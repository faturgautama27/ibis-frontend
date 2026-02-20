/**
 * Sales Order Actions
 * 
 * Defines all actions for Sales Order state management.
 */

import { createAction, props } from '@ngrx/store';
import {
    SalesOrderHeader,
    SalesOrderDetail,
    SOFilters,
    SOStatus
} from '../models/sales-order.model';

// Load Orders
export const loadOrders = createAction(
    '[Sales Order] Load Orders',
    props<{ filters?: SOFilters }>()
);

export const loadOrdersSuccess = createAction(
    '[Sales Order] Load Orders Success',
    props<{ orders: SalesOrderHeader[]; totalRecords: number }>()
);

export const loadOrdersFailure = createAction(
    '[Sales Order] Load Orders Failure',
    props<{ error: string }>()
);

// Load Order Details
export const loadOrderDetails = createAction(
    '[Sales Order] Load Order Details',
    props<{ orderId: string }>()
);

export const loadOrderDetailsSuccess = createAction(
    '[Sales Order] Load Order Details Success',
    props<{ orderId: string; details: SalesOrderDetail[] }>()
);

export const loadOrderDetailsFailure = createAction(
    '[Sales Order] Load Order Details Failure',
    props<{ error: string }>()
);

// Create Order
export const createOrder = createAction(
    '[Sales Order] Create Order',
    props<{ order: Partial<SalesOrderHeader>; details: Partial<SalesOrderDetail>[] }>()
);

export const createOrderSuccess = createAction(
    '[Sales Order] Create Order Success',
    props<{ order: SalesOrderHeader }>()
);

export const createOrderFailure = createAction(
    '[Sales Order] Create Order Failure',
    props<{ error: string }>()
);

// Update Order
export const updateOrder = createAction(
    '[Sales Order] Update Order',
    props<{ orderId: string; order: Partial<SalesOrderHeader>; details?: Partial<SalesOrderDetail>[] }>()
);

export const updateOrderSuccess = createAction(
    '[Sales Order] Update Order Success',
    props<{ order: SalesOrderHeader }>()
);

export const updateOrderFailure = createAction(
    '[Sales Order] Update Order Failure',
    props<{ error: string }>()
);

// Delete Order
export const deleteOrder = createAction(
    '[Sales Order] Delete Order',
    props<{ orderId: string }>()
);

export const deleteOrderSuccess = createAction(
    '[Sales Order] Delete Order Success',
    props<{ orderId: string }>()
);

export const deleteOrderFailure = createAction(
    '[Sales Order] Delete Order Failure',
    props<{ error: string }>()
);

// Update Order Status
export const updateOrderStatus = createAction(
    '[Sales Order] Update Order Status',
    props<{ orderId: string; status: SOStatus }>()
);

export const updateOrderStatusSuccess = createAction(
    '[Sales Order] Update Order Status Success',
    props<{ order: SalesOrderHeader }>()
);

export const updateOrderStatusFailure = createAction(
    '[Sales Order] Update Order Status Failure',
    props<{ error: string }>()
);

// Select Order
export const selectOrder = createAction(
    '[Sales Order] Select Order',
    props<{ order: SalesOrderHeader | null }>()
);

// Clear Selected Order
export const clearSelectedOrder = createAction(
    '[Sales Order] Clear Selected Order'
);

// Set Filters
export const setFilters = createAction(
    '[Sales Order] Set Filters',
    props<{ filters: SOFilters }>()
);

// Set Pagination
export const setPagination = createAction(
    '[Sales Order] Set Pagination',
    props<{ page: number; pageSize: number }>()
);

// Clear Error
export const clearError = createAction(
    '[Sales Order] Clear Error'
);
