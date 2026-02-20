# Design Document: IBIS System Enhancements

## Overview

This design document outlines the technical implementation for six major enhancements to the IBIS (Integrated Bonded Inventory System). These enhancements modernize the inventory management workflow by separating item categories, introducing flexible order input methods, implementing comprehensive order tracking, and adding robust stock adjustment capabilities with approval workflows.

### Enhancement Summary

1. **Item Master Separation**: Distinguish Raw Materials from Finished Goods at the data model level
2. **Purchase Order Multi-Input**: Support Excel upload, API integration, and manual entry
3. **Inbound-PO Integration**: Link inbound transactions to purchase orders for traceability
4. **Sales Order Module**: Complete sales order management with multi-input support
5. **Outbound-SO Integration**: Link outbound transactions to sales orders for fulfillment tracking
6. **Stock Adjustment Workflow**: Approval-based inventory corrections with comprehensive audit trail

### Technology Stack

- **Frontend Framework**: Angular 20.3.0 with standalone components
- **UI Library**: PrimeNG 20.4.0
- **Styling**: TailwindCSS 4.1.12
- **State Management**: NgRx 20.1.0
- **HTTP Client**: Angular HttpClient with interceptors
- **File Processing**: SheetJS (xlsx) for Excel handling
- **Validation**: Angular Reactive Forms with custom validators

## Architecture

### High-Level Architecture

The system follows a feature-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Item       │  │  Purchase    │  │   Sales      │     │
│  │   Master     │  │   Order      │  │   Order      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Inbound    │  │  Outbound    │  │   Stock      │     │
│  │ Transaction  │  │ Transaction  │  │ Adjustment   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    State Management (NgRx)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Items   │  │   PO     │  │   SO     │  │  Stock   │   │
│  │  Store   │  │  Store   │  │  Store   │  │  Store   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Item       │  │  Order       │  │  Excel       │     │
│  │   Service    │  │  Service     │  │  Service     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Transaction  │  │  Approval    │  │   API        │     │
│  │   Service    │  │  Service     │  │ Integration  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│  RESTful endpoints with JWT authentication                  │
└─────────────────────────────────────────────────────────────┘
```

### Feature Module Structure

Each feature follows a consistent structure:

```
features/{feature-name}/
├── components/
│   ├── {feature}-list/
│   ├── {feature}-form/
│   ├── {feature}-detail/
│   └── shared/
├── models/
│   └── {feature}.model.ts
├── services/
│   └── {feature}.service.ts
└── {feature}.routes.ts
```

### State Management Pattern

NgRx store structure for each feature:

```
store/{feature}/
├── {feature}.actions.ts    # Action definitions
├── {feature}.effects.ts    # Side effects (API calls)
├── {feature}.reducer.ts    # State mutations
├── {feature}.selectors.ts  # State queries
├── {feature}.state.ts      # State interface
└── index.ts                # Public API
```


## Components and Interfaces

### 1. Item Master Enhancement

#### Components

**ItemListComponent**
- Displays items with category filtering (Raw Material / Finished Good)
- Implements PrimeNG Table with lazy loading
- Provides search, filter, and sort capabilities
- Separate tabs or toggle for Raw Material vs Finished Good views

**ItemFormComponent**
- Reusable form for create/edit operations
- Category selection locked after creation
- Reactive forms with validation
- Integration with item service

**ItemCategoryGuard**
- Prevents category changes after item creation
- Validates item type consistency in transactions

#### Key Interfaces

```typescript
interface ItemMasterEnhancement {
  // Extends existing Item model
  category: ItemCategory; // 'RAW_MATERIAL' | 'FINISHED_GOOD'
  categoryLocked: boolean; // True after creation
}

interface ItemFilters {
  category?: ItemCategory;
  searchQuery?: string;
  active?: boolean;
}
```

### 2. Purchase Order Module

#### Components

**PurchaseOrderListComponent**
- Displays all purchase orders with status indicators
- Filters by status, date range, supplier
- Actions: create, view, edit, delete

**PurchaseOrderFormComponent**
- Multi-method input selector (Excel/API/Manual)
- Dynamic form based on selected method
- Preview panel for Excel/API data
- Validation and error display

**ExcelUploadComponent**
- File upload with drag-and-drop
- Template download button
- Progress indicator
- Error report display

**ApiIntegrationComponent**
- Connection status indicator
- Manual trigger for API data fetch
- Data preview grid
- Mapping configuration

**ManualEntryComponent**
- Header information form
- Line items table with add/remove
- Item lookup integration
- Quantity and price calculations

**PurchaseOrderDetailComponent**
- Read-only view of PO details
- Linked inbound transactions display
- Status history timeline
- Print/export functionality

#### Key Interfaces

```typescript
interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: Date;
  supplierId: string;
  supplierCode: string;
  supplierName: string;
  status: POStatus;
  inputMethod: InputMethod;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  currency: string;
  deliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}

interface PurchaseOrderLine {
  id: string;
  purchaseOrderId: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  hsCode: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDate?: Date;
  notes?: string;
}

enum POStatus {
  PENDING = 'PENDING',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  FULLY_RECEIVED = 'FULLY_RECEIVED',
  CANCELLED = 'CANCELLED'
}

enum InputMethod {
  EXCEL = 'EXCEL',
  API = 'API',
  MANUAL = 'MANUAL'
}

interface ExcelImportResult {
  success: boolean;
  validRows: PurchaseOrderLine[];
  errors: ExcelImportError[];
  totalRows: number;
  validCount: number;
  errorCount: number;
}

interface ExcelImportError {
  row: number;
  column: string;
  value: any;
  message: string;
}
```


### 3. Inbound Transaction Enhancement

#### Components

**InboundFormEnhancedComponent**
- Extends existing inbound form
- PO lookup dialog integration
- Auto-population from selected PO
- Manual override capability
- PO reference display

**PurchaseOrderLookupComponent**
- Reusable lookup dialog
- Search by PO number, supplier, date
- Grid display with selection
- Filter by status (exclude fully received)

#### Key Interfaces

```typescript
interface InboundTransactionEnhanced {
  // Extends existing InboundHeader
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  autoPopulatedFromPO: boolean;
}

interface POLookupCriteria {
  poNumber?: string;
  supplierId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: POStatus[];
}
```

### 4. Sales Order Module

#### Components

**SalesOrderListComponent**
- Displays all sales orders with status indicators
- Filters by status, date range, customer
- Actions: create, view, edit, delete

**SalesOrderFormComponent**
- Multi-method input selector (Excel/API/Manual)
- Dynamic form based on selected method
- Preview panel for Excel/API data
- Validation and error display

**SalesOrderDetailComponent**
- Read-only view of SO details
- Linked outbound transactions display
- Status history timeline
- Print/export functionality

#### Key Interfaces

```typescript
interface SalesOrder {
  id: string;
  soNumber: string;
  soDate: Date;
  customerId: string;
  customerCode: string;
  customerName: string;
  status: SOStatus;
  inputMethod: InputMethod;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  currency: string;
  deliveryDate?: Date;
  shippingAddress?: string;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
}

interface SalesOrderLine {
  id: string;
  salesOrderId: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  hsCode: string;
  orderedQuantity: number;
  shippedQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDate?: Date;
  notes?: string;
}

enum SOStatus {
  PENDING = 'PENDING',
  PARTIALLY_SHIPPED = 'PARTIALLY_SHIPPED',
  FULLY_SHIPPED = 'FULLY_SHIPPED',
  CANCELLED = 'CANCELLED'
}
```

### 5. Outbound Transaction Enhancement

#### Components

**OutboundFormEnhancedComponent**
- Extends existing outbound form
- SO lookup dialog integration
- Auto-population from selected SO
- Manual override capability
- SO reference display

**SalesOrderLookupComponent**
- Reusable lookup dialog
- Search by SO number, customer, date
- Grid display with selection
- Filter by status (exclude fully shipped)

#### Key Interfaces

```typescript
interface OutboundTransactionEnhanced {
  // Extends existing OutboundHeader
  salesOrderId?: string;
  salesOrderNumber?: string;
  autoPopulatedFromSO: boolean;
}

