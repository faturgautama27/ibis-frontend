/**
 * Purchase Order State
 * 
 * Defines the state structure for the Purchase Order feature in NgRx store.
 */

import { PurchaseOrderHeader, PurchaseOrderDetail, POFilters } from '../models/purchase-order.model';

/**
 * Pagination State
 * Manages pagination information for list views
 */
export interface PaginationState {
    page: number;
    pageSize: number;
    totalRecords: number;
}

/**
 * Purchase Order State Interface
 * Complete state structure for Purchase Order management
 */
export interface PurchaseOrderState {
    orders: PurchaseOrderHeader[];
    selectedOrder: PurchaseOrderHeader | null;
    orderDetails: { [orderId: string]: PurchaseOrderDetail[] };
    loading: boolean;
    saving: boolean;
    error: string | null;
    filters: POFilters;
    pagination: PaginationState;
}

/**
 * Initial State
 * Default state values when the store is initialized
 */
export const initialPurchaseOrderState: PurchaseOrderState = {
    orders: [],
    selectedOrder: null,
    orderDetails: {},
    loading: false,
    saving: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        pageSize: 10,
        totalRecords: 0
    }
};
