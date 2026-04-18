/**
 * Mock Report Data
 * Used for development and testing purposes
 */

// Inbound Report Mock Data
export const MOCK_INBOUND_REPORT = [
    {
        inbound_number: 'INB-2024-001',
        inbound_date: new Date('2026-04-15'),
        po_number: 'PO-2024-001',
        supplier_name: 'PT Supplier Utama',
        warehouse_name: 'Warehouse Jakarta',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        quantity_received: 100,
        unit: 'KG',
        unit_price: 1000,
        total_value: 100000,
        batch_number: 'BATCH-001',
        expiry_date: new Date('2025-01-15'),
        status: 'RECEIVED'
    },
    {
        inbound_number: 'INB-2024-002',
        inbound_date: new Date('2026-04-18'),
        po_number: 'PO-2024-002',
        supplier_name: 'CV Mitra Sejahtera',
        warehouse_name: 'Warehouse Jakarta',
        item_code: 'ITM003',
        item_name: 'Component B',
        quantity_received: 200,
        unit: 'PCS',
        unit_price: 500,
        total_value: 100000,
        batch_number: 'BATCH-002',
        expiry_date: new Date('2025-06-18'),
        status: 'RECEIVED'
    },
    {
        inbound_number: 'INB-2024-003',
        inbound_date: new Date('2026-04-20'),
        po_number: 'PO-2024-003',
        supplier_name: 'PT Global Trading',
        warehouse_name: 'Warehouse Surabaya',
        item_code: 'ITM005',
        item_name: 'Chemical X',
        quantity_received: 50,
        unit: 'LTR',
        unit_price: 2000,
        total_value: 100000,
        batch_number: 'BATCH-003',
        expiry_date: new Date('2024-12-20'),
        status: 'RECEIVED'
    },
    {
        inbound_number: 'INB-2024-004',
        inbound_date: new Date('2026-04-25'),
        po_number: 'PO-2024-001',
        supplier_name: 'PT Supplier Utama',
        warehouse_name: 'Warehouse Jakarta',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        quantity_received: 50,
        unit: 'KG',
        unit_price: 1000,
        total_value: 50000,
        batch_number: 'BATCH-001',
        expiry_date: new Date('2025-01-25'),
        status: 'RECEIVED'
    },
    {
        inbound_number: 'INB-2024-005',
        inbound_date: new Date('2024-02-01'),
        po_number: 'PO-2024-004',
        supplier_name: 'UD Berkah Jaya',
        warehouse_name: 'Warehouse Bandung',
        item_code: 'ITM007',
        item_name: 'Packaging Material',
        quantity_received: 1000,
        unit: 'PCS',
        unit_price: 100,
        total_value: 100000,
        batch_number: 'BATCH-004',
        expiry_date: new Date('2026-02-01'),
        status: 'RECEIVED'
    }
];