interface SOLookupCriteria {
  soNumber?: string;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: SOStatus[];
}
```


### 6. Stock Adjustment Module

#### Components

**StockAdjustmentListComponent**
- Displays all adjustments with approval status
- Filters by status, date range, item, user
- Actions: create, view, approve/reject (based on permissions)
- Status badges with color coding

**StockAdjustmentFormComponent**
- Item lookup and selection
- Adjustment type selector (increase/decrease)
- Quantity input with validation
- Reason dropdown (predefined + custom)
- Notes textarea
- Submit for approval button

**StockAdjustmentDetailComponent**
- Read-only view of adjustment details
- Approval history timeline
- Before/after quantity display
- Audit trail information

**StockAdjustmentApprovalComponent**
- Pending adjustments queue
- Approval/rejection actions
- Comment input for approval decision
- Batch approval capability

**StockAdjustmentAuditComponent**
- Comprehensive audit trail view
- Filters by date, item, user, action
- Export to Excel functionality
- Timeline visualization

#### Key Interfaces

```typescript
interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  adjustmentDate: Date;
  itemId: string;
  itemCode: string;
  itemName: string;
  adjustmentType: AdjustmentType;
  quantity: number;
  beforeQuantity: number;
  afterQuantity?: number;
  reason: string;
  reasonCategory: ReasonCategory;
  notes?: string;
  status: AdjustmentStatus;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
  createdAt: Date;
  updatedAt?: Date;
}

enum AdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE'
}

enum ReasonCategory {
  PHYSICAL_COUNT = 'PHYSICAL_COUNT',
  DAMAGE = 'DAMAGE',
  EXPIRY = 'EXPIRY',
  THEFT = 'THEFT',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OTHER = 'OTHER'
}

enum AdjustmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface AdjustmentAuditEntry {
  id: string;
  adjustmentId: string;
  action: AuditAction;
  performedBy: string;
  performedAt: Date;
  beforeStatus?: AdjustmentStatus;
  afterStatus?: AdjustmentStatus;
  beforeQuantity?: number;
  afterQuantity?: number;
  comments?: string;
  ipAddress?: string;
}

enum AuditAction {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  VIEWED = 'VIEWED'
}
```


## Data Models

### Enhanced Item Model

```typescript
export enum ItemCategory {
  RAW_MATERIAL = 'RAW_MATERIAL',
  FINISHED_GOOD = 'FINISHED_GOOD'
}

export interface ItemEnhanced extends Item {
  category: ItemCategory;
  categoryLocked: boolean;
  categoryLockedAt?: Date;
  categoryLockedBy?: string;
}

// Validation: category cannot be changed after creation
// Validation: RAW_MATERIAL items can only be used in Purchase Orders
// Validation: FINISHED_GOOD items can only be used in Sales Orders
```

### Purchase Order Models

```typescript
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
```

### Sales Order Models

```typescript
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
```

### Transaction Enhancement Models

```typescript
export interface InboundHeaderEnhanced extends InboundHeader {
  purchaseOrderId?: string;
  purchaseOrderNumber?: string;
  autoPopulatedFromPO: boolean;
  poLinkDate?: Date;
  poLinkBy?: string;
}

