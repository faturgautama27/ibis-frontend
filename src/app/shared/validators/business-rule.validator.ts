/**
 * Business Rule Validator
 * 
 * Provides validation methods for business rules including item category validation,
 * order deletion constraints, stock adjustment validation, and permission checks.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import { ItemCategory } from '../../features/item-master/models/item-category.enum';
import { AdjustmentType } from '../../features/stock-adjustment/models/stock-adjustment.model';

/**
 * Validation result interface
 */
export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Item interface for validation
 */
export interface ItemForValidation {
    id: string;
    itemCode: string;
    itemName: string;
    category: ItemCategory;
}

/**
 * User interface for permission validation
 */
export interface UserForValidation {
    id: string;
    permissions: string[];
}

/**
 * Business Rule Validator class
 */
export class BusinessRuleValidator {
    /**
     * Validate item category matches order type
     * 
     * Requirements: 10.1, 10.2, 10.3, 10.4
     * 
     * @param item - Item to validate
     * @param orderType - Type of order ('PO' for Purchase Order, 'SO' for Sales Order)
     * @returns Validation result with error message if invalid
     */
    static validateItemCategory(
        item: ItemForValidation,
        orderType: 'PO' | 'SO'
    ): ValidationResult {
        const expectedCategory = orderType === 'PO'
            ? ItemCategory.RAW_MATERIAL
            : ItemCategory.FINISHED_GOOD;

        if (item.category !== expectedCategory) {
            return {
                valid: false,
                message: `${orderType} can only contain ${expectedCategory} items. Item ${item.itemCode} (${item.itemName}) is ${item.category}.`
            };
        }

        return { valid: true };
    }

    /**
     * Validate multiple items for order type
     * 
     * Requirements: 10.1, 10.2, 10.3, 10.4
     * 
     * @param items - Array of items to validate
     * @param orderType - Type of order ('PO' or 'SO')
     * @returns Validation result with all error messages if invalid
     */
    static validateItemCategories(
        items: ItemForValidation[],
        orderType: 'PO' | 'SO'
    ): ValidationResult {
        const errors: string[] = [];

        items.forEach(item => {
            const result = this.validateItemCategory(item, orderType);
            if (!result.valid && result.message) {
                errors.push(result.message);
            }
        });

        if (errors.length > 0) {
            return {
                valid: false,
                message: errors.join('\n')
            };
        }

        return { valid: true };
    }

    /**
     * Validate order can be deleted
     * 
     * Requirements: 5.16, 5.17
     * 
     * @param linkedTransactions - Number of linked transactions
     * @param orderType - Type of order ('PO' or 'SO')
     * @returns Validation result with error message if invalid
     */
    static validateOrderDeletion(
        linkedTransactions: number,
        orderType: 'PO' | 'SO'
    ): ValidationResult {
        if (linkedTransactions > 0) {
            const transactionType = orderType === 'PO' ? 'inbound' : 'outbound';
            return {
                valid: false,
                message: `Cannot delete ${orderType} with ${linkedTransactions} linked ${transactionType} transaction(s). Please remove links first.`
            };
        }

        return { valid: true };
    }

    /**
     * Validate stock adjustment quantity
     * 
     * Requirements: 8.3, 8.4
     * 
     * @param adjustmentType - Type of adjustment (INCREASE or DECREASE)
     * @param quantity - Adjustment quantity
     * @param currentStock - Current stock quantity
     * @returns Validation result with error message if invalid
     */
    static validateAdjustmentQuantity(
        adjustmentType: AdjustmentType,
        quantity: number,
        currentStock: number
    ): ValidationResult {
        if (quantity <= 0) {
            return {
                valid: false,
                message: 'Adjustment quantity must be positive'
            };
        }

        if (adjustmentType === AdjustmentType.DECREASE && quantity > currentStock) {
            return {
                valid: false,
                message: `Cannot decrease by ${quantity}. Current stock is ${currentStock}.`
            };
        }

        return { valid: true };
    }

    /**
     * Validate user has required permission
     * 
     * Requirements: 14.1, 14.2, 14.3
     * 
     * @param user - User to validate
     * @param requiredPermission - Required permission string
     * @returns Validation result with error message if invalid
     */
    static validatePermission(
        user: UserForValidation,
        requiredPermission: string
    ): ValidationResult {
        if (!user.permissions.includes(requiredPermission)) {
            return {
                valid: false,
                message: `You do not have permission: ${requiredPermission}`
            };
        }

        return { valid: true };
    }

    /**
     * Validate user has approval permission for stock adjustments
     * 
     * Requirements: 14.1, 14.2, 14.3
     * 
     * @param user - User to validate
     * @returns Validation result with error message if invalid
     */
    static validateApprovalPermission(user: UserForValidation): ValidationResult {
        return this.validatePermission(user, 'APPROVE_STOCK_ADJUSTMENT');
    }
}
