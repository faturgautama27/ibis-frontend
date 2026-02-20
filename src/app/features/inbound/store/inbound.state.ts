/**
 * Inbound State
 * 
 * Defines the state structure for the Inbound feature in NgRx store.
 * Requirements: 4.1, 4.6
 */

import { InboundHeader, InboundDetail } from '../models/inbound.model';
import { PurchaseOrderHeader } from '../../purchase-order/models/purchase-order.model';

/**
 * Pagination State
 * Manages pagination information for list views
 */
export interface PaginationState {
    page: number;
    pageSize: number;
    totalRecords: number;
}

/**
 * Inbound Filters
 * Filter criteria for inbound list views
 */
export interface InboundFilters {
    searchQuery?: string;
    status?: string[];
    supplierId?: string;
    warehouseId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    hasPOLink?: boolean;
}

/**
 * Inbound State Interface
 * Complete state structure for Inbound management with PO linking support
 */
export interface InboundState {
    inbounds: InboundHeader[];
    selectedInbound: InboundHeader | null;
    inboundDetails: { [inboundId: string]: InboundDetail[] };
    loading: boolean;
    saving: boolean;
    error: string | null;
    filters: InboundFilters;
    pagination: PaginationState;

    // PO Lookup state
    poLookupResults: PurchaseOrderHeader[];
    poLookupLoading: boolean;
    poLookupError: string | null;
}

/**
 * Initial State
 * Default state values when the store is initialized
 */
export const initialInboundState: InboundState = {
    inbounds: [],
    selectedInbound: null,
    inboundDetails: {},
    loading: false,
    saving: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        pageSize: 10,
        totalRecords: 0
    },
    poLookupResults: [],
    poLookupLoading: false,
    poLookupError: null
};
