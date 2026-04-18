/**
 * Purchase Order Service
 * 
 * Provides CRUD operations, status updates, filtering, and search functionality
 * for Purchase Orders with error handling and retry logic.
 * 
 * Validates: Requirements 2.1, 2.12
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    PurchaseOrderHeader,
    PurchaseOrderDetail,
    POFilters,
    POLookupCriteria,
    POStatus
} from '../models/purchase-order.model';
import { BusinessRuleValidator, ItemForValidation } from '../../../shared/validators/business-rule.validator';
import { ItemCategory } from '../../item-master/models/item-category.enum';

/**
 * DTOs for Create and Update operations
 */
export interface CreatePurchaseOrderDto {
    poNumber: string;
    poDate: Date;
    supplierId: string;
    warehouseId: string;
    inputMethod: string;
    deliveryDate?: Date;
    currency: string;
    exchangeRate?: number;
    paymentTerms?: string;
    notes?: string;
    details: CreatePurchaseOrderDetailDto[];
}

export interface CreatePurchaseOrderDetailDto {
    lineNumber: number;
    itemId: string;
    itemCode?: string;
    itemName?: string;
    category?: ItemCategory;
    orderedQuantity: number;
    unit: string;
    unitPrice: number;
    taxRate?: number;
    deliveryDate?: Date;
    notes?: string;
}

export interface UpdatePurchaseOrderDto {
    poDate?: Date;
    supplierId?: string;
    warehouseId?: string;
    deliveryDate?: Date;
    currency?: string;
    exchangeRate?: number;
    paymentTerms?: string;
    notes?: string;
    details?: CreatePurchaseOrderDetailDto[];
}

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
    private readonly apiUrl = `${environment.apiUrl}/purchase-orders`;
    private readonly defaultTimeout = environment.apiTimeout || 30000;
    private readonly maxRetries = 2;

    constructor(private http: HttpClient) { }

    /**
     * Get all purchase orders with optional filters
     * Supports filtering by status, supplier, date range, and search query
     */
    getOrders(filters?: POFilters): Observable<PurchaseOrderHeader[]> {
        const params = this.buildQueryParams(filters);
        return this.http.get<PurchaseOrderHeader[]>(this.apiUrl, { params }).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Get a single purchase order by ID
     */
    getOrderById(id: string): Observable<PurchaseOrderHeader> {
        return this.http.get<PurchaseOrderHeader>(`${this.apiUrl}/${id}`).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Get line item details for a purchase order
     */
    getOrderDetails(orderId: string): Observable<PurchaseOrderDetail[]> {
        return this.http.get<PurchaseOrderDetail[]>(`${this.apiUrl}/${orderId}/details`).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Create a new purchase order
     * Validates item categories before creation
     * Requirements: 10.1, 10.2, 10.6
     */
    createOrder(order: CreatePurchaseOrderDto): Observable<PurchaseOrderHeader> {
        // Validate item categories
        const validationResult = this.validateItemCategories(order.details);
        if (!validationResult.valid) {
            return throwError(() => new Error(validationResult.message));
        }

        return this.http.post<PurchaseOrderHeader>(this.apiUrl, order).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Update an existing purchase order
     * Validates item categories if details are provided
     * Requirements: 10.1, 10.2, 10.6
     */
    updateOrder(id: string, order: UpdatePurchaseOrderDto): Observable<PurchaseOrderHeader> {
        // Validate item categories if details are being updated
        if (order.details && order.details.length > 0) {
            const validationResult = this.validateItemCategories(order.details);
            if (!validationResult.valid) {
                return throwError(() => new Error(validationResult.message));
            }
        }

        return this.http.put<PurchaseOrderHeader>(`${this.apiUrl}/${id}`, order).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Delete a purchase order
     */
    deleteOrder(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Update the status of a purchase order
     */
    updateStatus(id: string, status: POStatus): Observable<PurchaseOrderHeader> {
        return this.http.patch<PurchaseOrderHeader>(`${this.apiUrl}/${id}/status`, { status }).pipe(
            timeout(this.defaultTimeout),
            catchError(this.handleError)
        );
    }

    /**
     * Search for purchase orders for lookup in Inbound transaction forms
     * Filters out fully received orders by default
     */
    searchForLookup(criteria: POLookupCriteria): Observable<PurchaseOrderHeader[]> {
        const params = this.buildQueryParams(criteria);
        return this.http.get<PurchaseOrderHeader[]>(`${this.apiUrl}/lookup`, { params }).pipe(
            timeout(this.defaultTimeout),
            retry(this.maxRetries),
            catchError(this.handleError)
        );
    }

    /**
     * Lookup purchase orders for Inbound transaction linking
     * Alias for searchForLookup to match NgRx effects expectations
     * Requirements: 4.1, 4.6
     */
    lookupPurchaseOrders(criteria: POLookupCriteria): Observable<PurchaseOrderHeader[]> {
        return this.searchForLookup(criteria);
    }

    /**
     * Validate item categories for purchase order
     * Ensures all items are RAW_MATERIAL category
     * Requirements: 10.1, 10.2, 10.6
     */
    private validateItemCategories(details: CreatePurchaseOrderDetailDto[]): { valid: boolean; message?: string } {
        const items: ItemForValidation[] = details
            .filter(detail => detail.category !== undefined)
            .map(detail => ({
                id: detail.itemId,
                itemCode: detail.itemCode || detail.itemId,
                itemName: detail.itemName || 'Unknown',
                category: detail.category!
            }));

        if (items.length === 0) {
            // If no category information is provided, skip validation
            // Backend will handle validation
            return { valid: true };
        }

        return BusinessRuleValidator.validateItemCategories(items, 'PO');
    }

    /**
     * Calculate purchase order status based on received quantities
     * Requirements: 11.1, 11.3
     * 
     * @param details - Purchase order line items with ordered and received quantities
     * @returns Calculated status (PENDING, PARTIALLY_RECEIVED, or FULLY_RECEIVED)
     */
    calculateOrderStatus(details: PurchaseOrderDetail[]): POStatus {
        if (!details || details.length === 0) {
            return POStatus.PENDING;
        }

        let totalOrdered = 0;
        let totalReceived = 0;

        details.forEach(detail => {
            totalOrdered += detail.orderedQuantity;
            totalReceived += detail.receivedQuantity;
        });

        if (totalReceived === 0) {
            return POStatus.PENDING;
        } else if (totalReceived >= totalOrdered) {
            return POStatus.FULLY_RECEIVED;
        } else {
            return POStatus.PARTIALLY_RECEIVED;
        }
    }

    /**
     * Update order status based on received quantities
     * Automatically calculates and updates status when inbound transactions are linked
     * Requirements: 11.3, 11.4
     * 
     * @param orderId - Purchase order ID
     * @returns Observable of updated purchase order
     */
    recalculateAndUpdateStatus(orderId: string): Observable<PurchaseOrderHeader> {
        return this.getOrderDetails(orderId).pipe(
            map(details => this.calculateOrderStatus(details)),
            switchMap(newStatus => this.updateStatus(orderId, newStatus))
        );
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
                    errorMessage = 'Purchase order not found.';
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

        console.error('PurchaseOrderService Error:', {
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
     */
    private extractConflictError(error: HttpErrorResponse): string {
        if (error.error?.code === 'RECORD_LOCKED') {
            return `This purchase order is being edited by ${error.error.lockedBy}`;
        }
        if (error.error?.code === 'DUPLICATE_PO_NUMBER') {
            return 'A purchase order with this PO number already exists.';
        }
        return error.error?.message || 'Conflict occurred. Please refresh and try again.';
    }
}