export interface OutboundHeaderEnhanced extends OutboundHeader {
  salesOrderId?: string;
  salesOrderNumber?: string;
  autoPopulatedFromSO: boolean;
  soLinkDate?: Date;
  soLinkBy?: string;
}
```

### Stock Adjustment Models

```typescript
export interface StockAdjustmentHeader {
  id: string;
  adjustmentNumber: string;
  adjustmentDate: Date;
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  status: AdjustmentStatus;
  totalItems: number;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComments?: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface StockAdjustmentDetail {
  id: string;
  adjustmentHeaderId: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  adjustmentType: AdjustmentType;
  quantity: number;
  beforeQuantity: number;
  afterQuantity?: number;
  reason: string;
  reasonCategory: ReasonCategory;
  notes?: string;
}

export interface StockAdjustmentAudit {
  id: string;
  adjustmentId: string;
  action: AuditAction;
  performedBy: string;
  performedByName: string;
  performedAt: Date;
  beforeStatus?: AdjustmentStatus;
  afterStatus?: AdjustmentStatus;
  beforeQuantity?: number;
  afterQuantity?: number;
  comments?: string;
  ipAddress?: string;
  userAgent?: string;
}
```


## State Management

### NgRx Store Structure

#### Purchase Order Store

```typescript
// store/purchase-order/purchase-order.state.ts
export interface PurchaseOrderState {
  orders: PurchaseOrderHeader[];
  selectedOrder: PurchaseOrderHeader | null;
  orderDetails: { [orderId: string]: PurchaseOrderDetail[] };
  loading: boolean;
  saving: boolean;
  error: string | null;
  filters: POFilters;
  pagination: PaginationState;
}

export interface POFilters {
  searchQuery?: string;
  status?: POStatus[];
  supplierId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Actions
export const PurchaseOrderActions = {
  loadOrders: createAction('[PO] Load Orders', props<{ filters?: POFilters }>()),
  loadOrdersSuccess: createAction('[PO] Load Orders Success', props<{ orders: PurchaseOrderHeader[] }>()),
  loadOrdersFailure: createAction('[PO] Load Orders Failure', props<{ error: string }>()),
  
  createOrder: createAction('[PO] Create Order', props<{ order: CreatePurchaseOrderDto }>()),
  createOrderSuccess: createAction('[PO] Create Order Success', props<{ order: PurchaseOrderHeader }>()),
  createOrderFailure: createAction('[PO] Create Order Failure', props<{ error: string }>()),
  
  updateOrderStatus: createAction('[PO] Update Status', props<{ orderId: string, status: POStatus }>()),
  // ... additional actions
};
```

#### Sales Order Store

```typescript
// store/sales-order/sales-order.state.ts
export interface SalesOrderState {
  orders: SalesOrderHeader[];
  selectedOrder: SalesOrderHeader | null;
  orderDetails: { [orderId: string]: SalesOrderDetail[] };
  loading: boolean;
  saving: boolean;
  error: string | null;
  filters: SOFilters;
  pagination: PaginationState;
}

export interface SOFilters {
  searchQuery?: string;
  status?: SOStatus[];
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
```

#### Stock Adjustment Store

```typescript
// store/stock-adjustment/stock-adjustment.state.ts
export interface StockAdjustmentState {
  adjustments: StockAdjustmentHeader[];
  selectedAdjustment: StockAdjustmentHeader | null;
  adjustmentDetails: { [adjustmentId: string]: StockAdjustmentDetail[] };
  auditTrail: { [adjustmentId: string]: StockAdjustmentAudit[] };
  pendingApprovals: StockAdjustmentHeader[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  filters: AdjustmentFilters;
}

export interface AdjustmentFilters {
  status?: AdjustmentStatus[];
  itemId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  submittedBy?: string;
}
```

### Effects Pattern

```typescript
// Example: Purchase Order Effects
@Injectable()
export class PurchaseOrderEffects {
  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseOrderActions.loadOrders),
      switchMap(({ filters }) =>
        this.purchaseOrderService.getOrders(filters).pipe(
          map(orders => PurchaseOrderActions.loadOrdersSuccess({ orders })),
          catchError(error => of(PurchaseOrderActions.loadOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PurchaseOrderActions.createOrder),
      exhaustMap(({ order }) =>
        this.purchaseOrderService.createOrder(order).pipe(
          map(createdOrder => {
            this.notificationService.success('Purchase Order created successfully');
            return PurchaseOrderActions.createOrderSuccess({ order: createdOrder });
          }),
          catchError(error => {
            this.notificationService.error('Failed to create Purchase Order');
            return of(PurchaseOrderActions.createOrderFailure({ error: error.message }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private purchaseOrderService: PurchaseOrderService,
    private notificationService: NotificationService
  ) {}
}
```


## Service Layer Design

### Excel Service

```typescript
@Injectable({ providedIn: 'root' })
export class ExcelService {
  /**
   * Parse Excel file and convert to JSON
   */
  parseExcelFile<T>(file: File, mapping: ExcelColumnMapping): Observable<ExcelParseResult<T>> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(worksheet);
          
          const result = this.validateAndTransform<T>(data, mapping);
          observer.next(result);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };
      reader.readAsBinaryString(file);
    });
  }

  /**
   * Generate Excel template with headers and sample data
   */
  generateTemplate(templateConfig: ExcelTemplateConfig): void {
    const worksheet = XLSX.utils.json_to_sheet(templateConfig.sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, templateConfig.sheetName);
    XLSX.writeFile(workbook, templateConfig.fileName);
  }

  /**
   * Export error report to Excel
   */
  exportErrorReport(errors: ExcelImportError[], fileName: string): void {
    const worksheet = XLSX.utils.json_to_sheet(errors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');
    XLSX.writeFile(workbook, fileName);
  }

  private validateAndTransform<T>(data: any[], mapping: ExcelColumnMapping): ExcelParseResult<T> {
    const validRows: T[] = [];
    const errors: ExcelImportError[] = [];

    data.forEach((row, index) => {
      const validationResult = this.validateRow(row, mapping, index + 2); // +2 for header row
      if (validationResult.valid) {
        validRows.push(this.transformRow<T>(row, mapping));
      } else {
        errors.push(...validationResult.errors);
      }
    });

    return {
      success: errors.length === 0,
      validRows,
      errors,
      totalRows: data.length,
      validCount: validRows.length,
      errorCount: errors.length
    };
  }
}

export interface ExcelColumnMapping {
  [key: string]: {
    excelColumn: string;
    required: boolean;
    type: 'string' | 'number' | 'date' | 'boolean';
    validator?: (value: any) => boolean;
    transformer?: (value: any) => any;
  };
}

export interface ExcelParseResult<T> {
  success: boolean;
  validRows: T[];
  errors: ExcelImportError[];
  totalRows: number;
  validCount: number;
  errorCount: number;
}

export interface ExcelTemplateConfig {
  fileName: string;
  sheetName: string;
  headers: string[];
  sampleData: any[];
}
```

### API Integration Service

```typescript
@Injectable({ providedIn: 'root' })
export class ApiIntegrationService {
  private readonly apiEndpoint = environment.externalApiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetch purchase orders from external API
   */
  fetchPurchaseOrders(criteria: ApiSyncCriteria): Observable<ApiSyncResult<PurchaseOrderHeader>> {
    return this.http.post<ApiResponse>(`${this.apiEndpoint}/purchase-orders/sync`, criteria).pipe(
      map(response => this.transformApiResponse<PurchaseOrderHeader>(response)),
      catchError(error => {
        this.logApiError('fetchPurchaseOrders', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch sales orders from external API
   */
  fetchSalesOrders(criteria: ApiSyncCriteria): Observable<ApiSyncResult<SalesOrderHeader>> {
    return this.http.post<ApiResponse>(`${this.apiEndpoint}/sales-orders/sync`, criteria).pipe(
      map(response => this.transformApiResponse<SalesOrderHeader>(response)),
      catchError(error => {
        this.logApiError('fetchSalesOrders', error);
        return throwError(() => error);
      })
    );
  }

  private transformApiResponse<T>(response: ApiResponse): ApiSyncResult<T> {
    return {
      success: response.success,
      data: response.data,
      errors: response.errors || [],
      timestamp: new Date(response.timestamp)
    };
  }

  private logApiError(operation: string, error: any): void {
    console.error(`API Integration Error [${operation}]:`, error);
    // Send to backend logging service
  }
}

export interface ApiSyncCriteria {
  dateFrom?: Date;
  dateTo?: Date;
  externalIds?: string[];
}

export interface ApiSyncResult<T> {
  success: boolean;
  data: T[];
  errors: ApiError[];
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}
```


### Order Services

```typescript
@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
  private readonly apiUrl = `${environment.apiUrl}/purchase-orders`;

  constructor(private http: HttpClient) {}

  getOrders(filters?: POFilters): Observable<PurchaseOrderHeader[]> {
    const params = this.buildQueryParams(filters);
    return this.http.get<PurchaseOrderHeader[]>(this.apiUrl, { params });
  }

  getOrderById(id: string): Observable<PurchaseOrderHeader> {
    return this.http.get<PurchaseOrderHeader>(`${this.apiUrl}/${id}`);
  }

  getOrderDetails(orderId: string): Observable<PurchaseOrderDetail[]> {
    return this.http.get<PurchaseOrderDetail[]>(`${this.apiUrl}/${orderId}/details`);
  }

  createOrder(order: CreatePurchaseOrderDto): Observable<PurchaseOrderHeader> {
    return this.http.post<PurchaseOrderHeader>(this.apiUrl, order);
  }

  updateOrder(id: string, order: UpdatePurchaseOrderDto): Observable<PurchaseOrderHeader> {
    return this.http.put<PurchaseOrderHeader>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: POStatus): Observable<PurchaseOrderHeader> {
    return this.http.patch<PurchaseOrderHeader>(`${this.apiUrl}/${id}/status`, { status });
  }

  searchForLookup(criteria: POLookupCriteria): Observable<PurchaseOrderHeader[]> {
    const params = this.buildQueryParams(criteria);
    return this.http.get<PurchaseOrderHeader[]>(`${this.apiUrl}/lookup`, { params });
  }

  private buildQueryParams(filters: any): HttpParams {
    let params = new HttpParams();
    Object.keys(filters || {}).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params = params.set(key, filters[key].toString());
      }
    });
    return params;
  }
}

@Injectable({ providedIn: 'root' })
export class SalesOrderService {
  private readonly apiUrl = `${environment.apiUrl}/sales-orders`;

  constructor(private http: HttpClient) {}

  // Similar methods as PurchaseOrderService
  getOrders(filters?: SOFilters): Observable<SalesOrderHeader[]> { /* ... */ }
  getOrderById(id: string): Observable<SalesOrderHeader> { /* ... */ }
  getOrderDetails(orderId: string): Observable<SalesOrderDetail[]> { /* ... */ }
  createOrder(order: CreateSalesOrderDto): Observable<SalesOrderHeader> { /* ... */ }
  updateOrder(id: string, order: UpdateSalesOrderDto): Observable<SalesOrderHeader> { /* ... */ }
  deleteOrder(id: string): Observable<void> { /* ... */ }
  updateStatus(id: string, status: SOStatus): Observable<SalesOrderHeader> { /* ... */ }
  searchForLookup(criteria: SOLookupCriteria): Observable<SalesOrderHeader[]> { /* ... */ }
}
```

### Stock Adjustment Service

```typescript
@Injectable({ providedIn: 'root' })
export class StockAdjustmentService {
  private readonly apiUrl = `${environment.apiUrl}/stock-adjustments`;

  constructor(private http: HttpClient) {}

  getAdjustments(filters?: AdjustmentFilters): Observable<StockAdjustmentHeader[]> {
    const params = this.buildQueryParams(filters);
    return this.http.get<StockAdjustmentHeader[]>(this.apiUrl, { params });
  }

  getAdjustmentById(id: string): Observable<StockAdjustmentHeader> {
    return this.http.get<StockAdjustmentHeader>(`${this.apiUrl}/${id}`);
  }

  getAdjustmentDetails(adjustmentId: string): Observable<StockAdjustmentDetail[]> {
    return this.http.get<StockAdjustmentDetail[]>(`${this.apiUrl}/${adjustmentId}/details`);
  }

  createAdjustment(adjustment: CreateStockAdjustmentDto): Observable<StockAdjustmentHeader> {
    return this.http.post<StockAdjustmentHeader>(this.apiUrl, adjustment);
  }

  approveAdjustment(id: string, comments?: string): Observable<StockAdjustmentHeader> {
    return this.http.post<StockAdjustmentHeader>(`${this.apiUrl}/${id}/approve`, { comments });
  }

  rejectAdjustment(id: string, comments: string): Observable<StockAdjustmentHeader> {
    return this.http.post<StockAdjustmentHeader>(`${this.apiUrl}/${id}/reject`, { comments });
  }

  getAuditTrail(adjustmentId: string): Observable<StockAdjustmentAudit[]> {
    return this.http.get<StockAdjustmentAudit[]>(`${this.apiUrl}/${adjustmentId}/audit`);
  }

  getPendingApprovals(): Observable<StockAdjustmentHeader[]> {
    return this.http.get<StockAdjustmentHeader[]>(`${this.apiUrl}/pending-approvals`);
  }

  private buildQueryParams(filters: any): HttpParams {
    let params = new HttpParams();
    Object.keys(filters || {}).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        params = params.set(key, filters[key].toString());
      }
    });
    return params;
  }
}
```

### Record Lock Service

```typescript
@Injectable({ providedIn: 'root' })
export class RecordLockService {
  private readonly apiUrl = `${environment.apiUrl}/record-locks`;
  private activeLocks = new Map<string, string>(); // recordId -> lockId

  constructor(private http: HttpClient) {}

  acquireLock(recordType: string, recordId: string): Observable<RecordLock> {
    return this.http.post<RecordLock>(`${this.apiUrl}/acquire`, { recordType, recordId }).pipe(
      tap(lock => this.activeLocks.set(recordId, lock.id))
    );
  }

  releaseLock(recordId: string): Observable<void> {
    const lockId = this.activeLocks.get(recordId);
    if (!lockId) return of(undefined);

    return this.http.post<void>(`${this.apiUrl}/release`, { lockId }).pipe(
      tap(() => this.activeLocks.delete(recordId))
    );
  }

  checkLock(recordType: string, recordId: string): Observable<RecordLockStatus> {
    return this.http.get<RecordLockStatus>(`${this.apiUrl}/check`, {
      params: { recordType, recordId }
    });
  }

  releaseAllLocks(): void {
    this.activeLocks.forEach((lockId, recordId) => {
      this.releaseLock(recordId).subscribe();
    });
  }
}

export interface RecordLock {
  id: string;
  recordType: string;
  recordId: string;
  lockedBy: string;
  lockedAt: Date;
  expiresAt: Date;
}

export interface RecordLockStatus {
  isLocked: boolean;
  lock?: RecordLock;
}
```


## UI/UX Design Considerations

### Design Principles

1. **Consistency**: Maintain consistent patterns across all order and transaction forms
2. **Progressive Disclosure**: Show advanced options only when needed
3. **Immediate Feedback**: Provide real-time validation and clear error messages
4. **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
5. **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop

### Component Patterns

#### Multi-Method Input Selector

```
┌─────────────────────────────────────────────────────────┐
│  Create Purchase Order                                  │
├─────────────────────────────────────────────────────────┤
│  Select Input Method:                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │ 📄 Excel│  │ 🔌 API  │  │ ✏️ Manual│               │
│  │  Upload │  │  Sync   │  │  Entry  │               │
│  └─────────┘  └─────────┘  └─────────┘               │
│                                                         │
│  [Dynamic content area based on selection]             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Excel Upload Flow

```
1. File Selection
   ┌─────────────────────────────────────┐
   │  Drag & Drop Excel File Here        │
   │  or click to browse                 │
   │                                     │
   │  📥 Download Template               │
   └─────────────────────────────────────┘

2. Validation & Preview
   ┌─────────────────────────────────────┐
   │  ✓ 45 rows valid                    │
   │  ⚠ 3 rows with errors               │
   │                                     │
   │  [Preview Grid]                     │
   │  📊 Download Error Report           │
   └─────────────────────────────────────┘

3. Confirmation
   ┌─────────────────────────────────────┐
   │  Ready to import 45 items           │
   │  [Cancel]  [Import]                 │
   └─────────────────────────────────────┘
```

#### Lookup Dialog Pattern

```
┌─────────────────────────────────────────────────────────┐
│  Select Purchase Order                          [X]     │
├─────────────────────────────────────────────────────────┤
│  Search: [________________]  [🔍 Search]               │
│                                                         │
│  Filters:                                              │
│  Supplier: [All ▼]  Status: [Pending ▼]               │
│  Date Range: [From] - [To]                             │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ PO Number │ Date       │ Supplier  │ Status      │ │
│  ├───────────────────────────────────────────────────┤ │
│  │ PO-001    │ 2024-01-15 │ Supplier A│ Pending     │ │
│  │ PO-002    │ 2024-01-16 │ Supplier B│ Partial     │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Cancel]                              [Select]        │
└─────────────────────────────────────────────────────────┘
```

#### Approval Workflow UI

```
┌─────────────────────────────────────────────────────────┐
│  Stock Adjustment Details                               │
├─────────────────────────────────────────────────────────┤
│  Adjustment #: ADJ-2024-001                             │
│  Item: Raw Material A                                   │
│  Type: Decrease                                         │
│  Quantity: -50 units                                    │
│  Reason: Physical count discrepancy                     │
│                                                         │
│  Before: 1,000 units                                    │
│  After:    950 units                                    │
│                                                         │
│  Submitted by: John Doe on 2024-01-15 10:30            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Review Comments (optional)                      │   │
│  │ [_________________________________________]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Reject]                              [Approve]        │
└─────────────────────────────────────────────────────────┘
```

### PrimeNG Components Usage

- **p-table**: All list views with lazy loading, sorting, filtering
- **p-dialog**: Lookup dialogs, confirmation dialogs
- **p-fileUpload**: Excel file upload
- **p-dropdown**: All dropdown selections
- **p-calendar**: Date pickers
- **p-inputNumber**: Numeric inputs with validation
- **p-button**: All action buttons with loading states
- **p-toast**: Success/error notifications
- **p-confirmDialog**: Delete confirmations
- **p-timeline**: Audit trail and approval history
- **p-tag**: Status badges
- **p-progressBar**: Upload progress
- **p-tabView**: Category tabs in item master

### Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large desktop

// Layout adjustments
- Mobile: Single column, stacked forms
- Tablet: Two columns for forms, full table
- Desktop: Multi-column layouts, side panels
```


## API Integration Patterns

### RESTful Endpoint Design

#### Purchase Orders

```
GET    /api/purchase-orders              # List with filters
GET    /api/purchase-orders/:id          # Get by ID
GET    /api/purchase-orders/:id/details  # Get line items
POST   /api/purchase-orders              # Create
PUT    /api/purchase-orders/:id          # Update
DELETE /api/purchase-orders/:id          # Delete
PATCH  /api/purchase-orders/:id/status   # Update status
GET    /api/purchase-orders/lookup       # Lookup for linking
POST   /api/purchase-orders/import       # Bulk import
GET    /api/purchase-orders/template     # Download template
```

#### Sales Orders

```
GET    /api/sales-orders                 # List with filters
GET    /api/sales-orders/:id             # Get by ID
GET    /api/sales-orders/:id/details     # Get line items
POST   /api/sales-orders                 # Create
PUT    /api/sales-orders/:id             # Update
DELETE /api/sales-orders/:id             # Delete
PATCH  /api/sales-orders/:id/status      # Update status
GET    /api/sales-orders/lookup          # Lookup for linking
POST   /api/sales-orders/import          # Bulk import
GET    /api/sales-orders/template        # Download template
```

#### Stock Adjustments

```
GET    /api/stock-adjustments                    # List with filters
GET    /api/stock-adjustments/:id                # Get by ID
GET    /api/stock-adjustments/:id/details        # Get line items
POST   /api/stock-adjustments                    # Create
POST   /api/stock-adjustments/:id/approve        # Approve
POST   /api/stock-adjustments/:id/reject         # Reject
GET    /api/stock-adjustments/:id/audit          # Audit trail
GET    /api/stock-adjustments/pending-approvals  # Pending queue
```

#### Items (Enhanced)

```
GET    /api/items                        # List with category filter
GET    /api/items/:id                    # Get by ID
POST   /api/items                        # Create (with category)
PUT    /api/items/:id                    # Update (category locked)
DELETE /api/items/:id                    # Delete
GET    /api/items/raw-materials          # Filter raw materials
GET    /api/items/finished-goods         # Filter finished goods
```

### Request/Response Formats

#### Create Purchase Order Request

```json
{
  "poNumber": "PO-2024-001",
  "poDate": "2024-01-15T00:00:00Z",
  "supplierId": "SUP-001",
  "warehouseId": "WH-001",
  "inputMethod": "MANUAL",
  "deliveryDate": "2024-02-15T00:00:00Z",
  "currency": "IDR",
  "notes": "Urgent order",
  "details": [
    {
      "lineNumber": 1,
      "itemId": "ITEM-001",
      "orderedQuantity": 100,
      "unit": "pcs",
      "unitPrice": 50000,
      "deliveryDate": "2024-02-15T00:00:00Z"
    }
  ]
}
```

#### Create Stock Adjustment Request

```json
{
  "adjustmentDate": "2024-01-15T00:00:00Z",
  "warehouseId": "WH-001",
  "notes": "Monthly physical count adjustment",
  "details": [
    {
      "lineNumber": 1,
      "itemId": "ITEM-001",
      "adjustmentType": "DECREASE",
      "quantity": 50,
      "reasonCategory": "PHYSICAL_COUNT",
      "reason": "Discrepancy found during physical count",
      "notes": "Verified by warehouse supervisor"
    }
  ]
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "details[0].itemId",
        "message": "Item must be a Raw Material for Purchase Orders",
        "code": "INVALID_ITEM_CATEGORY"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Interceptors

#### Error Interceptor Enhancement

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = this.handleValidationError(error);
              break;
            case 401:
              errorMessage = 'Unauthorized. Please login again.';
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 409:
              errorMessage = this.handleConflictError(error);
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            default:
              errorMessage = error.error?.message || errorMessage;
          }
        }

        this.notificationService.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleValidationError(error: HttpErrorResponse): string {
    if (error.error?.details && Array.isArray(error.error.details)) {
      return error.error.details.map((d: any) => d.message).join(', ');
    }
    return error.error?.message || 'Validation failed';
  }

  private handleConflictError(error: HttpErrorResponse): string {
    if (error.error?.code === 'RECORD_LOCKED') {
      return `This record is being edited by ${error.error.lockedBy}`;
    }
    return error.error?.message || 'Conflict occurred';
  }
}
```


## Validation and Error Handling

### Form Validation Strategy

#### Reactive Forms with Custom Validators

```typescript
// Custom Validators
export class CustomValidators {
  /**
   * Validate that item category matches order type
   */
  static itemCategoryValidator(orderType: 'PO' | 'SO'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const item = control.value;
      if (!item) return null;

      const expectedCategory = orderType === 'PO' ? ItemCategory.RAW_MATERIAL : ItemCategory.FINISHED_GOOD;
      if (item.category !== expectedCategory) {
        return {
          invalidCategory: {
            expected: expectedCategory,
            actual: item.category,
            message: `${orderType} can only contain ${expectedCategory} items`
          }
        };
      }
      return null;
    };
  }

