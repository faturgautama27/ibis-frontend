import { StockAdjustmentHeader, AdjustmentStatus } from '../../models/stock-adjustment.model';

/**
 * Mock Stock Adjustment Data
 * Used for development and testing purposes
 */
export const MOCK_STOCK_ADJUSTMENTS: StockAdjustmentHeader[] = [
    {
        id: 'adj-001',
        adjustmentNumber: 'ADJ-2024-001',
        adjustmentDate: new Date('2024-01-15'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.PENDING,
        totalItems: 5,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-01-15T10:30:00'),
        notes: 'Physical count adjustment - Q1 2024',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00')
    },
    {
        id: 'adj-002',
        adjustmentNumber: 'ADJ-2024-002',
        adjustmentDate: new Date('2024-01-18'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.APPROVED,
        totalItems: 3,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-01-18T09:15:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-01-18T14:20:00'),
        reviewComments: 'Approved - damage items verified',
        notes: 'Damaged goods adjustment',
        createdAt: new Date('2024-01-18T09:15:00'),
        updatedAt: new Date('2024-01-18T14:20:00')
    },
    {
        id: 'adj-003',
        adjustmentNumber: 'ADJ-2024-003',
        adjustmentDate: new Date('2024-01-20'),
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: AdjustmentStatus.APPROVED,
        totalItems: 8,
        submittedBy: 'warehouse.sby@company.com',
        submittedByName: 'Surabaya Warehouse Staff',
        submittedAt: new Date('2024-01-20T11:00:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-01-20T16:45:00'),
        reviewComments: 'Approved - system error correction',
        notes: 'System error correction - inventory mismatch',
        createdAt: new Date('2024-01-20T11:00:00'),
        updatedAt: new Date('2024-01-20T16:45:00')
    },
    {
        id: 'adj-004',
        adjustmentNumber: 'ADJ-2024-004',
        adjustmentDate: new Date('2024-01-22'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.REJECTED,
        totalItems: 2,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-01-22T13:30:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-01-22T17:15:00'),
        reviewComments: 'Rejected - insufficient documentation',
        notes: 'Theft adjustment - missing items',
        createdAt: new Date('2024-01-22T13:30:00'),
        updatedAt: new Date('2024-01-22T17:15:00')
    },
    {
        id: 'adj-005',
        adjustmentNumber: 'ADJ-2024-005',
        adjustmentDate: new Date('2024-01-25'),
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: AdjustmentStatus.PENDING,
        totalItems: 6,
        submittedBy: 'warehouse.bdg@company.com',
        submittedByName: 'Bandung Warehouse Staff',
        submittedAt: new Date('2024-01-25T08:45:00'),
        notes: 'Expired products adjustment',
        createdAt: new Date('2024-01-25T08:45:00'),
        updatedAt: new Date('2024-01-25T08:45:00')
    },
    {
        id: 'adj-006',
        adjustmentNumber: 'ADJ-2024-006',
        adjustmentDate: new Date('2024-01-28'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.APPROVED,
        totalItems: 4,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-01-28T10:00:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-01-28T15:30:00'),
        reviewComments: 'Approved - physical count verified',
        notes: 'Monthly physical count adjustment',
        createdAt: new Date('2024-01-28T10:00:00'),
        updatedAt: new Date('2024-01-28T15:30:00')
    },
    {
        id: 'adj-007',
        adjustmentNumber: 'ADJ-2024-007',
        adjustmentDate: new Date('2024-02-01'),
        warehouseId: 'wh-002',
        warehouseCode: 'WH002',
        warehouseName: 'Warehouse Surabaya',
        status: AdjustmentStatus.PENDING,
        totalItems: 7,
        submittedBy: 'warehouse.sby@company.com',
        submittedByName: 'Surabaya Warehouse Staff',
        submittedAt: new Date('2024-02-01T09:30:00'),
        notes: 'Damage adjustment - handling issues',
        createdAt: new Date('2024-02-01T09:30:00'),
        updatedAt: new Date('2024-02-01T09:30:00')
    },
    {
        id: 'adj-008',
        adjustmentNumber: 'ADJ-2024-008',
        adjustmentDate: new Date('2024-02-03'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.APPROVED,
        totalItems: 3,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-02-03T11:15:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-02-03T16:00:00'),
        reviewComments: 'Approved - expiry date verified',
        notes: 'Expired items removal',
        createdAt: new Date('2024-02-03T11:15:00'),
        updatedAt: new Date('2024-02-03T16:00:00')
    },
    {
        id: 'adj-009',
        adjustmentNumber: 'ADJ-2024-009',
        adjustmentDate: new Date('2024-02-05'),
        warehouseId: 'wh-003',
        warehouseCode: 'WH003',
        warehouseName: 'Warehouse Bandung',
        status: AdjustmentStatus.PENDING,
        totalItems: 10,
        submittedBy: 'warehouse.bdg@company.com',
        submittedByName: 'Bandung Warehouse Staff',
        submittedAt: new Date('2024-02-05T14:20:00'),
        notes: 'Large physical count adjustment',
        createdAt: new Date('2024-02-05T14:20:00'),
        updatedAt: new Date('2024-02-05T14:20:00')
    },
    {
        id: 'adj-010',
        adjustmentNumber: 'ADJ-2024-010',
        adjustmentDate: new Date('2024-02-08'),
        warehouseId: 'wh-001',
        warehouseCode: 'WH001',
        warehouseName: 'Warehouse Jakarta',
        status: AdjustmentStatus.REJECTED,
        totalItems: 1,
        submittedBy: 'warehouse@company.com',
        submittedByName: 'Warehouse Staff',
        submittedAt: new Date('2024-02-08T12:00:00'),
        reviewedBy: 'manager@company.com',
        reviewedByName: 'Warehouse Manager',
        reviewedAt: new Date('2024-02-08T18:30:00'),
        reviewComments: 'Rejected - need more evidence',
        notes: 'Single item adjustment',
        createdAt: new Date('2024-02-08T12:00:00'),
        updatedAt: new Date('2024-02-08T18:30:00')
    }
];

/**
 * Get mock stock adjustments with optional filtering
 */
export function getMockStockAdjustments(filters?: {
    status?: AdjustmentStatus[];
    warehouseId?: string;
    searchQuery?: string;
}): StockAdjustmentHeader[] {
    let filtered = [...MOCK_STOCK_ADJUSTMENTS];

    if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(adj => filters.status!.includes(adj.status));
    }

    if (filters?.warehouseId) {
        filtered = filtered.filter(adj => adj.warehouseId === filters.warehouseId);
    }

    if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(adj =>
            adj.adjustmentNumber.toLowerCase().includes(query) ||
            adj.warehouseName.toLowerCase().includes(query) ||
            adj.submittedByName?.toLowerCase().includes(query) ||
            adj.notes?.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Get mock stock adjustment by ID
 */
export function getMockStockAdjustmentById(id: string): StockAdjustmentHeader | undefined {
    return MOCK_STOCK_ADJUSTMENTS.find(adj => adj.id === id);
}