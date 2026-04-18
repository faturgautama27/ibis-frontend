import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { RecordLockService } from '../services/record-lock.service';

/**
 * Record Lock Validator
 * Async validator to check if a record is locked by another user
 * 
 * Requirements: 15.1, 15.2, 15.3
 * - Check lock status before allowing edits
 * - Display lock status messages to users
 * - Prevent concurrent edits
 */

/**
 * Create an async validator that checks if a record is locked
 * 
 * @param lockService RecordLockService instance
 * @param recordType Type of record (e.g., 'PurchaseOrder', 'SalesOrder')
 * @param recordId Unique identifier of the record
 * @returns AsyncValidatorFn
 */
export function recordLockValidator(
    lockService: RecordLockService,
    recordType: string,
    recordId: string
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        // Don't validate if control is empty or pristine
        if (!control.value || control.pristine) {
            return of(null);
        }

        return of(control.value).pipe(
            debounceTime(300), // Debounce to avoid excessive API calls
            switchMap(() => lockService.checkLock(recordType, recordId)),
            map(status => {
                if (status.isLocked && status.lock) {
                    // Check if locked by current user
                    if (lockService.isLockedByCurrentUser(recordId)) {
                        // Locked by current user, allow edit
                        return null;
                    }

                    // Locked by another user, prevent edit
                    return {
                        recordLocked: {
                            lockedBy: status.lock.lockedByName,
                            lockedAt: status.lock.lockedAt,
                            expiresAt: status.lock.expiresAt,
                            message: `This record is being edited by ${status.lock.lockedByName}. Please try again later.`
                        }
                    };
                }

                // Not locked, allow edit
                return null;
            }),
            catchError(() => {
                // On error, allow edit (fail open)
                console.error('Record lock validation failed, allowing edit');
                return of(null);
            }),
            first() // Complete after first emission
        );
    };
}

/**
 * Helper function to get error message from record lock validation error
 */
export function getRecordLockErrorMessage(errors: ValidationErrors | null): string | null {
    if (!errors || !errors['recordLocked']) {
        return null;
    }

    return errors['recordLocked'].message;
}

/**
 * Helper function to check if a control has a record lock error
 */
export function hasRecordLockError(control: AbstractControl): boolean {
    return !!(control.errors && control.errors['recordLocked']);
}

/**
 * Helper function to get lock details from validation error
 */
export function getRecordLockDetails(errors: ValidationErrors | null): {
    lockedBy: string;
    lockedAt: Date;
    expiresAt: Date;
} | null {
    if (!errors || !errors['recordLocked']) {
        return null;
    }

    return {
        lockedBy: errors['recordLocked'].lockedBy,
        lockedAt: errors['recordLocked'].lockedAt,
        expiresAt: errors['recordLocked'].expiresAt
    };
}
