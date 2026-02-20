import { Item } from '../../inventory/models/item.model';
import { ItemCategory } from './item-category.enum';

/**
 * Enhanced Item Interface
 * Extends the existing Item model with category and locking fields
 * 
 * Requirements:
 * - 1.1: Items must be categorized as either RAW_MATERIAL or FINISHED_GOOD
 * - 1.6: Category cannot be changed after creation (immutable)
 */
export interface ItemEnhanced extends Item {
    /** Item category - RAW_MATERIAL or FINISHED_GOOD */
    category: ItemCategory;

    /** Indicates if category is locked (true after creation) */
    categoryLocked: boolean;

    /** Timestamp when category was locked */
    categoryLockedAt?: Date;

    /** User who locked the category */
    categoryLockedBy?: string;
}

/**
 * Create Item Enhanced DTO
 * Used when creating a new enhanced item
 */
export interface CreateItemEnhancedDto {
    item_code: string;
    item_name: string;
    hs_code: string;
    item_type: string;
    unit: string;
    is_hazardous: boolean;
    facility_status: string;
    active: boolean;
    category: ItemCategory;
    description?: string;
    category_id?: string;
    brand?: string;
    min_stock?: number;
    max_stock?: number;
    reorder_point?: number;
    lead_time_days?: number;
    price?: number;
    currency?: string;
    image_url?: string;
    barcode?: string;
    rfid_tag?: string;
    shelf_life_days?: number;
    storage_condition?: string;
}

/**
 * Update Item Enhanced DTO
 * Used when updating an existing enhanced item
 * Note: category field is excluded as it cannot be changed after creation
 */
export interface UpdateItemEnhancedDto {
    item_name?: string;
    hs_code?: string;
    item_type?: string;
    unit?: string;
    is_hazardous?: boolean;
    facility_status?: string;
    active?: boolean;
    description?: string;
    category_id?: string;
    brand?: string;
    min_stock?: number;
    max_stock?: number;
    reorder_point?: number;
    lead_time_days?: number;
    price?: number;
    currency?: string;
    image_url?: string;
    barcode?: string;
    rfid_tag?: string;
    shelf_life_days?: number;
    storage_condition?: string;
    // Note: category is intentionally excluded - it cannot be changed after creation
}
