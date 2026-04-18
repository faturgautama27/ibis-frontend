import { AuditLog, AuditAction } from '../../models/audit-log.model';

/**
 * Mock Audit Trail Data
 * Used for development and testing purposes
 */
export const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'audit-001',
        table_name: 'purchase_orders',
        record_id: 'po-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            po_number: 'PO-2024-001',
            supplier_id: 'sup-001',
            total_value: 75000000,
            status: 'PENDING'
        },
        changed_fields: ['po_number', 'supplier_id', 'total_value', 'status'],
        user_id: 'user-001',
        user_name: 'purchasing@company.com',
        timestamp: new Date('2024-01-15T08:30:00'),
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-002',
        table_name: 'purchase_orders',
        record_id: 'po-001',
        action: AuditAction.UPDATE,
        old_data: {
            status: 'PENDING',
            updated_at: '2024-01-15T08:30:00'
        },
        new_data: {
            status: 'PARTIALLY_RECEIVED',
            updated_at: '2024-01-25T14:20:00'
        },
        changed_fields: ['status', 'updated_at'],
        user_id: 'user-002',
        user_name: 'warehouse@company.com',
        timestamp: new Date('2024-01-25T14:20:00'),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-003',
        table_name: 'sales_orders',
        record_id: 'so-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            so_number: 'SO-2024-001',
            customer_id: 'cust-001',
            total_value: 60000000,
            status: 'PENDING'
        },
        changed_fields: ['so_number', 'customer_id', 'total_value', 'status'],
        user_id: 'user-003',
        user_name: 'sales@company.com',
        timestamp: new Date('2024-01-16T09:00:00'),
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
        id: 'audit-004',
        table_name: 'stock_adjustments',
        record_id: 'adj-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            adjustment_number: 'ADJ-2024-001',
            warehouse_id: 'wh-001',
            status: 'PENDING',
            total_items: 5
        },
        changed_fields: ['adjustment_number', 'warehouse_id', 'status', 'total_items'],
        user_id: 'user-002',
        user_name: 'warehouse@company.com',
        timestamp: new Date('2024-01-15T10:30:00'),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-005',
        table_name: 'stock_adjustments',
        record_id: 'adj-001',
        action: AuditAction.UPDATE,
        old_data: {
            status: 'PENDING',
            reviewed_by: null,
            reviewed_at: null
        },
        new_data: {
            status: 'APPROVED',
            reviewed_by: 'manager@company.com',
            reviewed_at: '2024-01-18T14:20:00'
        },
        changed_fields: ['status', 'reviewed_by', 'reviewed_at'],
        user_id: 'user-004',
        user_name: 'manager@company.com',
        timestamp: new Date('2024-01-18T14:20:00'),
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
        id: 'audit-006',
        table_name: 'stock_opnames',
        record_id: 'opname-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            opname_number: 'OP-2024-001',
            warehouse_id: 'wh-001',
            opname_type: 'PERIODIC',
            status: 'DRAFT'
        },
        changed_fields: ['opname_number', 'warehouse_id', 'opname_type', 'status'],
        user_id: 'user-002',
        user_name: 'warehouse@company.com',
        timestamp: new Date('2024-01-15T08:00:00'),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-007',
        table_name: 'items',
        record_id: 'item-001',
        action: AuditAction.UPDATE,
        old_data: {
            item_name: 'Raw Material A',
            unit_price: 1000
        },
        new_data: {
            item_name: 'Raw Material A - Premium',
            unit_price: 1200
        },
        changed_fields: ['item_name', 'unit_price'],
        user_id: 'user-005',
        user_name: 'admin@company.com',
        timestamp: new Date('2024-01-20T11:15:00'),
        ip_address: '192.168.1.104',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-008',
        table_name: 'suppliers',
        record_id: 'sup-004',
        action: AuditAction.DELETE,
        old_data: {
            supplier_code: 'SUP004',
            supplier_name: 'UD Berkah Jaya',
            status: 'INACTIVE'
        },
        new_data: null,
        changed_fields: ['supplier_code', 'supplier_name', 'status'],
        user_id: 'user-005',
        user_name: 'admin@company.com',
        timestamp: new Date('2024-01-22T16:30:00'),
        ip_address: '192.168.1.104',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-009',
        table_name: 'inbound_transactions',
        record_id: 'inb-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            inbound_number: 'INB-2024-001',
            po_id: 'po-001',
            warehouse_id: 'wh-001',
            status: 'RECEIVED'
        },
        changed_fields: ['inbound_number', 'po_id', 'warehouse_id', 'status'],
        user_id: 'user-002',
        user_name: 'warehouse@company.com',
        timestamp: new Date('2024-01-25T09:45:00'),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-010',
        table_name: 'outbound_transactions',
        record_id: 'out-001',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            outbound_number: 'OUT-2024-001',
            so_id: 'so-001',
            warehouse_id: 'wh-001',
            status: 'SHIPPED'
        },
        changed_fields: ['outbound_number', 'so_id', 'warehouse_id', 'status'],
        user_id: 'user-002',
        user_name: 'warehouse@company.com',
        timestamp: new Date('2024-01-18T15:20:00'),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-011',
        table_name: 'users',
        record_id: 'user-006',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            username: 'newuser@company.com',
            role: 'WAREHOUSE_STAFF',
            status: 'ACTIVE'
        },
        changed_fields: ['username', 'role', 'status'],
        user_id: 'user-005',
        user_name: 'admin@company.com',
        timestamp: new Date('2024-02-01T08:30:00'),
        ip_address: '192.168.1.104',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-012',
        table_name: 'warehouses',
        record_id: 'wh-004',
        action: AuditAction.INSERT,
        old_data: null,
        new_data: {
            warehouse_code: 'WH004',
            warehouse_name: 'Warehouse Medan',
            status: 'ACTIVE'
        },
        changed_fields: ['warehouse_code', 'warehouse_name', 'status'],
        user_id: 'user-005',
        user_name: 'admin@company.com',
        timestamp: new Date('2024-02-03T10:15:00'),
        ip_address: '192.168.1.104',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
        id: 'audit-013',
        table_name: 'purchase_orders',
        record_id: 'po-005',
        action: AuditAction.DELETE,
        old_data: {
            po_number: 'PO-2024-005',
            status: 'CANCELLED',
            total_value: 60000000
        },
        new_data: null,
        changed_fields: ['po_number', 'status', 'total_value'],
        user_id: 'user-004',
        user_name: 'manager@company.com',
        timestamp: new Date('2024-01-26T09:15:00'),
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
        id: 'audit-014',
        table_name: 'inventory',
        record_id: 'inv-001',
        action: AuditAction.UPDATE,
        old_data: {
            quantity: 100,
            last_updated: '2024-01-15T08:30:00'
        },
        new_data: {
            quantity: 150,
            last_updated: '2024-01-25T09:45:00'
        },
        changed_fields: ['quantity', 'last_updated'],
        user_id: 'system',
        user_name: 'System (Inbound)',
        timestamp: new Date('2024-01-25T09:45:00'),
        ip_address: '127.0.0.1',
        user_agent: 'System Process'
    },
    {
        id: 'audit-015',
        table_name: 'inventory',
        record_id: 'inv-002',
        action: AuditAction.UPDATE,
        old_data: {
            quantity: 25,
            last_updated: '2024-01-16T14:30:00'
        },
        new_data: {
            quantity: 10,
            last_updated: '2024-01-18T15:20:00'
        },
        changed_fields: ['quantity', 'last_updated'],
        user_id: 'system',
        user_name: 'System (Outbound)',
        timestamp: new Date('2024-01-18T15:20:00'),
        ip_address: '127.0.0.1',
        user_agent: 'System Process'
    }
];

