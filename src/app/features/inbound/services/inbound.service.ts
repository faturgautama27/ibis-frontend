/**
 * Inbound Service
 * 
 * Service for managing inbound transactions with PO linking support.
 * Requirements: 4.1, 4.6
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InboundHeader, InboundDetail } from '../models/inbound.model';
import { InboundFilters } from '../store/inbound.state';
import { environment } from '../../../../environments/environment';

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
    data: T;
    total: number;
    page: number;
    pageSize: number;
}

@Injectable({
    providedIn: 'root'
})
export class InboundService {
    private readonly apiUrl = `${environment.apiUrl}/inbounds`;

    constructor(private http: HttpClient) { }

    /**
     * Get inbounds with optional filters
     */
    getInbounds(filters?: InboundFilters): Observable<ApiResponse<InboundHeader[]>> {
        let params = new HttpParams();

        if (filters) {
            if (filters.searchQuery) {
                params = params.set('search', filters.searchQuery);
            }
            if (filters.status && filters.status.length > 0) {
                params = params.set('status', filters.status.join(','));
            }
            if (filters.supplierId) {
                params = params.set('supplierId', filters.supplierId);
            }
            if (filters.warehouseId) {
                params = params.set('warehouseId', filters.warehouseId);
            }
            if (filters.dateFrom) {
                params = params.set('dateFrom', filters.dateFrom.toISOString());
            }
            if (filters.dateTo) {
                params = params.set('dateTo', filters.dateTo.toISOString());
            }
            if (filters.hasPOLink !== undefined) {
                params = params.set('hasPOLink', filters.hasPOLink.toString());
            }
        }

        return this.http.get<ApiResponse<InboundHeader[]>>(this.apiUrl, { params });
    }

    /**
     * Get inbound by ID
     */
    getInboundById(id: string): Observable<InboundHeader> {
        return this.http.get<InboundHeader>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get inbound details
     */
    getInboundDetails(inboundId: string): Observable<InboundDetail[]> {
        return this.http.get<InboundDetail[]>(`${this.apiUrl}/${inboundId}/details`);
    }

    /**
     * Create new inbound
     */
    createInbound(
        inbound: Partial<InboundHeader>,
        details: Partial<InboundDetail>[]
    ): Observable<InboundHeader> {
        return this.http.post<InboundHeader>(this.apiUrl, {
            header: inbound,
            details
        });
    }

    /**
     * Update existing inbound
     */
    updateInbound(
        inboundId: string,
        inbound: Partial<InboundHeader>,
        details?: Partial<InboundDetail>[]
    ): Observable<InboundHeader> {
        return this.http.put<InboundHeader>(`${this.apiUrl}/${inboundId}`, {
            header: inbound,
            details
        });
    }

    /**
     * Delete inbound
     */
    deleteInbound(inboundId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${inboundId}`);
    }

    /**
     * Get inbounds linked to a specific PO
     * Requirements: 4.6
     */
    getInboundsByPO(purchaseOrderId: string): Observable<InboundHeader[]> {
        return this.http.get<InboundHeader[]>(`${this.apiUrl}/by-po/${purchaseOrderId}`);
    }
}
