/**
 * Purchase Order Reducer
 * 
 * Handles state mutations for Purchase Order actions.
 */

import { createReducer, on } from '@ngrx/store';
import { PurchaseOrderState, initialPurchaseOrderState } from './purchase-order.state';
import * as PurchaseOrderActions from './purchase-order.actions';

export const purchaseOrderReducer = createReducer(
    initialPurchaseOrderState,

    // Load Orders
    on(PurchaseOrderActions.loadOrders, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(PurchaseOrderActions.loadOrdersSuccess, (state, { orders, totalRecords }) => ({
        ...state,
        orders,
        loading: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords
        }
    })),

    on(PurchaseOrderActions.loadOrdersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Order Details
    on(PurchaseOrderActions.loadOrderDetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(PurchaseOrderActions.loadOrderDetailsSuccess, (state, { orderId, details }) => ({
        ...state,
        orderDetails: {
            ...state.orderDetails,
            [orderId]: details
        },
        loading: false,
        error: null
    })),

    on(PurchaseOrderActions.loadOrderDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Order
    on(PurchaseOrderActions.createOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(PurchaseOrderActions.createOrderSuccess, (state, { order }) => ({
        ...state,
        orders: [...state.orders, order],
        saving: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords: state.pagination.totalRecords + 1
        }
    })),

    on(PurchaseOrderActions.createOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Order
    on(PurchaseOrderActions.updateOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(PurchaseOrderActions.updateOrderSuccess, (state, { order }) => ({
        ...state,
        orders: state.orders.map(o => o.id === order.id ? order : o),
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
        saving: false,
        error: null
    })),

    on(PurchaseOrderActions.updateOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Delete Order
    on(PurchaseOrderActions.deleteOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(PurchaseOrderActions.deleteOrderSuccess, (state, { orderId }) => ({
        ...state,
        orders: state.orders.filter(o => o.id !== orderId),
        selectedOrder: state.selectedOrder?.id === orderId ? null : state.selectedOrder,
        orderDetails: Object.keys(state.orderDetails)
            .filter(key => key !== orderId)
            .reduce((acc, key) => ({ ...acc, [key]: state.orderDetails[key] }), {}),
        saving: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords: state.pagination.totalRecords - 1
        }
    })),

    on(PurchaseOrderActions.deleteOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Order Status
    on(PurchaseOrderActions.updateOrderStatus, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(PurchaseOrderActions.updateOrderStatusSuccess, (state, { order }) => ({
        ...state,
        orders: state.orders.map(o => o.id === order.id ? order : o),
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
        saving: false,
        error: null
    })),

    on(PurchaseOrderActions.updateOrderStatusFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Select Order
    on(PurchaseOrderActions.selectOrder, (state, { order }) => ({
        ...state,
        selectedOrder: order
    })),

    // Clear Selected Order
    on(PurchaseOrderActions.clearSelectedOrder, (state) => ({
        ...state,
        selectedOrder: null
    })),

    // Set Filters
    on(PurchaseOrderActions.setFilters, (state, { filters }) => ({
        ...state,
        filters,
        pagination: {
            ...state.pagination,
            page: 0 // Reset to first page when filters change
        }
    })),

    // Set Pagination
    on(PurchaseOrderActions.setPagination, (state, { page, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            page,
            pageSize
        }
    })),

    // Clear Error
    on(PurchaseOrderActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
