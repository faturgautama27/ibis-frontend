/**
 * Mock Traceability Data
 * Used for development and testing purposes
 */

export interface TraceabilityMovement {
    id: string;
    item_id: string;
    item_code: string;
    item_name: string;
    movement_type: string;
    movement_date: Date;
    reference_type: string;
    reference_number: string;
    quantity_change: number;
    quantity_after: number;
    unit: string;
    batch_number?: string;
    warehouse_id: string;
    warehouse_name: string;
    rfid_tag?: string;
}

export interface ProductionOrder {
    id: string;
    wo_number: string;
    wo_date: Date;
    output_item_id: string;
    output_item_name: string;
    output_quantity: number;
    output_unit: string;
    status: string;
    materials: ProductionMaterial[];
}

export interface ProductionMaterial {
    material_item_id: string;
    material_item_name: string;
    quantity_used: number;
    unit: string;
    batch_number?: string;
}

export const MOCK_TRACEABILITY_MOVEMENTS: TraceabilityMovement[] = [
    {
        id: 'trace-001',
        item_id: 'item-001',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        movement_type: 'INBOUND',
        movement_date: new Date('2024-01-15T08:30:00'),
        reference_type: 'PURCHASE_ORDER',
        reference_number: 'PO-2024-001',
        quantity_change: 100,
        quantity_after: 100,
        unit: 'KG',
        batch_number: 'BATCH-001',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-001-A'
    },
    {
        id: 'trace-002',
        item_id: 'item-001',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        movement_type: 'PRODUCTION_INPUT',
        movement_date: new Date('2024-01-16T10:15:00'),
        reference_type: 'WORK_ORDER',
        reference_number: 'WO-2024-001',
        quantity_change: -50,
        quantity_after: 50,
        unit: 'KG',
        batch_number: 'BATCH-001',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-001-A'
    },
    {
        id: 'trace-003',
        item_id: 'item-002',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        movement_type: 'PRODUCTION_OUTPUT',
        movement_date: new Date('2024-01-16T14:30:00'),
        reference_type: 'WORK_ORDER',
        reference_number: 'WO-2024-001',
        quantity_change: 25,
        quantity_after: 25,
        unit: 'PCS',
        batch_number: 'BATCH-FG-001',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-002-X'
    },
    {
        id: 'trace-004',
        item_id: 'item-002',
        item_code: 'ITM002',
        item_name: 'Finished Product X',
        movement_type: 'OUTBOUND',
        movement_date: new Date('2024-01-18T09:45:00'),
        reference_type: 'SALES_ORDER',
        reference_number: 'SO-2024-001',
        quantity_change: -15,
        quantity_after: 10,
        unit: 'PCS',
        batch_number: 'BATCH-FG-001',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-002-X'
    },
    {
        id: 'trace-005',
        item_id: 'item-003',
        item_code: 'ITM003',
        item_name: 'Component B',
        movement_type: 'INBOUND',
        movement_date: new Date('2024-01-20T11:00:00'),
        reference_type: 'PURCHASE_ORDER',
        reference_number: 'PO-2024-002',
        quantity_change: 200,
        quantity_after: 200,
        unit: 'PCS',
        batch_number: 'BATCH-002',
        warehouse_id: 'wh-002',
        warehouse_name: 'Warehouse Surabaya',
        rfid_tag: 'RFID-003-B'
    },
    {
        id: 'trace-006',
        item_id: 'item-003',
        item_code: 'ITM003',
        item_name: 'Component B',
        movement_type: 'TRANSFER_OUT',
        movement_date: new Date('2024-01-21T13:20:00'),
        reference_type: 'TRANSFER_ORDER',
        reference_number: 'TO-2024-001',
        quantity_change: -100,
        quantity_after: 100,
        unit: 'PCS',
        batch_number: 'BATCH-002',
        warehouse_id: 'wh-002',
        warehouse_name: 'Warehouse Surabaya',
        rfid_tag: 'RFID-003-B'
    },
    {
        id: 'trace-007',
        item_id: 'item-003',
        item_code: 'ITM003',
        item_name: 'Component B',
        movement_type: 'TRANSFER_IN',
        movement_date: new Date('2024-01-21T15:30:00'),
        reference_type: 'TRANSFER_ORDER',
        reference_number: 'TO-2024-001',
        quantity_change: 100,
        quantity_after: 100,
        unit: 'PCS',
        batch_number: 'BATCH-002',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-003-B'
    },
    {
        id: 'trace-008',
        item_id: 'item-001',
        item_code: 'ITM001',
        item_name: 'Raw Material A',
        movement_type: 'ADJUSTMENT',
        movement_date: new Date('2024-01-25T16:45:00'),
        reference_type: 'STOCK_ADJUSTMENT',
        reference_number: 'ADJ-2024-001',
        quantity_change: -5,
        quantity_after: 45,
        unit: 'KG',
        batch_number: 'BATCH-001',
        warehouse_id: 'wh-001',
        warehouse_name: 'Warehouse Jakarta',
        rfid_tag: 'RFID-001-A'
    }
];

