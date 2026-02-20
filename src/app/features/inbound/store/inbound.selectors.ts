/**
 * Inbound Selectors
 * 
 * Provides selectors for querying Inbound state including PO-linked inbounds.
 * Requirements: 4.1, 4.6
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InboundState } from './inbound.state';

// Feature selector
export const selectInboundState = createFeatureSelector<InboundState>('inbound');

// Basic selectors
export const selectAllInbounds = createSelector(
    selectInboundState,
    (state) => state.inbounds
);

export const selectSelectedInbound = createSelector(
    selectInboundState,
    (state) => state.selectedInbound
);

export const selectInboundDetails = createSelector(
    selectInboundState,
    (state) => state.inboundDetails
);

export const selectLoading = createSelector(
    selectInboundState,
    (state) => state.loading
);

export const selectSaving = createSelector(
    selectInboundState,
    (state) => state.saving
);

export const selectError = createSelector(
    selectInboundState,
    (state) => state.error
);

export const selectFilters = createSelector(
    selectInboundState,
    (state) => state.filters
);

export const selectPagination = createSelector(
    selectInboundState,
    (state) => state.pagination
);

// PO Lookup selectors (Requirements: 4.1, 4.6)
export const selectPOLookupResults = createSelector(
    selectInboundState,
    (state) => state.poLookupResults
);

export const selectPOLookupLoading = createSelector(
    selectInboundState,
    (state) => state.poLookupLoading
);

export const selectPOLookupError = createSelector(
    selectInboundState,
    (state) => state.poLookupError
);

// PO-linked inbounds selector (Requirements: 4.6)
export const selectPOLinkedInbounds = createSelector(
    selectAllInbounds,
    (inbounds) => inbounds.filter(inbound => !!inbound.purchase_order_id)
);

// Inbounds without PO link
export const selectInboundsWithoutPOLink = createSelector(
    selectAllInbounds,
    (inbounds) => inbounds.filter(inbound => !inbound.purchase_order_id)
);

// Get inbound details by ID
export const selectInboundDetailsById = (inboundId: string) => createSelector(
    selectInboundDetails,
    (details) => details[inboundId] || []
);

// Filtered inbounds based on current filters
export const selectFilteredInbounds = createSelector(
    selectAllInbounds,
    selectFilters,
    (inbounds, filters) => {
        let filtered = [...inbounds];

        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(inbound =>
                inbound.inbound_number.toLowerCase().includes(query) ||
                inbound.supplier_name.toLowerCase().includes(query) ||
                inbound.purchase_order_number?.toLowerCase().includes(query)
            );
        }

        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(inbound =>
                filters.status!.includes(inbound.status)
            );
        }

        if (filters.supplierId) {
            filtered = filtered.filter(inbound =>
                inbound.supplier_id === filters.supplierId
            );
        }

        if (filters.warehouseId) {
            filtered = filtered.filter(inbound =>
                inbound.warehouse_id === filters.warehouseId
            );
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(inbound =>
                new Date(inbound.inbound_date) >= filters.dateFrom!
            );
        }

        if (filters.dateTo) {
            filtered = filtered.filter(inbound =>
                new Date(inbound.inbound_date) <= filters.dateTo!
            );
        }

        if (filters.hasPOLink !== undefined) {
            filtered = filtered.filter(inbound =>
                filters.hasPOLink ? !!inbound.purchase_order_id : !inbound.purchase_order_id
            );
        }

        return filtered;
    }
);
