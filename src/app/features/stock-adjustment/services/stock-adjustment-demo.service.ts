import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { StockAdjustmentHeader, AdjustmentStatus } from '../models/stock-adjustment.model';

/**
 * Stock Adjustment Demo Service
 * Provides mock data for Stock Adjustments
 */
@Injectable({
    providedIn: 'root'
})
export class StockAdjustmentDemoService {
    private readonly STORAGE_KEY = 'stock_adjustments';
    private readonly DELAY = 500; // Simulate network delay

    constructor() {
        this.initializeMockData();
    }

    /**
     * Initialize mock data if not exists
     */
    private initializeMockData(): void {
        const existing = localStorage.getItem(this.STORAGE_KEY);
        if (!existing) {
            const mockData = this.generateMockData();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockData));
        }
    }

    /**
     * Generate mock stock adjustments
     */
    private generateMockData(): StockAdjustmentHeader[] {
        const today = new Date();
        return [
            {
                id: 'adj-001',
                adjustmentNumber: 'ADJ-2024-001',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 3),
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: AdjustmentStatus.PENDING,
                totalItems: 3,
                notes: 'Stock count discrepancy correction',
                submittedBy: 'user-001',
                submittedByName: 'John Doe',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 3, 10, 30),
                createdAt: new Date(today.getFullYear(), today.getMonth(), 3),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 3)
            },
            {
                id: 'adj-002',
                adjustmentNumber: 'ADJ-2024-002',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 7),
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: AdjustmentStatus.APPROVED,
                totalItems: 5,
                notes: 'Damaged goods write-off',
                submittedBy: 'user-002',
                submittedByName: 'Jane Smith',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 7, 14, 15),
                reviewedBy: 'user-003',
                reviewedByName: 'Manager One',
                reviewedAt: new Date(today.getFullYear(), today.getMonth(), 8, 9, 0),
                reviewComments: 'Approved after verification',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 7),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 8)
            },
            {
                id: 'adj-003',
                adjustmentNumber: 'ADJ-2024-003',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 9),
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: AdjustmentStatus.PENDING,
                totalItems: 2,
                notes: 'Expired items removal',
                submittedBy: 'user-004',
                submittedByName: 'Bob Wilson',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 9, 11, 45),
                createdAt: new Date(today.getFullYear(), today.getMonth(), 9),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 9)
            },
            {
                id: 'adj-004',
                adjustmentNumber: 'ADJ-2024-004',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 11),
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: AdjustmentStatus.REJECTED,
                totalItems: 4,
                notes: 'Physical count adjustment',
                submittedBy: 'user-001',
                submittedByName: 'John Doe',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 11, 16, 20),
                reviewedBy: 'user-003',
                reviewedByName: 'Manager One',
                reviewedAt: new Date(today.getFullYear(), today.getMonth(), 12, 10, 30),
                reviewComments: 'Rejected - insufficient documentation',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 11),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 12)
            },
            {
                id: 'adj-005',
                adjustmentNumber: 'ADJ-2024-005',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 13),
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: AdjustmentStatus.APPROVED,
                totalItems: 6,
                notes: 'System error correction',
                submittedBy: 'user-004',
                submittedByName: 'Bob Wilson',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 13, 13, 0),
                reviewedBy: 'user-005',
                reviewedByName: 'Manager Two',
                reviewedAt: new Date(today.getFullYear(), today.getMonth(), 14, 8, 45),
                reviewComments: 'Approved - verified with IT',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 13),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 14)
            },
            {
                id: 'adj-006',
                adjustmentNumber: 'ADJ-2024-006',
                adjustmentDate: new Date(today.getFullYear(), today.getMonth(), 15),
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: AdjustmentStatus.PENDING,
                totalItems: 3,
                notes: 'Monthly stock reconciliation',
                submittedBy: 'user-002',
                submittedByName: 'Jane Smith',
                submittedAt: new Date(today.getFullYear(), today.getMonth(), 15, 15, 30),
                createdAt: new Date(today.getFullYear(), today.getMonth(), 15),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 15)
            }
        ];
    }

    /**
     * Get all stock adjustments
     */
    getAll(): Observable<StockAdjustmentHeader[]> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments = data ? JSON.parse(data) : [];
        return of(adjustments).pipe(delay(this.DELAY));
    }

    /**
     * Get pending approvals
     */
    getPendingApprovals(): Observable<StockAdjustmentHeader[]> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];
        const pending = adjustments.filter(a => a.status === AdjustmentStatus.PENDING);
        return of(pending).pipe(delay(this.DELAY));
    }

    /**
     * Get stock adjustment by ID
     */
    getById(id: string): Observable<StockAdjustmentHeader | null> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];
        const adjustment = adjustments.find(a => a.id === id);
        return of(adjustment || null).pipe(delay(this.DELAY));
    }

    /**
     * Create new stock adjustment
     */
    create(adjustment: Partial<StockAdjustmentHeader>): Observable<StockAdjustmentHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];

        const newAdjustment: StockAdjustmentHeader = {
            ...adjustment,
            id: `adj-${Date.now()}`,
            status: AdjustmentStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        } as StockAdjustmentHeader;

        adjustments.push(newAdjustment);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adjustments));

        return of(newAdjustment).pipe(delay(this.DELAY));
    }

    /**
     * Approve stock adjustment
     */
    approve(id: string, comments?: string): Observable<StockAdjustmentHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];

        const index = adjustments.findIndex(a => a.id === id);
        if (index === -1) {
            return throwError(() => new Error('Stock adjustment not found'));
        }

        adjustments[index] = {
            ...adjustments[index],
            status: AdjustmentStatus.APPROVED,
            reviewedBy: 'current-user',
            reviewedByName: 'Current User',
            reviewedAt: new Date(),
            reviewComments: comments,
            updatedAt: new Date()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adjustments));

        return of(adjustments[index]).pipe(delay(this.DELAY));
    }

    /**
     * Reject stock adjustment
     */
    reject(id: string, comments: string): Observable<StockAdjustmentHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];

        const index = adjustments.findIndex(a => a.id === id);
        if (index === -1) {
            return throwError(() => new Error('Stock adjustment not found'));
        }

        adjustments[index] = {
            ...adjustments[index],
            status: AdjustmentStatus.REJECTED,
            reviewedBy: 'current-user',
            reviewedByName: 'Current User',
            reviewedAt: new Date(),
            reviewComments: comments,
            updatedAt: new Date()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adjustments));

        return of(adjustments[index]).pipe(delay(this.DELAY));
    }

    /**
     * Delete stock adjustment
     */
    delete(id: string): Observable<void> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];

        const filtered = adjustments.filter(a => a.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

        return of(void 0).pipe(delay(this.DELAY));
    }

    /**
     * Approve stock adjustment (alias for effects)
     */
    approveAdjustment(id: string, review?: { comments?: string }): Observable<StockAdjustmentHeader> {
        return this.approve(id, review?.comments);
    }

    /**
     * Reject stock adjustment (alias for effects)
     */
    rejectAdjustment(id: string, review: { comments?: string }): Observable<StockAdjustmentHeader> {
        return this.reject(id, review.comments || 'Rejected');
    }

    /**
     * Get audit trail for adjustment
     */
    getAuditTrail(adjustmentId: string): Observable<any[]> {
        // Mock audit trail data
        return of([
            {
                id: `audit-${Date.now()}-1`,
                adjustmentId,
                action: 'CREATED',
                performedBy: 'user-001',
                performedByName: 'John Doe',
                performedAt: new Date(),
                details: 'Stock adjustment created'
            }
        ]).pipe(delay(this.DELAY));
    }

    /**
     * Get adjustment details
     */
    getAdjustmentDetails(adjustmentId: string): Observable<any[]> {
        // Mock adjustment details
        return of([]).pipe(delay(this.DELAY));
    }

    /**
     * Create adjustment (alias for effects)
     */
    createAdjustment(adjustment: Partial<StockAdjustmentHeader>): Observable<StockAdjustmentHeader> {
        return this.create(adjustment);
    }

    /**
     * Update adjustment (alias for effects)
     */
    updateAdjustment(id: string, updates: Partial<StockAdjustmentHeader>): Observable<StockAdjustmentHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const adjustments: StockAdjustmentHeader[] = data ? JSON.parse(data) : [];

        const index = adjustments.findIndex(a => a.id === id);
        if (index === -1) {
            return throwError(() => new Error('Stock adjustment not found'));
        }

        adjustments[index] = {
            ...adjustments[index],
            ...updates,
            updatedAt: new Date()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adjustments));

        return of(adjustments[index]).pipe(delay(this.DELAY));
    }
}
