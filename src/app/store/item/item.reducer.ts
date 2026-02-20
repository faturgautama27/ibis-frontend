import { createReducer, on } from '@ngrx/store';
import { ItemActions } from './item.actions';
import { ItemState, initialItemState } from './item.state';

/**
 * Item Reducer
 * Handles state mutations for item management
 * 
 * Requirements:
 * - 1.1: Manage items with category information
 * - 1.6: Enforce category locking after creation
 */
export const itemReducer = createReducer(
    initialItemState,

    // Load Items
    on(ItemActions.loadItems, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ItemActions.loadItemsSuccess, (state, { items, totalItems }) => ({
        ...state,
        items,
        loading: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalItems
        }
    })),
    on(ItemActions.loadItemsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Single Item
    on(ItemActions.loadItem, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ItemActions.loadItemSuccess, (state, { item }) => ({
        ...state,
        selectedItem: item,
        loading: false,
        error: null
    })),
    on(ItemActions.loadItemFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Item
    on(ItemActions.createItem, (state) => ({
        ...state,
        saving: true,
        error: null
    })),
    on(ItemActions.createItemSuccess, (state, { item }) => ({
        ...state,
        items: [...state.items, item],
        saving: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalItems: state.pagination.totalItems + 1
        }
    })),
    on(ItemActions.createItemFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Update Item
    on(ItemActions.updateItem, (state) => ({
        ...state,
        saving: true,
        error: null
    })),
    on(ItemActions.updateItemSuccess, (state, { item }) => ({
        ...state,
        items: state.items.map(i => i.id === item.id ? item : i),
        selectedItem: state.selectedItem?.id === item.id ? item : state.selectedItem,
        saving: false,
        error: null
    })),
    on(ItemActions.updateItemFailure, (state, { error }) => ({
        ...state,
        saving: false,
        error
    })),

    // Delete Item
    on(ItemActions.deleteItem, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(ItemActions.deleteItemSuccess, (state, { id }) => ({
        ...state,
        items: state.items.filter(i => i.id !== id),
        selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
        loading: false,
        error: null,
        pagination: {
            ...state.pagination,
            totalItems: state.pagination.totalItems - 1
        }
    })),
    on(ItemActions.deleteItemFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Filter Items
    on(ItemActions.filterByCategory, (state, { filters }) => ({
        ...state,
        filters,
        pagination: {
            ...state.pagination,
            page: 0
        }
    })),

    // Select Item
    on(ItemActions.selectItem, (state, { item }) => ({
        ...state,
        selectedItem: item
    })),

    // Set Filters
    on(ItemActions.setFilters, (state, { filters }) => ({
        ...state,
        filters,
        pagination: {
            ...state.pagination,
            page: 0
        }
    })),
    on(ItemActions.clearFilters, (state) => ({
        ...state,
        filters: {},
        pagination: {
            ...state.pagination,
            page: 0
        }
    })),

    // Pagination
    on(ItemActions.setPage, (state, { page, pageSize }) => ({
        ...state,
        pagination: {
            ...state.pagination,
            page,
            pageSize
        }
    })),

    // Clear Error
    on(ItemActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
