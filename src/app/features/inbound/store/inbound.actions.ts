/**
 * Inbound Actions
 * 
 * Defines all actions for Inbound state management including PO linking.
 * Requirements: 4.1, 4.6
 */

import { createAction, props } from '@ngrx/store';
import { InboundHeader, InboundDetail, POLookupCriteria } from '../models/inbound.model';
import { InboundFilters } from './inbound.state';
import { PurchaseOrderHeader } from '../../purchase-order/models/purchase-order.model';

// Load Inbounds
export const loadInbounds = createAction(
    '[Inbound] Load Inbounds',
    props<{ filters?: InboundFilters }>()
);

export const loadInboundsSuccess = createAction(
    '[Inbound] Load Inbounds Success',
    props<{ inbounds: InboundHeader[]; totalRecords: number }>()
);

export const loadInboundsFailure = createAction(
    '[Inbound] Load Inbounds Failure',
    props<{ error: string }>()
);

// Load Inbound Details
export const loadInboundDetails = createAction(
    '[Inbound] Load Inbound Details',
    props<{ inboundId: string }>()
);

export const loadInboundDetailsSuccess = createAction(
    '[Inbound] Load Inbound Details Success',
    props<{ inboundId: string; details: InboundDetail[] }>()
);

export const loadInboundDetailsFailure = createAction(
    '[Inbound] Load Inbound Details Failure',
    props<{ error: string }>()
);

// Create Inbound
export const createInbound = createAction(
    '[Inbound] Create Inbound',
    props<{ inbound: Partial<InboundHeader>; details: Partial<InboundDetail>[] }>()
);

export const createInboundSuccess = createAction(
    '[Inbound] Create Inbound Success',
    props<{ inbound: InboundHeader }>()
);

export const createInboundFailure = createAction(
    '[Inbound] Create Inbound Failure',
    props<{ error: string }>()
);

// Update Inbound
export const updateInbound = createAction(
    '[Inbound] Update Inbound',
    props<{ inboundId: string; inbound: Partial<InboundHeader>; details?: Partial<InboundDetail>[] }>()
);

export const updateInboundSuccess = createAction(
    '[Inbound] Update Inbound Success',
    props<{ inbound: InboundHeader }>()
);

export const updateInboundFailure = createAction(
    '[Inbound] Update Inbound Failure',
    props<{ error: string }>()
);

// Delete Inbound
export const deleteInbound = createAction(
    '[Inbound] Delete Inbound',
    props<{ inboundId: string }>()
);

export const deleteInboundSuccess = createAction(
    '[Inbound] Delete Inbound Success',
    props<{ inboundId: string }>()
);

export const deleteInboundFailure = createAction(
    '[Inbound] Delete Inbound Failure',
    props<{ error: string }>()
);

// PO Lookup Actions (Requirements: 4.1, 4.6)
export const lookupPurchaseOrders = createAction(
    '[Inbound] Lookup Purchase Orders',
    props<{ criteria: POLookupCriteria }>()
);

export const lookupPurchaseOrdersSuccess = createAction(
    '[Inbound] Lookup Purchase Orders Success',
    props<{ orders: PurchaseOrderHeader[] }>()
);

export const lookupPurchaseOrdersFailure = createAction(
    '[Inbound] Lookup Purchase Orders Failure',
    props<{ error: string }>()
);

export const clearPOLookupResults = createAction(
    '[Inbound] Clear PO Lookup Results'
);

// Link PO to Inbound
export const linkPurchaseOrder = createAction(
    '[Inbound] Link Purchase Order',
    props<{ purchaseOrder: PurchaseOrderHeader }>()
);

// Select Inbound
export const selectInbound = createAction(
    '[Inbound] Select Inbound',
    props<{ inbound: InboundHeader | null }>()
);

// Clear Selected Inbound
export const clearSelectedInbound = createAction(
    '[Inbound] Clear Selected Inbound'
);

// Set Filters
export const setFilters = createAction(
    '[Inbound] Set Filters',
    props<{ filters: InboundFilters }>()
);

// Set Pagination
export const setPagination = createAction(
    '[Inbound] Set Pagination',
    props<{ page: number; pageSize: number }>()
);

// Clear Error
export const clearError = createAction(
    '[Inbound] Clear Error'
);