  /**
   * Validate HS Code format
   */
  static hsCodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hsCodePattern = /^\d{4}\.\d{2}\.\d{2}$/;
      if (!hsCodePattern.test(value)) {
        return {
          invalidHsCode: {
            message: 'HS Code must be in format XXXX.XX.XX'
          }
        };
      }
      return null;
    };
  }

  /**
   * Validate quantity is positive
   */
  static positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined) return null;

      if (value <= 0) {
        return {
          notPositive: {
            message: 'Quantity must be greater than zero'
          }
        };
      }
      return null;
    };
  }

  /**
   * Validate adjustment quantity doesn't exceed available stock
   */
  static stockAvailabilityValidator(availableStock: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const adjustmentType = control.parent?.get('adjustmentType')?.value;
      const quantity = control.value;

      if (adjustmentType === AdjustmentType.DECREASE && quantity > availableStock) {
        return {
          insufficientStock: {
            available: availableStock,
            requested: quantity,
            message: `Cannot decrease by ${quantity}. Only ${availableStock} units available.`
          }
        };
      }
      return null;
    };
  }

  /**
   * Async validator to check if record is locked
   */
  static recordLockValidator(
    lockService: RecordLockService,
    recordType: string,
    recordId: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return lockService.checkLock(recordType, recordId).pipe(
        map(status => {
          if (status.isLocked) {
            return {
              recordLocked: {
                lockedBy: status.lock?.lockedBy,
                message: `Record is being edited by ${status.lock?.lockedBy}`
              }
            };
          }
          return null;
        }),
        catchError(() => of(null))
      );
    };
  }
}
```

#### Form Group Examples

```typescript
// Purchase Order Form
createPurchaseOrderForm(): FormGroup {
  return this.fb.group({
    poNumber: ['', [Validators.required, Validators.maxLength(50)]],
    poDate: [new Date(), Validators.required],
    supplierId: ['', Validators.required],
    warehouseId: ['', Validators.required],
    inputMethod: [InputMethod.MANUAL, Validators.required],
    deliveryDate: [''],
    currency: ['IDR', Validators.required],
    notes: ['', Validators.maxLength(500)],
    details: this.fb.array([], Validators.minLength(1))
  });
}

