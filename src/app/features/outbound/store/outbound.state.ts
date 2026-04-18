/**
 * Outbound State
 * 
 * Defines the state structure for the Outbound feature in NgRx store.
 * Requirements: 7.1, 7.6
 */

import { OutboundHeader, OutboundDetail } from '../models/outbound.model';
import { SalesOrderHeader } from '../../sales-order/models/sales-order.model';

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
 * Outbound Filters
 * Filter criteria for outbound list views
 */
export interface OutboundFilters {
    searchQuery?: string;
    status?: string[];
    customerId?: string;
    warehouseId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    hasSOLink?: boolean;
}

/**
 * Outbound State Interface
 * Complete state structure for Outbound management with SO linking support
 */
export interface OutboundState {
    outbounds: OutboundHeader[];
    selectedOutbound: OutboundHeader | null;
    outboundDetails: { [outboundId: string]: OutboundDetail[] };
    loading: boolean;
    saving: boolean;
    error: string | null;
    filters: OutboundFilters;
    pagination: PaginationState;

    // SO Lookup state
    soLookupResults: SalesOrderHeader[];
    soLookupLoading: boolean;
    soLookupError: string | null;
}

/**
 * Initial State
 * Default state values when the store is initialized
 */
export const initialOutboundState: OutboundState = {
    outbounds: [],
    selectedOutbound: null,
    outboundDetails: {},
    loading: false,
    saving: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        pageSize: 10,
        totalRecords: 0
    },
    soLookupResults: [],
    soLookupLoading: false,
    soLookupError: null
};
