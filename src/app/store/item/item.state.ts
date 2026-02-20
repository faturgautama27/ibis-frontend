import { ItemEnhanced } from '../../features/item-master/models/item-enhanced.model';
import { ItemFilters } from '../../features/item-master/models/item-filters.model';

/**
 * Item State Interface
 * Defines the shape of the item state in the NgRx store
 * 
 * Requirements:
 * - 1.1: Manage items with category information
 * - 1.6: Track category locking status
 */
export interface ItemState {
    /** All items in the store */
    items: ItemEnhanced[];

    /** Currently selected item */
    selectedItem: ItemEnhanced | null;

    /** Loading state for async operations */
    loading: boolean;

    /** Saving state for create/update operations */
    saving: boolean;

    /** Error message if any operation fails */
    error: string | null;

    /** Current filters applied to the item list */
    filters: ItemFilters;

    /** Pagination state */
    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
    };
}

/**
 * Initial Item State
 */
export const initialItemState: ItemState = {
    items: [],
    selectedItem: null,
    loading: false,
    saving: false,
    error: null,
    filters: {},
    pagination: {
        page: 0,
        pageSize: 10,
        totalItems: 0
    }
};
