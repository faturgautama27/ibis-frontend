import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { PurchaseOrderHeader, POStatus, InputMethod } from '../models/purchase-order.model';

/**
 * Purchase Order Demo Service
 * Provides mock data for Purchase Orders
 */
@Injectable({
    providedIn: 'root'
})
export class PurchaseOrderDemoService {
    private readonly STORAGE_KEY = 'purchase_orders';
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
     * Generate mock purchase orders
     */
    private generateMockData(): PurchaseOrderHeader[] {
        const today = new Date();
        return [
            {
                id: 'po-001',
                poNumber: 'PO-2024-001',
                poDate: new Date(today.getFullYear(), today.getMonth(), 1),
                supplierId: 'sup-001',
                supplierCode: 'SUP-001',
                supplierName: 'PT Supplier Utama',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: POStatus.PENDING,
                totalItems: 5,
                totalQuantity: 1000,
                totalValue: 50000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.MANUAL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 15),
                paymentTerms: 'NET 30',
                notes: 'Urgent order for production',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 1),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 1),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'po-002',
                poNumber: 'PO-2024-002',
                poDate: new Date(today.getFullYear(), today.getMonth(), 5),
                supplierId: 'sup-002',
                supplierCode: 'SUP-002',
                supplierName: 'CV Material Jaya',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: POStatus.PARTIALLY_RECEIVED,
                totalItems: 3,
                totalQuantity: 500,
                totalValue: 25000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.EXCEL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 20),
                paymentTerms: 'NET 45',
                notes: 'Regular monthly order',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 5),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 10),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'po-003',
                poNumber: 'PO-2024-003',
                poDate: new Date(today.getFullYear(), today.getMonth(), 10),
                supplierId: 'sup-001',
                supplierCode: 'SUP-001',
                supplierName: 'PT Supplier Utama',
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: POStatus.FULLY_RECEIVED,
                totalItems: 8,
                totalQuantity: 2000,
                totalValue: 100000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.API,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 25),
                paymentTerms: 'NET 30',
                notes: 'Completed order',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 10),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 15),
                createdBy: 'user-002',
                updatedBy: 'user-002'
            },
            {
                id: 'po-004',
                poNumber: 'PO-2024-004',
                poDate: new Date(today.getFullYear(), today.getMonth(), 12),
                supplierId: 'sup-003',
                supplierCode: 'SUP-003',
                supplierName: 'UD Bahan Baku',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: POStatus.PENDING,
                totalItems: 4,
                totalQuantity: 750,
                totalValue: 37500000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.MANUAL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth() + 1, 5),
                paymentTerms: 'NET 60',
                notes: 'New supplier trial order',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 12),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 12),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'po-005',
                poNumber: 'PO-2024-005',
                poDate: new Date(today.getFullYear(), today.getMonth(), 15),
                supplierId: 'sup-002',
                supplierCode: 'SUP-002',
                supplierName: 'CV Material Jaya',
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: POStatus.CANCELLED,
                totalItems: 2,
                totalQuantity: 300,
                totalValue: 15000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.EXCEL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 28),
                paymentTerms: 'NET 30',
                notes: 'Cancelled due to supplier issue',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 15),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 16),
                createdBy: 'user-002',
                updatedBy: 'user-002'
            }
        ];
    }

    /**
     * Get all purchase orders
     */
    getAll(): Observable<PurchaseOrderHeader[]> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders = data ? JSON.parse(data) : [];
        return of(orders).pipe(delay(this.DELAY));
    }

    /**
     * Get purchase order by ID
     */
    getById(id: string): Observable<PurchaseOrderHeader | null> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: PurchaseOrderHeader[] = data ? JSON.parse(data) : [];
        const order = orders.find(o => o.id === id);
        return of(order || null).pipe(delay(this.DELAY));
    }

    /**
     * Create new purchase order
     */
    create(order: Partial<PurchaseOrderHeader>): Observable<PurchaseOrderHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: PurchaseOrderHeader[] = data ? JSON.parse(data) : [];

        const newOrder: PurchaseOrderHeader = {
            ...order,
            id: `po-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        } as PurchaseOrderHeader;

        orders.push(newOrder);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));

        return of(newOrder).pipe(delay(this.DELAY));
    }

    /**
     * Update purchase order
     */
    update(id: string, updates: Partial<PurchaseOrderHeader>): Observable<PurchaseOrderHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: PurchaseOrderHeader[] = data ? JSON.parse(data) : [];

        const index = orders.findIndex(o => o.id === id);
        if (index === -1) {
            return throwError(() => new Error('Purchase order not found'));
        }

        orders[index] = {
            ...orders[index],
            ...updates,
            updatedAt: new Date()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));

        return of(orders[index]).pipe(delay(this.DELAY));
    }

    /**
     * Delete purchase order
     */
    delete(id: string): Observable<void> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: PurchaseOrderHeader[] = data ? JSON.parse(data) : [];

        const filtered = orders.filter(o => o.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

        return of(void 0).pipe(delay(this.DELAY));
    }
}
