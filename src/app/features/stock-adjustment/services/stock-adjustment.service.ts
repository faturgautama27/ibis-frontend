/**
 * Stock Adjustment Service
 * 
 * Handles HTTP requests for Stock Adjustment operations.
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 9.1, 9.7
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
    StockAdjustmentHeader,
    StockAdjustmentDetail,
    StockAdjustmentAudit,
    AdjustmentFilters,
    CreateStockAdjustmentDto,
    UpdateStockAdjustmentDto,
    ReviewStockAdjustmentDto
} from '../models/stock-adjustment.model';
import { PermissionService } from '../../../shared/services/permission.service';
import { Permission } from '../../../shared/constants/permissions';

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
    data: T;
    totalRecords: number;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class StockAdjustmentService {
    private http = inject(HttpClient);
    private permissionService = inject(PermissionService);
    private readonly apiUrl = `${environment.apiUrl}/stock-adjustments`;

    /**
     * Get all stock adjustments with optional filters
     */
    getAdjustments(filters?: AdjustmentFilters): Observable<ApiResponse<StockAdjustmentHeader[]>> {
        const params = this.buildQueryParams(filters);
        return this.http.get<ApiResponse<StockAdjustmentHeader[]>>(this.apiUrl, { params });
    }

    /**
     * Get stock adjustment by ID
     */
    getAdjustmentById(id: string): Observable<StockAdjustmentHeader> {
        return this.http.get<StockAdjustmentHeader>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get stock adjustment details (line items)
     */
    getAdjustmentDetails(adjustmentId: string): Observable<StockAdjustmentDetail[]> {
        return this.http.get<StockAdjustmentDetail[]>(`${this.apiUrl}/${adjustmentId}/details`);
    }

    /**
     * Create new stock adjustment
     */
    createAdjustment(adjustment: CreateStockAdjustmentDto): Observable<StockAdjustmentHeader> {
        return this.http.post<StockAdjustmentHeader>(this.apiUrl, adjustment);
    }

    /**
     * Update stock adjustment (before submission)
     */
    updateAdjustment(id: string, adjustment: UpdateStockAdjustmentDto): Observable<StockAdjustmentHeader> {
        return this.http.put<StockAdjustmentHeader>(`${this.apiUrl}/${id}`, adjustment);
    }

    /**
     * Approve stock adjustment
     * Requirements: 8.8, 8.9, 8.10, 14.2, 14.3
     */
    approveAdjustment(id: string, review: ReviewStockAdjustmentDto): Observable<StockAdjustmentHeader> {
        // Validate permission before making API call
        try {
            this.permissionService.requirePermission(Permission.STOCK_ADJUSTMENT_APPROVE);
        } catch (error) {
            return throwError(() => error);
        }

        return this.http.post<StockAdjustmentHeader>(`${this.apiUrl}/${id}/approve`, review);
    }

    /**
     * Reject stock adjustment
     * Requirements: 8.8, 8.9, 8.11, 14.2, 14.3
     */
    rejectAdjustment(id: string, review: ReviewStockAdjustmentDto): Observable<StockAdjustmentHeader> {
        // Validate permission before making API call
        try {
            this.permissionService.requirePermission(Permission.STOCK_ADJUSTMENT_REJECT);
        } catch (error) {
            return throwError(() => error);
        }

        return this.http.post<StockAdjustmentHeader>(`${this.apiUrl}/${id}/reject`, review);
    }

    /**
     * Get audit trail for stock adjustment
     * Requirements: 9.1, 9.7
     */
    getAuditTrail(adjustmentId: string): Observable<StockAdjustmentAudit[]> {
        return this.http.get<StockAdjustmentAudit[]>(`${this.apiUrl}/${adjustmentId}/audit`);
    }

    /**
     * Get pending approvals
     * Requirements: 8.8
     */
    getPendingApprovals(): Observable<StockAdjustmentHeader[]> {
        return this.http.get<StockAdjustmentHeader[]>(`${this.apiUrl}/pending-approvals`);
    }

    /**
     * Export audit trail to Excel
     * Requirements: 9.8
     */
    exportAuditTrail(filters?: AdjustmentFilters): Observable<Blob> {
        const params = this.buildQueryParams(filters);
        return this.http.get(`${this.apiUrl}/audit/export`, {
            params,
            responseType: 'blob'
        });
    }

    /**
     * Build query parameters from filters
     */
    private buildQueryParams(filters?: AdjustmentFilters): HttpParams {
        let params = new HttpParams();

        if (!filters) {
            return params;
        }

        if (filters.searchQuery) {
            params = params.set('search', filters.searchQuery);
        }

        if (filters.status && filters.status.length > 0) {
            params = params.set('status', filters.status.join(','));
        }

        if (filters.itemId) {
            params = params.set('itemId', filters.itemId);
        }

        if (filters.dateFrom) {
            params = params.set('dateFrom', filters.dateFrom.toISOString());
        }

        if (filters.dateTo) {
            params = params.set('dateTo', filters.dateTo.toISOString());
        }

        if (filters.submittedBy) {
            params = params.set('submittedBy', filters.submittedBy);
        }

        if (filters.warehouseId) {
            params = params.set('warehouseId', filters.warehouseId);
        }

        return params;
    }
}