/**
 * Get mock audit logs with optional filtering
 */
export function getMockAuditLogs(filters?: {
    start_date?: Date;
    end_date?: Date;
    user_name?: string;
    action?: AuditAction;
    table_name?: string;
}): AuditLog[] {
    let filtered = [...MOCK_AUDIT_LOGS];

    if (filters?.start_date) {
        filtered = filtered.filter(log => new Date(log.timestamp) >= filters.start_date!);
    }

    if (filters?.end_date) {
        filtered = filtered.filter(log => new Date(log.timestamp) <= filters.end_date!);
    }

    if (filters?.user_name) {
        const query = filters.user_name.toLowerCase();
        filtered = filtered.filter(log => log.user_name.toLowerCase().includes(query));
    }

    if (filters?.action) {
        filtered = filtered.filter(log => log.action === filters.action);
    }

    if (filters?.table_name) {
        filtered = filtered.filter(log => log.table_name === filters.table_name);
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Get mock audit log by ID
 */
export function getMockAuditLogById(id: string): AuditLog | undefined {
    return MOCK_AUDIT_LOGS.find(log => log.id === id);
}

/**
 * Get mock audit logs for a specific record
 */
export function getMockAuditLogsByRecord(tableName: string, recordId: string): AuditLog[] {
    return MOCK_AUDIT_LOGS
        .filter(log => log.table_name === tableName && log.record_id === recordId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Get mock table names for filtering
 */
export function getMockTableNames(): string[] {
    return [...new Set(MOCK_AUDIT_LOGS.map(log => log.table_name))];
}

/**
 * Get mock user names for filtering
 */
export function getMockUserNames(): string[] {
    return [...new Set(MOCK_AUDIT_LOGS.map(log => log.user_name))];
}