import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemState } from './item.state';
import { ItemCategory } from '../../features/item-master/models/item-category.enum';

/**
 * Item Selectors
 * Provides selectors for querying item state with category filtering
 * 
 * Requirements:
 * - 1.2: Separate list views for Raw Material and Finished Good
 * - 1.5: Filter controls to switch between categories
 * - 1.7: Search and filter capabilities by category
 */

// Feature selector
export const selectItemState = createFeatureSelector<ItemState>('item');

// Basic selectors
export const selectAllItems = createSelector(
    selectItemState,
    (state) => state.items
);

export const selectSelectedItem = createSelector(
    selectItemState,
    (state) => state.selectedItem
);

export const selectItemLoading = createSelector(
    selectItemState,
    (state) => state.loading
);

export const selectItemSaving = createSelector(
    selectItemState,
    (state) => state.saving
);

export const selectItemError = createSelector(
    selectItemState,
    (state) => state.error
);

export const selectItemFilters = createSelector(
    selectItemState,
    (state) => state.filters
);

export const selectItemPagination = createSelector(
    selectItemState,
    (state) => state.pagination
);

// Category-specific selectors
export const selectRawMaterialItems = createSelector(
    selectAllItems,
    (items) => items.filter(item => item.category === ItemCategory.RAW_MATERIAL)
);

export const selectFinishedGoodItems = createSelector(
    selectAllItems,
    (items) => items.filter(item => item.category === ItemCategory.FINISHED_GOOD)
);

// Filtered items selector
export const selectFilteredItems = createSelector(
    selectAllItems,
    selectItemFilters,
    (items, filters) => {
        let filtered = items;

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(item => item.category === filters.category);
        }

        // Filter by search query
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.item_code.toLowerCase().includes(query) ||
                item.item_name.toLowerCase().includes(query)
            );
        }

        // Filter by active status
        if (filters.active !== undefined) {
            filtered = filtered.filter(item => item.active === filters.active);
        }

        // Filter by warehouse
        if (filters.warehouseId) {
            // Note: This would require warehouse information in the item model
            // For now, this is a placeholder
        }

        // Filter by hazardous status
        if (filters.isHazardous !== undefined) {
            filtered = filtered.filter(item => item.is_hazardous === filters.isHazardous);
        }

        return filtered;
    }
);

// Count selectors
export const selectRawMaterialCount = createSelector(
    selectRawMaterialItems,
    (items) => items.length
);

export const selectFinishedGoodCount = createSelector(
    selectFinishedGoodItems,
    (items) => items.length
);

export const selectTotalItemCount = createSelector(
    selectItemPagination,
    (pagination) => pagination.totalItems
);

// Item by ID selector
export const selectItemById = (id: string) => createSelector(
    selectAllItems,
    (items) => items.find(item => item.id === id)
);
