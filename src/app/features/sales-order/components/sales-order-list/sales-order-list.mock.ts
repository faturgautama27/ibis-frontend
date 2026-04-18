import { SalesOrderHeader, SOStatus, InputMethod } from '../../models/sales-order.model';

/**
 * Mock Sales Order Data
 * Used for development and testing purposes
 */
export const MOCK_SALES_ORDERS: SalesOrderHeader[] = [
    {
        id: 'so-001',
        soNumber: 'SO-2024-001',
        soDate: new Date('2024-01-16'),
        customerId: 'cust-001',
        customerCode: 'CUST001',
        customerName: 'PT Retail Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.PENDING,
        inputMethod: InputMethod.MANUAL,
        totalItems: 4,
        totalQuantity: 120,
        totalValue: 60000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-16'),
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
        shippingMethod: 'Express Delivery',
        paymentTerms: 'Net 30',
        notes: 'Urgent order for retail store',
        createdAt: new Date('2024-01-16T09:00:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-01-16T09:00:00'),
        updatedBy: 'sales@company.com'
    },
    {
        id: 'so-002',
        soNumber: 'SO-2024-002',
        soDate: new Date('2024-01-19'),
        customerId: 'cust-002',
        customerCode: 'CUST002',
        customerName: 'CV Distributor Maju',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.PARTIALLY_SHIPPED,
        inputMethod: InputMethod.EXCEL,
        totalItems: 10,
        totalQuantity: 400,
        totalValue: 150000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-22'),
        shippingAddress: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
        shippingMethod: 'Standard Delivery',
        paymentTerms: 'Net 45',
        notes: 'Imported from Excel - partial shipment completed',
        createdAt: new Date('2024-01-19T10:30:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-01-28T14:15:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'so-003',
        soNumber: 'SO-2024-003',
        soDate: new Date('2024-01-21'),
        customerId: 'cust-003',
        customerCode: 'CUST003',
        customerName: 'PT Toko Modern',
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: SOStatus.FULLY_SHIPPED,
        inputMethod: InputMethod.API,
        totalItems: 6,
        totalQuantity: 200,
        totalValue: 85000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-12'),
        shippingAddress: 'Jl. Basuki Rahmat No. 789, Surabaya',
        shippingMethod: 'Express Delivery',
        paymentTerms: 'Net 30',
        notes: 'API integration - fully shipped',
        createdAt: new Date('2024-01-21T08:45:00'),
        createdBy: 'api-user',
        updatedAt: new Date('2024-02-10T16:30:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'so-004',
        soNumber: 'SO-2024-004',
        soDate: new Date('2024-01-23'),
        customerId: 'cust-001',
        customerCode: 'CUST001',
        customerName: 'PT Retail Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.PENDING,
        inputMethod: InputMethod.MANUAL,
        totalItems: 3,
        totalQuantity: 90,
        totalValue: 45000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-26'),
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
        shippingMethod: 'Standard Delivery',
        paymentTerms: 'Net 30',
        notes: 'Regular monthly order',
        createdAt: new Date('2024-01-23T11:15:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-01-23T11:15:00'),
        updatedBy: 'sales@company.com'
    },
    {
        id: 'so-005',
        soNumber: 'SO-2024-005',
        soDate: new Date('2024-01-26'),
        customerId: 'cust-004',
        customerCode: 'CUST004',
        customerName: 'UD Warung Berkah',
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: SOStatus.CANCELLED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 5,
        totalQuantity: 150,
        totalValue: 55000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-01'),
        shippingAddress: 'Jl. Asia Afrika No. 321, Bandung',
        shippingMethod: 'Standard Delivery',
        paymentTerms: 'Net 30',
        notes: 'Cancelled by customer request',
        createdAt: new Date('2024-01-26T13:30:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-01-27T09:00:00'),
        updatedBy: 'manager@company.com'
    },
    {
        id: 'so-006',
        soNumber: 'SO-2024-006',
        soDate: new Date('2024-01-29'),
        customerId: 'cust-002',
        customerCode: 'CUST002',
        customerName: 'CV Distributor Maju',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.PARTIALLY_SHIPPED,
        inputMethod: InputMethod.EXCEL,
        totalItems: 12,
        totalQuantity: 500,
        totalValue: 175000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-06'),
        shippingAddress: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
        shippingMethod: 'Express Delivery',
        paymentTerms: 'Net 45',
        notes: 'Large order - multiple shipments',
        createdAt: new Date('2024-01-29T08:00:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-02-06T10:45:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'so-007',
        soNumber: 'SO-2024-007',
        soDate: new Date('2024-02-02'),
        customerId: 'cust-005',
        customerCode: 'CUST005',
        customerName: 'PT Grosir Nusantara',
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: SOStatus.PENDING,
        inputMethod: InputMethod.API,
        totalItems: 8,
        totalQuantity: 320,
        totalValue: 110000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-12'),
        shippingAddress: 'Jl. Pemuda No. 654, Surabaya',
        shippingMethod: 'Standard Delivery',
        paymentTerms: 'Net 30',
        notes: 'Auto-generated from ERP',
        createdAt: new Date('2024-02-02T07:30:00'),
        createdBy: 'api-user',
        updatedAt: new Date('2024-02-02T07:30:00'),
        updatedBy: 'api-user'
    },
    {
        id: 'so-008',
        soNumber: 'SO-2024-008',
        soDate: new Date('2024-02-04'),
        customerId: 'cust-003',
        customerCode: 'CUST003',
        customerName: 'PT Toko Modern',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.FULLY_SHIPPED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 4,
        totalQuantity: 100,
        totalValue: 52000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-21'),
        shippingAddress: 'Jl. Basuki Rahmat No. 789, Surabaya',
        shippingMethod: 'Express Delivery',
        paymentTerms: 'Net 30',
        notes: 'Express delivery completed',
        createdAt: new Date('2024-02-04T09:45:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-02-19T15:20:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'so-009',
        soNumber: 'SO-2024-009',
        soDate: new Date('2024-02-06'),
        customerId: 'cust-006',
        customerCode: 'CUST006',
        customerName: 'CV Toko Jaya',
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: SOStatus.PENDING,
        inputMethod: InputMethod.EXCEL,
        totalItems: 15,
        totalQuantity: 600,
        totalValue: 220000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-18'),
        shippingAddress: 'Jl. Dago No. 987, Bandung',
        shippingMethod: 'Standard Delivery',
        paymentTerms: 'Net 60',
        notes: 'Bulk order for Q1 2024',
        createdAt: new Date('2024-02-06T10:15:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-02-06T10:15:00'),
        updatedBy: 'sales@company.com'
    },
    {
        id: 'so-010',
        soNumber: 'SO-2024-010',
        soDate: new Date('2024-02-09'),
        customerId: 'cust-001',
        customerCode: 'CUST001',
        customerName: 'PT Retail Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: SOStatus.PARTIALLY_SHIPPED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 7,
        totalQuantity: 280,
        totalValue: 95000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-10'),
        shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
        shippingMethod: 'Express Delivery',
        paymentTerms: 'Net 30',
        notes: 'Partial shipment on Feb 22',
        createdAt: new Date('2024-02-09T08:30:00'),
        createdBy: 'sales@company.com',
        updatedAt: new Date('2024-02-22T11:00:00'),
        updatedBy: 'warehouse@company.com'
    }
];

/**
 * Get mock sales orders with optional filtering
 */
export function getMockSalesOrders(filters?: {
    status?: SOStatus[];
    customerId?: string;
    searchQuery?: string;
}): SalesOrderHeader[] {
    let filtered = [...MOCK_SALES_ORDERS];

    if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(so => filters.status!.includes(so.status));
    }

    if (filters?.customerId) {
        filtered = filtered.filter(so => so.customerId === filters.customerId);
    }

    if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(so =>
            so.soNumber.toLowerCase().includes(query) ||
            so.customerName.toLowerCase().includes(query) ||
            so.customerCode.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Get mock sales order by ID
 */
export function getMockSalesOrderById(id: string): SalesOrderHeader | undefined {
    return MOCK_SALES_ORDERS.find(so => so.id === id);
}

/**
 * Get mock sales order by SO Number
 */
export function getMockSalesOrderByNumber(soNumber: string): SalesOrderHeader | undefined {
    return MOCK_SALES_ORDERS.find(so => so.soNumber === soNumber);
}
