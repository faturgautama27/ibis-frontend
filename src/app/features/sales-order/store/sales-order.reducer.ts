/**
 * Sales Order Reducer
 * 
 * Handles state mutations for Sales Order actions.
 */

import { createReducer, on } from '@ngrx/store';
import { SalesOrderState, initialSalesOrderState } from './sales-order.state';
import * as SalesOrderActions from './sales-order.actions';

export const salesOrderReducer = createReducer(
    initialSalesOrderState,

    // Load Orders
    on(SalesOrderActions.loadOrders, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(SalesOrderActions.loadOrdersSuccess, (state, { orders, totalRecords }) => ({
        ...state,
        orders,
        loading: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords
        }
    })),

    on(SalesOrderActions.loadOrdersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Order Details
    on(SalesOrderActions.loadOrderDetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(SalesOrderActions.loadOrderDetailsSuccess, (state, { orderId, details }) => ({
        ...state,
        orderDetails: {
            ...state.orderDetails,
            [orderId]: details
        },
        loading: false,
        error: null
    })),

    on(SalesOrderActions.loadOrderDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Order
    on(SalesOrderActions.createOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(SalesOrderActions.createOrderSuccess, (state, { order }) => ({
        ...state,
        orders: [...state.orders, order],
        saving: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalRecords: state.pagination.totalRecords + 1
        }
    })),

    on(SalesOrderActions.createOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Order
    on(SalesOrderActions.updateOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(SalesOrderActions.updateOrderSuccess, (state, { order }) => ({
        ...state,
        orders: state.orders.map(o => o.id === order.id ? order : o),
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
        saving: false,
        error: null
    })),

    on(SalesOrderActions.updateOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Delete Order
    on(SalesOrderActions.deleteOrder, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(SalesOrderActions.deleteOrderSuccess, (state, { orderId }) => ({
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

    on(SalesOrderActions.deleteOrderFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Order Status
    on(SalesOrderActions.updateOrderStatus, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(SalesOrderActions.updateOrderStatusSuccess, (state, { order }) => ({
        ...state,
        orders: state.orders.map(o => o.id === order.id ? order : o),
        selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
        saving: false,
        error: null
    })),

    on(SalesOrderActions.updateOrderStatusFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Select Order
    on(SalesOrderActions.selectOrder, (state, { order }) => ({
        ...state,
        selectedOrder: order
    })),

    // Clear Selected Order
    on(SalesOrderActions.clearSelectedOrder, (state) => ({
        ...state,
        selectedOrder: null
    })),

    // Set Filters
    on(SalesOrderActions.setFilters, (state, { filters }) => ({
        ...state,
        filters,
        pagination: {
            ...state.pagination,
            page: 0 // Reset to first page when filters change
        }
    })),

    // Set Pagination
    on(SalesOrderActions.setPagination, (state, { page, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            page,
            pageSize
        }
    })),

    // Clear Error
    on(SalesOrderActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
