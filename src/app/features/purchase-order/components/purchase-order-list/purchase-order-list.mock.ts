import { PurchaseOrderHeader, POStatus, InputMethod } from '../../models/purchase-order.model';

/**
 * Mock Purchase Order Data
 * Used for development and testing purposes
 */
export const MOCK_PURCHASE_ORDERS: PurchaseOrderHeader[] = [
    {
        id: 'po-001',
        poNumber: 'PO-2024-001',
        poDate: new Date('2024-01-15'),
        supplierId: 'sup-001',
        supplierCode: 'SUP001',
        supplierName: 'PT Supplier Utama',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.PENDING,
        inputMethod: InputMethod.MANUAL,
        totalItems: 5,
        totalQuantity: 150,
        totalValue: 75000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-15'),
        paymentTerms: 'Net 30',
        notes: 'Urgent order for Q1 stock',
        createdAt: new Date('2024-01-15T08:30:00'),
        createdBy: 'admin@company.com',
        updatedAt: new Date('2024-01-15T08:30:00'),
        updatedBy: 'admin@company.com'
    },
    {
        id: 'po-002',
        poNumber: 'PO-2024-002',
        poDate: new Date('2024-01-18'),
        supplierId: 'sup-002',
        supplierCode: 'SUP002',
        supplierName: 'CV Mitra Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.PARTIALLY_RECEIVED,
        inputMethod: InputMethod.EXCEL,
        totalItems: 12,
        totalQuantity: 500,
        totalValue: 125000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-20'),
        paymentTerms: 'Net 45',
        notes: 'Imported from Excel template',
        createdAt: new Date('2024-01-18T10:15:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-01-25T14:20:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'po-003',
        poNumber: 'PO-2024-003',
        poDate: new Date('2024-01-20'),
        supplierId: 'sup-003',
        supplierCode: 'SUP003',
        supplierName: 'PT Global Trading',
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: POStatus.FULLY_RECEIVED,
        inputMethod: InputMethod.API,
        totalItems: 8,
        totalQuantity: 300,
        totalValue: 95000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-10'),
        paymentTerms: 'Net 30',
        notes: 'Received via API integration',
        createdAt: new Date('2024-01-20T09:00:00'),
        createdBy: 'api-user',
        updatedAt: new Date('2024-02-08T16:45:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'po-004',
        poNumber: 'PO-2024-004',
        poDate: new Date('2024-01-22'),
        supplierId: 'sup-001',
        supplierCode: 'SUP001',
        supplierName: 'PT Supplier Utama',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.PENDING,
        inputMethod: InputMethod.MANUAL,
        totalItems: 3,
        totalQuantity: 75,
        totalValue: 45000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-25'),
        paymentTerms: 'Net 30',
        notes: 'Regular monthly order',
        createdAt: new Date('2024-01-22T11:30:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-01-22T11:30:00'),
        updatedBy: 'purchasing@company.com'
    },
    {
        id: 'po-005',
        poNumber: 'PO-2024-005',
        poDate: new Date('2024-01-25'),
        supplierId: 'sup-004',
        supplierCode: 'SUP004',
        supplierName: 'UD Berkah Jaya',
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: POStatus.CANCELLED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 6,
        totalQuantity: 200,
        totalValue: 60000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-28'),
        paymentTerms: 'Net 30',
        notes: 'Cancelled due to supplier unavailability',
        createdAt: new Date('2024-01-25T13:00:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-01-26T09:15:00'),
        updatedBy: 'manager@company.com'
    },
    {
        id: 'po-006',
        poNumber: 'PO-2024-006',
        poDate: new Date('2024-01-28'),
        supplierId: 'sup-002',
        supplierCode: 'SUP002',
        supplierName: 'CV Mitra Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.PARTIALLY_RECEIVED,
        inputMethod: InputMethod.EXCEL,
        totalItems: 15,
        totalQuantity: 600,
        totalValue: 180000000,
        currency: 'IDR',
        exchangeRate: 1,
        deliveryDate: new Date('2024-03-05'),
        paymentTerms: 'Net 45',
        notes: 'Large order - multiple deliveries expected',
        createdAt: new Date('2024-01-28T08:45:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-02-05T10:30:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'po-007',
        poNumber: 'PO-2024-007',
        poDate: new Date('2024-02-01'),
        supplierId: 'sup-005',
        supplierCode: 'SUP005',
        supplierName: 'PT Indo Makmur',
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: POStatus.PENDING,
        inputMethod: InputMethod.API,
        totalItems: 10,
        totalQuantity: 400,
        totalValue: 120000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-10'),
        paymentTerms: 'Net 30',
        notes: 'Auto-generated from ERP system',
        createdAt: new Date('2024-02-01T07:00:00'),
        createdBy: 'api-user',
        updatedAt: new Date('2024-02-01T07:00:00'),
        updatedBy: 'api-user'
    },
    {
        id: 'po-008',
        poNumber: 'PO-2024-008',
        poDate: new Date('2024-02-03'),
        supplierId: 'sup-003',
        supplierCode: 'SUP003',
        supplierName: 'PT Global Trading',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.FULLY_RECEIVED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 4,
        totalQuantity: 100,
        totalValue: 55000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-20'),
        paymentTerms: 'Net 30',
        notes: 'Express delivery completed',
        createdAt: new Date('2024-02-03T09:30:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-02-18T15:00:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'po-009',
        poNumber: 'PO-2024-009',
        poDate: new Date('2024-02-05'),
        supplierId: 'sup-006',
        supplierCode: 'SUP006',
        supplierName: 'CV Sumber Rejeki',
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: POStatus.PENDING,
        inputMethod: InputMethod.EXCEL,
        totalItems: 20,
        totalQuantity: 800,
        totalValue: 240000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-15'),
        paymentTerms: 'Net 60',
        notes: 'Bulk order for Q1 2024',
        createdAt: new Date('2024-02-05T10:00:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-02-05T10:00:00'),
        updatedBy: 'purchasing@company.com'
    },
    {
        id: 'po-010',
        poNumber: 'PO-2024-010',
        poDate: new Date('2024-02-08'),
        supplierId: 'sup-001',
        supplierCode: 'SUP001',
        supplierName: 'PT Supplier Utama',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.PARTIALLY_RECEIVED,
        inputMethod: InputMethod.MANUAL,
        totalItems: 7,
        totalQuantity: 250,
        totalValue: 87500000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-08'),
        paymentTerms: 'Net 30',
        notes: 'Partial delivery received on Feb 20',
        createdAt: new Date('2024-02-08T08:15:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-02-20T11:45:00'),
        updatedBy: 'warehouse@company.com'
    },
    {
        id: 'po-011',
        poNumber: 'PO-2024-011',
        poDate: new Date('2024-02-10'),
        supplierId: 'sup-007',
        supplierCode: 'SUP007',
        supplierName: 'PT Nusantara Abadi',
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: POStatus.PENDING,
        inputMethod: InputMethod.API,
        totalItems: 9,
        totalQuantity: 350,
        totalValue: 105000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-03-20'),
        paymentTerms: 'Net 45',
        notes: 'API integration - auto sync',
        createdAt: new Date('2024-02-10T06:30:00'),
        createdBy: 'api-user',
        updatedAt: new Date('2024-02-10T06:30:00'),
        updatedBy: 'api-user'
    },
    {
        id: 'po-012',
        poNumber: 'PO-2024-012',
        poDate: new Date('2024-02-12'),
        supplierId: 'sup-002',
        supplierCode: 'SUP002',
        supplierName: 'CV Mitra Sejahtera',
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: POStatus.FULLY_RECEIVED,
        inputMethod: InputMethod.EXCEL,
        totalItems: 6,
        totalQuantity: 180,
        totalValue: 72000000,
        currency: 'IDR',
        deliveryDate: new Date('2024-02-28'),
        paymentTerms: 'Net 30',
        notes: 'All items received and verified',
        createdAt: new Date('2024-02-12T09:00:00'),
        createdBy: 'purchasing@company.com',
        updatedAt: new Date('2024-02-27T14:30:00'),
        updatedBy: 'warehouse@company.com'
    }
];

/**
 * Get mock purchase orders with optional filtering
 */
export function getMockPurchaseOrders(filters?: {
    status?: POStatus[];
    supplierId?: string;
    searchQuery?: string;
}): PurchaseOrderHeader[] {
    let filtered = [...MOCK_PURCHASE_ORDERS];

    if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(po => filters.status!.includes(po.status));
    }

    if (filters?.supplierId) {
        filtered = filtered.filter(po => po.supplierId === filters.supplierId);
    }

    if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(po =>
            po.poNumber.toLowerCase().includes(query) ||
            po.supplierName.toLowerCase().includes(query) ||
            po.supplierCode.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Get mock purchase order by ID
 */
export function getMockPurchaseOrderById(id: string): PurchaseOrderHeader | undefined {
    return MOCK_PURCHASE_ORDERS.find(po => po.id === id);
}

/**
 * Get mock purchase order by PO Number
 */
export function getMockPurchaseOrderByNumber(poNumber: string): PurchaseOrderHeader | undefined {
    return MOCK_PURCHASE_ORDERS.find(po => po.poNumber === poNumber);
}
