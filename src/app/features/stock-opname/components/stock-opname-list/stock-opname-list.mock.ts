import { StockOpname, OpnameType } from '../../models/stock-opname.model';

/**
 * Mock Stock Opname Data
 * Used for development and testing purposes
 */
export const MOCK_STOCK_OPNAMES: StockOpname[] = [
    {
        id: 'opname-001',
        opname_number: 'OP-2024-001',
        opname_date: new Date('2024-01-15'),
        opname_type: OpnameType.PERIODIC,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'COMPLETED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-01-16T10:30:00'),
        created_at: new Date('2024-01-15T08:00:00'),
        created_by: 'warehouse@company.com',
        notes: 'Monthly periodic stock count'
    },
    {
        id: 'opname-002',
        opname_number: 'OP-2024-002',
        opname_date: new Date('2024-01-18'),
        opname_type: OpnameType.SPOT_CHECK,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'APPROVED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-01-18T15:45:00'),
        created_at: new Date('2024-01-18T09:15:00'),
        created_by: 'warehouse@company.com',
        notes: 'Spot check for high-value items'
    },
    {
        id: 'opname-003',
        opname_number: 'OP-2024-003',
        opname_date: new Date('2024-01-20'),
        opname_type: OpnameType.PERIODIC,
        warehouse_id: 'wh-002',
        warehouse_code: 'WH002',
        warehouse_name: 'Warehouse Surabaya',
        status: 'COMPLETED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-01-21T11:20:00'),
        created_at: new Date('2024-01-20T07:30:00'),
        created_by: 'warehouse.sby@company.com',
        notes: 'Surabaya monthly count'
    },
    {
        id: 'opname-004',
        opname_number: 'OP-2024-004',
        opname_date: new Date('2024-01-22'),
        opname_type: OpnameType.SPOT_CHECK,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'DRAFT',
        created_at: new Date('2024-01-22T14:00:00'),
        created_by: 'warehouse@company.com',
        notes: 'Fast-moving items check'
    },
    {
        id: 'opname-005',
        opname_number: 'OP-2024-005',
        opname_date: new Date('2024-01-25'),
        opname_type: OpnameType.YEAR_END,
        warehouse_id: 'wh-003',
        warehouse_code: 'WH003',
        warehouse_name: 'Warehouse Bandung',
        status: 'APPROVED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-01-26T09:00:00'),
        created_at: new Date('2024-01-25T08:45:00'),
        created_by: 'warehouse.bdg@company.com',
        notes: 'Year-end inventory count'
    },
    {
        id: 'opname-006',
        opname_number: 'OP-2024-006',
        opname_date: new Date('2024-01-28'),
        opname_type: OpnameType.PERIODIC,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'COMPLETED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-01-29T16:30:00'),
        created_at: new Date('2024-01-28T10:00:00'),
        created_by: 'warehouse@company.com',
        notes: 'End of month count'
    },
    {
        id: 'opname-007',
        opname_number: 'OP-2024-007',
        opname_date: new Date('2024-02-01'),
        opname_type: OpnameType.SPOT_CHECK,
        warehouse_id: 'wh-002',
        warehouse_code: 'WH002',
        warehouse_name: 'Warehouse Surabaya',
        status: 'DRAFT',
        created_at: new Date('2024-02-01T09:30:00'),
        created_by: 'warehouse.sby@company.com',
        notes: 'Random sample check'
    },
    {
        id: 'opname-008',
        opname_number: 'OP-2024-008',
        opname_date: new Date('2024-02-03'),
        opname_type: OpnameType.PERIODIC,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'APPROVED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-02-04T13:15:00'),
        created_at: new Date('2024-02-03T11:15:00'),
        created_by: 'warehouse@company.com',
        notes: 'February periodic count'
    },
    {
        id: 'opname-009',
        opname_number: 'OP-2024-009',
        opname_date: new Date('2024-02-05'),
        opname_type: OpnameType.SPOT_CHECK,
        warehouse_id: 'wh-003',
        warehouse_code: 'WH003',
        warehouse_name: 'Warehouse Bandung',
        status: 'COMPLETED',
        approved_by: 'manager@company.com',
        approved_date: new Date('2024-02-06T10:45:00'),
        created_at: new Date('2024-02-05T14:20:00'),
        created_by: 'warehouse.bdg@company.com',
        notes: 'Critical items verification'
    },
    {
        id: 'opname-010',
        opname_number: 'OP-2024-010',
        opname_date: new Date('2024-02-08'),
        opname_type: OpnameType.PERIODIC,
        warehouse_id: 'wh-001',
        warehouse_code: 'WH001',
        warehouse_name: 'Warehouse Jakarta',
        status: 'DRAFT',
        created_at: new Date('2024-02-08T12:00:00'),
        created_by: 'warehouse@company.com',
        notes: 'Weekly count in progress'
    }
];

/**
 * Get mock stock opnames with optional filtering
 */
export function getMockStockOpnames(filters?: {
    status?: string[];
    warehouseId?: string;
    searchQuery?: string;
    opnameType?: OpnameType[];
}): StockOpname[] {
    let filtered = [...MOCK_STOCK_OPNAMES];

    if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter(opname => filters.status!.includes(opname.status));
    }

    if (filters?.warehouseId) {
        filtered = filtered.filter(opname => opname.warehouse_id === filters.warehouseId);
    }

    if (filters?.opnameType && filters.opnameType.length > 0) {
        filtered = filtered.filter(opname => filters.opnameType!.includes(opname.opname_type));
    }

    if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(opname =>
            opname.opname_number.toLowerCase().includes(query) ||
            opname.warehouse_name.toLowerCase().includes(query) ||
            opname.notes?.toLowerCase().includes(query)
        );
    }

    return filtered;
}

/**
 * Get mock stock opname by ID
 */
export function getMockStockOpnameById(id: string): StockOpname | undefined {
    return MOCK_STOCK_OPNAMES.find(opname => opname.id === id);
}

/**
 * Get mock stock opname by number
 */
export function getMockStockOpnameByNumber(opnameNumber: string): StockOpname | undefined {
    return MOCK_STOCK_OPNAMES.find(opname => opname.opname_number === opnameNumber);
}