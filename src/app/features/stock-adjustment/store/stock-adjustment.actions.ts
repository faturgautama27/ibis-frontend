/**
 * Stock Adjustment Actions
 * 
 * Defines all actions for the Stock Adjustment feature.
 * 
 * Requirements: 8.1, 8.6, 8.7, 8.8, 8.9
 */

import { createAction, props } from '@ngrx/store';
import {
    StockAdjustmentHeader,
    StockAdjustmentDetail,
    StockAdjustmentAudit,
    AdjustmentFilters,
    CreateStockAdjustmentDto,
    UpdateStockAdjustmentDto,
    ReviewStockAdjustmentDto
} from '../models/stock-adjustment.model';

// Load Adjustments
export const loadAdjustments = createAction(
    '[Stock Adjustment] Load Adjustments',
    props<{ filters?: AdjustmentFilters }>()
);

export const loadAdjustmentsSuccess = createAction(
    '[Stock Adjustment] Load Adjustments Success',
    props<{ adjustments: StockAdjustmentHeader[]; totalRecords: number }>()
);

export const loadAdjustmentsFailure = createAction(
    '[Stock Adjustment] Load Adjustments Failure',
    props<{ error: string }>()
);

// Load Adjustment By ID
export const loadAdjustmentById = createAction(
    '[Stock Adjustment] Load Adjustment By ID',
    props<{ id: string }>()
);

export const loadAdjustmentByIdSuccess = createAction(
    '[Stock Adjustment] Load Adjustment By ID Success',
    props<{ adjustment: StockAdjustmentHeader }>()
);

export const loadAdjustmentByIdFailure = createAction(
    '[Stock Adjustment] Load Adjustment By ID Failure',
    props<{ error: string }>()
);

// Load Adjustment Details
export const loadAdjustmentDetails = createAction(
    '[Stock Adjustment] Load Adjustment Details',
    props<{ adjustmentId: string }>()
);

export const loadAdjustmentDetailsSuccess = createAction(
    '[Stock Adjustment] Load Adjustment Details Success',
    props<{ adjustmentId: string; details: StockAdjustmentDetail[] }>()
);

export const loadAdjustmentDetailsFailure = createAction(
    '[Stock Adjustment] Load Adjustment Details Failure',
    props<{ error: string }>()
);

// Create Adjustment
export const createAdjustment = createAction(
    '[Stock Adjustment] Create Adjustment',
    props<{ adjustment: CreateStockAdjustmentDto }>()
);

export const createAdjustmentSuccess = createAction(
    '[Stock Adjustment] Create Adjustment Success',
    props<{ adjustment: StockAdjustmentHeader }>()
);

export const createAdjustmentFailure = createAction(
    '[Stock Adjustment] Create Adjustment Failure',
    props<{ error: string }>()
);

// Update Adjustment (before submission)
export const updateAdjustment = createAction(
    '[Stock Adjustment] Update Adjustment',
    props<{ id: string; adjustment: UpdateStockAdjustmentDto }>()
);

export const updateAdjustmentSuccess = createAction(
    '[Stock Adjustment] Update Adjustment Success',
    props<{ adjustment: StockAdjustmentHeader }>()
);

export const updateAdjustmentFailure = createAction(
    '[Stock Adjustment] Update Adjustment Failure',
    props<{ error: string }>()
);

// Approve Adjustment
export const approveAdjustment = createAction(
    '[Stock Adjustment] Approve Adjustment',
    props<{ id: string; review: ReviewStockAdjustmentDto }>()
);

export const approveAdjustmentSuccess = createAction(
    '[Stock Adjustment] Approve Adjustment Success',
    props<{ adjustment: StockAdjustmentHeader }>()
);

export const approveAdjustmentFailure = createAction(
    '[Stock Adjustment] Approve Adjustment Failure',
    props<{ error: string }>()
);

// Reject Adjustment
export const rejectAdjustment = createAction(
    '[Stock Adjustment] Reject Adjustment',
    props<{ id: string; review: ReviewStockAdjustmentDto }>()
);

export const rejectAdjustmentSuccess = createAction(
    '[Stock Adjustment] Reject Adjustment Success',
    props<{ adjustment: StockAdjustmentHeader }>()
);

export const rejectAdjustmentFailure = createAction(
    '[Stock Adjustment] Reject Adjustment Failure',
    props<{ error: string }>()
);

// Load Audit Trail
export const loadAuditTrail = createAction(
    '[Stock Adjustment] Load Audit Trail',
    props<{ adjustmentId: string }>()
);

export const loadAuditTrailSuccess = createAction(
    '[Stock Adjustment] Load Audit Trail Success',
    props<{ adjustmentId: string; auditTrail: StockAdjustmentAudit[] }>()
);

export const loadAuditTrailFailure = createAction(
    '[Stock Adjustment] Load Audit Trail Failure',
    props<{ error: string }>()
);

// Load Pending Approvals
export const loadPendingApprovals = createAction(
    '[Stock Adjustment] Load Pending Approvals'
);

export const loadPendingApprovalsSuccess = createAction(
    '[Stock Adjustment] Load Pending Approvals Success',
    props<{ pendingApprovals: StockAdjustmentHeader[] }>()
);

export const loadPendingApprovalsFailure = createAction(
    '[Stock Adjustment] Load Pending Approvals Failure',
    props<{ error: string }>()
);

// Set Filters
export const setFilters = createAction(
    '[Stock Adjustment] Set Filters',
    props<{ filters: AdjustmentFilters }>()
);

// Clear Selected Adjustment
export const clearSelectedAdjustment = createAction(
    '[Stock Adjustment] Clear Selected Adjustment'
);

// Clear Error
export const clearError = createAction(
    '[Stock Adjustment] Clear Error'
);
