/**
 * Outbound Service
 * 
 * Service for managing outbound transactions with SO linking support.
 * Requirements: 7.1, 7.6
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OutboundHeader, OutboundDetail } from '../models/outbound.model';
import { OutboundFilters } from '../store/outbound.state';
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
export class OutboundService {
    private readonly apiUrl = `${environment.apiUrl}/outbounds`;

    constructor(private http: HttpClient) { }

    /**
     * Get outbounds with optional filters
     */
    getOutbounds(filters?: OutboundFilters): Observable<OutboundHeader[]> {
        let params = new HttpParams();

        if (filters) {
            if (filters.searchQuery) {
                params = params.set('search', filters.searchQuery);
            }
            if (filters.status && filters.status.length > 0) {
                params = params.set('status', filters.status.join(','));
            }
            if (filters.customerId) {
                params = params.set('customerId', filters.customerId);
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
            if (filters.hasSOLink !== undefined) {
                params = params.set('hasSOLink', filters.hasSOLink.toString());
            }
        }

        return this.http.get<OutboundHeader[]>(this.apiUrl, { params });
    }

    /**
     * Get outbound by ID
     */
    getOutboundById(id: string): Observable<OutboundHeader> {
        return this.http.get<OutboundHeader>(`${this.apiUrl}/${id}`);
    }

    /**
     * Get outbound details
     */
    getOutboundDetails(outboundId: string): Observable<OutboundDetail[]> {
        return this.http.get<OutboundDetail[]>(`${this.apiUrl}/${outboundId}/details`);
    }

    /**
     * Create new outbound
     */
    createOutbound(
        outbound: Partial<OutboundHeader>,
        details: Partial<OutboundDetail>[]
    ): Observable<OutboundHeader> {
        return this.http.post<OutboundHeader>(this.apiUrl, {
            header: outbound,
            details
        });
    }

    /**
     * Update existing outbound
     */
    updateOutbound(
        outboundId: string,
        outbound: Partial<OutboundHeader>,
        details?: Partial<OutboundDetail>[]
    ): Observable<OutboundHeader> {
        return this.http.put<OutboundHeader>(`${this.apiUrl}/${outboundId}`, {
            header: outbound,
            details
        });
    }

    /**
     * Delete outbound
     */
    deleteOutbound(outboundId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${outboundId}`);
    }

    /**
     * Get outbounds linked to a specific SO
     * Requirements: 7.6
     */
    getOutboundsBySO(salesOrderId: string): Observable<OutboundHeader[]> {
        return this.http.get<OutboundHeader[]>(`${this.apiUrl}/by-so/${salesOrderId}`);
    }
}