// Outbound Report Mock Data
export const MOCK_OUTBOUND_REPORT = [
    {
        outbound_number: 'OUT-2024-001',
        outbound_date: new Date('2026-04-18'),
        so_number: 'SO-2024-001',
        customer_name: 'PT Retail Sejahtera',
        warehouse_name: 'Warehouse Jakarta',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        quantity_shipped: 15,
        unit: 'PCS',
        unit_price: 4000,
        total_value: 60000,
        batch_number: 'BATCH-FG-001',
        shipping_method: 'Express Delivery',
        status: 'SHIPPED'
    },
    {
        outbound_number: 'OUT-2024-002',
        outbound_date: new Date('2026-04-22'),
        so_number: 'SO-2024-002',
        customer_name: 'CV Distributor Maju',
        warehouse_name: 'Warehouse Jakarta',
        item_code: 'ITM004',
        item_name: 'Finished Product Y',
        quantity_shipped: 25,
        unit: 'PCS',
        unit_price: 3500,
        total_value: 87500,
        batch_number: 'BATCH-FG-002',
        shipping_method: 'Standard Delivery',
        status: 'SHIPPED'
    },
    {
        outbound_number: 'OUT-2024-003',
        outbound_date: new Date('2026-04-25'),
        so_number: 'SO-2024-003',
        customer_name: 'PT Toko Modern',
        warehouse_name: 'Warehouse Surabaya',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        quantity_shipped: 30,
        unit: 'PCS',
        unit_price: 4000,
        total_value: 120000,
        batch_number: 'BATCH-FG-003',
        shipping_method: 'Express Delivery',
        status: 'SHIPPED'
    },
    {
        outbound_number: 'OUT-2024-004',
        outbound_date: new Date('2024-02-02'),
        so_number: 'SO-2024-004',
        customer_name: 'UD Warung Berkah',
        warehouse_name: 'Warehouse Bandung',
        item_code: 'ITM006',
        item_name: 'Consumer Product Z',
        quantity_shipped: 100,
        unit: 'PCS',
        unit_price: 1500,
        total_value: 150000,
        batch_number: 'BATCH-FG-004',
        shipping_method: 'Standard Delivery',
        status: 'SHIPPED'
    },
    {
        outbound_number: 'OUT-2024-005',
        outbound_date: new Date('2024-02-05'),
        so_number: 'SO-2024-005',
        customer_name: 'PT Grosir Nusantara',
        warehouse_name: 'Warehouse Surabaya',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        quantity_shipped: 20,
        unit: 'PCS',
        unit_price: 4000,
        total_value: 80000,
        batch_number: 'BATCH-FG-005',
        shipping_method: 'Express Delivery',
        status: 'SHIPPED'
    }
];

// Purchase Order Report Mock Data
export const MOCK_PURCHASE_ORDER_REPORT = [
    {
        po_number: 'PO-2024-001',
        po_date: new Date('2026-04-15'),
        supplier_name: 'PT Supplier Utama',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PARTIALLY_RECEIVED',
        total_items: 5,
        total_quantity: 150,
        total_value: 75000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-15'),
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'purchasing@company.com',
        created_date: new Date('2026-04-15')
    },
    {
        po_number: 'PO-2024-002',
        po_date: new Date('2026-04-18'),
        supplier_name: 'CV Mitra Sejahtera',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PARTIALLY_RECEIVED',
        total_items: 12,
        total_quantity: 500,
        total_value: 125000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-20'),
        payment_terms: 'Net 45',
        input_method: 'EXCEL',
        created_by: 'purchasing@company.com',
        created_date: new Date('2026-04-18')
    },
    {
        po_number: 'PO-2024-003',
        po_date: new Date('2026-04-20'),
        supplier_name: 'PT Global Trading',
        warehouse_name: 'Warehouse Surabaya',
        status: 'FULLY_RECEIVED',
        total_items: 8,
        total_quantity: 300,
        total_value: 95000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-10'),
        payment_terms: 'Net 30',
        input_method: 'API',
        created_by: 'api-user',
        created_date: new Date('2026-04-20')
    },
    {
        po_number: 'PO-2024-004',
        po_date: new Date('2026-04-22'),
        supplier_name: 'PT Supplier Utama',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PENDING',
        total_items: 3,
        total_quantity: 75,
        total_value: 45000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-25'),
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'purchasing@company.com',
        created_date: new Date('2026-04-22')
    },
    {
        po_number: 'PO-2024-005',
        po_date: new Date('2026-04-25'),
        supplier_name: 'UD Berkah Jaya',
        warehouse_name: 'Warehouse Bandung',
        status: 'CANCELLED',
        total_items: 6,
        total_quantity: 200,
        total_value: 60000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-28'),
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'purchasing@company.com',
        created_date: new Date('2026-04-25')
    }
];

