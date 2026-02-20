import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
    ItemEnhanced,
    CreateItemEnhancedDto,
    UpdateItemEnhancedDto
} from '../../features/item-master/models/item-enhanced.model';
import { ItemFilters } from '../../features/item-master/models/item-filters.model';

/**
 * Item Actions
 * Defines all actions for item management with category support
 * 
 * Requirements:
 * - 1.1: CRUD operations for items with categories
 * - 1.6: Prevent category changes after creation
 */
export const ItemActions = createActionGroup({
    source: 'Item',
    events: {
        // Load Items
        'Load Items': props<{ filters?: ItemFilters }>(),
        'Load Items Success': props<{ items: ItemEnhanced[]; totalItems: number }>(),
        'Load Items Failure': props<{ error: string }>(),

        // Load Single Item
        'Load Item': props<{ id: string }>(),
        'Load Item Success': props<{ item: ItemEnhanced }>(),
        'Load Item Failure': props<{ error: string }>(),

        // Create Item
        'Create Item': props<{ item: CreateItemEnhancedDto }>(),
        'Create Item Success': props<{ item: ItemEnhanced }>(),
        'Create Item Failure': props<{ error: string }>(),

        // Update Item
        'Update Item': props<{ id: string; item: UpdateItemEnhancedDto }>(),
        'Update Item Success': props<{ item: ItemEnhanced }>(),
        'Update Item Failure': props<{ error: string }>(),

        // Delete Item
        'Delete Item': props<{ id: string }>(),
        'Delete Item Success': props<{ id: string }>(),
        'Delete Item Failure': props<{ error: string }>(),

        // Filter Items by Category
        'Filter By Category': props<{ filters: ItemFilters }>(),

        // Select Item
        'Select Item': props<{ item: ItemEnhanced | null }>(),

        // Set Filters
        'Set Filters': props<{ filters: ItemFilters }>(),
        'Clear Filters': emptyProps(),

        // Pagination
        'Set Page': props<{ page: number; pageSize: number }>(),

        // Clear Error
        'Clear Error': emptyProps()
    }
});
