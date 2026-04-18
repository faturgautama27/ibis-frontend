/**
 * Stock Adjustment Custom Validators
 * 
 * Provides custom validation functions for stock adjustment forms.
 * 
 * Requirements: 8.3, 8.4
 */

import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

/**
 * Validator to ensure quantity is a positive number
 * Requirements: 8.3
 */
export function positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Don't validate empty values (use required validator for that)
        }

        const value = Number(control.value);

        if (isNaN(value)) {
            return { notANumber: { value: control.value } };
        }

        if (value <= 0) {
            return { notPositive: { value: control.value } };
        }

        return null;
    };
}

/**
 * Validator to check if there's enough stock available for decrease adjustments
 * Requirements: 8.4
 * 
 * This is an async validator that checks the current stock level
 */
export function stockAvailabilityValidator(
    itemIdControl: AbstractControl,
    warehouseIdControl: AbstractControl,
    adjustmentTypeControl: AbstractControl
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }

        const quantity = Number(control.value);
        const itemId = itemIdControl.value;
        const warehouseId = warehouseIdControl.value;
        const adjustmentType = adjustmentTypeControl.value;

        // Only validate for decrease adjustments
        if (adjustmentType !== 'DECREASE') {
            return of(null);
        }

        if (!itemId || !warehouseId) {
            return of(null);
        }

        const http = inject(HttpClient);
        const apiUrl = `${environment.apiUrl}/inventory/stock-level`;

        return of(null).pipe(
            debounceTime(500),
            switchMap(() =>
                http.get<{ availableQuantity: number }>(`${apiUrl}/${itemId}/${warehouseId}`).pipe(
                    map(response => {
                        if (quantity > response.availableQuantity) {
                            return {
                                insufficientStock: {
                                    requested: quantity,
                                    available: response.availableQuantity
                                }
                            };
                        }
                        return null;
                    }),
                    catchError(() => of(null))
                )
            ),
            first()
        );
    };
}

/**
 * Validator to ensure item category is valid for stock adjustments
 * Requirements: 8.4
 */
export function itemCategoryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const item = control.value;

        // Check if item has required fields
        if (!item.id || !item.item_code) {
            return { invalidItem: { value: control.value } };
        }

        // Additional category validation can be added here
        // For example, checking if item is active
        if (item.active === false) {
            return { inactiveItem: { itemCode: item.item_code } };
        }

        return null;
    };
}

/**
 * Async validator to check if record is locked by another user
 * Requirements: 15.1, 15.2, 15.3, 15.4
 */
export function recordLockValidator(recordId: string, recordType: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!recordId) {
            return of(null);
        }

        const http = inject(HttpClient);
        const apiUrl = `${environment.apiUrl}/record-locks/check`;

        return of(null).pipe(
            debounceTime(300),
            switchMap(() =>
                http.post<{ isLocked: boolean; lockedBy?: string; lockedAt?: Date }>(apiUrl, {
                    recordId,
                    recordType
                }).pipe(
                    map(response => {
                        if (response.isLocked) {
                            return {
                                recordLocked: {
                                    lockedBy: response.lockedBy,
                                    lockedAt: response.lockedAt
                                }
                            };
                        }
                        return null;
                    }),
                    catchError(() => of(null))
                )
            ),
            first()
        );
    };
}

/**
 * Validator to ensure adjustment reason is provided
 * Requirements: 8.4
 */
export function adjustmentReasonValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return { reasonRequired: true };
        }

        const reason = control.value.trim();

        if (reason.length < 10) {
            return { reasonTooShort: { minLength: 10, actualLength: reason.length } };
        }

        if (reason.length > 500) {
            return { reasonTooLong: { maxLength: 500, actualLength: reason.length } };
        }

        return null;
    };
}

/**
 * Validator to ensure adjustment date is not in the future
 * Requirements: 8.1
 */
export function adjustmentDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const adjustmentDate = new Date(control.value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        if (adjustmentDate > today) {
            return { futureDate: { date: adjustmentDate } };
        }

        // Check if date is too old (e.g., more than 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        if (adjustmentDate < thirtyDaysAgo) {
            return { dateTooOld: { date: adjustmentDate, maxDaysAgo: 30 } };
        }

        return null;
    };
}

/**
 * Helper function to get validation error message
 */
export function getValidationErrorMessage(errors: ValidationErrors): string {
    if (errors['required']) {
        return 'This field is required';
    }

    if (errors['notANumber']) {
        return 'Please enter a valid number';
    }

    if (errors['notPositive']) {
        return 'Quantity must be greater than zero';
    }

    if (errors['insufficientStock']) {
        return `Insufficient stock. Available: ${errors['insufficientStock'].available}, Requested: ${errors['insufficientStock'].requested}`;
    }

    if (errors['invalidItem']) {
        return 'Please select a valid item';
    }

    if (errors['inactiveItem']) {
        return `Item ${errors['inactiveItem'].itemCode} is inactive`;
    }

    if (errors['recordLocked']) {
        return `This record is being edited by ${errors['recordLocked'].lockedBy}`;
    }

    if (errors['reasonRequired']) {
        return 'Adjustment reason is required';
    }

    if (errors['reasonTooShort']) {
        return `Reason must be at least ${errors['reasonTooShort'].minLength} characters`;
    }

    if (errors['reasonTooLong']) {
        return `Reason must not exceed ${errors['reasonTooLong'].maxLength} characters`;
    }

    if (errors['futureDate']) {
        return 'Adjustment date cannot be in the future';
    }

    if (errors['dateTooOld']) {
        return `Adjustment date cannot be more than ${errors['dateTooOld'].maxDaysAgo} days ago`;
    }

    return 'Invalid value';
}