// Purchase Order Line Form
createPurchaseOrderLineForm(): FormGroup {
  return this.fb.group({
    lineNumber: [0],
    itemId: ['', Validators.required],
    item: ['', [Validators.required, CustomValidators.itemCategoryValidator('PO')]],
    orderedQuantity: [0, [Validators.required, CustomValidators.positiveNumberValidator()]],
    unit: ['', Validators.required],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    deliveryDate: [''],
    notes: ['', Validators.maxLength(200)]
  });
}

// Stock Adjustment Form
createStockAdjustmentForm(): FormGroup {
  return this.fb.group({
    adjustmentDate: [new Date(), Validators.required],
    warehouseId: ['', Validators.required],
    notes: ['', Validators.maxLength(500)],
    details: this.fb.array([], Validators.minLength(1))
  });
}

// Stock Adjustment Line Form
createStockAdjustmentLineForm(availableStock: number): FormGroup {
  return this.fb.group({
    lineNumber: [0],
    itemId: ['', Validators.required],
    adjustmentType: [AdjustmentType.INCREASE, Validators.required],
    quantity: [
      0,
      [
        Validators.required,
        CustomValidators.positiveNumberValidator(),
        CustomValidators.stockAvailabilityValidator(availableStock)
      ]
    ],
    reasonCategory: [ReasonCategory.PHYSICAL_COUNT, Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(200)]],
    notes: ['', Validators.maxLength(200)]
  });
}
```

### Error Message Display

```typescript
// Error message helper
export class FormErrorHelper {
  static getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (!control.errors) return '';

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} is required`;
    }
    if (errors['maxlength']) {
      return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${fieldName} must be at least ${errors['min'].min}`;
    }
    if (errors['invalidCategory']) {
      return errors['invalidCategory'].message;
    }
    if (errors['invalidHsCode']) {
      return errors['invalidHsCode'].message;
    }
    if (errors['notPositive']) {
      return errors['notPositive'].message;
    }
    if (errors['insufficientStock']) {
      return errors['insufficientStock'].message;
    }
    if (errors['recordLocked']) {
      return errors['recordLocked'].message;
    }

    return 'Invalid value';
  }

  static hasError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
```


### Excel Import Validation

```typescript
export class ExcelValidationService {
  /**
   * Validate Purchase Order Excel data
   */
  validatePurchaseOrderData(data: any[]): ExcelValidationResult {
    const errors: ExcelImportError[] = [];
    const validRows: any[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // Account for header row
      const rowErrors: ExcelImportError[] = [];

      // Required field validation
      if (!row['PO Number']) {
        rowErrors.push({
          row: rowNumber,
          column: 'PO Number',
          value: row['PO Number'],
          message: 'PO Number is required'
        });
      }

      if (!row['Item Code']) {
        rowErrors.push({
          row: rowNumber,
          column: 'Item Code',
          value: row['Item Code'],
          message: 'Item Code is required'
        });
      }

      // Quantity validation
      const quantity = parseFloat(row['Quantity']);
      if (isNaN(quantity) || quantity <= 0) {
        rowErrors.push({
          row: rowNumber,
          column: 'Quantity',
          value: row['Quantity'],
          message: 'Quantity must be a positive number'
        });
      }

      // Price validation
      const unitPrice = parseFloat(row['Unit Price']);
      if (isNaN(unitPrice) || unitPrice < 0) {
        rowErrors.push({
          row: rowNumber,
          column: 'Unit Price',
          value: row['Unit Price'],
          message: 'Unit Price must be a non-negative number'
        });
      }

      // Date validation
      if (row['Delivery Date']) {
        const deliveryDate = this.parseExcelDate(row['Delivery Date']);
        if (!deliveryDate) {
          rowErrors.push({
            row: rowNumber,
            column: 'Delivery Date',
            value: row['Delivery Date'],
            message: 'Invalid date format'
          });
        }
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      } else {
        validRows.push(row);
      }
    });

    return {
      valid: errors.length === 0,
      validRows,
      errors,
      totalRows: data.length,
      validCount: validRows.length,
      errorCount: errors.length
    };
  }

  /**
   * Validate Sales Order Excel data
   */
  validateSalesOrderData(data: any[]): ExcelValidationResult {
    // Similar to validatePurchaseOrderData
    // with SO-specific validations
  }

  private parseExcelDate(value: any): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'number') {
      // Excel serial date
      return new Date((value - 25569) * 86400 * 1000);
    }
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }
}