export const MOCK_PRODUCTION_ORDERS: ProductionOrder[] = [
    {
        id: 'wo-001',
        wo_number: 'WO-2024-001',
        wo_date: new Date('2024-01-16T08:00:00'),
        output_item_id: 'item-002',
        output_item_name: 'Finished Product X',
        output_quantity: 25,
        output_unit: 'PCS',
        status: 'COMPLETED',
        materials: [
            {
                material_item_id: 'item-001',
                material_item_name: 'Raw Material A',
                quantity_used: 50,
                unit: 'KG',
                batch_number: 'BATCH-001'
            },
            {
                material_item_id: 'item-003',
                material_item_name: 'Component B',
                quantity_used: 25,
                unit: 'PCS',
                batch_number: 'BATCH-002'
            }
        ]
    },
    {
        id: 'wo-002',
        wo_number: 'WO-2024-002',
        wo_date: new Date('2024-01-22T09:30:00'),
        output_item_id: 'item-004',
        output_item_name: 'Finished Product Y',
        output_quantity: 15,
        output_unit: 'PCS',
        status: 'IN_PROGRESS',
        materials: [
            {
                material_item_id: 'item-001',
                material_item_name: 'Raw Material A',
                quantity_used: 30,
                unit: 'KG',
                batch_number: 'BATCH-001'
            },
            {
                material_item_id: 'item-005',
                material_item_name: 'Component C',
                quantity_used: 15,
                unit: 'PCS',
                batch_number: 'BATCH-003'
            }
        ]
    },
    {
        id: 'wo-003',
        wo_number: 'WO-2024-003',
        wo_date: new Date('2024-01-28T10:15:00'),
        output_item_id: 'item-002',
        output_item_name: 'Finished Product X',
        output_quantity: 40,
        output_unit: 'PCS',
        status: 'PLANNED',
        materials: [
            {
                material_item_id: 'item-001',
                material_item_name: 'Raw Material A',
                quantity_used: 80,
                unit: 'KG',
                batch_number: 'BATCH-004'
            },
            {
                material_item_id: 'item-003',
                material_item_name: 'Component B',
                quantity_used: 40,
                unit: 'PCS',
                batch_number: 'BATCH-002'
            }
        ]
    }
];

/**
 * Get mock traceability movements for forward trace
 */
export function getMockForwardTrace(itemId: string, batchNumber?: string): TraceabilityMovement[] {
    let movements = MOCK_TRACEABILITY_MOVEMENTS.filter(m => m.item_id === itemId);

    if (batchNumber) {
        movements = movements.filter(m => m.batch_number === batchNumber);
    }

    return movements.sort((a, b) => new Date(a.movement_date).getTime() - new Date(b.movement_date).getTime());
}

/**
 * Get mock traceability movements for backward trace
 */
export function getMockBackwardTrace(itemId: string, batchNumber?: string): TraceabilityMovement[] {
    let movements = MOCK_TRACEABILITY_MOVEMENTS.filter(m => m.item_id === itemId);

    if (batchNumber) {
        movements = movements.filter(m => m.batch_number === batchNumber);
    }

    return movements.sort((a, b) => new Date(b.movement_date).getTime() - new Date(a.movement_date).getTime());
}

/**
 * Get mock traceability movements by RFID
 */
export function getMockTraceByRFID(rfidTag: string): TraceabilityMovement[] {
    return MOCK_TRACEABILITY_MOVEMENTS
        .filter(m => m.rfid_tag === rfidTag)
        .sort((a, b) => new Date(a.movement_date).getTime() - new Date(b.movement_date).getTime());
}

/**
 * Get mock production history for an item
 */
export function getMockProductionHistory(itemId: string): ProductionOrder[] {
    return MOCK_PRODUCTION_ORDERS.filter(wo =>
        wo.output_item_id === itemId ||
        wo.materials.some(m => m.material_item_id === itemId)
    );
}

/**
 * Get all mock RFID tags for testing
 */
export function getMockRFIDTags(): string[] {
    return [...new Set(MOCK_TRACEABILITY_MOVEMENTS
        .filter(m => m.rfid_tag)
        .map(m => m.rfid_tag!)
    )];
}

/**
 * Get all mock item IDs for testing
 */
export function getMockItemIds(): string[] {
    return [...new Set(MOCK_TRACEABILITY_MOVEMENTS.map(m => m.item_id))];
}

/**
 * Get all mock batch numbers for testing
 */
export function getMockBatchNumbers(): string[] {
    return [...new Set(MOCK_TRACEABILITY_MOVEMENTS
        .filter(m => m.batch_number)
        .map(m => m.batch_number!)
    )];
}