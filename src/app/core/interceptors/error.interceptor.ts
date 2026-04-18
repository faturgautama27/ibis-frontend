import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

/**
 * Error Interceptor
 * 
 * Global HTTP error handler that intercepts all HTTP errors and provides
 * user-friendly error messages based on HTTP status codes.
 * 
 * Requirements: All
 * - Add validation error handling (400)
 * - Add authorization error handling (401, 403)
 * - Add conflict error handling (409)
 * - Add server error handling (500)
 * - Implement retry strategy for transient errors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const router = inject(Router);

    // Retry configuration for transient errors
    const retryConfig = {
        count: 3,
        delay: 1000,
        backoff: 2,
        retryableErrors: [408, 429, 500, 502, 503, 504]
    };

    return next(req).pipe(
        retry({
            count: retryConfig.count,
            delay: (error: HttpErrorResponse, retryCount: number) => {
                // Only retry on specific error codes
                if (retryConfig.retryableErrors.includes(error.status)) {
                    const delayMs = retryConfig.delay * Math.pow(retryConfig.backoff, retryCount - 1);
                    console.log(`Retrying request (attempt ${retryCount}/${retryConfig.count}) after ${delayMs}ms`);
                    return timer(delayMs);
                }
                // Don't retry, throw error immediately
                throw error;
            }
        }),
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';
            let showNotification = true;

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
            } else {
                // Server-side error
                switch (error.status) {
                    case 400:
                        errorMessage = handleValidationError(error);
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Please login again.';
                        handleAuthError(router);
                        showNotification = false; // Auth redirect will show its own message
                        break;
                    case 403:
                        errorMessage = handleForbiddenError(error);
                        break;
                    case 404:
                        errorMessage = 'Resource not found.';
                        break;
                    case 409:
                        errorMessage = handleConflictError(error);
                        break;
                    case 422:
                        errorMessage = handleBusinessLogicError(error);
                        break;
                    case 429:
                        errorMessage = 'Too many requests. Please slow down and try again.';
                        break;
                    case 500:
                        errorMessage = handleServerError(error);
                        break;
                    case 502:
                    case 503:
                        errorMessage = 'Service temporarily unavailable. Please try again later.';
                        break;
                    case 504:
                        errorMessage = 'Request timeout. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unexpected error occurred. Please try again.';
                }
            }

            if (showNotification) {
                notificationService.error(errorMessage);
            }

            return throwError(() => error);
        })
    );
};

/**
 * Handle validation errors (400 Bad Request)
 * Requirements: All - Validation error handling
 */
function handleValidationError(error: HttpErrorResponse): string {
    if (error.error?.message) {
        return error.error.message;
    }

    // Handle validation errors with details array
    if (error.error?.details && Array.isArray(error.error.details)) {
        const errorMessages = error.error.details.map((detail: any) => {
            if (detail.field && detail.message) {
                return `${detail.field}: ${detail.message}`;
            }
            return detail.message || detail;
        });
        return errorMessages.join('; ');
    }

    // Handle validation errors array
    if (error.error?.errors) {
        const errors = error.error.errors;
        if (Array.isArray(errors)) {
            return errors.join(', ');
        }
        // Handle validation errors object
        const errorMessages = Object.values(errors).flat();
        return errorMessages.join(', ');
    }

    return 'Invalid request. Please check your input.';
}

/**
 * Handle authentication errors (401 Unauthorized)
 * Requirements: All - Authorization error handling
 */
function handleAuthError(router: Router): void {
    // Clear session and redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: router.url }
    });
}

/**
 * Handle forbidden errors (403 Forbidden)
 * Requirements: All - Authorization error handling
 */
function handleForbiddenError(error: HttpErrorResponse): string {
    if (error.error?.message) {
        return error.error.message;
    }

    // Check for specific permission errors
    if (error.error?.code === 'INSUFFICIENT_PERMISSIONS') {
        return 'You do not have permission to perform this action. Please contact your administrator.';
    }

    return 'Access denied. You do not have permission to perform this action.';
}

/**
 * Handle conflict errors (409 Conflict)
 * Requirements: All - Conflict error handling
 */
function handleConflictError(error: HttpErrorResponse): string {
    if (error.error?.message) {
        return error.error.message;
    }

    // Handle specific conflict types
    if (error.error?.code === 'RECORD_LOCKED') {
        const lockedBy = error.error.details?.lockedBy || 'another user';
        return `This record is being edited by ${lockedBy}. Please try again later.`;
    }

    if (error.error?.code === 'DUPLICATE_ENTRY') {
        return 'A record with this information already exists.';
    }

    if (error.error?.code === 'REFERENTIAL_INTEGRITY') {
        return 'Cannot delete this record because it is referenced by other records.';
    }

    return 'A conflict occurred. The resource may already exist or has been modified.';
}

/**
 * Handle business logic errors (422 Unprocessable Entity)
 * Requirements: All - Business rule validation
 */
function handleBusinessLogicError(error: HttpErrorResponse): string {
    if (error.error?.message) {
        return error.error.message;
    }

    // Handle specific business rule violations
    if (error.error?.code === 'INVALID_ITEM_CATEGORY') {
        return error.error.details?.message || 'Invalid item category for this operation.';
    }

    if (error.error?.code === 'INSUFFICIENT_STOCK') {
        return error.error.details?.message || 'Insufficient stock for this operation.';
    }

    return 'Business rule violation. Please check your input and try again.';
}

/**
 * Handle server errors (500 Internal Server Error)
 * Requirements: All - Server error handling
 */
function handleServerError(error: HttpErrorResponse): string {
    // Log error details for debugging
    console.error('Server error:', {
        status: error.status,
        message: error.message,
        error: error.error
    });

    if (error.error?.message) {
        return `Server error: ${error.error.message}`;
    }

    return 'An unexpected server error occurred. Please try again later.';
}
