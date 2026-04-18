import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Record Lock Interface
 * Represents a lock on a record being edited
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4
 */
export interface RecordLock {
    id: string;
    recordType: string;
    recordId: string;
    lockedBy: string;
    lockedByName: string;
    lockedAt: Date;
    expiresAt: Date;
}

/**
 * Record Lock Status Interface
 * Indicates whether a record is currently locked
 */
export interface RecordLockStatus {
    isLocked: boolean;
    lock?: RecordLock;
}

/**
 * Record Lock Service
 * Manages record locking to prevent concurrent edits
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4
 * - Acquire lock when opening records for edit
 * - Release lock on save/cancel
 * - Check lock status
 * - Automatic lock expiration (30 minutes)
 * - Release all locks for cleanup
 */
@Injectable({
    providedIn: 'root'
})
export class RecordLockService {
    private http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/record-locks`;

    // Track active locks in memory for cleanup
    private activeLocks = new Map<string, string>(); // recordId -> lockId

    // Lock expiration time in milliseconds (30 minutes)
    private readonly LOCK_EXPIRATION_MS = 30 * 60 * 1000;

    constructor() {
        // Set up automatic cleanup on page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                this.releaseAllLocks();
            });
        }
    }

    /**
     * Acquire a lock on a record
     * Requirements: 15.1
     * 
     * @param recordType Type of record (e.g., 'PurchaseOrder', 'SalesOrder', 'StockAdjustment')
     * @param recordId Unique identifier of the record
     * @returns Observable of RecordLock
     */
    acquireLock(recordType: string, recordId: string): Observable<RecordLock> {
        const expiresAt = new Date(Date.now() + this.LOCK_EXPIRATION_MS);

        return this.http.post<RecordLock>(`${this.apiUrl}/acquire`, {
            recordType,
            recordId,
            expiresAt
        }).pipe(
            tap(lock => {
                // Store lock ID for cleanup
                this.activeLocks.set(recordId, lock.id);

                // Set up automatic expiration
                setTimeout(() => {
                    this.releaseLock(recordId).subscribe();
                }, this.LOCK_EXPIRATION_MS);
            }),
            catchError(error => {
                console.error('Failed to acquire lock:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Release a lock on a record
     * Requirements: 15.2, 15.3
     * 
     * @param recordId Unique identifier of the record
     * @returns Observable of void
     */
    releaseLock(recordId: string): Observable<void> {
        const lockId = this.activeLocks.get(recordId);

        if (!lockId) {
            // No active lock for this record
            return of(undefined);
        }

        return this.http.post<void>(`${this.apiUrl}/release`, { lockId }).pipe(
            tap(() => {
                // Remove from active locks
                this.activeLocks.delete(recordId);
            }),
            catchError(error => {
                console.error('Failed to release lock:', error);
                // Still remove from active locks even if API call fails
                this.activeLocks.delete(recordId);
                return of(undefined);
            })
        );
    }

    /**
     * Check if a record is locked
     * Requirements: 15.1, 15.2
     * 
     * @param recordType Type of record
     * @param recordId Unique identifier of the record
     * @returns Observable of RecordLockStatus
     */
    checkLock(recordType: string, recordId: string): Observable<RecordLockStatus> {
        return this.http.get<RecordLockStatus>(`${this.apiUrl}/check`, {
            params: { recordType, recordId }
        }).pipe(
            catchError(error => {
                console.error('Failed to check lock status:', error);
                // Return unlocked status on error
                return of({ isLocked: false });
            })
        );
    }

    /**
     * Release all active locks
     * Requirements: 15.3
     * Used for cleanup when user logs out or closes the application
     */
    releaseAllLocks(): void {
        const lockIds = Array.from(this.activeLocks.keys());

        lockIds.forEach(recordId => {
            // Use synchronous approach for cleanup during page unload
            this.releaseLock(recordId).subscribe({
                error: (error) => console.error('Failed to release lock during cleanup:', error)
            });
        });

        // Clear the map
        this.activeLocks.clear();
    }

    /**
     * Get all active locks for current user
     * Useful for debugging and monitoring
     */
    getActiveLocks(): string[] {
        return Array.from(this.activeLocks.keys());
    }

    /**
     * Check if a specific record is locked by current user
     */
    isLockedByCurrentUser(recordId: string): boolean {
        return this.activeLocks.has(recordId);
    }

    /**
     * Extend lock expiration time
     * Useful for long-running edit sessions
     * 
     * @param recordId Unique identifier of the record
     * @returns Observable of RecordLock with updated expiration
     */
    extendLock(recordId: string): Observable<RecordLock> {
        const lockId = this.activeLocks.get(recordId);

        if (!lockId) {
            return throwError(() => new Error('No active lock found for this record'));
        }

        const expiresAt = new Date(Date.now() + this.LOCK_EXPIRATION_MS);

        return this.http.post<RecordLock>(`${this.apiUrl}/extend`, {
            lockId,
            expiresAt
        }).pipe(
            catchError(error => {
                console.error('Failed to extend lock:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Force release a lock (admin only)
     * Used to unlock records when a user's session expires or crashes
     * 
     * @param recordId Unique identifier of the record
     * @returns Observable of void
     */
    forceReleaseLock(recordId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/force-release`, { recordId }).pipe(
            tap(() => {
                // Remove from active locks if it was ours
                this.activeLocks.delete(recordId);
            }),
            catchError(error => {
                console.error('Failed to force release lock:', error);
                return throwError(() => error);
            })
        );
    }
}
