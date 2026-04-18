/**
 * Outbound Reducer
 * 
 * Handles state mutations for Outbound management including SO linking.
 * Requirements: 7.1, 7.6
 */

import { createReducer, on } from '@ngrx/store';
import { OutboundState, initialOutboundState } from './outbound.state';
import * as OutboundActions from './outbound.actions';

export const outboundReducer = createReducer(
    initialOutboundState,

    // Load Outbounds
    on(OutboundActions.loadOutbounds, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(OutboundActions.loadOutboundsSuccess, (state, { outbounds, totalRecords }) => ({
        ...state,
        outbounds,
        pagination: {
            ...state.pagination,
            totalRecords
        },
        loading: false,
        error: null
    })),

    on(OutboundActions.loadOutboundsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Outbound Details
    on(OutboundActions.loadOutboundDetails, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(OutboundActions.loadOutboundDetailsSuccess, (state, { outboundId, details }) => ({
        ...state,
        outboundDetails: {
            ...state.outboundDetails,
            [outboundId]: details
        },
        loading: false,
        error: null
    })),

    on(OutboundActions.loadOutboundDetailsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Outbound
    on(OutboundActions.createOutbound, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(OutboundActions.createOutboundSuccess, (state, { outbound }) => ({
        ...state,
        outbounds: [...state.outbounds, outbound],
        saving: false,
        error: null
    })),

    on(OutboundActions.createOutboundFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Outbound
    on(OutboundActions.updateOutbound, (state) => ({
        ...state,
        saving: true,
        error: null
    })),

    on(OutboundActions.updateOutboundSuccess, (state, { outbound }) => ({
        ...state,
        outbounds: state.outbounds.map(o => o.id === outbound.id ? outbound : o),
        selectedOutbound: state.selectedOutbound?.id === outbound.id ? outbound : state.selectedOutbound,
        saving: false,
        error: null
    })),

    on(OutboundActions.updateOutboundFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Delete Outbound
    on(OutboundActions.deleteOutbound, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(OutboundActions.deleteOutboundSuccess, (state, { outboundId }) => ({
        ...state,
        outbounds: state.outbounds.filter(o => o.id !== outboundId),
        loading: false,
        error: null
    })),

    on(OutboundActions.deleteOutboundFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // SO Lookup
    on(OutboundActions.lookupSalesOrders, (state) => ({
        ...state,
        soLookupLoading: true,
        soLookupError: null
    })),

    on(OutboundActions.lookupSalesOrdersSuccess, (state, { orders }) => ({
        ...state,
        soLookupResults: orders,
        soLookupLoading: false,
        soLookupError: null
    })),

    on(OutboundActions.lookupSalesOrdersFailure, (state, { error }) => ({
        ...state,
        soLookupLoading: false,
        soLookupError: error
    })),

    on(OutboundActions.clearSOLookupResults, (state) => ({
        ...state,
        soLookupResults: [],
        soLookupError: null
    })),

    // Select Outbound
    on(OutboundActions.selectOutbound, (state, { outbound }) => ({
        ...state,
        selectedOutbound: outbound
    })),

    on(OutboundActions.clearSelectedOutbound, (state) => ({
        ...state,
        selectedOutbound: null
    })),

    // Set Filters
    on(OutboundActions.setFilters, (state, { filters }) => ({
        ...state,
        filters
    })),

    // Set Pagination
    on(OutboundActions.setPagination, (state, { page, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            page,
            pageSize
        }
    })),

    // Clear Error
    on(OutboundActions.clearError, (state) => ({
        ...state,
        error: null,
        soLookupError: null
    }))
);
