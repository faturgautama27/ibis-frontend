/**
 * Sales Order Selectors
 * 
 * Provides selectors for querying Sales Order state.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesOrderState } from './sales-order.state';
import { SOStatus } from '../models/sales-order.model';

/**
 * Feature Selector
 * Selects the entire Sales Order state slice
 */
export const selectSalesOrderState = createFeatureSelector<SalesOrderState>('salesOrder');

/**
 * Basic Selectors
 */
export const selectAllOrders = createSelector(
    selectSalesOrderState,
    (state) => state.orders
);

export const selectSelectedOrder = createSelector(
    selectSalesOrderState,
    (state) => state.selectedOrder
);

export const selectOrderDetails = createSelector(
    selectSalesOrderState,
    (state) => state.orderDetails
);

export const selectLoading = createSelector(
    selectSalesOrderState,
    (state) => state.loading
);

export const selectSaving = createSelector(
    selectSalesOrderState,
    (state) => state.saving
);

export const selectError = createSelector(
    selectSalesOrderState,
    (state) => state.error
);

export const selectFilters = createSelector(
    selectSalesOrderState,
    (state) => state.filters
);

export const selectPagination = createSelector(
    selectSalesOrderState,
    (state) => state.pagination
);

/**
 * Computed Selectors
 */

/**
 * Select order details for a specific order ID
 */
export const selectOrderDetailsById = (orderId: string) => createSelector(
    selectOrderDetails,
    (orderDetails) => orderDetails[orderId] || []
);

/**
 * Select order by ID
 */
export const selectOrderById = (orderId: string) => createSelector(
    selectAllOrders,
    (orders) => orders.find(order => order.id === orderId) || null
);

/**
 * Select filtered orders based on current filters
 */
export const selectFilteredOrders = createSelector(
    selectAllOrders,
    selectFilters,
    (orders, filters) => {
        let filtered = [...orders];

        // Filter by search query (SO number, customer name, customer code)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.soNumber.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.customerCode.toLowerCase().includes(query)
            );
        }

        // Filter by status
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(order => filters.status!.includes(order.status));
        }

        // Filter by customer ID
        if (filters.customerId) {
            filtered = filtered.filter(order => order.customerId === filters.customerId);
        }

        // Filter by date range
        if (filters.dateFrom) {
            filtered = filtered.filter(order => new Date(order.soDate) >= filters.dateFrom!);
        }

        if (filters.dateTo) {
            filtered = filtered.filter(order => new Date(order.soDate) <= filters.dateTo!);
        }

        return filtered;
    }
);

/**
 * Select orders by status
 */
export const selectOrdersByStatus = (status: SOStatus) => createSelector(
    selectAllOrders,
    (orders) => orders.filter(order => order.status === status)
);

/**
 * Select pending orders (for lookup in Outbound transactions)
 */
export const selectPendingOrders = createSelector(
    selectAllOrders,
    (orders) => orders.filter(order =>
        order.status === SOStatus.PENDING ||
        order.status === SOStatus.PARTIALLY_SHIPPED
    )
);

/**
 * Select orders by customer
 */
export const selectOrdersByCustomer = (customerId: string) => createSelector(
    selectAllOrders,
    (orders) => orders.filter(order => order.customerId === customerId)
);

/**
 * Select total order count
 */
export const selectTotalOrderCount = createSelector(
    selectAllOrders,
    (orders) => orders.length
);

/**
 * Select total order value
 */
export const selectTotalOrderValue = createSelector(
    selectAllOrders,
    (orders) => orders.reduce((sum, order) => sum + order.totalValue, 0)
);

/**
 * Select orders with remaining quantities (for Outbound lookup)
 */
export const selectOrdersWithRemainingQuantity = createSelector(
    selectAllOrders,
    selectOrderDetails,
    (orders, orderDetails) => {
        return orders.filter(order => {
            const details = orderDetails[order.id];
            if (!details) return true; // Include if details not loaded yet

            return details.some(detail => detail.remainingQuantity > 0);
        });
    }
);

/**
 * Select if any operation is in progress
 */
export const selectIsOperationInProgress = createSelector(
    selectLoading,
    selectSaving,
    (loading, saving) => loading || saving
);

/**
 * Select order completion percentage
 */
export const selectOrderCompletionPercentage = (orderId: string) => createSelector(
    selectOrderDetailsById(orderId),
    (details) => {
        if (!details || details.length === 0) return 0;

        const totalOrdered = details.reduce((sum, detail) => sum + detail.orderedQuantity, 0);
        const totalShipped = details.reduce((sum, detail) => sum + detail.shippedQuantity, 0);

        return totalOrdered > 0 ? (totalShipped / totalOrdered) * 100 : 0;
    }
);

/**
 * Select orders for lookup (with search criteria)
 */
export const selectOrdersForLookup = createSelector(
    selectPendingOrders,
    (orders) => orders.map(order => ({
        id: order.id,
        soNumber: order.soNumber,
        soDate: order.soDate,
        customerCode: order.customerCode,
        customerName: order.customerName,
        status: order.status,
        totalValue: order.totalValue,
        currency: order.currency
    }))
);
