/**
 * Stock Adjustment Data Models
 * 
 * This file contains all data models, interfaces, and enums for the Stock Adjustment module.
 * These models support approval workflow and comprehensive audit trail.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.6
 */

/**
 * Adjustment Type
 * Indicates whether the adjustment increases or decreases inventory
 */
export enum AdjustmentType {
    INCREASE = 'INCREASE',
    DECREASE = 'DECREASE'
}

/**
 * Reason Category
 * Predefined categories for adjustment reasons
 */
export enum ReasonCategory {
    PHYSICAL_COUNT = 'PHYSICAL_COUNT',
    DAMAGE = 'DAMAGE',
    EXPIRY = 'EXPIRY',
    THEFT = 'THEFT',
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    OTHER = 'OTHER'
}

/**
 * Adjustment Status
 * Tracks the approval status of stock adjustments
 */
export enum AdjustmentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

/**
 * Audit Action
 * Types of actions recorded in the audit trail
 */
export enum AuditAction {
    CREATED = 'CREATED',
    SUBMITTED = 'SUBMITTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    VIEWED = 'VIEWED'
}

/**
 * Stock Adjustment Header
 * Main stock adjustment entity containing header-level information
 */
export interface StockAdjustmentHeader {
    id: string;
    adjustmentNumber: string;
    adjustmentDate: Date;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    status: AdjustmentStatus;
    totalItems: number;
    submittedBy: string;
    submittedByName?: string;
    submittedAt: Date;
    reviewedBy?: string;
    reviewedByName?: string;
    reviewedAt?: Date;
    reviewComments?: string;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
}

/**
 * Stock Adjustment Detail
 * Line item details for stock adjustments
 */
export interface StockAdjustmentDetail {
    id: string;
    adjustmentHeaderId: string;
    lineNumber: number;
    itemId: string;
    itemCode: string;
    itemName: string;
    adjustmentType: AdjustmentType;
    quantity: number;
    beforeQuantity: number;
    afterQuantity?: number;
    reason: string;
    reasonCategory: ReasonCategory;
    notes?: string;
}

/**
 * Stock Adjustment Audit Entry
 * Audit trail record for stock adjustment actions
 */
export interface StockAdjustmentAudit {
    id: string;
    adjustmentId: string;
    action: AuditAction;
    performedBy: string;
    performedByName: string;
    performedAt: Date;
    beforeStatus?: AdjustmentStatus;
    afterStatus?: AdjustmentStatus;
    beforeQuantity?: number;
    afterQuantity?: number;
    comments?: string;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Stock Adjustment Filters
 * Filter criteria for stock adjustment list views
 */
export interface AdjustmentFilters {
    searchQuery?: string;
    status?: AdjustmentStatus[];
    itemId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    submittedBy?: string;
    warehouseId?: string;
}

/**
 * Create Stock Adjustment DTO
 * Data transfer object for creating new stock adjustments
 */
export interface CreateStockAdjustmentDto {
    warehouseId: string;
    adjustmentDate: Date;
    details: CreateStockAdjustmentDetailDto[];
    notes?: string;
}

/**
 * Create Stock Adjustment Detail DTO
 */
export interface CreateStockAdjustmentDetailDto {
    itemId: string;
    adjustmentType: AdjustmentType;
    quantity: number;
    reason: string;
    reasonCategory: ReasonCategory;
    notes?: string;
}

/**
 * Update Stock Adjustment DTO
 * Data transfer object for updating stock adjustments (before submission)
 */
export interface UpdateStockAdjustmentDto {
    adjustmentDate?: Date;
    details?: CreateStockAdjustmentDetailDto[];
    notes?: string;
}

/**
 * Approve/Reject Stock Adjustment DTO
 */
export interface ReviewStockAdjustmentDto {
    comments?: string;
}

/**
 * Helper function to get adjustment status label
 */
export function getAdjustmentStatusLabel(status: AdjustmentStatus): string {
    const labels: Record<AdjustmentStatus, string> = {
        [AdjustmentStatus.PENDING]: 'Pending Approval',
        [AdjustmentStatus.APPROVED]: 'Approved',
        [AdjustmentStatus.REJECTED]: 'Rejected'
    };
    return labels[status];
}

/**
 * Helper function to get adjustment status color for PrimeNG tags
 */
export function getAdjustmentStatusSeverity(status: AdjustmentStatus): 'warning' | 'success' | 'danger' {
    const severities: Record<AdjustmentStatus, 'warning' | 'success' | 'danger'> = {
        [AdjustmentStatus.PENDING]: 'warning',
        [AdjustmentStatus.APPROVED]: 'success',
        [AdjustmentStatus.REJECTED]: 'danger'
    };
    return severities[status];
}

/**
 * Helper function to get adjustment type label
 */
export function getAdjustmentTypeLabel(type: AdjustmentType): string {
    const labels: Record<AdjustmentType, string> = {
        [AdjustmentType.INCREASE]: 'Increase',
        [AdjustmentType.DECREASE]: 'Decrease'
    };
    return labels[type];
}

/**
 * Helper function to get reason category label
 */
export function getReasonCategoryLabel(category: ReasonCategory): string {
    const labels: Record<ReasonCategory, string> = {
        [ReasonCategory.PHYSICAL_COUNT]: 'Physical Count',
        [ReasonCategory.DAMAGE]: 'Damage',
        [ReasonCategory.EXPIRY]: 'Expiry',
        [ReasonCategory.THEFT]: 'Theft',
        [ReasonCategory.SYSTEM_ERROR]: 'System Error',
        [ReasonCategory.OTHER]: 'Other'
    };
    return labels[category];
}

/**
 * Helper function to get audit action label
 */
export function getAuditActionLabel(action: AuditAction): string {
    const labels: Record<AuditAction, string> = {
        [AuditAction.CREATED]: 'Created',
        [AuditAction.SUBMITTED]: 'Submitted for Approval',
        [AuditAction.APPROVED]: 'Approved',
        [AuditAction.REJECTED]: 'Rejected',
        [AuditAction.VIEWED]: 'Viewed'
    };
    return labels[action];
}