// Sales Order Report Mock Data
export const MOCK_SALES_ORDER_REPORT = [
    {
        so_number: 'SO-2024-001',
        so_date: new Date('2026-04-16'),
        customer_name: 'PT Retail Sejahtera',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PENDING',
        total_items: 4,
        total_quantity: 120,
        total_value: 60000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-16'),
        shipping_method: 'Express Delivery',
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'sales@company.com',
        created_date: new Date('2026-04-16')
    },
    {
        so_number: 'SO-2024-002',
        so_date: new Date('2026-04-19'),
        customer_name: 'CV Distributor Maju',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PARTIALLY_SHIPPED',
        total_items: 10,
        total_quantity: 400,
        total_value: 150000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-22'),
        shipping_method: 'Standard Delivery',
        payment_terms: 'Net 45',
        input_method: 'EXCEL',
        created_by: 'sales@company.com',
        created_date: new Date('2026-04-19')
    },
    {
        so_number: 'SO-2024-003',
        so_date: new Date('2026-04-21'),
        customer_name: 'PT Toko Modern',
        warehouse_name: 'Warehouse Surabaya',
        status: 'FULLY_SHIPPED',
        total_items: 6,
        total_quantity: 200,
        total_value: 85000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-12'),
        shipping_method: 'Express Delivery',
        payment_terms: 'Net 30',
        input_method: 'API',
        created_by: 'api-user',
        created_date: new Date('2026-04-21')
    },
    {
        so_number: 'SO-2024-004',
        so_date: new Date('2026-04-23'),
        customer_name: 'PT Retail Sejahtera',
        warehouse_name: 'Warehouse Jakarta',
        status: 'PENDING',
        total_items: 3,
        total_quantity: 90,
        total_value: 45000000,
        currency: 'IDR',
        delivery_date: new Date('2024-02-26'),
        shipping_method: 'Standard Delivery',
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'sales@company.com',
        created_date: new Date('2026-04-23')
    },
    {
        so_number: 'SO-2024-005',
        so_date: new Date('2026-04-26'),
        customer_name: 'UD Warung Berkah',
        warehouse_name: 'Warehouse Bandung',
        status: 'CANCELLED',
        total_items: 5,
        total_quantity: 150,
        total_value: 55000000,
        currency: 'IDR',
        delivery_date: new Date('2024-03-01'),
        shipping_method: 'Standard Delivery',
        payment_terms: 'Net 30',
        input_method: 'MANUAL',
        created_by: 'sales@company.com',
        created_date: new Date('2026-04-26')
    }
];

// Stock Opname Report Mock Data
export const MOCK_STOCK_OPNAME_REPORT = [
    {
        opname_number: 'OP-2024-001',
        opname_date: new Date('2026-04-15'),
        opname_type: 'PERIODIC',
        warehouse_name: 'Warehouse Jakarta',
        status: 'COMPLETED',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        system_quantity: 100,
        physical_quantity: 98,
        difference: -2,
        unit: 'KG',
        adjustment_reason: 'Physical count variance',
        batch_number: 'BATCH-001',
        created_by: 'warehouse@company.com',
        approved_by: 'manager@company.com'
    },
    {
        opname_number: 'OP-2024-001',
        opname_date: new Date('2026-04-15'),
        opname_type: 'PERIODIC',
        warehouse_name: 'Warehouse Jakarta',
        status: 'COMPLETED',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        system_quantity: 25,
        physical_quantity: 25,
        difference: 0,
        unit: 'PCS',
        adjustment_reason: 'No variance',
        batch_number: 'BATCH-FG-001',
        created_by: 'warehouse@company.com',
        approved_by: 'manager@company.com'
    },
    {
        opname_number: 'OP-2024-002',
        opname_date: new Date('2026-04-18'),
        opname_type: 'SPOT_CHECK',
        warehouse_name: 'Warehouse Jakarta',
        status: 'APPROVED',
        item_code: 'ITM003',
        item_name: 'Component B',
        system_quantity: 200,
        physical_quantity: 195,
        difference: -5,
        unit: 'PCS',
        adjustment_reason: 'Handling damage',
        batch_number: 'BATCH-002',
        created_by: 'warehouse@company.com',
        approved_by: 'manager@company.com'
    },
    {
        opname_number: 'OP-2024-003',
        opname_date: new Date('2026-04-20'),
        opname_type: 'PERIODIC',
        warehouse_name: 'Warehouse Surabaya',
        status: 'COMPLETED',
        item_code: 'ITM005',
        item_name: 'Chemical X',
        system_quantity: 50,
        physical_quantity: 52,
        difference: 2,
        unit: 'LTR',
        adjustment_reason: 'System error correction',
        batch_number: 'BATCH-003',
        created_by: 'warehouse.sby@company.com',
        approved_by: 'manager@company.com'
    },
    {
        opname_number: 'OP-2024-004',
        opname_date: new Date('2026-04-25'),
        opname_type: 'YEAR_END',
        warehouse_name: 'Warehouse Bandung',
        status: 'APPROVED',
        item_code: 'ITM007',
        item_name: 'Packaging Material',
        system_quantity: 1000,
        physical_quantity: 990,
        difference: -10,
        unit: 'PCS',
        adjustment_reason: 'Year-end adjustment',
        batch_number: 'BATCH-004',
        created_by: 'warehouse.bdg@company.com',
        approved_by: 'manager@company.com'
    }
];

