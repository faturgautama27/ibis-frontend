import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { SalesOrderHeader, SOStatus, InputMethod } from '../models/sales-order.model';

/**
 * Sales Order Demo Service
 * Provides mock data for Sales Orders
 */
@Injectable({
    providedIn: 'root'
})
export class SalesOrderDemoService {
    private readonly STORAGE_KEY = 'sales_orders';
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
     * Generate mock sales orders
     */
    private generateMockData(): SalesOrderHeader[] {
        const today = new Date();
        return [
            {
                id: 'so-001',
                soNumber: 'SO-2024-001',
                soDate: new Date(today.getFullYear(), today.getMonth(), 2),
                customerId: 'cust-001',
                customerCode: 'CUST-001',
                customerName: 'PT Customer Prima',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: SOStatus.PENDING,
                totalItems: 4,
                totalQuantity: 500,
                totalValue: 75000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.MANUAL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 18),
                shippingAddress: 'Jl. Sudirman No. 123, Jakarta',
                shippingMethod: 'TRUCK',
                paymentTerms: 'NET 30',
                notes: 'Priority customer order',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 2),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 2),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'so-002',
                soNumber: 'SO-2024-002',
                soDate: new Date(today.getFullYear(), today.getMonth(), 6),
                customerId: 'cust-002',
                customerCode: 'CUST-002',
                customerName: 'CV Distributor Sejahtera',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: SOStatus.PARTIALLY_SHIPPED,
                totalItems: 6,
                totalQuantity: 1200,
                totalValue: 120000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.EXCEL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 22),
                shippingAddress: 'Jl. Gatot Subroto No. 456, Jakarta',
                shippingMethod: 'CONTAINER',
                paymentTerms: 'NET 45',
                notes: 'Partial shipment approved',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 6),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 12),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'so-003',
                soNumber: 'SO-2024-003',
                soDate: new Date(today.getFullYear(), today.getMonth(), 8),
                customerId: 'cust-003',
                customerCode: 'CUST-003',
                customerName: 'UD Retail Makmur',
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: SOStatus.FULLY_SHIPPED,
                totalItems: 3,
                totalQuantity: 300,
                totalValue: 45000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.API,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 20),
                shippingAddress: 'Jl. Basuki Rahmat No. 789, Surabaya',
                shippingMethod: 'TRUCK',
                paymentTerms: 'NET 30',
                notes: 'Completed and delivered',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 8),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 14),
                createdBy: 'user-002',
                updatedBy: 'user-002'
            },
            {
                id: 'so-004',
                soNumber: 'SO-2024-004',
                soDate: new Date(today.getFullYear(), today.getMonth(), 14),
                customerId: 'cust-001',
                customerCode: 'CUST-001',
                customerName: 'PT Customer Prima',
                warehouseId: 'wh-001',
                warehouseCode: 'WH-JKT',
                warehouseName: 'Warehouse Jakarta',
                status: SOStatus.PENDING,
                totalItems: 5,
                totalQuantity: 800,
                totalValue: 96000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.MANUAL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth() + 1, 10),
                shippingAddress: 'Jl. Sudirman No. 123, Jakarta',
                shippingMethod: 'CONTAINER',
                paymentTerms: 'NET 30',
                notes: 'Repeat order from priority customer',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 14),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 14),
                createdBy: 'user-001',
                updatedBy: 'user-001'
            },
            {
                id: 'so-005',
                soNumber: 'SO-2024-005',
                soDate: new Date(today.getFullYear(), today.getMonth(), 16),
                customerId: 'cust-004',
                customerCode: 'CUST-004',
                customerName: 'PT Ekspor Internasional',
                warehouseId: 'wh-002',
                warehouseCode: 'WH-SBY',
                warehouseName: 'Warehouse Surabaya',
                status: SOStatus.CANCELLED,
                totalItems: 2,
                totalQuantity: 200,
                totalValue: 30000000,
                currency: 'IDR',
                exchangeRate: 1,
                inputMethod: InputMethod.EXCEL,
                deliveryDate: new Date(today.getFullYear(), today.getMonth(), 30),
                shippingAddress: 'Jl. Pelabuhan No. 321, Surabaya',
                shippingMethod: 'CONTAINER',
                paymentTerms: 'NET 60',
                notes: 'Cancelled by customer',
                createdAt: new Date(today.getFullYear(), today.getMonth(), 16),
                updatedAt: new Date(today.getFullYear(), today.getMonth(), 17),
                createdBy: 'user-002',
                updatedBy: 'user-002'
            }
        ];
    }

    /**
     * Get all sales orders
     */
    getAll(): Observable<SalesOrderHeader[]> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders = data ? JSON.parse(data) : [];
        return of(orders).pipe(delay(this.DELAY));
    }

    /**
     * Get sales order by ID
     */
    getById(id: string): Observable<SalesOrderHeader | null> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: SalesOrderHeader[] = data ? JSON.parse(data) : [];
        const order = orders.find(o => o.id === id);
        return of(order || null).pipe(delay(this.DELAY));
    }

    /**
     * Create new sales order
     */
    create(order: Partial<SalesOrderHeader>): Observable<SalesOrderHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: SalesOrderHeader[] = data ? JSON.parse(data) : [];

        const newOrder: SalesOrderHeader = {
            ...order,
            id: `so-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
        } as SalesOrderHeader;

        orders.push(newOrder);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));

        return of(newOrder).pipe(delay(this.DELAY));
    }

    /**
     * Update sales order
     */
    update(id: string, updates: Partial<SalesOrderHeader>): Observable<SalesOrderHeader> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: SalesOrderHeader[] = data ? JSON.parse(data) : [];

        const index = orders.findIndex(o => o.id === id);
        if (index === -1) {
            return throwError(() => new Error('Sales order not found'));
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
     * Delete sales order
     */
    delete(id: string): Observable<void> {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const orders: SalesOrderHeader[] = data ? JSON.parse(data) : [];

        const filtered = orders.filter(o => o.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

        return of(void 0).pipe(delay(this.DELAY));
    }

    /**
     * Get order details (alias for effects)
     */
    getOrderDetails(orderId: string): Observable<any[]> {
        // Mock order details
        return of([]).pipe(delay(this.DELAY));
    }

    /**
     * Create order (alias for effects)
     */
    createOrder(order: Partial<SalesOrderHeader>): Observable<SalesOrderHeader> {
        return this.create(order);
    }

    /**
     * Update order (alias for effects)
     */
    updateOrder(id: string, updates: Partial<SalesOrderHeader>): Observable<SalesOrderHeader> {
        return this.update(id, updates);
    }

    /**
     * Delete order (alias for effects)
     */
    deleteOrder(id: string): Observable<void> {
        return this.delete(id);
    }

    /**
     * Update status (alias for effects)
     */
    updateStatus(id: string, status: SOStatus): Observable<SalesOrderHeader> {
        return this.update(id, { status });
    }
}
