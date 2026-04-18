import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission, getPermissionErrorMessage } from '../constants/permissions';

/**
 * Permission Service
 * Handles permission checking and validation
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4
 * - Define permission for approving Stock Adjustments
 * - Only display approval actions to users with approval permission
 * - Deny actions for users without permission and display error message
 * - Allow administrators to assign approval permissions to users
 */
@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    // In a real application, this would come from an auth service
    // that retrieves user permissions from the backend
    private userPermissions: Set<Permission> = new Set();

    constructor() {
        // TODO: Initialize with actual user permissions from auth service
        // For now, we'll set some default permissions for testing
        this.initializeDefaultPermissions();
    }

    /**
     * Initialize default permissions (for testing)
     * In production, this would be loaded from the auth service
     */
    private initializeDefaultPermissions(): void {
        // This is just for demonstration
        // In real app, permissions would come from backend based on user role
        this.userPermissions.add(Permission.STOCK_ADJUSTMENT_VIEW);
        this.userPermissions.add(Permission.STOCK_ADJUSTMENT_CREATE);
        // Uncomment to grant approval permission:
        // this.userPermissions.add(Permission.STOCK_ADJUSTMENT_APPROVE);
        // this.userPermissions.add(Permission.STOCK_ADJUSTMENT_REJECT);
    }

    /**
     * Set user permissions (called by auth service after login)
     */
    setUserPermissions(permissions: Permission[]): void {
        this.userPermissions = new Set(permissions);
    }

    /**
     * Check if user has a specific permission
     */
    hasPermission(permission: Permission): boolean {
        return this.userPermissions.has(permission);
    }

    /**
     * Check if user has any of the specified permissions
     */
    hasAnyPermission(permissions: Permission[]): boolean {
        return permissions.some(permission => this.hasPermission(permission));
    }

    /**
     * Check if user has all of the specified permissions
     */
    hasAllPermissions(permissions: Permission[]): boolean {
        return permissions.every(permission => this.hasPermission(permission));
    }

    /**
     * Check if user has permission (returns Observable for async pipe)
     */
    hasPermission$(permission: Permission): Observable<boolean> {
        return of(this.hasPermission(permission));
    }

    /**
     * Check if user has any of the specified permissions (returns Observable)
     */
    hasAnyPermission$(permissions: Permission[]): Observable<boolean> {
        return of(this.hasAnyPermission(permissions));
    }

    /**
     * Check if user has all of the specified permissions (returns Observable)
     */
    hasAllPermissions$(permissions: Permission[]): Observable<boolean> {
        return of(this.hasAllPermissions(permissions));
    }

    /**
     * Validate permission and throw error if not authorized
     * @throws Error with permission-specific message
     */
    requirePermission(permission: Permission): void {
        if (!this.hasPermission(permission)) {
            throw new Error(getPermissionErrorMessage(permission));
        }
    }

    /**
     * Validate permission and return result with error message
     */
    validatePermission(permission: Permission): { valid: boolean; message?: string } {
        if (this.hasPermission(permission)) {
            return { valid: true };
        }
        return {
            valid: false,
            message: getPermissionErrorMessage(permission)
        };
    }

    /**
     * Get all user permissions
     */
    getUserPermissions(): Permission[] {
        return Array.from(this.userPermissions);
    }

    /**
     * Check if user can approve stock adjustments
     */
    canApproveStockAdjustments(): boolean {
        return this.hasPermission(Permission.STOCK_ADJUSTMENT_APPROVE);
    }

    /**
     * Check if user can reject stock adjustments
     */
    canRejectStockAdjustments(): boolean {
        return this.hasPermission(Permission.STOCK_ADJUSTMENT_REJECT);
    }

    /**
     * Check if user can create stock adjustments
     */
    canCreateStockAdjustments(): boolean {
        return this.hasPermission(Permission.STOCK_ADJUSTMENT_CREATE);
    }

    /**
     * Check if user can view stock adjustments
     */
    canViewStockAdjustments(): boolean {
        return this.hasPermission(Permission.STOCK_ADJUSTMENT_VIEW);
    }

    /**
     * Check if user can delete purchase orders
     */
    canDeletePurchaseOrders(): boolean {
        return this.hasPermission(Permission.PURCHASE_ORDER_DELETE);
    }

    /**
     * Check if user can delete sales orders
     */
    canDeleteSalesOrders(): boolean {
        return this.hasPermission(Permission.SALES_ORDER_DELETE);
    }

    /**
     * Check if user can export audit trail
     */
    canExportAuditTrail(): boolean {
        return this.hasPermission(Permission.AUDIT_TRAIL_EXPORT);
    }
}
