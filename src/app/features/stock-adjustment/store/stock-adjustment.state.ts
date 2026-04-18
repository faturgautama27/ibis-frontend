/**
 * Stock Adjustment State
 * 
 * Defines the state structure for the Stock Adjustment feature in NgRx store.
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9
 */

import {
    StockAdjustmentHeader,
    StockAdjustmentDetail,
    StockAdjustmentAudit,
    AdjustmentFilters
} from '../models/stock-adjustment.model';

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
 * Stock Adjustment State Interface
 * Complete state structure for Stock Adjustment management
 */
export interface StockAdjustmentState {
    /** All adjustments in the store */
    adjustments: StockAdjustmentHeader[];

    /** Currently selected adjustment */
    selectedAdjustment: StockAdjustmentHeader | null;

    /** Adjustment details mapped by adjustment ID */
    adjustmentDetails: { [adjustmentId: string]: StockAdjustmentDetail[] };

    /** Audit trail mapped by adjustment ID */
    auditTrail: { [adjustmentId: string]: StockAdjustmentAudit[] };

    /** Pending approvals list */
    pendingApprovals: StockAdjustmentHeader[];

    /** Loading state for async operations */
    loading: boolean;

    /** Saving state for create/update operations */
    saving: boolean;

    /** Error message if any operation fails */
    error: string | null;

    /** Current filters applied to the adjustment list */
    filters: AdjustmentFilters;

    /** Pagination state */
    pagination: PaginationState;
}

/**
 * Initial State
 * Default state values when the store is initialized
 */
export const initialStockAdjustmentState: StockAdjustmentState = {
    adjustments: [],
    selectedAdjustment: null,
    adjustmentDetails: {},
    auditTrail: {},
    pendingApprovals: [],
    loading: false,
    saving: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        pageSize: 10,
        totalRecords: 0
    }
};
