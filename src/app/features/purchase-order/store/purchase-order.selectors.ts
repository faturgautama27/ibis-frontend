/**
 * Purchase Order Selectors
 * 
 * Provides selectors for querying Purchase Order state.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PurchaseOrderState } from './purchase-order.state';
import { POStatus } from '../models/purchase-order.model';

/**
 * Feature Selector
 * Selects the entire Purchase Order state slice
 */
export const selectPurchaseOrderState = createFeatureSelector<PurchaseOrderState>('purchaseOrder');

/**
 * Basic Selectors
 */
export const selectAllOrders = createSelector(
    selectPurchaseOrderState,
    (state) => state.orders
);

export const selectSelectedOrder = createSelector(
    selectPurchaseOrderState,
    (state) => state.selectedOrder
);

export const selectOrderDetails = createSelector(
    selectPurchaseOrderState,
    (state) => state.orderDetails
);

export const selectLoading = createSelector(
    selectPurchaseOrderState,
    (state) => state.loading
);

export const selectSaving = createSelector(
    selectPurchaseOrderState,
    (state) => state.saving
);

export const selectError = createSelector(
    selectPurchaseOrderState,
    (state) => state.error
);

export const selectFilters = createSelector(
    selectPurchaseOrderState,
    (state) => state.filters
);

export const selectPagination = createSelector(
    selectPurchaseOrderState,
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

        // Filter by search query (PO number, supplier name, supplier code)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.poNumber.toLowerCase().includes(query) ||
                order.supplierName.toLowerCase().includes(query) ||
                order.supplierCode.toLowerCase().includes(query)
            );
        }

        // Filter by status
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(order => filters.status!.includes(order.status));
        }

        // Filter by supplier ID
        if (filters.supplierId) {
            filtered = filtered.filter(order => order.supplierId === filters.supplierId);
        }

        // Filter by date range
        if (filters.dateFrom) {
            filtered = filtered.filter(order => new Date(order.poDate) >= filters.dateFrom!);
        }

        if (filters.dateTo) {
            filtered = filtered.filter(order => new Date(order.poDate) <= filters.dateTo!);
        }

        return filtered;
    }
);

/**
 * Select orders by status
 */
export const selectOrdersByStatus = (status: POStatus) => createSelector(
    selectAllOrders,
    (orders) => orders.filter(order => order.status === status)
);

/**
 * Select pending orders (for lookup in Inbound transactions)
 */
export const selectPendingOrders = createSelector(
    selectAllOrders,
    (orders) => orders.filter(order =>
        order.status === POStatus.PENDING ||
        order.status === POStatus.PARTIALLY_RECEIVED
    )
);

/**
 * Select orders by supplier
 */
export const selectOrdersBySupplier = (supplierId: string) => createSelector(
    selectAllOrders,
    (orders) => orders.filter(order => order.supplierId === supplierId)
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
 * Select orders with remaining quantities (for Inbound lookup)
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
        const totalReceived = details.reduce((sum, detail) => sum + detail.receivedQuantity, 0);

        return totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 0;
    }
);

/**
 * Select orders for lookup (with search criteria)
 */
export const selectOrdersForLookup = createSelector(
    selectPendingOrders,
    (orders) => orders.map(order => ({
        id: order.id,
        poNumber: order.poNumber,
        poDate: order.poDate,
        supplierCode: order.supplierCode,
        supplierName: order.supplierName,
        status: order.status,
        totalValue: order.totalValue,
        currency: order.currency
    }))
);