export interface ExcelValidationResult {
  valid: boolean;
  validRows: any[];
  errors: ExcelImportError[];
  totalRows: number;
  validCount: number;
  errorCount: number;
}
```

### Business Rule Validation

```typescript
export class BusinessRuleValidator {
  /**
   * Validate item category matches order type
   */
  static validateItemCategory(
    item: ItemEnhanced,
    orderType: 'PO' | 'SO'
  ): ValidationResult {
    const expectedCategory = orderType === 'PO' 
      ? ItemCategory.RAW_MATERIAL 
      : ItemCategory.FINISHED_GOOD;

    if (item.category !== expectedCategory) {
      return {
        valid: false,
        message: `${orderType} can only contain ${expectedCategory} items. Item ${item.itemCode} is ${item.category}.`
      };
    }

    return { valid: true };
  }

  /**
   * Validate order can be deleted
   */
  static validateOrderDeletion(
    order: PurchaseOrderHeader | SalesOrderHeader,
    linkedTransactions: number
  ): ValidationResult {
    if (linkedTransactions > 0) {
      return {
        valid: false,
        message: `Cannot delete order with ${linkedTransactions} linked transaction(s). Please remove links first.`
      };
    }

    return { valid: true };
  }

  /**
   * Validate stock adjustment quantity
   */
  static validateAdjustmentQuantity(
    adjustmentType: AdjustmentType,
    quantity: number,
    currentStock: number
  ): ValidationResult {
    if (quantity <= 0) {
      return {
        valid: false,
        message: 'Adjustment quantity must be positive'
      };
    }

    if (adjustmentType === AdjustmentType.DECREASE && quantity > currentStock) {
      return {
        valid: false,
        message: `Cannot decrease by ${quantity}. Current stock is ${currentStock}.`
      };
    }

    return { valid: true };
  }

  /**
   * Validate user has approval permission
   */
  static validateApprovalPermission(
    user: User,
    requiredPermission: string
  ): ValidationResult {
    if (!user.permissions.includes(requiredPermission)) {
      return {
        valid: false,
        message: 'You do not have permission to approve stock adjustments'
      };
    }

    return { valid: true };
  }