// Stock Adjustment Report Mock Data
export const MOCK_STOCK_ADJUSTMENT_REPORT = [
    {
        adjustment_number: 'ADJ-2024-001',
        adjustment_date: new Date('2026-04-15'),
        warehouse_name: 'Warehouse Jakarta',
        status: 'APPROVED',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        adjustment_type: 'DECREASE',
        quantity: -5,
        before_quantity: 50,
        after_quantity: 45,
        unit: 'KG',
        reason: 'Physical count adjustment',
        reason_category: 'PHYSICAL_COUNT',
        batch_number: 'BATCH-001',
        submitted_by: 'warehouse@company.com',
        approved_by: 'manager@company.com',
        approved_date: new Date('2026-04-18T14:20:00')
    },
    {
        adjustment_number: 'ADJ-2024-002',
        adjustment_date: new Date('2026-04-18'),
        warehouse_name: 'Warehouse Jakarta',
        status: 'APPROVED',
        item_code: 'ITM003',
        item_name: 'Component B',
        adjustment_type: 'DECREASE',
        quantity: -3,
        before_quantity: 200,
        after_quantity: 197,
        unit: 'PCS',
        reason: 'Damaged goods',
        reason_category: 'DAMAGE',
        batch_number: 'BATCH-002',
        submitted_by: 'warehouse@company.com',
        approved_by: 'manager@company.com',
        approved_date: new Date('2026-04-18T14:20:00')
    },
    {
        adjustment_number: 'ADJ-2024-003',
        adjustment_date: new Date('2026-04-20'),
        warehouse_name: 'Warehouse Surabaya',
        status: 'APPROVED',
        item_code: 'ITM005',
        item_name: 'Chemical X',
        adjustment_type: 'INCREASE',
        quantity: 2,
        before_quantity: 50,
        after_quantity: 52,
        unit: 'LTR',
        reason: 'System error correction',
        reason_category: 'SYSTEM_ERROR',
        batch_number: 'BATCH-003',
        submitted_by: 'warehouse.sby@company.com',
        approved_by: 'manager@company.com',
        approved_date: new Date('2026-04-20T16:45:00')
    },
    {
        adjustment_number: 'ADJ-2024-004',
        adjustment_date: new Date('2026-04-22'),
        warehouse_name: 'Warehouse Jakarta',
        status: 'REJECTED',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        adjustment_type: 'DECREASE',
        quantity: -2,
        before_quantity: 25,
        after_quantity: 23,
        unit: 'PCS',
        reason: 'Theft adjustment',
        reason_category: 'THEFT',
        batch_number: 'BATCH-FG-001',
        submitted_by: 'warehouse@company.com',
        approved_by: 'manager@company.com',
        approved_date: new Date('2026-04-22T17:15:00')
    },
    {
        adjustment_number: 'ADJ-2024-005',
        adjustment_date: new Date('2026-04-25'),
        warehouse_name: 'Warehouse Bandung',
        status: 'PENDING',
        item_code: 'ITM007',
        item_name: 'Packaging Material',
        adjustment_type: 'DECREASE',
        quantity: -50,
        before_quantity: 1000,
        after_quantity: 950,
        unit: 'PCS',
        reason: 'Expired products',
        reason_category: 'EXPIRY',
        batch_number: 'BATCH-004',
        submitted_by: 'warehouse.bdg@company.com',
        approved_by: null,
        approved_date: null
    }
];

