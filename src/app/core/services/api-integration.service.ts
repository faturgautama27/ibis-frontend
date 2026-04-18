import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { PurchaseOrderHeader } from '../../features/purchase-order/models/purchase-order.model';
import { SalesOrderHeader } from '../../features/sales-order/models/sales-order.model';
import { BusinessRuleValidator, ItemForValidation } from '../../shared/validators/business-rule.validator';
import { ItemCategory } from '../../features/item-master/models/item-category.enum';

/**
 * API Integration Service
 * 
 * Service for integrating with external APIs to fetch Purchase Orders and Sales Orders.
 * Implements error handling, retry logic, and admin notifications for API failures.
 * 
 * Requirements: 2.5, 2.6, 2.7, 13.1, 13.2, 13.4
 */
@Injectable({
    providedIn: 'root'
})
export class ApiIntegrationService {
    private readonly apiEndpoint = environment.apiUrl || 'http://localhost:3000/api';
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000; // milliseconds

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService
    ) { }

    /**
     * Fetch purchase orders from external API
     * Implements retry strategy for transient errors
     * Validates item categories for all fetched orders
     * 
     * Requirements: 10.5
     * 
     * @param criteria - Search criteria for fetching purchase orders
     * @returns Observable of API sync result containing purchase orders
     */
    fetchPurchaseOrders(criteria: ApiSyncCriteria): Observable<ApiSyncResult<PurchaseOrderHeader>> {
        return this.http.post<ApiResponse>(`${this.apiEndpoint}/purchase-orders/sync`, criteria).pipe(
            retry({
                count: this.maxRetries,
                delay: (error: HttpErrorResponse, retryCount: number) => {
                    // Only retry on transient errors (5xx, network errors)
                    if (this.isTransientError(error)) {
                        console.log(`Retrying API call (attempt ${retryCount + 1}/${this.maxRetries})...`);
                        return throwError(() => error).pipe(delay(this.retryDelay * retryCount));
                    }
                    // Don't retry on client errors (4xx)
                    return throwError(() => error);
                }
            }),
            map(response => {
                const result = this.transformApiResponse<PurchaseOrderHeader>(response);
                // Validate item categories for purchase orders
                result.errors = [...result.errors, ...this.validatePurchaseOrderItems(result.data)];
                return result;
            }),
            catchError(error => {
                this.logApiError('fetchPurchaseOrders', error);
                this.notifyAdminOfError('fetchPurchaseOrders', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Fetch sales orders from external API
     * Implements retry strategy for transient errors
     * Validates item categories for all fetched orders
     * 
     * Requirements: 5.6, 5.7, 5.8, 10.5
     * 
     * @param criteria - Search criteria for fetching sales orders
     * @returns Observable of API sync result containing sales orders
     */
    fetchSalesOrders(criteria: ApiSyncCriteria): Observable<ApiSyncResult<SalesOrderHeader>> {
        return this.http.post<ApiResponse>(`${this.apiEndpoint}/sales-orders/sync`, criteria).pipe(
            retry({
                count: this.maxRetries,
                delay: (error: HttpErrorResponse, retryCount: number) => {
                    if (this.isTransientError(error)) {
                        console.log(`Retrying API call (attempt ${retryCount + 1}/${this.maxRetries})...`);
                        return throwError(() => error).pipe(delay(this.retryDelay * retryCount));
                    }
                    return throwError(() => error);
                }
            }),
            map(response => {
                const result = this.transformApiResponse<SalesOrderHeader>(response);
                // Validate item categories for sales orders
                result.errors = [...result.errors, ...this.validateSalesOrderItems(result.data)];
                return result;
            }),
            catchError(error => {
                this.logApiError('fetchSalesOrders', error);
                this.notifyAdminOfError('fetchSalesOrders', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Transform API response to standardized format
     * 
     * @param response - Raw API response
     * @returns Transformed API sync result
     */
    private transformApiResponse<T>(response: ApiResponse): ApiSyncResult<T> {
        return {
            success: response.success,
            data: response.data || [],
            errors: response.errors || [],
            timestamp: new Date(response.timestamp)
        };
    }

    /**
     * Determine if an error is transient and should be retried
     * 
     * @param error - HTTP error response
     * @returns True if error is transient (5xx, network errors)
     */
    private isTransientError(error: HttpErrorResponse): boolean {
        // Retry on server errors (5xx) and network errors (status 0)
        return error.status === 0 || (error.status >= 500 && error.status < 600);
    }

    /**
     * Log API error details for debugging and monitoring
     * 
     * @param operation - Name of the operation that failed
     * @param error - Error object
     */
    private logApiError(operation: string, error: any): void {
        const errorDetails = {
            operation,
            timestamp: new Date().toISOString(),
            message: error.message || 'Unknown error',
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error
        };

        console.error(`API Integration Error [${operation}]:`, errorDetails);

        // In a production environment, this would send to a backend logging service
        // For now, we'll store in localStorage for demo purposes
        this.storeErrorLog(errorDetails);
    }

    /**
     * Store error log in localStorage for demo purposes
     * In production, this would send to a backend logging service
     * 
     * @param errorDetails - Error details to store
     */
    private storeErrorLog(errorDetails: any): void {
        try {
            const logs = JSON.parse(localStorage.getItem('api_error_logs') || '[]');
            logs.push(errorDetails);
            // Keep only last 100 errors
            if (logs.length > 100) {
                logs.shift();
            }
            localStorage.setItem('api_error_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to store error log:', e);
        }
    }

    /**
     * Notify system administrators of API integration errors
     * 
     * @param operation - Name of the operation that failed
     * @param error - Error object
     */
    private notifyAdminOfError(operation: string, error: any): void {
        const errorMessage = this.formatErrorMessage(error);

        // Display error notification to user
        this.notificationService.error(
            `API Integration failed: ${errorMessage}`,
            'API Error',
            5000
        );

        // In a production environment, this would:
        // 1. Send email/SMS to administrators
        // 2. Create a ticket in the support system
        // 3. Send to monitoring/alerting system (e.g., Sentry, DataDog)

        // For demo purposes, we'll log to console
        console.warn(`[ADMIN NOTIFICATION] API Integration Error in ${operation}:`, {
            operation,
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Format error message for display
     * 
     * @param error - Error object
     * @returns Formatted error message
     */
    private formatErrorMessage(error: any): string {
        if (error.error?.message) {
            return error.error.message;
        }
        if (error.message) {
            return error.message;
        }
        if (error.status === 0) {
            return 'Network error - unable to connect to API';
        }
        if (error.status >= 500) {
            return 'Server error - please try again later';
        }
        if (error.status === 404) {
            return 'API endpoint not found';
        }
        if (error.status === 401 || error.status === 403) {
            return 'Authentication error - please check credentials';
        }
        return 'An unexpected error occurred';
    }

    /**
     * Get API error logs (for admin view)
     * Enhanced with filtering capabilities
     * Requirements: 13.3
     * 
     * @param filters - Optional filters for error logs
     * @returns Array of error logs
     */
    getErrorLogs(filters?: ApiErrorLogFilters): any[] {
        try {
            let logs = JSON.parse(localStorage.getItem('api_error_logs') || '[]');

            // Apply filters if provided
            if (filters) {
                if (filters.operation) {
                    logs = logs.filter((log: any) =>
                        log.operation.toLowerCase().includes(filters.operation!.toLowerCase())
                    );
                }

                if (filters.dateFrom) {
                    logs = logs.filter((log: any) =>
                        new Date(log.timestamp) >= filters.dateFrom!
                    );
                }

                if (filters.dateTo) {
                    logs = logs.filter((log: any) =>
                        new Date(log.timestamp) <= filters.dateTo!
                    );
                }

                if (filters.status) {
                    logs = logs.filter((log: any) => log.status === filters.status);
                }
            }

            // Sort by timestamp descending (most recent first)
            logs.sort((a: any, b: any) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            return logs;
        } catch (e) {
            console.error('Failed to retrieve error logs:', e);
            return [];
        }
    }

    /**
     * Get error log statistics
     * Requirements: 13.3
     * 
     * @returns Statistics about API errors
     */
    getErrorLogStatistics(): ApiErrorStatistics {
        try {
            const logs = JSON.parse(localStorage.getItem('api_error_logs') || '[]');

            const stats: ApiErrorStatistics = {
                totalErrors: logs.length,
                errorsByOperation: {},
                errorsByStatus: {},
                recentErrors: logs.slice(0, 10)
            };

            logs.forEach((log: any) => {
                // Count by operation
                if (!stats.errorsByOperation[log.operation]) {
                    stats.errorsByOperation[log.operation] = 0;
                }
                stats.errorsByOperation[log.operation]++;

                // Count by status
                const status = log.status || 'unknown';
                if (!stats.errorsByStatus[status]) {
                    stats.errorsByStatus[status] = 0;
                }
                stats.errorsByStatus[status]++;
            });

            return stats;
        } catch (e) {
            console.error('Failed to retrieve error statistics:', e);
            return {
                totalErrors: 0,
                errorsByOperation: {},
                errorsByStatus: {},
                recentErrors: []
            };
        }
    }

    /**
     * Clear API error logs
     */
    clearErrorLogs(): void {
        localStorage.removeItem('api_error_logs');
    }

    /**
     * Validate item categories for purchase orders
     * Ensures all items are RAW_MATERIAL category
     * Requirements: 10.5
     * 
     * @param orders - Purchase orders to validate
     * @returns Array of API errors for invalid items
     */
    private validatePurchaseOrderItems(orders: any[]): ApiError[] {
        const errors: ApiError[] = [];

        orders.forEach((order: any, orderIndex: number) => {
            if (order.details && Array.isArray(order.details)) {
                order.details.forEach((detail: any, detailIndex: number) => {
                    if (detail.category && detail.category !== ItemCategory.RAW_MATERIAL) {
                        errors.push({
                            code: 'INVALID_ITEM_CATEGORY',
                            message: `PO ${order.poNumber || orderIndex + 1}, Line ${detailIndex + 1}: Item must be RAW_MATERIAL. Found: ${detail.category}`,
                            field: `orders[${orderIndex}].details[${detailIndex}].category`
                        });
                    }
                });
            }
        });

        return errors;
    }

    /**
     * Validate item categories for sales orders
     * Ensures all items are FINISHED_GOOD category
     * Requirements: 10.5
     * 
     * @param orders - Sales orders to validate
     * @returns Array of API errors for invalid items
     */
    private validateSalesOrderItems(orders: any[]): ApiError[] {
        const errors: ApiError[] = [];

        orders.forEach((order: any, orderIndex: number) => {
            if (order.details && Array.isArray(order.details)) {
                order.details.forEach((detail: any, detailIndex: number) => {
                    if (detail.category && detail.category !== ItemCategory.FINISHED_GOOD) {
                        errors.push({
                            code: 'INVALID_ITEM_CATEGORY',
                            message: `SO ${order.soNumber || orderIndex + 1}, Line ${detailIndex + 1}: Item must be FINISHED_GOOD. Found: ${detail.category}`,
                            field: `orders[${orderIndex}].details[${detailIndex}].category`
                        });
                    }
                });
            }
        });

        return errors;
    }
}

/**
 * API Sync Criteria
 * Search criteria for fetching data from external APIs
 */
export interface ApiSyncCriteria {
    dateFrom?: Date;
    dateTo?: Date;
    externalIds?: string[];
}

/**
 * API Sync Result
 * Standardized result format for API synchronization
 */
export interface ApiSyncResult<T> {
    success: boolean;
    data: T[];
    errors: ApiError[];
    timestamp: Date;
}

/**
 * API Error
 * Detailed error information from API responses
 */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
}

/**
 * API Response
 * Raw response format from external APIs
 */
interface ApiResponse {
    success: boolean;
    data: any[];
    errors?: ApiError[];
    timestamp: string;
}

/**
 * API Error Log Filters
 * Requirements: 13.3
 */
export interface ApiErrorLogFilters {
    operation?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: number;
}

/**
 * API Error Statistics
 * Requirements: 13.3
 */
export interface ApiErrorStatistics {
    totalErrors: number;
    errorsByOperation: { [operation: string]: number };
    errorsByStatus: { [status: string]: number };
    recentErrors: any[];
}