  /**
   * Validate record is not locked
   */
  static validateRecordNotLocked(
    lockStatus: RecordLockStatus,
    currentUser: string
  ): ValidationResult {
    if (lockStatus.isLocked && lockStatus.lock?.lockedBy !== currentUser) {
      return {
        valid: false,
        message: `Record is being edited by ${lockStatus.lock?.lockedBy}`
      };
    }

    return { valid: true };
  }
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property Reflection

After analyzing all 115 acceptance criteria, several properties can be consolidated:
- Auto-population properties (4.3, 4.4, 4.5) can be combined into a single property about PO-to-Inbound data transfer
- Auto-population properties (7.3, 7.4, 7.5) can be combined into a single property about SO-to-Outbound data transfer
- Audit trail capture properties (9.2, 9.3, 9.4, 9.5, 9.6) can be combined into comprehensive audit completeness
- Excel/API validation properties for PO and SO follow the same pattern and can be generalized
- Status assignment properties (11.1, 11.2) are structural and covered by status update properties (11.3, 11.4)

### Property 1: Item Category Immutability

For any item in the Item_Master, once the category is set during creation, any subsequent update operation should preserve the original category value.

**Validates: Requirements 1.6**

### Property 2: Category Filter Correctness

For any category filter applied to the item list (Raw_Material or Finished_Good), all returned items should have the specified category and no items of other categories should be included.

**Validates: Requirements 1.2, 1.5, 1.7**

### Property 3: Excel Parse Round Trip

For any valid Excel file containing order data (PO or SO), parsing the file and then validating the parsed data should produce the same structured data that would be created through manual entry.

**Validates: Requirements 2.2, 2.4, 5.3, 5.5**

### Property 4: Required Field Validation

For any order creation attempt (PO, SO, or Stock Adjustment) via any input method (Excel, API, Manual), if any required field is missing or invalid, the system should reject the creation and provide error messages identifying all invalid fields.

**Validates: Requirements 2.3, 2.6, 2.9, 2.11, 5.4, 5.7, 5.10, 5.12, 8.2, 8.3, 8.4, 10.5, 12.2, 12.3, 13.3**

### Property 5: Input Method Persistence

For any order (PO or SO) created through any input method, retrieving that order from the database should return the same input method value that was used during creation.

**Validates: Requirements 2.10, 5.11**

### Property 6: Order Persistence Round Trip

For any order (PO or SO) that passes validation and is confirmed for saving, the saved order should be retrievable from the database with all field values matching the confirmed data.

**Validates: Requirements 2.12, 5.13**

### Property 7: PO Lookup Search Correctness

For any search criteria (PO number or supplier) applied to the PO lookup function, all returned purchase orders should match the search criteria.

**Validates: Requirements 4.1, 4.2**

### Property 8: PO-to-Inbound Auto-Population

For any purchase order selected in the inbound form, all fields (item details, quantity, supplier information) in the inbound form should be populated with the corresponding values from the selected purchase order.

**Validates: Requirements 4.3, 4.4, 4.5**

### Property 9: Transaction-Order Reference Persistence

For any inbound transaction linked to a purchase order (or outbound transaction linked to a sales order), retrieving that transaction should return the order reference, and displaying the transaction should show the linked order number.

**Validates: Requirements 4.6, 4.8, 7.6, 7.8**

### Property 10: SO Lookup Search Correctness

For any search criteria (SO number or customer) applied to the SO lookup function, all returned sales orders should match the search criteria.

**Validates: Requirements 7.1, 7.2**

### Property 11: SO-to-Outbound Auto-Population

For any sales order selected in the outbound form, all fields (item details, quantity, customer information) in the outbound form should be populated with the corresponding values from the selected sales order.

**Validates: Requirements 7.3, 7.4, 7.5**

### Property 12: Sales Order Deletion Constraint

For any sales order, deletion should succeed if and only if there are no linked outbound transactions. Sales orders with linked transactions should be rejected with an appropriate error message.

**Validates: Requirements 5.16, 5.17**

### Property 13: Stock Adjustment Workflow State

For any stock adjustment that is submitted, the adjustment should transition to PENDING status and should not be editable or deletable after submission.

**Validates: Requirements 8.6, 8.12, 8.13**

### Property 14: Approval Inventory Update

For any stock adjustment, when approved, the inventory quantity for the affected item should change by the adjustment quantity (increase or decrease), and when rejected, the inventory quantity should remain unchanged.

**Validates: Requirements 8.10, 8.11**

### Property 15: Audit Trail Completeness

For any stock adjustment, the audit trail should contain entries for all state transitions (created, submitted, approved/rejected) with complete information including user, timestamp, and quantity changes for approved adjustments.

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

### Property 16: Audit Trail Immutability

For any audit trail record, once created, it should never be modified or deleted, ensuring the integrity of the historical record.

**Validates: Requirements 9.9**

### Property 17: Audit Trail Filtering

For any filter criteria (date range, item, or user) applied to the audit trail view, all returned audit records should match the filter criteria.

**Validates: Requirements 9.8**

### Property 18: Item Category Validation for Orders

For any purchase order, all items should be categorized as Raw_Material and exist in Item_Master. For any sales order, all items should be categorized as Finished_Good and exist in Item_Master. Orders violating these rules should be rejected.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.6**

### Property 19: Order Status Calculation

For any purchase order with linked inbound transactions, the status should be PENDING if no items received, PARTIALLY_RECEIVED if some items received, and FULLY_RECEIVED if all items received. For any sales order with linked outbound transactions, the status should be PENDING if no items shipped, PARTIALLY_SHIPPED if some items shipped, and FULLY_SHIPPED if all items shipped.

**Validates: Requirements 11.3, 11.4**

### Property 20: Status Filter Correctness

For any status filter applied to order lists (PO or SO), all returned orders should have the specified status and no orders with other statuses should be included.

**Validates: Requirements 11.6**

### Property 21: Excel Validation Error Reporting

For any Excel file with validation errors, the error report should include the row number, column name, invalid value, and error message for each validation failure, and the system should prevent saving until all errors are corrected.

**Validates: Requirements 12.2, 12.3, 12.4, 12.5**

### Property 22: API Error Logging and Notification

For any API integration error, the error should be logged with complete details, displayed to the user, and trigger a notification to system administrators.

**Validates: Requirements 13.1, 13.2, 13.4**

### Property 23: Approval Permission Enforcement

For any stock adjustment approval attempt, the action should succeed if and only if the user has the approval permission. Users without permission should receive an error message and the approval should be denied.

**Validates: Requirements 14.2, 14.3**

### Property 24: Record Lock Lifecycle

For any record opened for editing, a lock should be acquired, preventing other users from editing. When the user saves or cancels, the lock should be released. If inactive for 30 minutes, the lock should automatically expire.

**Validates: Requirements 15.1, 15.2, 15.3, 15.4**


## Error Handling

### Error Handling Strategy

The system implements a multi-layered error handling approach:

1. **Client-Side Validation**: Immediate feedback through reactive forms
2. **Service Layer Validation**: Business rule validation before API calls
3. **HTTP Interceptor**: Centralized error handling for all API responses
4. **User Notification**: Toast messages for success/error feedback
5. **Error Logging**: Comprehensive logging for debugging and audit

### Error Categories

#### Validation Errors (400)

```typescript
interface ValidationError {
  code: 'VALIDATION_ERROR';
  message: string;
  details: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Example handling
if (error.status === 400) {
  const validationError = error.error as ValidationError;
  validationError.details.forEach(detail => {
    this.notificationService.error(`${detail.field}: ${detail.message}`);
  });
}
```

#### Authorization Errors (401, 403)

```typescript
// 401: Redirect to login
if (error.status === 401) {
  this.authService.logout();
  this.router.navigate(['/login']);
  this.notificationService.error('Session expired. Please login again.');
}

// 403: Show permission error
if (error.status === 403) {
  this.notificationService.error('You do not have permission to perform this action.');
}
```

#### Conflict Errors (409)

```typescript
interface ConflictError {
  code: 'RECORD_LOCKED' | 'DUPLICATE_ENTRY' | 'REFERENTIAL_INTEGRITY';
  message: string;
  details?: any;
}

// Example: Record lock conflict
if (error.error.code === 'RECORD_LOCKED') {
  this.notificationService.error(
    `This record is being edited by ${error.error.details.lockedBy}`
  );
}

// Example: Referential integrity
if (error.error.code === 'REFERENTIAL_INTEGRITY') {
  this.notificationService.error(
    'Cannot delete this record because it is referenced by other records.'
  );
}
```

#### Server Errors (500)

```typescript
if (error.status === 500) {
  this.notificationService.error('Server error. Please try again later.');
  this.errorLogService.logError({
    type: 'SERVER_ERROR',
    message: error.message,
    stack: error.error?.stack,
    timestamp: new Date()
  });
}
```

### Excel Import Error Handling

```typescript
interface ExcelImportError {
  row: number;
  column: string;
  value: any;
  message: string;
  code: string;
}

// Error display in UI
<p-table [value]="importErrors">
  <ng-template pTemplate="header">
    <tr>
      <th>Row</th>
      <th>Column</th>
      <th>Value</th>
      <th>Error</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-error>
    <tr>
      <td>{{ error.row }}</td>
      <td>{{ error.column }}</td>
      <td>{{ error.value }}</td>
      <td class="text-red-600">{{ error.message }}</td>
    </tr>
  </ng-template>
</p-table>

// Error report download
downloadErrorReport(): void {
  this.excelService.exportErrorReport(
    this.importErrors,
    `import-errors-${Date.now()}.xlsx`
  );
}
```

### API Integration Error Handling

```typescript
interface ApiIntegrationError {
  operation: string;
  timestamp: Date;
  errorCode: string;
  errorMessage: string;
  requestData?: any;
  responseData?: any;
}

// Error logging
private logApiError(operation: string, error: any): void {
  const apiError: ApiIntegrationError = {
    operation,
    timestamp: new Date(),
    errorCode: error.code || 'UNKNOWN',
    errorMessage: error.message,
    requestData: error.config?.data,
    responseData: error.response?.data
  };

  // Log to backend
  this.http.post('/api/logs/api-errors', apiError).subscribe();

  // Notify administrators
  this.notificationService.notifyAdmins({
    type: 'API_ERROR',
    severity: 'HIGH',
    message: `API Integration Error: ${operation}`,
    details: apiError
  });
}
```

### Retry Strategy

```typescript
// Retry configuration for transient errors
const retryConfig = {
  count: 3,
  delay: 1000,
  backoff: 2,
  retryableErrors: [408, 429, 500, 502, 503, 504]
};

// Retry implementation
this.http.post(url, data).pipe(
  retryWhen(errors =>
    errors.pipe(
      mergeMap((error, index) => {
        if (
          index < retryConfig.count &&
          retryConfig.retryableErrors.includes(error.status)
        ) {
          const delay = retryConfig.delay * Math.pow(retryConfig.backoff, index);
          return timer(delay);
        }
        return throwError(() => error);
      })
    )
  )
);
```


## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property Tests**: Verify universal properties across all inputs through randomization
- Both approaches are complementary and necessary for complete validation

### Property-Based Testing

#### Framework Selection

For TypeScript/Angular applications, we will use **fast-check** as the property-based testing library.

```bash
npm install --save-dev fast-check
```

#### Configuration

Each property test should run a minimum of 100 iterations to ensure adequate coverage through randomization.

```typescript
import * as fc from 'fast-check';

// Configure test runs
const testConfig = {
  numRuns: 100,
  verbose: true
};
```

#### Property Test Examples

**Property 1: Item Category Immutability**

```typescript
describe('Property 1: Item Category Immutability', () => {
  it('should preserve category on update', () => {
    // Feature: ibis-system-enhancements, Property 1: Item category immutability
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          itemCode: fc.string({ minLength: 1, maxLength: 20 }),
          itemName: fc.string({ minLength: 1, maxLength: 100 }),
          category: fc.constantFrom(ItemCategory.RAW_MATERIAL, ItemCategory.FINISHED_GOOD),
          hsCode: fc.string({ minLength: 10, maxLength: 10 })
        }),
        fc.record({
          itemName: fc.string({ minLength: 1, maxLength: 100 }),
          price: fc.float({ min: 0, max: 1000000 })
        }),
        async (item, updates) => {
          // Create item
          const created = await itemService.create(item);
          
          // Update item
          const updated = await itemService.update(created.id, updates);
          
          // Category should remain unchanged
          expect(updated.category).toBe(created.category);
        }
      ),
      testConfig
    );
  });
});
```

**Property 6: Order Persistence Round Trip**

```typescript
describe('Property 6: Order Persistence Round Trip', () => {
  it('should retrieve saved PO with matching data', () => {
    // Feature: ibis-system-enhancements, Property 6: Order persistence round trip
    fc.assert(
      fc.property(
        fc.record({
          poNumber: fc.string({ minLength: 1, maxLength: 50 }),
          poDate: fc.date(),
          supplierId: fc.uuid(),
          warehouseId: fc.uuid(),
          inputMethod: fc.constantFrom(...Object.values(InputMethod)),
          details: fc.array(
            fc.record({
              itemId: fc.uuid(),
              orderedQuantity: fc.integer({ min: 1, max: 10000 }),
              unitPrice: fc.float({ min: 0, max: 1000000 })
            }),
            { minLength: 1, maxLength: 10 }
          )
        }),
        async (poData) => {
          // Save PO
          const saved = await purchaseOrderService.create(poData);
          
          // Retrieve PO
          const retrieved = await purchaseOrderService.getById(saved.id);
          
          // All fields should match
          expect(retrieved.poNumber).toBe(poData.poNumber);
          expect(retrieved.inputMethod).toBe(poData.inputMethod);
          expect(retrieved.details.length).toBe(poData.details.length);
        }
      ),
      testConfig
    );
  });
});
```

**Property 14: Approval Inventory Update**

```typescript
describe('Property 14: Approval Inventory Update', () => {
  it('should update inventory on approval, preserve on rejection', () => {
    // Feature: ibis-system-enhancements, Property 14: Approval inventory update
    fc.assert(
      fc.property(
        fc.record({
          itemId: fc.uuid(),
          adjustmentType: fc.constantFrom(...Object.values(AdjustmentType)),
          quantity: fc.integer({ min: 1, max: 100 }),
          reason: fc.string({ minLength: 10, maxLength: 200 })
        }),
        fc.boolean(),
        async (adjustment, shouldApprove) => {
          // Get initial inventory
          const initialStock = await inventoryService.getStock(adjustment.itemId);
          
          // Create and submit adjustment
          const created = await stockAdjustmentService.create(adjustment);
          
          // Approve or reject
          if (shouldApprove) {
            await stockAdjustmentService.approve(created.id);
            const finalStock = await inventoryService.getStock(adjustment.itemId);
            
            // Stock should change by adjustment amount
            const expectedChange = adjustment.adjustmentType === AdjustmentType.INCREASE
              ? adjustment.quantity
              : -adjustment.quantity;
            expect(finalStock).toBe(initialStock + expectedChange);
          } else {
            await stockAdjustmentService.reject(created.id, 'Test rejection');
            const finalStock = await inventoryService.getStock(adjustment.itemId);
            
            // Stock should remain unchanged
            expect(finalStock).toBe(initialStock);
          }
        }
      ),
      testConfig
    );
  });
});
```

**Property 18: Item Category Validation for Orders**

```typescript
describe('Property 18: Item Category Validation for Orders', () => {
  it('should reject PO with non-raw-material items', () => {
    // Feature: ibis-system-enhancements, Property 18: Item category validation
    fc.assert(
      fc.property(
        fc.record({
          poNumber: fc.string({ minLength: 1, maxLength: 50 }),
          supplierId: fc.uuid(),
          details: fc.array(
            fc.record({
              itemId: fc.uuid(),
              itemCategory: fc.constantFrom(...Object.values(ItemCategory)),
              orderedQuantity: fc.integer({ min: 1, max: 1000 })
            }),
            { minLength: 1, maxLength: 5 }
          )
        }),
        async (poData) => {
          const hasInvalidItems = poData.details.some(
            d => d.itemCategory !== ItemCategory.RAW_MATERIAL
          );
          
          if (hasInvalidItems) {
            // Should reject
            await expect(purchaseOrderService.create(poData)).rejects.toThrow();
          } else {
            // Should succeed
            const created = await purchaseOrderService.create(poData);
            expect(created).toBeDefined();
          }
        }
      ),
      testConfig
    );
  });
});
```

**Property 24: Record Lock Lifecycle**

```typescript
describe('Property 24: Record Lock Lifecycle', () => {
  it('should manage lock lifecycle correctly', () => {
    // Feature: ibis-system-enhancements, Property 24: Record lock lifecycle
    fc.assert(
      fc.property(
        fc.constantFrom('PurchaseOrder', 'SalesOrder', 'StockAdjustment'),
        fc.uuid(),
        fc.constantFrom('save', 'cancel'),
        async (recordType, recordId, action) => {
          // Acquire lock
          const lock = await recordLockService.acquireLock(recordType, recordId);
          expect(lock).toBeDefined();
          
          // Check lock status
          const status = await recordLockService.checkLock(recordType, recordId);
          expect(status.isLocked).toBe(true);
          
          // Release lock
          if (action === 'save' || action === 'cancel') {
            await recordLockService.releaseLock(recordId);
          }
          
          // Verify lock released
          const statusAfter = await recordLockService.checkLock(recordType, recordId);
          expect(statusAfter.isLocked).toBe(false);
        }
      ),
      testConfig
    );
  });
});
```

### Unit Testing

#### Unit Test Focus Areas

Unit tests should focus on:
- Specific examples demonstrating correct behavior
- Edge cases (empty data, boundary values, special characters)
- Error conditions and validation failures
- Component integration points
- UI interactions and state changes

#### Unit Test Examples

```typescript
describe('PurchaseOrderFormComponent', () => {
  it('should initialize with manual entry method', () => {
    const component = new PurchaseOrderFormComponent();
    expect(component.selectedInputMethod).toBe(InputMethod.MANUAL);
  });

  it('should validate required fields', () => {
    const form = component.createPurchaseOrderForm();
    expect(form.valid).toBe(false);
    
    form.patchValue({
      poNumber: 'PO-001',
      poDate: new Date(),
      supplierId: 'SUP-001',
      warehouseId: 'WH-001'
    });
    
    expect(form.valid).toBe(true);
  });

  it('should handle Excel upload errors', async () => {
    const invalidFile = new File(['invalid'], 'test.xlsx');
    await component.handleExcelUpload(invalidFile);
    
    expect(component.importErrors.length).toBeGreaterThan(0);
    expect(component.showErrorReport).toBe(true);
  });
});

describe('StockAdjustmentService', () => {
  it('should create adjustment with PENDING status', async () => {
    const adjustment = {
      itemId: 'ITEM-001',
      adjustmentType: AdjustmentType.INCREASE,
      quantity: 50,
      reason: 'Physical count adjustment'
    };
    
    const created = await service.create(adjustment);
    expect(created.status).toBe(AdjustmentStatus.PENDING);
  });

  it('should prevent editing after submission', async () => {
    const adjustment = await service.create(testAdjustment);
    
    await expect(
      service.update(adjustment.id, { quantity: 100 })
    ).rejects.toThrow('Cannot edit submitted adjustment');
  });
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 24 correctness properties implemented
- **Integration Test Coverage**: All API endpoints and service integrations
- **E2E Test Coverage**: Critical user workflows (order creation, approval workflow)

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run property tests
        run: npm run test:property
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2
```

### Test Data Generators

```typescript
// test/generators/order-generators.ts
export class OrderGenerators {
  static generatePurchaseOrder(): fc.Arbitrary<CreatePurchaseOrderDto> {
    return fc.record({
      poNumber: fc.string({ minLength: 1, maxLength: 50 }),
      poDate: fc.date(),
      supplierId: fc.uuid(),
      warehouseId: fc.uuid(),
      inputMethod: fc.constantFrom(...Object.values(InputMethod)),
      currency: fc.constantFrom('IDR', 'USD', 'EUR'),
      details: fc.array(
        this.generatePurchaseOrderLine(),
        { minLength: 1, maxLength: 20 }
      )
    });
  }

  static generatePurchaseOrderLine(): fc.Arbitrary<PurchaseOrderLineDto> {
    return fc.record({
      itemId: fc.uuid(),
      orderedQuantity: fc.integer({ min: 1, max: 10000 }),
      unit: fc.constantFrom('pcs', 'kg', 'liter', 'box'),
      unitPrice: fc.float({ min: 0, max: 1000000 })
    });
  }

  static generateStockAdjustment(): fc.Arbitrary<CreateStockAdjustmentDto> {
    return fc.record({
      adjustmentDate: fc.date(),
      warehouseId: fc.uuid(),
      details: fc.array(
        fc.record({
          itemId: fc.uuid(),
          adjustmentType: fc.constantFrom(...Object.values(AdjustmentType)),
          quantity: fc.integer({ min: 1, max: 1000 }),
          reasonCategory: fc.constantFrom(...Object.values(ReasonCategory)),
          reason: fc.string({ minLength: 10, maxLength: 200 })
        }),
        { minLength: 1, maxLength: 10 }
      )
    });
  }
}
```

---

## Implementation Notes

### Migration Strategy

1. **Phase 1**: Item Master enhancement (category separation)
2. **Phase 2**: Purchase Order module with multi-input
3. **Phase 3**: Inbound-PO integration
4. **Phase 4**: Sales Order module
5. **Phase 5**: Outbound-SO integration
6. **Phase 6**: Stock Adjustment with approval workflow

### Performance Considerations

- Implement lazy loading for large order lists
- Use virtual scrolling for Excel preview grids
- Cache lookup results for frequently accessed data
- Implement debouncing for search inputs
- Use pagination for audit trail views

### Security Considerations

- Validate all user inputs on both client and server
- Implement CSRF protection for state-changing operations
- Use JWT tokens with appropriate expiration
- Encrypt sensitive data in transit and at rest
- Implement rate limiting for API endpoints
- Log all approval actions for audit compliance

### Accessibility Considerations

- Ensure all interactive elements are keyboard accessible
- Provide ARIA labels for screen readers
- Maintain sufficient color contrast ratios
- Support screen reader announcements for dynamic content
- Provide alternative text for all icons and images