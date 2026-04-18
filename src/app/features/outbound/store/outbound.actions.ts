/**
 * Outbound Actions
 * 
 * Defines all actions for Outbound state management including SO linking.
 * Requirements: 7.1, 7.6
 */

import { createAction, props } from '@ngrx/store';
import { OutboundHeader, OutboundDetail, SOLookupCriteria } from '../models/outbound.model';
import { OutboundFilters } from './outbound.state';
import { SalesOrderHeader } from '../../sales-order/models/sales-order.model';

// Load Outbounds
export const loadOutbounds = createAction(
    '[Outbound] Load Outbounds',
    props<{ filters?: OutboundFilters }>()
);

export const loadOutboundsSuccess = createAction(
    '[Outbound] Load Outbounds Success',
    props<{ outbounds: OutboundHeader[]; totalRecords: number }>()
);

export const loadOutboundsFailure = createAction(
    '[Outbound] Load Outbounds Failure',
    props<{ error: string }>()
);

// Load Outbound Details
export const loadOutboundDetails = createAction(
    '[Outbound] Load Outbound Details',
    props<{ outboundId: string }>()
);

export const loadOutboundDetailsSuccess = createAction(
    '[Outbound] Load Outbound Details Success',
    props<{ outboundId: string; details: OutboundDetail[] }>()
);

export const loadOutboundDetailsFailure = createAction(
    '[Outbound] Load Outbound Details Failure',
    props<{ error: string }>()
);

// Create Outbound
export const createOutbound = createAction(
    '[Outbound] Create Outbound',
    props<{ outbound: Partial<OutboundHeader>; details: Partial<OutboundDetail>[] }>()
);

export const createOutboundSuccess = createAction(
    '[Outbound] Create Outbound Success',
    props<{ outbound: OutboundHeader }>()
);

export const createOutboundFailure = createAction(
    '[Outbound] Create Outbound Failure',
    props<{ error: string }>()
);

// Update Outbound
export const updateOutbound = createAction(
    '[Outbound] Update Outbound',
    props<{ outboundId: string; outbound: Partial<OutboundHeader>; details?: Partial<OutboundDetail>[] }>()
);

export const updateOutboundSuccess = createAction(
    '[Outbound] Update Outbound Success',
    props<{ outbound: OutboundHeader }>()
);

export const updateOutboundFailure = createAction(
    '[Outbound] Update Outbound Failure',
    props<{ error: string }>()
);

// Delete Outbound
export const deleteOutbound = createAction(
    '[Outbound] Delete Outbound',
    props<{ outboundId: string }>()
);

export const deleteOutboundSuccess = createAction(
    '[Outbound] Delete Outbound Success',
    props<{ outboundId: string }>()
);

export const deleteOutboundFailure = createAction(
    '[Outbound] Delete Outbound Failure',
    props<{ error: string }>()
);

// SO Lookup Actions (Requirements: 7.1, 7.6)
export const lookupSalesOrders = createAction(
    '[Outbound] Lookup Sales Orders',
    props<{ criteria: SOLookupCriteria }>()
);

export const lookupSalesOrdersSuccess = createAction(
    '[Outbound] Lookup Sales Orders Success',
    props<{ orders: SalesOrderHeader[] }>()
);

export const lookupSalesOrdersFailure = createAction(
    '[Outbound] Lookup Sales Orders Failure',
    props<{ error: string }>()
);

export const clearSOLookupResults = createAction(
    '[Outbound] Clear SO Lookup Results'
);

// Link SO to Outbound
export const linkSalesOrder = createAction(
    '[Outbound] Link Sales Order',
    props<{ salesOrder: SalesOrderHeader }>()
);

// Select Outbound
export const selectOutbound = createAction(
    '[Outbound] Select Outbound',
    props<{ outbound: OutboundHeader | null }>()
);

// Clear Selected Outbound
export const clearSelectedOutbound = createAction(
    '[Outbound] Clear Selected Outbound'
);

// Set Filters
export const setFilters = createAction(
    '[Outbound] Set Filters',
    props<{ filters: OutboundFilters }>()
);

// Set Pagination
export const setPagination = createAction(
    '[Outbound] Set Pagination',
    props<{ page: number; pageSize: number }>()
);

// Clear Error
export const clearError = createAction(
    '[Outbound] Clear Error'
);
