import { ItemCategory } from './item-category.enum';

/**
 * Item Filters Interface
 * Defines available filters for item list views
 * 
 * Requirements:
 * - 1.2: Separate list views for Raw Material and Finished Good
 * - 1.5: Filter controls to switch between categories
 * - 1.7: Search and filter capabilities by category
 */
export interface ItemFilters {
    /** Filter by item category */
    category?: ItemCategory;

    /** Search query for item code or name */
    searchQuery?: string;

    /** Filter by active status */
    active?: boolean;

    /** Filter by warehouse */
    warehouseId?: string;

    /** Filter by hazardous status */
    isHazardous?: boolean;
}
