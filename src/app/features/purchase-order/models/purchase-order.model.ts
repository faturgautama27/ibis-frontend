/**
 * Purchase Order Data Models
 * 
 * This file contains all data models, interfaces, and enums for the Purchase Order module.
 * These models support multi-method input (Excel, API, Manual) and integration with Inbound transactions.
 */

/**
 * Purchase Order Status
 * Tracks the fulfillment status of purchase orders
 */
export enum POStatus {
    PENDING = 'PENDING',
    PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
    FULLY_RECEIVED = 'FULLY_RECEIVED',
    CANCELLED = 'CANCELLED'
}

/**
 * Input Method
 * Indicates how the purchase order was created
 */
export enum InputMethod {
    EXCEL = 'EXCEL',
    API = 'API',
    MANUAL = 'MANUAL'
}

/**
 * Purchase Order Header
 * Main purchase order entity containing header-level information
 */
export interface PurchaseOrderHeader {
    id: string;
    poNumber: string;
    poDate: Date;
    supplierId: string;
    supplierCode: string;
    supplierName: string;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    status: POStatus;
    inputMethod: InputMethod;
    totalItems: number;
    totalQuantity: number;
    totalValue: number;
    currency: string;
    exchangeRate?: number;
    deliveryDate?: Date;
    paymentTerms?: string;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
}

/**
 * Purchase Order Detail
 * Line item details for purchase orders
 */
export interface PurchaseOrderDetail {
    id: string;
    purchaseOrderId: string;
    lineNumber: number;
    itemId: string;
    itemCode: string;
    itemName: string;
    hsCode: string;
    orderedQuantity: number;
    receivedQuantity: number;
    remainingQuantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    taxRate?: number;
    taxAmount?: number;
    deliveryDate?: Date;
    notes?: string;
}

/**
 * Excel Import Result
 * Result of Excel file parsing and validation
 */
export interface ExcelImportResult {
    success: boolean;
    validRows: PurchaseOrderLine[];
    errors: ExcelImportError[];
    totalRows: number;
    validCount: number;
    errorCount: number;
}

/**
 * Excel Import Error
 * Detailed error information for failed Excel imports
 */
export interface ExcelImportError {
    row: number;
    column: string;
    value: any;
    message: string;
}

/**
 * Purchase Order Line
 * Temporary structure used during Excel/API import before saving
 */
export interface PurchaseOrderLine {
    lineNumber: number;
    itemCode: string;
    itemName: string;
    hsCode: string;
    orderedQuantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    deliveryDate?: Date;
    notes?: string;
}

/**
 * Purchase Order Filters
 * Filter criteria for purchase order list views
 */
export interface POFilters {
    searchQuery?: string;
    status?: POStatus[];
    supplierId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * Purchase Order Lookup Criteria
 * Search criteria for PO lookup in Inbound transaction forms
 */
export interface POLookupCriteria {
    poNumber?: string;
    supplierId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: POStatus[];
}
