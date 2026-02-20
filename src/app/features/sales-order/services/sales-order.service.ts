/**
 * Sales Order Service
 * 
 * Provides CRUD operations, status updates, filtering, search functionality,
 * and deletion validation for Sales Orders with error handling and retry logic.
 * 
 * Validates: Requirements 5.1, 5.13, 5.14, 5.15, 5.16, 5.17
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    SalesOrderHeader,
    SalesOrderDetail,
    SOFilters,
    SOLookupCriteria,
    SOStatus
} from '../models/sales-order.model';

/**
 * DTOs for Create and Update operations
 */
export interface CreateSalesOrderDto {
    soNumber: string;
    soDate: Date;
    customerId: string;
    warehouseId: string;
    inputMethod: string;
    deliveryDate?: Date;
    shippingAddress: string;
    shippingMethod?: string;
    currency: string;
    exchangeRate?: number;
    paymentTerms?: string;
    notes?: string;
    details: CreateSalesOrderDetailDto[];
}

export interface CreateSalesOrderDetailDto {
    lineNumber: number;
    itemId: string;
    orderedQuantity: number;
    unit: string;
    unitPrice: number;
    taxRate?: number;
    deliveryDate?: Date;
    notes?: string;
}

export interface UpdateSalesOrderDto {
    soDate?: Date;
    customerId?: string;
    warehouseId?: string;
    deliveryDate?: Date;
    shippingAddress?: string;
    shippingMethod?: string;
    currency?: string;
    exchangeRate?: number;
    paymentTerms?: string;
    notes?: string;
    details?: CreateSalesOrderDetailDto[];
}

@Injectable({ providedIn: 'root' })
export class SalesOrderService {
    private readonly apiUrl = `${environment.apiUrl}/sales-orders`;
    private readonly defaultTimeout = environment.apiTimeout || 30000;
    private readonly maxRetries = 2;

    constructor(private http: HttpClient) { }

    /**
     * Get all sales orders with optional filters
     * Supports filtering by status, customer, date range, and search query
     */
    getOrders(filters?: SOFilters): Observable<SalesOrderHeader[]> {
        const params = this.buildQueryParams(filters);
        return this.http.get<SalesOrderHeader[]>(this.apiUrl, { params }).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Get a single sales order by ID
     */
    getOrderById(id: string): Observable<SalesOrderHeader> {
        return this.http.get<SalesOrderHeader>(`${this.apiUrl}/${id}`).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Get line item details for a sales order
     */
    getOrderDetails(orderId: string): Observable<SalesOrderDetail[]> {
        return this.http.get<SalesOrderDetail[]>(`${this.apiUrl}/${orderId}/details`).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Create a new sales order
     */
    createOrder(order: CreateSalesOrderDto): Observable<SalesOrderHeader> {
        return this.http.post<SalesOrderHeader>(this.apiUrl, order).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Update an existing sales order
     */
    updateOrder(id: string, order: UpdateSalesOrderDto): Observable<SalesOrderHeader> {
        return this.http.put<SalesOrderHeader>(`${this.apiUrl}/${id}`, order).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Delete a sales order
     * Validates that no linked outbound transactions exist before deletion
     * Requirements: 5.16, 5.17
     */
    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Update the status of a sales order
     */
    updateStatus(id: string, status: SOStatus): Observable<SalesOrderHeader> {
        return this.http.patch<SalesOrderHeader>(`${this.apiUrl}/${id}/status`, { status }).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Search for sales orders for lookup in Outbound transaction forms
     * Filters out fully shipped orders by default
     */
    searchForLookup(criteria: SOLookupCriteria): Observable<SalesOrderHeader[]> {
        const params = this.buildQueryParams(criteria);
        return this.http.get<SalesOrderHeader[]>(`${this.apiUrl}/lookup`, { params }).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Lookup sales orders for Outbound transaction linking
     * Alias for searchForLookup to match NgRx effects expectations
     * Requirements: 7.1, 7.6
     */
    lookupSalesOrders(criteria: SOLookupCriteria): Observable<SalesOrderHeader[]> {
        return this.searchForLookup(criteria);
    }

    /**
     * Build HTTP query parameters from filter object
     * Handles null/undefined values and converts objects to strings
     */
    private buildQueryParams(filters: any): HttpParams {
        let params = new HttpParams();

        if (!filters) {
            return params;
        }

        Object.keys(filters).forEach(key => {
            const value = filters[key];

            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    // Handle array values (e.g., status filters)
                    value.forEach(item => {
                        params = params.append(key, item.toString());
                    });
                } else if (value instanceof Date) {
                    // Handle Date objects
                    params = params.set(key, value.toISOString());
                } else {
                    // Handle primitive values
                    params = params.set(key, value.toString());
                }
            }
        });

        return params;
    }

    /**
     * Centralized error handling
     * Provides detailed error messages based on HTTP status codes
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorMessage = `Network error: ${error.error.message}`;
        } else {
            // Backend error
            switch (error.status) {
                case 400:
                    errorMessage = this.extractValidationErrors(error);
                    break;
                case 401:
                    errorMessage = 'Unauthorized. Please login again.';
                    break;
                case 403:
                    errorMessage = 'You do not have permission to perform this action.';
                    break;
                case 404:
                    errorMessage = 'Sales order not found.';
                    break;
                case 409:
                    errorMessage = this.extractConflictError(error);
                    break;
                case 422:
                    errorMessage = 'Invalid data. Please check your input.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                case 503:
                    errorMessage = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
            }
        }

        console.error('SalesOrderService Error:', {
            status: error.status,
            message: errorMessage,
            error: error.error
        });

        return throwError(() => new Error(errorMessage));
    }

    /**
     * Extract validation errors from 400 Bad Request responses
     */
    private extractValidationErrors(error: HttpErrorResponse): string {
        if (error.error?.details && Array.isArray(error.error.details)) {
            const messages = error.error.details.map((detail: any) => {
                return detail.field ? `${detail.field}: ${detail.message}` : detail.message;
            });
            return messages.join('; ');
        }
        return error.error?.message || 'Validation failed. Please check your input.';
    }

    /**
     * Extract conflict error messages from 409 Conflict responses
     * Handles deletion validation for linked outbound transactions
     * Requirements: 5.16, 5.17
     */
    private extractConflictError(error: HttpErrorResponse): string {
        if (error.error?.code === 'RECORD_LOCKED') {
            return `This sales order is being edited by ${error.error.lockedBy}`;
        }
        if (error.error?.code === 'DUPLICATE_SO_NUMBER') {
            return 'A sales order with this SO number already exists.';
        }
        if (error.error?.code === 'HAS_LINKED_OUTBOUNDS') {
            const count = error.error?.linkedCount || 'some';
            return `Cannot delete sales order with ${count} linked outbound transaction(s). Please remove links first.`;
        }
        return error.error?.message || 'Conflict occurred. Please refresh and try again.';
    }
}
