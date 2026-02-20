/**
 * Sales Order State
 * 
 * Defines the state structure for the Sales Order feature in NgRx store.
 */

import { SalesOrderHeader, SalesOrderDetail, SOFilters } from '../models/sales-order.model';

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
 * Sales Order State Interface
 * Complete state structure for Sales Order management
 */
export interface SalesOrderState {
    orders: SalesOrderHeader[];
    selectedOrder: SalesOrderHeader | null;
    orderDetails: { [orderId: string]: SalesOrderDetail[] };
    loading: boolean;
    saving: boolean;
    error: string | null;
    filters: SOFilters;
    pagination: PaginationState;
}

/**
 * Initial State
 * Default state values when the store is initialized
 */
export const initialSalesOrderState: SalesOrderState = {
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
