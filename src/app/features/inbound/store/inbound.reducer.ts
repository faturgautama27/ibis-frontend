/**
 * Inbound Reducer
 * 
 * Manages state transitions for Inbound operations including PO linking.
 * Requirements: 4.1, 4.6
 */

import { createReducer, on } from '@ngrx/store';
import { InboundState, initialInboundState } from './inbound.state';
import * as InboundActions from './inbound.actions';

export const inboundReducer = createReducer(
    initialInboundState,

    // Load Inbounds
    on(InboundActions.loadInbounds, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(InboundActions.loadInboundsSuccess, (state, { inbounds, totalRecords }) => ({
        ...state,
        inbounds,
        loading: false,
        pagination: {
            ...state.pagination,
            totalRecords
        }
    })),

    on(InboundActions.loadInboundsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Inbound Details
    on(InboundActions.loadInboundDetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(InboundActions.loadInboundDetailsSuccess, (state, { inboundId, details }) => ({
        ...state,
        inboundDetails: {
            ...state.inboundDetails,
            [inboundId]: details
        },
        loading: false
    })),

    on(InboundActions.loadInboundDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Inbound
    on(InboundActions.createInbound, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(InboundActions.createInboundSuccess, (state, { inbound }) => ({
        ...state,
        inbounds: [...state.inbounds, inbound],
        saving: false
    })),

    on(InboundActions.createInboundFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Inbound
    on(InboundActions.updateInbound, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(InboundActions.updateInboundSuccess, (state, { inbound }) => ({
        ...state,
        inbounds: state.inbounds.map(i => i.id === inbound.id ? inbound : i),
        selectedInbound: state.selectedInbound?.id === inbound.id ? inbound : state.selectedInbound,
        saving: false
    })),

    on(InboundActions.updateInboundFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Delete Inbound
    on(InboundActions.deleteInbound, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(InboundActions.deleteInboundSuccess, (state, { inboundId }) => ({
        ...state,
        inbounds: state.inbounds.filter(i => i.id !== inboundId),
        loading: false
    })),

    on(InboundActions.deleteInboundFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // PO Lookup (Requirements: 4.1, 4.6)
    on(InboundActions.lookupPurchaseOrders, (state) => ({
        ...state,
        poLookupLoading: true,
        poLookupError: null
    })),

    on(InboundActions.lookupPurchaseOrdersSuccess, (state, { orders }) => ({
        ...state,
        poLookupResults: orders,
        poLookupLoading: false
    })),

    on(InboundActions.lookupPurchaseOrdersFailure, (state, { error }) => ({
        ...state,
        poLookupLoading: false,
        poLookupError: error
    })),

    on(InboundActions.clearPOLookupResults, (state) => ({
        ...state,
        poLookupResults: [],
        poLookupError: null
    })),

    // Link PO to Inbound
    on(InboundActions.linkPurchaseOrder, (state, { purchaseOrder }) => ({
        ...state,
        selectedInbound: state.selectedInbound ? {
            ...state.selectedInbound,
            purchase_order_id: purchaseOrder.id,
            purchase_order_number: purchaseOrder.poNumber,
            auto_populated_from_po: true,
            po_link_date: new Date(),
            supplier_id: purchaseOrder.supplierId,
            supplier_code: purchaseOrder.supplierCode,
            supplier_name: purchaseOrder.supplierName,
            warehouse_id: purchaseOrder.warehouseId,
            warehouse_code: purchaseOrder.warehouseCode,
            warehouse_name: purchaseOrder.warehouseName
        } : null
    })),

    // Select Inbound
    on(InboundActions.selectInbound, (state, { inbound }) => ({
        ...state,
        selectedInbound: inbound
    })),

    // Clear Selected Inbound
    on(InboundActions.clearSelectedInbound, (state) => ({
        ...state,
        selectedInbound: null
    })),

    // Set Filters
    on(InboundActions.setFilters, (state, { filters }) => ({
        ...state,
        filters
    })),

    // Set Pagination
    on(InboundActions.setPagination, (state, { page, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            page,
            pageSize
        }
    })),

    // Clear Error
    on(InboundActions.clearError, (state) => ({
        ...state,
        error: null,
        poLookupError: null
    }))
);
