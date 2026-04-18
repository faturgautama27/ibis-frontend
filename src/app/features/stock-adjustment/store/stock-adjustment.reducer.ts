/**
 * Stock Adjustment Reducer
 * 
 * Handles state mutations for Stock Adjustment actions.
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9
 */

import { createReducer, on } from '@ngrx/store';
import { StockAdjustmentState, initialStockAdjustmentState } from './stock-adjustment.state';
import * as StockAdjustmentActions from './stock-adjustment.actions';

export const stockAdjustmentReducer = createReducer(
    initialStockAdjustmentState,

    // Load Adjustments
    on(StockAdjustmentActions.loadAdjustments, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(StockAdjustmentActions.loadAdjustmentsSuccess, (state, { adjustments, totalRecords }) => ({
        ...state,
        adjustments,
        loading: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords
        }
    })),

    on(StockAdjustmentActions.loadAdjustmentsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Adjustment By ID
    on(StockAdjustmentActions.loadAdjustmentById, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(StockAdjustmentActions.loadAdjustmentByIdSuccess, (state, { adjustment }) => ({
        ...state,
        selectedAdjustment: adjustment,
        loading: false,
        error: null
    })),

    on(StockAdjustmentActions.loadAdjustmentByIdFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Adjustment Details
    on(StockAdjustmentActions.loadAdjustmentDetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(StockAdjustmentActions.loadAdjustmentDetailsSuccess, (state, { adjustmentId, details }) => ({
        ...state,
        adjustmentDetails: {
            ...state.adjustmentDetails,
            [adjustmentId]: details
        },
        loading: false,
        error: null
    })),

    on(StockAdjustmentActions.loadAdjustmentDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Adjustment
    on(StockAdjustmentActions.createAdjustment, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(StockAdjustmentActions.createAdjustmentSuccess, (state, { adjustment }) => ({
        ...state,
        adjustments: [adjustment, ...state.adjustments],
        selectedAdjustment: adjustment,
        saving: false,
        error: null
    })),

    on(StockAdjustmentActions.createAdjustmentFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Adjustment
    on(StockAdjustmentActions.updateAdjustment, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(StockAdjustmentActions.updateAdjustmentSuccess, (state, { adjustment }) => ({
        ...state,
        adjustments: state.adjustments.map(adj =>
            adj.id === adjustment.id ? adjustment : adj
        ),
        selectedAdjustment: adjustment,
        saving: false,
        error: null
    })),

    on(StockAdjustmentActions.updateAdjustmentFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Approve Adjustment
    on(StockAdjustmentActions.approveAdjustment, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(StockAdjustmentActions.approveAdjustmentSuccess, (state, { adjustment }) => ({
        ...state,
        adjustments: state.adjustments.map(adj =>
            adj.id === adjustment.id ? adjustment : adj
        ),
        selectedAdjustment: adjustment,
        pendingApprovals: state.pendingApprovals.filter(adj => adj.id !== adjustment.id),
        saving: false,
        error: null
    })),

    on(StockAdjustmentActions.approveAdjustmentFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Reject Adjustment
    on(StockAdjustmentActions.rejectAdjustment, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(StockAdjustmentActions.rejectAdjustmentSuccess, (state, { adjustment }) => ({
        ...state,
        adjustments: state.adjustments.map(adj =>
            adj.id === adjustment.id ? adjustment : adj
        ),
        selectedAdjustment: adjustment,
        pendingApprovals: state.pendingApprovals.filter(adj => adj.id !== adjustment.id),
        saving: false,
        error: null
    })),

    on(StockAdjustmentActions.rejectAdjustmentFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Load Audit Trail
    on(StockAdjustmentActions.loadAuditTrail, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(StockAdjustmentActions.loadAuditTrailSuccess, (state, { adjustmentId, auditTrail }) => ({
        ...state,
        auditTrail: {
            ...state.auditTrail,
            [adjustmentId]: auditTrail
        },
        loading: false,
        error: null
    })),

    on(StockAdjustmentActions.loadAuditTrailFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Pending Approvals
    on(StockAdjustmentActions.loadPendingApprovals, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(StockAdjustmentActions.loadPendingApprovalsSuccess, (state, { pendingApprovals }) => ({
        ...state,
        pendingApprovals,
        loading: false,
        error: null
    })),

    on(StockAdjustmentActions.loadPendingApprovalsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Set Filters
    on(StockAdjustmentActions.setFilters, (state, { filters }) => ({
        ...state,
        filters
    })),

    // Clear Selected Adjustment
    on(StockAdjustmentActions.clearSelectedAdjustment, (state) => ({
        ...state,
        selectedAdjustment: null
    })),

    // Clear Error
    on(StockAdjustmentActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
