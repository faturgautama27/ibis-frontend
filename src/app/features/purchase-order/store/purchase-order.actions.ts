/**
 * Purchase Order Actions
 * 
 * Defines all actions for Purchase Order state management.
 */

import { createAction, props } from '@ngrx/store';
import {
    PurchaseOrderHeader,
    PurchaseOrderDetail,
    POFilters,
    POStatus
} from '../models/purchase-order.model';

// Load Orders
export const loadOrders = createAction(
    '[Purchase Order] Load Orders',
    props<{ filters?: POFilters }>()
);

export const loadOrdersSuccess = createAction(
    '[Purchase Order] Load Orders Success',
    props<{ orders: PurchaseOrderHeader[]; totalRecords: number }>()
);

export const loadOrdersFailure = createAction(
    '[Purchase Order] Load Orders Failure',
    props<{ error: string }>()
);

// Load Order Details
export const loadOrderDetails = createAction(
    '[Purchase Order] Load Order Details',
    props<{ orderId: string }>()
);

export const loadOrderDetailsSuccess = createAction(
    '[Purchase Order] Load Order Details Success',
    props<{ orderId: string; details: PurchaseOrderDetail[] }>()
);

export const loadOrderDetailsFailure = createAction(
    '[Purchase Order] Load Order Details Failure',
    props<{ error: string }>()
);

// Create Order
export const createOrder = createAction(
    '[Purchase Order] Create Order',
    props<{ order: Partial<PurchaseOrderHeader>; details: Partial<PurchaseOrderDetail>[] }>()
);

export const createOrderSuccess = createAction(
    '[Purchase Order] Create Order Success',
    props<{ order: PurchaseOrderHeader }>()
);

export const createOrderFailure = createAction(
    '[Purchase Order] Create Order Failure',
    props<{ error: string }>()
);

// Update Order
export const updateOrder = createAction(
    '[Purchase Order] Update Order',
    props<{ orderId: string; order: Partial<PurchaseOrderHeader>; details?: Partial<PurchaseOrderDetail>[] }>()
);

export const updateOrderSuccess = createAction(
    '[Purchase Order] Update Order Success',
    props<{ order: PurchaseOrderHeader }>()
);

export const updateOrderFailure = createAction(
    '[Purchase Order] Update Order Failure',
    props<{ error: string }>()
);

// Delete Order
export const deleteOrder = createAction(
    '[Purchase Order] Delete Order',
    props<{ orderId: string }>()
);

export const deleteOrderSuccess = createAction(
    '[Purchase Order] Delete Order Success',
    props<{ orderId: string }>()
);

export const deleteOrderFailure = createAction(
    '[Purchase Order] Delete Order Failure',
    props<{ error: string }>()
);

// Update Order Status
export const updateOrderStatus = createAction(
    '[Purchase Order] Update Order Status',
    props<{ orderId: string; status: POStatus }>()
);

export const updateOrderStatusSuccess = createAction(
    '[Purchase Order] Update Order Status Success',
    props<{ order: PurchaseOrderHeader }>()
);

export const updateOrderStatusFailure = createAction(
    '[Purchase Order] Update Order Status Failure',
    props<{ error: string }>()
);

// Recalculate and Update Order Status
// Requirements: 11.3, 11.4
export const recalculateOrderStatus = createAction(
    '[Purchase Order] Recalculate Order Status',
    props<{ orderId: string }>()
);

export const recalculateOrderStatusSuccess = createAction(
    '[Purchase Order] Recalculate Order Status Success',
    props<{ order: PurchaseOrderHeader }>()
);

export const recalculateOrderStatusFailure = createAction(
    '[Purchase Order] Recalculate Order Status Failure',
    props<{ error: string }>()
);

// Select Order
export const selectOrder = createAction(
    '[Purchase Order] Select Order',
    props<{ order: PurchaseOrderHeader | null }>()
);

// Clear Selected Order
export const clearSelectedOrder = createAction(
    '[Purchase Order] Clear Selected Order'
);

// Set Filters
export const setFilters = createAction(
    '[Purchase Order] Set Filters',
    props<{ filters: POFilters }>()
);

// Set Pagination
export const setPagination = createAction(
    '[Purchase Order] Set Pagination',
    props<{ page: number; pageSize: number }>()
);

// Clear Error
export const clearError = createAction(
    '[Purchase Order] Clear Error'
);
