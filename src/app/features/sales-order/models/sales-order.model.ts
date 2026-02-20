/**
 * Sales Order Data Models
 * 
 * This file contains all data models, interfaces, and enums for the Sales Order module.
 * These models support multi-method input (Excel, API, Manual) and integration with Outbound transactions.
 */

/**
 * Sales Order Status
 * Tracks the fulfillment status of sales orders
 */
export enum SOStatus {
    PENDING = 'PENDING',
    PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
    FULLY_SHIPPED = 'FULLY_SHIPPED',
    CANCELLED = 'CANCELLED'
}

/**
 * Input Method
 * Indicates how the sales order was created
 * Reused from Purchase Order module
 */
export enum InputMethod {
    EXCEL = 'EXCEL',
    API = 'API',
    MANUAL = 'MANUAL'
}

/**
 * Sales Order Header
 * Main sales order entity containing header-level information
 */
export interface SalesOrderHeader {
    id: string;
    soNumber: string;
    soDate: Date;
    customerId: string;
    customerCode: string;
    customerName: string;
    warehouseId: string;
    warehouseCode: string;
    warehouseName: string;
    status: SOStatus;
    inputMethod: InputMethod;
    totalItems: number;
    totalQuantity: number;
    totalValue: number;
    currency: string;
    exchangeRate?: number;
    deliveryDate?: Date;
    shippingAddress: string;
    shippingMethod?: string;
    paymentTerms?: string;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
}

/**
 * Sales Order Detail
 * Line item details for sales orders
 */
export interface SalesOrderDetail {
    id: string;
    salesOrderId: string;
    lineNumber: number;
    itemId: string;
    itemCode: string;
    itemName: string;
    hsCode: string;
    orderedQuantity: number;
    shippedQuantity: number;
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
    validRows: SalesOrderLine[];
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
 * Sales Order Line
 * Temporary structure used during Excel/API import before saving
 */
export interface SalesOrderLine {
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
 * Sales Order Filters
 * Filter criteria for sales order list views
 */
export interface SOFilters {
    searchQuery?: string;
    status?: SOStatus[];
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * Sales Order Lookup Criteria
 * Search criteria for SO lookup in Outbound transaction forms
 */
export interface SOLookupCriteria {
    soNumber?: string;
    customerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
    status?: SOStatus[];
}
