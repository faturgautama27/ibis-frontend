# Purchase Order List Component

## Overview

Component untuk menampilkan daftar Purchase Orders dengan fitur filtering, search, dan action buttons.

## Features

✅ Display purchase orders in table format
✅ Search by PO number, supplier name, supplier code, warehouse
✅ Filter by status (Pending, Partially Received, Fully Received, Cancelled)
✅ Filter by date range (Date From - Date To)
✅ Status badges with color coding
✅ Action buttons (View, Edit, Delete)
✅ Pagination support
✅ Confirmation dialog for delete action
✅ Toast notifications for success/error messages

## Development Mode

Component ini mendukung 2 mode:

### 1. Mock Data Mode (Development)
```typescript
private readonly USE_MOCK_DATA = true;
```

**Keuntungan:**
- Tidak perlu backend/API
- Data langsung tersedia
- Cepat untuk development dan testing
- Filtering dan search bekerja dengan mock data

**Data Mock:**
- 12 purchase orders dengan berbagai status
- 7 suppliers berbeda
- 3 warehouses (Jakarta, Surabaya, Bandung)
- Berbagai input methods (Manual, Excel, API)

### 2. NgRx Store Mode (Production)
```typescript
private readonly USE_MOCK_DATA = false;
```

**Keuntungan:**
- Menggunakan real API
- State management dengan NgRx
- Data persisten
- Production-ready

## Mock Data Structure

File: `purchase-order-list.mock.ts`

```typescript
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
    // ... more fields
  },
  // ... 11 more purchase orders
];
```

## Helper Functions

### getMockPurchaseOrders(filters?)
Filter mock data berdasarkan kriteria:
```typescript
const pendingOrders = getMockPurchaseOrders({ 
  status: [POStatus.PENDING] 
});

const searchResults = getMockPurchaseOrders({ 
  searchQuery: 'SUP001' 
});
```

### getMockPurchaseOrderById(id)
Get PO by ID:
```typescript
const order = getMockPurchaseOrderById('po-001');
```

### getMockPurchaseOrderByNumber(poNumber)
Get PO by PO Number:
```typescript
const order = getMockPurchaseOrderByNumber('PO-2024-001');
```

## Usage

### Switch to Mock Data Mode
1. Open `purchase-order-list.component.ts`
2. Set `USE_MOCK_DATA = true`
3. Save and reload

### Switch to NgRx Store Mode
1. Open `purchase-order-list.component.ts`
2. Set `USE_MOCK_DATA = false`
3. Ensure NgRx store and API are configured
4. Save and reload

## Filtering

### Search
- PO Number
- Supplier Name
- Supplier Code
- Warehouse Name

### Status Filter
- Pending (Yellow badge)
- Partially Received (Blue badge)
- Fully Received (Green badge)
- Cancelled (Red badge)

### Date Range Filter
- Date From: Filter PO dengan tanggal >= selected date
- Date To: Filter PO dengan tanggal <= selected date

## Actions

### View
Navigate to detail page: `/purchase-orders/:id`

### Edit
Navigate to edit page: `/purchase-orders/:id/edit`

### Delete
- Show confirmation dialog
- Delete from mock data (if USE_MOCK_DATA = true)
- Dispatch delete action to store (if USE_MOCK_DATA = false)
- Show success toast notification

## Status Badge Colors

| Status | Severity | Color |
|--------|----------|-------|
| Pending | warn | Yellow |
| Partially Received | info | Blue |
| Fully Received | success | Green |
| Cancelled | danger | Red |

## Dependencies

- PrimeNG Table
- PrimeNG Button
- PrimeNG InputText
- PrimeNG Select (Dropdown)
- PrimeNG DatePicker
- PrimeNG Tag
- PrimeNG ConfirmDialog
- PrimeNG Toast
- PrimeNG Tooltip
- NgRx Store (for production mode)

## Testing

Mock data mode sangat berguna untuk:
- Unit testing
- Integration testing
- UI/UX testing
- Demo purposes
- Development tanpa backend

## Notes

- Mock data disimpan di memory, akan reset setiap reload
- Untuk production, pastikan `USE_MOCK_DATA = false`
- Delete operation di mock mode akan menghapus dari array, tidak persisten
- Pagination di mock mode menggunakan semua data (tidak lazy load)