/**
 * Get mock report data based on report type
 */
export function getMockReportData(reportType: string, filters?: any): any[] {
    let data: any[] = [];

    switch (reportType) {
        case 'inbound':
            data = [...MOCK_INBOUND_REPORT];
            break;
        case 'outbound':
            data = [...MOCK_OUTBOUND_REPORT];
            break;
        case 'purchase_order':
            data = [...MOCK_PURCHASE_ORDER_REPORT];
            break;
        case 'sales_order':
            data = [...MOCK_SALES_ORDER_REPORT];
            break;
        case 'stock_opname':
            data = [...MOCK_STOCK_OPNAME_REPORT];
            break;
        case 'stock_adjustment':
            data = [...MOCK_STOCK_ADJUSTMENT_REPORT];
            break;
        default:
            return [];
    }

    // Apply date filters if provided
    if (filters?.start_date) {
        const startDate = new Date(filters.start_date);
        data = data.filter(item => {
            const itemDate = getItemDate(item, reportType);
            return itemDate >= startDate;
        });
    }

    if (filters?.end_date) {
        const endDate = new Date(filters.end_date);
        data = data.filter(item => {
            const itemDate = getItemDate(item, reportType);
            return itemDate <= endDate;
        });
    }

    // Apply warehouse filter if provided
    if (filters?.warehouse_id) {
        data = data.filter(item => item.warehouse_name.includes(getWarehouseName(filters.warehouse_id)));
    }

    return data;
}

/**
 * Get date field from item based on report type
 */
function getItemDate(item: any, reportType: string): Date {
    switch (reportType) {
        case 'inbound':
            return new Date(item.inbound_date);
        case 'outbound':
            return new Date(item.outbound_date);
        case 'purchase_order':
            return new Date(item.po_date);
        case 'sales_order':
            return new Date(item.so_date);
        case 'stock_opname':
            return new Date(item.opname_date);
        case 'stock_adjustment':
            return new Date(item.adjustment_date);
        default:
            return new Date();
    }
}

/**
 * Get warehouse name by ID
 */
function getWarehouseName(warehouseId: string): string {
    const warehouses: Record<string, string> = {
        'wh-001': 'Jakarta',
        'wh-002': 'Surabaya',
        'wh-003': 'Bandung'
    };
    return warehouses[warehouseId] || '';
}

/**
 * Get report columns based on report type
 */
export function getReportColumns(reportType: string): string[] {
    switch (reportType) {
        case 'inbound':
            return ['inbound_number', 'inbound_date', 'po_number', 'supplier_name', 'item_code', 'item_name', 'quantity_received', 'unit', 'total_value', 'status'];
        case 'outbound':
            return ['outbound_number', 'outbound_date', 'so_number', 'customer_name', 'item_code', 'item_name', 'quantity_shipped', 'unit', 'total_value', 'status'];
        case 'purchase_order':
            return ['po_number', 'po_date', 'supplier_name', 'status', 'total_items', 'total_quantity', 'total_value', 'delivery_date', 'input_method'];
        case 'sales_order':
            return ['so_number', 'so_date', 'customer_name', 'status', 'total_items', 'total_quantity', 'total_value', 'delivery_date', 'input_method'];
        case 'stock_opname':
            return ['opname_number', 'opname_date', 'opname_type', 'warehouse_name', 'item_code', 'item_name', 'system_quantity', 'physical_quantity', 'difference', 'status'];
        case 'stock_adjustment':
            return ['adjustment_number', 'adjustment_date', 'warehouse_name', 'item_code', 'item_name', 'adjustment_type', 'quantity', 'reason', 'status'];
        default:
            return [];
    }
}