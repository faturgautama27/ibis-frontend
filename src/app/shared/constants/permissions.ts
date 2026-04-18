/**
 * Permission constants for IBIS system
 * Used for role-based access control throughout the application
 */

export enum Permission {
    // Stock Adjustment Permissions
    STOCK_ADJUSTMENT_VIEW = 'stock_adjustment:view',
    STOCK_ADJUSTMENT_CREATE = 'stock_adjustment:create',
    STOCK_ADJUSTMENT_APPROVE = 'stock_adjustment:approve',
    STOCK_ADJUSTMENT_REJECT = 'stock_adjustment:reject',

    // Purchase Order Permissions
    PURCHASE_ORDER_VIEW = 'purchase_order:view',
    PURCHASE_ORDER_CREATE = 'purchase_order:create',
    PURCHASE_ORDER_EDIT = 'purchase_order:edit',
    PURCHASE_ORDER_DELETE = 'purchase_order:delete',

    // Sales Order Permissions
    SALES_ORDER_VIEW = 'sales_order:view',
    SALES_ORDER_CREATE = 'sales_order:create',
    SALES_ORDER_EDIT = 'sales_order:edit',
    SALES_ORDER_DELETE = 'sales_order:delete',

    // Inbound Transaction Permissions
    INBOUND_VIEW = 'inbound:view',
    INBOUND_CREATE = 'inbound:create',
    INBOUND_EDIT = 'inbound:edit',

    // Outbound Transaction Permissions
    OUTBOUND_VIEW = 'outbound:view',
    OUTBOUND_CREATE = 'outbound:create',
    OUTBOUND_EDIT = 'outbound:edit',

    // Item Master Permissions
    ITEM_MASTER_VIEW = 'item_master:view',
    ITEM_MASTER_CREATE = 'item_master:create',
    ITEM_MASTER_EDIT = 'item_master:edit',
    ITEM_MASTER_DELETE = 'item_master:delete',

    // Audit Trail Permissions
    AUDIT_TRAIL_VIEW = 'audit_trail:view',
    AUDIT_TRAIL_EXPORT = 'audit_trail:export',
}

/**
 * Permission groups for common role assignments
 */
export const PermissionGroups = {
    STOCK_ADJUSTMENT_APPROVER: [
        Permission.STOCK_ADJUSTMENT_VIEW,
        Permission.STOCK_ADJUSTMENT_APPROVE,
        Permission.STOCK_ADJUSTMENT_REJECT,
    ],

    STOCK_ADJUSTMENT_CREATOR: [
        Permission.STOCK_ADJUSTMENT_VIEW,
        Permission.STOCK_ADJUSTMENT_CREATE,
    ],

    WAREHOUSE_OPERATOR: [
        Permission.INBOUND_VIEW,
        Permission.INBOUND_CREATE,
        Permission.OUTBOUND_VIEW,
        Permission.OUTBOUND_CREATE,
        Permission.STOCK_ADJUSTMENT_VIEW,
        Permission.STOCK_ADJUSTMENT_CREATE,
    ],

    PROCUREMENT_OFFICER: [
        Permission.PURCHASE_ORDER_VIEW,
        Permission.PURCHASE_ORDER_CREATE,
        Permission.PURCHASE_ORDER_EDIT,
        Permission.INBOUND_VIEW,
    ],

    SALES_COORDINATOR: [
        Permission.SALES_ORDER_VIEW,
        Permission.SALES_ORDER_CREATE,
        Permission.SALES_ORDER_EDIT,
        Permission.OUTBOUND_VIEW,
    ],

    INVENTORY_MANAGER: [
        Permission.ITEM_MASTER_VIEW,
        Permission.ITEM_MASTER_CREATE,
        Permission.ITEM_MASTER_EDIT,
        Permission.STOCK_ADJUSTMENT_VIEW,
        Permission.STOCK_ADJUSTMENT_CREATE,
        Permission.STOCK_ADJUSTMENT_APPROVE,
        Permission.STOCK_ADJUSTMENT_REJECT,
        Permission.AUDIT_TRAIL_VIEW,
        Permission.AUDIT_TRAIL_EXPORT,
    ],
};

/**
 * Error messages for permission violations
 */
export const PermissionErrorMessages: Partial<Record<Permission, string>> & { DEFAULT: string } = {
    [Permission.STOCK_ADJUSTMENT_APPROVE]: 'You do not have permission to approve stock adjustments. Please contact your administrator.',
    [Permission.STOCK_ADJUSTMENT_REJECT]: 'You do not have permission to reject stock adjustments. Please contact your administrator.',
    [Permission.STOCK_ADJUSTMENT_CREATE]: 'You do not have permission to create stock adjustments.',
    [Permission.STOCK_ADJUSTMENT_VIEW]: 'You do not have permission to view stock adjustments.',
    [Permission.PURCHASE_ORDER_DELETE]: 'You do not have permission to delete purchase orders.',
    [Permission.SALES_ORDER_DELETE]: 'You do not have permission to delete sales orders.',
    [Permission.ITEM_MASTER_DELETE]: 'You do not have permission to delete items.',
    [Permission.AUDIT_TRAIL_EXPORT]: 'You do not have permission to export audit trail data.',
    DEFAULT: 'You do not have permission to perform this action.',
};

/**
 * Helper function to get permission error message
 */
export function getPermissionErrorMessage(permission: Permission): string {
    return PermissionErrorMessages[permission] || PermissionErrorMessages.DEFAULT;
}
