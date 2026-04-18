/**
 * Stock Adjustment Selectors
 * 
 * Provides selectors for querying Stock Adjustment state.
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockAdjustmentState } from './stock-adjustment.state';
import { AdjustmentStatus } from '../models/stock-adjustment.model';

// Feature selector
export const selectStockAdjustmentState = createFeatureSelector<StockAdjustmentState>('stockAdjustment');

// Basic selectors
export const selectAllAdjustments = createSelector(
    selectStockAdjustmentState,
    (state) => state.adjustments
);

export const selectSelectedAdjustment = createSelector(
    selectStockAdjustmentState,
    (state) => state.selectedAdjustment
);

export const selectAdjustmentDetails = createSelector(
    selectStockAdjustmentState,
    (state) => state.adjustmentDetails
);

export const selectAuditTrail = createSelector(
    selectStockAdjustmentState,
    (state) => state.auditTrail
);

export const selectPendingApprovals = createSelector(
    selectStockAdjustmentState,
    (state) => state.pendingApprovals
);

export const selectLoading = createSelector(
    selectStockAdjustmentState,
    (state) => state.loading
);

export const selectSaving = createSelector(
    selectStockAdjustmentState,
    (state) => state.saving
);

export const selectError = createSelector(
    selectStockAdjustmentState,
    (state) => state.error
);

export const selectFilters = createSelector(
    selectStockAdjustmentState,
    (state) => state.filters
);

export const selectPagination = createSelector(
    selectStockAdjustmentState,
    (state) => state.pagination
);

// Derived selectors
export const selectAdjustmentDetailsById = (adjustmentId: string) => createSelector(
    selectAdjustmentDetails,
    (details) => details[adjustmentId] || []
);

export const selectAuditTrailById = (adjustmentId: string) => createSelector(
    selectAuditTrail,
    (auditTrail) => auditTrail[adjustmentId] || []
);

export const selectFilteredAdjustments = createSelector(
    selectAllAdjustments,
    selectFilters,
    (adjustments, filters) => {
        let filtered = [...adjustments];

        // Filter by status
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(adj => filters.status!.includes(adj.status));
        }

        // Filter by item
        if (filters.itemId) {
            // This would require loading details for all adjustments
            // In practice, filtering by item should be done server-side
        }

        // Filter by date range
        if (filters.dateFrom) {
            filtered = filtered.filter(adj =>
                new Date(adj.adjustmentDate) >= filters.dateFrom!
            );
        }

        if (filters.dateTo) {
            filtered = filtered.filter(adj =>
                new Date(adj.adjustmentDate) <= filters.dateTo!
            );
        }

        // Filter by submitted by
        if (filters.submittedBy) {
            filtered = filtered.filter(adj =>
                adj.submittedBy === filters.submittedBy
            );
        }

        // Filter by warehouse
        if (filters.warehouseId) {
            filtered = filtered.filter(adj =>
                adj.warehouseId === filters.warehouseId
            );
        }

        // Search query (adjustment number, warehouse name)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(adj =>
                adj.adjustmentNumber.toLowerCase().includes(query) ||
                adj.warehouseName.toLowerCase().includes(query)
            );
        }

        return filtered;
    }
);

export const selectPendingApprovalsCount = createSelector(
    selectPendingApprovals,
    (pendingApprovals) => pendingApprovals.length
);

export const selectAdjustmentsByStatus = (status: AdjustmentStatus) => createSelector(
    selectAllAdjustments,
    (adjustments) => adjustments.filter(adj => adj.status === status)
);
