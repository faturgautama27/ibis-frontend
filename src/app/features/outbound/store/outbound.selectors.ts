/**
 * Outbound Selectors
 * 
 * Provides selectors for querying Outbound state including SO-linked outbounds.
 * Requirements: 7.1, 7.6
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OutboundState } from './outbound.state';

/**
 * Feature selector for Outbound state
 */
export const selectOutboundState = createFeatureSelector<OutboundState>('outbound');

/**
 * Select all outbounds
 */
export const selectAllOutbounds = createSelector(
    selectOutboundState,
    (state) => state.outbounds
);

/**
 * Select selected outbound
 */
export const selectSelectedOutbound = createSelector(
    selectOutboundState,
    (state) => state.selectedOutbound
);

/**
 * Select outbound details by ID
 */
export const selectOutboundDetails = (outboundId: string) => createSelector(
    selectOutboundState,
    (state) => state.outboundDetails[outboundId] || []
);

/**
 * Select loading state
 */
export const selectOutboundLoading = createSelector(
    selectOutboundState,
    (state) => state.loading
);

/**
 * Select saving state
 */
export const selectOutboundSaving = createSelector(
    selectOutboundState,
    (state) => state.saving
);

/**
 * Select error
 */
export const selectOutboundError = createSelector(
    selectOutboundState,
    (state) => state.error
);

/**
 * Select filters
 */
export const selectOutboundFilters = createSelector(
    selectOutboundState,
    (state) => state.filters
);

/**
 * Select pagination
 */
export const selectOutboundPagination = createSelector(
    selectOutboundState,
    (state) => state.pagination
);

/**
 * Select SO lookup results
 * Requirements: 7.1, 7.6
 */
export const selectSOLookupResults = createSelector(
    selectOutboundState,
    (state) => state.soLookupResults
);

/**
 * Select SO lookup loading state
 */
export const selectSOLookupLoading = createSelector(
    selectOutboundState,
    (state) => state.soLookupLoading
);

/**
 * Select SO lookup error
 */
export const selectSOLookupError = createSelector(
    selectOutboundState,
    (state) => state.soLookupError
);

/**
 * Select outbounds linked to sales orders
 * Requirements: 7.6
 */
export const selectSOLinkedOutbounds = createSelector(
    selectAllOutbounds,
    (outbounds) => outbounds.filter(o => o.sales_order_id !== undefined && o.sales_order_id !== null)
);

/**
 * Select outbounds not linked to sales orders
 */
export const selectNonSOLinkedOutbounds = createSelector(
    selectAllOutbounds,
    (outbounds) => outbounds.filter(o => o.sales_order_id === undefined || o.sales_order_id === null)
);

/**
 * Select filtered outbounds based on current filters
 */
export const selectFilteredOutbounds = createSelector(
    selectAllOutbounds,
    selectOutboundFilters,
    (outbounds, filters) => {
        let filtered = [...outbounds];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.outbound_number.toLowerCase().includes(query) ||
                o.customer_name.toLowerCase().includes(query) ||
                o.sales_order_number?.toLowerCase().includes(query)
            );
        }

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(o => filters.status!.includes(o.status));
        }

        if (filters.customerId) {
            filtered = filtered.filter(o => o.customer_id === filters.customerId);
        }

        if (filters.warehouseId) {
            filtered = filtered.filter(o => o.warehouse_id === filters.warehouseId);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(o => new Date(o.outbound_date) >= filters.dateFrom!);
        }

        if (filters.dateTo) {
            filtered = filtered.filter(o => new Date(o.outbound_date) <= filters.dateTo!);
        }

        if (filters.hasSOLink !== undefined) {
            filtered = filtered.filter(o => {
                const hasLink = o.sales_order_id !== undefined && o.sales_order_id !== null;
                return hasLink === filters.hasSOLink;
            });
        }

        return filtered;
    }
);
