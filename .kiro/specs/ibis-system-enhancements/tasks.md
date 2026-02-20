# Implementation Plan: IBIS System Enhancements

## Overview

This implementation plan breaks down the IBIS System Enhancements into six migration phases, following the feature-based architecture with standalone Angular components, NgRx state management, and PrimeNG UI components. Each phase builds incrementally, with property-based tests using fast-check to validate correctness properties alongside unit tests.

## Tasks

- [x] 1. Phase 1: Item Master Enhancement (Raw Materials vs Finished Goods)
  - [x] 1.1 Create enhanced item data models and enums
    - Create `ItemCategory` enum with RAW_MATERIAL and FINISHED_GOOD values
    - Extend existing Item model with category, categoryLocked, categoryLockedAt, categoryLockedBy fields
    - Create `ItemFilters` interface with category, searchQuery, and active fields
    - _Requirements: 1.1_

  - [x] 1.2 Create item NgRx store structure
    - Create actions for load, create, update, delete, and filter items
    - Create reducer with item state management and category locking logic
    - Create effects for API calls with error handling
    - Create selectors for filtering items by category
    - _Requirements: 1.1, 1.6_

  - [x] 1.3 Implement ItemService with category validation
    - Create service methods for CRUD operations
    - Add category validation to prevent changes after creation
    - Implement filtering by category (raw materials vs finished goods)
    - Add HTTP interceptor integration for error handling
    - _Requirements: 1.1, 1.6, 1.7_

  - [ ]* 1.4 Write property test for item category immutability
    - **Property 1: Item Category Immutability**
    - **Validates: Requirements 1.6**
    - Generate random items with categories, update them, verify category unchanged
    - Use fast-check with 100 iterations

  - [x] 1.5 Create ItemListComponent with category filtering
    - Implement PrimeNG table with lazy loading
    - Add category filter tabs/toggle (Raw Material / Finished Good)
    - Add search, sort, and pagination controls
    - Connect to NgRx store for data and actions
    - _Requirements: 1.2, 1.5, 1.7_

  - [ ]* 1.6 Write property test for category filter correctness
    - **Property 2: Category Filter Correctness**
    - **Validates: Requirements 1.2, 1.5, 1.7**
    - Generate random category filters, verify all returned items match filter

  - [x] 1.7 Create ItemFormComponent with category selection
    - Implement reactive form with validation
    - Add category dropdown (locked after creation)
    - Add form validation with custom validators
    - Implement create/edit modes with category locking
    - _Requirements: 1.3, 1.4, 1.6_

  - [ ]* 1.8 Write unit tests for ItemFormComponent
    - Test category locking behavior
    - Test form validation rules
    - Test create vs edit mode differences
    - _Requirements: 1.3, 1.4, 1.6_

- [x] 2. Phase 2: Purchase Order Module with Multi-Method Input
  - [x] 2.1 Create Purchase Order data models
    - Create PurchaseOrderHeader and PurchaseOrderDetail interfaces
    - Create POStatus enum (PENDING, PARTIALLY_RECEIVED, FULLY_RECEIVED, CANCELLED)
    - Create InputMethod enum (EXCEL, API, MANUAL)
    - Create ExcelImportResult and ExcelImportError interfaces
    - Create POFilters and POLookupCriteria interfaces
    - _Requirements: 2.1, 2.10_

  - [x] 2.2 Create Purchase Order NgRx store
    - Create actions for load, create, update, delete, updateStatus
    - Create reducer with order state, filters, and pagination
    - Create effects for API calls with error handling
    - Create selectors for filtering and lookup
    - _Requirements: 2.1, 2.12_

  - [x] 2.3 Implement PurchaseOrderService
    - Create service methods for CRUD operations
    - Add methods for status updates and lookup
    - Implement filtering and search functionality
    - Add error handling and retry logic
    - _Requirements: 2.1, 2.12_

  - [x] 2.4 Create ExcelService for file parsing
    - Implement parseExcelFile method using SheetJS (xlsx)
    - Add validateAndTransform method with column mapping
    - Implement generateTemplate method for template download
    - Add exportErrorReport method for error reporting
    - _Requirements: 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_

  - [ ]* 2.5 Write property test for Excel parse round trip
    - **Property 3: Excel Parse Round Trip**
    - **Validates: Requirements 2.2, 2.4**
    - Generate random valid Excel data, parse and validate, verify structure matches

  - [x] 2.6 Create ApiIntegrationService for external data
    - Implement fetchPurchaseOrders method
    - Add transformApiResponse method
    - Implement error logging and admin notifications
    - Add retry strategy for transient errors
    - _Requirements: 2.5, 2.6, 2.7, 13.1, 13.2, 13.4_

  - [x] 2.7 Create PurchaseOrderListComponent
    - Implement PrimeNG table with lazy loading
    - Add filters (status, date range, supplier)
    - Add search and sort functionality
    - Add action buttons (create, view, edit, delete)
    - Connect to NgRx store
    - _Requirements: 2.1_

  - [x] 2.8 Create PurchaseOrderFormComponent with input method selector
    - Implement input method selection (Excel/API/Manual)
    - Create dynamic form that switches based on selected method
    - Add preview panel for Excel/API data
    - Implement validation and error display
    - _Requirements: 2.1, 2.8, 2.9, 2.11_

  - [x] 2.9 Create ExcelUploadComponent
    - Implement file upload with drag-and-drop using PrimeNG p-fileUpload
    - Add template download button
    - Add progress indicator
    - Display error report with row/column details
    - _Requirements: 2.2, 2.3, 2.4, 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 2.10 Write property test for required field validation
    - **Property 4: Required Field Validation**
    - **Validates: Requirements 2.3, 2.6, 2.9, 2.11**
    - Generate random PO data with missing fields, verify rejection with error messages

  - [x] 2.11 Create ApiIntegrationComponent
    - Add connection status indicator
    - Implement manual trigger for API data fetch
    - Add data preview grid
    - Display validation errors
    - _Requirements: 2.5, 2.6, 2.7_

  - [x] 2.12 Create ManualEntryComponent for PO
    - Implement header information form
    - Create line items table with add/remove functionality
    - Add item lookup integration
    - Implement quantity and price calculations
    - _Requirements: 2.8, 2.9_

  - [ ]* 2.13 Write property test for input method persistence
    - **Property 5: Input Method Persistence**
    - **Validates: Requirements 2.10**
    - Generate random POs with different input methods, save and retrieve, verify method preserved

  - [ ]* 2.14 Write property test for order persistence round trip
    - **Property 6: Order Persistence Round Trip**
    - **Validates: Requirements 2.12**
    - Generate random PO data, save and retrieve, verify all fields match

  - [x] 2.15 Create PurchaseOrderDetailComponent
    - Implement read-only view of PO details
    - Add linked inbound transactions display
    - Create status history timeline using PrimeNG p-timeline
    - Add print/export functionality
    - _Requirements: 2.1_

  - [ ]* 2.16 Write unit tests for PurchaseOrderFormComponent
    - Test input method switching
    - Test form validation
    - Test preview functionality
    - Test error handling
    - _Requirements: 2.1, 2.8, 2.9, 2.11_

- [ ] 3. Checkpoint - Verify Phase 1 and 2 completion
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Phase 3: Inbound-PO Integration
  - [x] 4.1 Extend InboundHeader model with PO reference
    - Add purchaseOrderId, purchaseOrderNumber fields
    - Add autoPopulatedFromPO, poLinkDate, poLinkBy fields
    - Create POLookupCriteria interface
    - _Requirements: 4.6, 4.8_

  - [x] 4.2 Update Inbound NgRx store for PO linking
    - Add actions for PO lookup and linking
    - Update reducer to handle PO reference
    - Add effects for PO lookup API calls
    - Create selectors for PO-linked inbounds
    - _Requirements: 4.1, 4.6_

  - [x] 4.3 Create PurchaseOrderLookupComponent
    - Implement reusable lookup dialog using PrimeNG p-dialog
    - Add search by PO number, supplier, date
    - Create grid display with selection
    - Add filter by status (exclude fully received)
    - _Requirements: 4.1, 4.2_

  - [ ]* 4.4 Write property test for PO lookup search correctness
    - **Property 7: PO Lookup Search Correctness**
    - **Validates: Requirements 4.1, 4.2**
    - Generate random search criteria, verify all returned POs match criteria

  - [x] 4.5 Enhance InboundFormComponent with PO lookup
    - Add PO lookup button and dialog integration
    - Implement auto-population from selected PO
    - Add manual override capability
    - Display PO reference in form
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.7_

  - [ ]* 4.6 Write property test for PO-to-Inbound auto-population
    - **Property 8: PO-to-Inbound Auto-Population**
    - **Validates: Requirements 4.3, 4.4, 4.5**
    - Generate random POs, select in inbound form, verify all fields populated correctly

  - [ ]* 4.7 Write property test for transaction-order reference persistence
    - **Property 9: Transaction-Order Reference Persistence**
    - **Validates: Requirements 4.6, 4.8**
    - Generate random inbound with PO link, save and retrieve, verify PO reference preserved

  - [x] 4.8 Update InboundDetailComponent to show PO link
    - Add PO reference display section
    - Add link to view linked PO details
    - Update UI to show auto-population indicator
    - _Requirements: 4.8_

  - [ ]* 4.9 Write unit tests for PO lookup and linking
    - Test lookup dialog functionality
    - Test auto-population behavior
    - Test manual override capability
    - Test PO reference display
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.8_

- [x] 5. Phase 4: Sales Order Module
  - [x] 5.1 Create Sales Order data models
    - Create SalesOrderHeader and SalesOrderDetail interfaces
    - Create SOStatus enum (PENDING, PARTIALLY_SHIPPED, FULLY_SHIPPED, CANCELLED)
    - Create SOFilters and SOLookupCriteria interfaces
    - _Requirements: 5.1, 5.11_

  - [x] 5.2 Create Sales Order NgRx store
    - Create actions for load, create, update, delete, updateStatus
    - Create reducer with order state, filters, and pagination
    - Create effects for API calls with error handling
    - Create selectors for filtering and lookup
    - _Requirements: 5.1, 5.13, 5.14_

  - [x] 5.3 Implement SalesOrderService
    - Create service methods for CRUD operations
    - Add methods for status updates and lookup
    - Implement filtering and search functionality
    - Add deletion validation (check for linked outbounds)
    - _Requirements: 5.1, 5.13, 5.14, 5.15, 5.16, 5.17_

  - [x] 5.4 Update ApiIntegrationService for Sales Orders
    - Implement fetchSalesOrders method
    - Add SO-specific validation
    - Reuse error handling and retry logic
    - _Requirements: 5.6, 5.7, 5.8_

  - [x] 5.5 Create SalesOrderListComponent
    - Implement PrimeNG table with lazy loading
    - Add filters (status, date range, customer)
    - Add search and sort functionality
    - Add action buttons (create, view, edit, delete)
    - Connect to NgRx store
    - _Requirements: 5.14_

  - [x] 5.6 Create SalesOrderFormComponent with input method selector
    - Implement input method selection (Excel/API/Manual)
    - Create dynamic form that switches based on selected method
    - Add preview panel for Excel/API data
    - Implement validation and error display
    - Reuse ExcelUploadComponent and ApiIntegrationComponent
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.12_

  - [x] 5.7 Create ManualEntryComponent for SO
    - Implement header information form
    - Create line items table with add/remove functionality
    - Add item lookup integration (Finished Goods only)
    - Implement quantity and price calculations
    - _Requirements: 5.9, 5.10_

  - [ ]* 5.8 Write property test for SO deletion constraint
    - **Property 12: Sales Order Deletion Constraint**
    - **Validates: Requirements 5.16, 5.17**
    - Generate random SOs with/without linked outbounds, verify deletion rules enforced

  - [x] 5.9 Create SalesOrderDetailComponent
    - Implement read-only view of SO details
    - Add linked outbound transactions display
    - Create status history timeline using PrimeNG p-timeline
    - Add print/export functionality
    - _Requirements: 5.1_

  - [ ]* 5.10 Write unit tests for SalesOrderFormComponent
    - Test input method switching
    - Test form validation
    - Test preview functionality
    - Test deletion validation
    - _Requirements: 5.2, 5.9, 5.10, 5.12, 5.16, 5.17_

- [ ] 6. Checkpoint - Verify Phase 3 and 4 completion
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Phase 5: Outbound-SO Integration
  - [ ] 7.1 Extend OutboundHeader model with SO reference
    - Add salesOrderId, salesOrderNumber fields
    - Add autoPopulatedFromSO, soLinkDate, soLinkBy fields
    - Create SOLookupCriteria interface
    - _Requirements: 7.6, 7.8_

  - [ ] 7.2 Update Outbound NgRx store for SO linking
    - Add actions for SO lookup and linking
    - Update reducer to handle SO reference
    - Add effects for SO lookup API calls
    - Create selectors for SO-linked outbounds
    - _Requirements: 7.1, 7.6_

  - [ ] 7.3 Create SalesOrderLookupComponent
    - Implement reusable lookup dialog using PrimeNG p-dialog
    - Add search by SO number, customer, date
    - Create grid display with selection
    - Add filter by status (exclude fully shipped)
    - _Requirements: 7.1, 7.2_

  - [ ]* 7.4 Write property test for SO lookup search correctness
    - **Property 10: SO Lookup Search Correctness**
    - **Validates: Requirements 7.1, 7.2**
    - Generate random search criteria, verify all returned SOs match criteria

  - [ ] 7.5 Enhance OutboundFormComponent with SO lookup
    - Add SO lookup button and dialog integration
    - Implement auto-population from selected SO
    - Add manual override capability
    - Display SO reference in form
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.7_

  - [ ]* 7.6 Write property test for SO-to-Outbound auto-population
    - **Property 11: SO-to-Outbound Auto-Population**
    - **Validates: Requirements 7.3, 7.4, 7.5**
    - Generate random SOs, select in outbound form, verify all fields populated correctly

  - [ ] 7.7 Update OutboundDetailComponent to show SO link
    - Add SO reference display section
    - Add link to view linked SO details
    - Update UI to show auto-population indicator
    - _Requirements: 7.8_

  - [ ]* 7.8 Write unit tests for SO lookup and linking
    - Test lookup dialog functionality
    - Test auto-population behavior
    - Test manual override capability
    - Test SO reference display
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.8_

- [ ] 8. Phase 6: Stock Adjustment with Approval Workflow
  - [ ] 8.1 Create Stock Adjustment data models
    - Create StockAdjustmentHeader and StockAdjustmentDetail interfaces
    - Create AdjustmentType enum (INCREASE, DECREASE)
    - Create ReasonCategory enum (PHYSICAL_COUNT, DAMAGE, EXPIRY, THEFT, SYSTEM_ERROR, OTHER)
    - Create AdjustmentStatus enum (PENDING, APPROVED, REJECTED)
    - Create StockAdjustmentAudit interface with AuditAction enum
    - Create AdjustmentFilters interface
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

  - [ ] 8.2 Create Stock Adjustment NgRx store
    - Create actions for load, create, approve, reject, getAuditTrail
    - Create reducer with adjustment state, pending approvals, audit trail
    - Create effects for API calls with error handling
    - Create selectors for filtering and pending approvals
    - _Requirements: 8.1, 8.6, 8.7, 8.8, 8.9_

  - [ ] 8.3 Implement StockAdjustmentService
    - Create service methods for CRUD operations
    - Add approve and reject methods
    - Implement getAuditTrail method
    - Add getPendingApprovals method
    - Implement filtering functionality
    - _Requirements: 8.1, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 9.1, 9.7_

  - [ ] 8.4 Create custom validators for stock adjustments
    - Implement positiveNumberValidator
    - Implement stockAvailabilityValidator (check available stock for decreases)
    - Implement itemCategoryValidator
    - Add async recordLockValidator
    - _Requirements: 8.3, 8.4_

  - [ ] 8.5 Create StockAdjustmentFormComponent
    - Implement reactive form with validation
    - Add item lookup and selection
    - Add adjustment type selector (increase/decrease)
    - Add quantity input with validation
    - Add reason dropdown (predefined + custom)
    - Add notes textarea
    - Add submit for approval button
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 8.6 Write property test for stock adjustment workflow state
    - **Property 13: Stock Adjustment Workflow State**
    - **Validates: Requirements 8.6, 8.12, 8.13**
    - Generate random adjustments, submit them, verify PENDING status and immutability

  - [ ] 8.7 Create StockAdjustmentListComponent
    - Implement PrimeNG table with lazy loading
    - Add filters (status, date range, item, user)
    - Add status badges with color coding using PrimeNG p-tag
    - Add action buttons based on permissions
    - Connect to NgRx store
    - _Requirements: 8.7_

  - [ ] 8.8 Create StockAdjustmentApprovalComponent
    - Implement pending adjustments queue
    - Add approval/rejection actions
    - Add comment input for approval decision
    - Implement batch approval capability
    - Add permission checks
    - _Requirements: 8.8, 8.9, 14.1, 14.2, 14.3_

  - [ ]* 8.9 Write property test for approval inventory update
    - **Property 14: Approval Inventory Update**
    - **Validates: Requirements 8.10, 8.11**
    - Generate random adjustments, approve/reject them, verify inventory changes correctly

  - [ ] 8.10 Create StockAdjustmentDetailComponent
    - Implement read-only view of adjustment details
    - Add approval history timeline using PrimeNG p-timeline
    - Display before/after quantity
    - Show audit trail information
    - _Requirements: 8.1, 9.7_

  - [ ] 8.11 Create StockAdjustmentAuditComponent
    - Implement comprehensive audit trail view
    - Add filters (date, item, user, action)
    - Add export to Excel functionality
    - Create timeline visualization
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

  - [ ]* 8.12 Write property test for audit trail completeness
    - **Property 15: Audit Trail Completeness**
    - **Validates: Requirements 9.2, 9.3, 9.4, 9.5, 9.6**
    - Generate random adjustments with state transitions, verify all audit entries present

  - [ ]* 8.13 Write property test for audit trail immutability
    - **Property 16: Audit Trail Immutability**
    - **Validates: Requirements 9.9**
    - Create audit records, attempt modifications, verify immutability enforced

  - [ ]* 8.14 Write property test for audit trail filtering
    - **Property 17: Audit Trail Filtering**
    - **Validates: Requirements 9.8**
    - Generate random filter criteria, verify all returned audit records match filters

  - [ ]* 8.15 Write unit tests for StockAdjustmentFormComponent
    - Test form validation
    - Test quantity validation against available stock
    - Test reason category selection
    - Test submission workflow
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 8.16 Write unit tests for approval workflow
    - Test approval permission checks
    - Test approval/rejection actions
    - Test inventory updates
    - Test audit trail creation
    - _Requirements: 8.8, 8.9, 8.10, 8.11, 14.2, 14.3_

- [ ] 9. Cross-Cutting Concerns: Validation and Business Rules
  - [ ] 9.1 Implement item category validation for orders
    - Create BusinessRuleValidator class
    - Implement validateItemCategory method (RAW_MATERIAL for PO, FINISHED_GOOD for SO)
    - Add validation to PO and SO services
    - Add validation to Excel and API importers
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 9.2 Write property test for item category validation
    - **Property 18: Item Category Validation for Orders**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.6**
    - Generate random orders with mixed item categories, verify validation rules enforced

  - [ ] 9.3 Implement order status calculation logic
    - Add status calculation to PO service (based on received quantities)
    - Add status calculation to SO service (based on shipped quantities)
    - Update status when transactions are linked
    - Add status update effects to NgRx stores
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 9.4 Write property test for order status calculation
    - **Property 19: Order Status Calculation**
    - **Validates: Requirements 11.3, 11.4**
    - Generate random orders with varying fulfillment levels, verify status calculated correctly

  - [ ] 9.5 Implement status filtering for order lists
    - Add status filter to PO list component
    - Add status filter to SO list component
    - Update NgRx selectors for status filtering
    - _Requirements: 11.5, 11.6_

  - [ ]* 9.6 Write property test for status filter correctness
    - **Property 20: Status Filter Correctness**
    - **Validates: Requirements 11.6**
    - Generate random status filters, verify all returned orders match filter

  - [ ] 9.7 Implement Excel validation error reporting
    - Enhance ExcelService with detailed error reporting
    - Add row number, column name, value, and message to errors
    - Implement error report download functionality
    - Prevent saving until all errors corrected
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [ ]* 9.8 Write property test for Excel validation error reporting
    - **Property 21: Excel Validation Error Reporting**
    - **Validates: Requirements 12.2, 12.3, 12.4, 12.5**
    - Generate random Excel files with errors, verify error report completeness

  - [ ] 9.9 Implement API error logging and notification
    - Enhance ApiIntegrationService with comprehensive error logging
    - Add admin notification system for API errors
    - Create API error log view
    - Implement error details capture
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 9.10 Write property test for API error logging
    - **Property 22: API Error Logging and Notification**
    - **Validates: Requirements 13.1, 13.2, 13.4**
    - Generate random API errors, verify logging and notification completeness

- [ ] 10. Cross-Cutting Concerns: Security and Permissions
  - [ ] 10.1 Implement approval permission system
    - Create permission constants and enums
    - Add permission checks to StockAdjustmentApprovalComponent
    - Implement permission validation in service layer
    - Add error messages for unauthorized attempts
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ]* 10.2 Write property test for approval permission enforcement
    - **Property 23: Approval Permission Enforcement**
    - **Validates: Requirements 14.2, 14.3**
    - Generate random users with/without permissions, verify approval rules enforced

  - [ ] 10.3 Implement RecordLockService
    - Create RecordLock and RecordLockStatus interfaces
    - Implement acquireLock method
    - Implement releaseLock method
    - Implement checkLock method
    - Add automatic lock expiration (30 minutes)
    - Implement releaseAllLocks for cleanup
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ] 10.4 Integrate record locking into forms
    - Add lock acquisition when opening records for edit
    - Add lock release on save/cancel
    - Display lock status messages to users
    - Add async validator for record lock checking
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ]* 10.5 Write property test for record lock lifecycle
    - **Property 24: Record Lock Lifecycle**
    - **Validates: Requirements 15.1, 15.2, 15.3, 15.4**
    - Generate random record operations, verify lock acquisition/release lifecycle

  - [ ]* 10.6 Write unit tests for RecordLockService
    - Test lock acquisition
    - Test lock release
    - Test concurrent edit prevention
    - Test automatic expiration
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 11. Final Integration and Testing
  - [ ] 11.1 Create shared components and utilities
    - Create reusable lookup dialog base component
    - Create form error helper utility
    - Create validation message display component
    - Create status badge component
    - _Requirements: All_

  - [ ] 11.2 Implement HTTP error interceptor enhancements
    - Add validation error handling (400)
    - Add authorization error handling (401, 403)
    - Add conflict error handling (409)
    - Add server error handling (500)
    - Implement retry strategy for transient errors
    - _Requirements: All_

  - [ ] 11.3 Create routing configuration
    - Define routes for all new modules
    - Add route guards for permissions
    - Configure lazy loading for feature modules
    - _Requirements: All_

  - [ ] 11.4 Update navigation and menu structure
    - Add menu items for Purchase Orders
    - Add menu items for Sales Orders
    - Add menu items for Stock Adjustments
    - Update item master menu with category views
    - _Requirements: All_

  - [ ]* 11.5 Write integration tests for complete workflows
    - Test PO creation through Excel upload
    - Test inbound transaction with PO linking
    - Test SO creation through API integration
    - Test outbound transaction with SO linking
    - Test stock adjustment approval workflow
    - _Requirements: All_

  - [ ]* 11.6 Write E2E tests for critical paths
    - Test complete PO-to-Inbound workflow
    - Test complete SO-to-Outbound workflow
    - Test stock adjustment creation and approval
    - Test item category separation
    - _Requirements: All_

- [ ] 12. Final Checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check with 100 iterations
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a phased approach to enable incremental delivery
- All components use Angular 20.3.0 standalone architecture
- All UI components use PrimeNG 20.4.0 with TailwindCSS 4.1.12 styling
- All state management uses NgRx 20.1.0 with effects pattern
- Checkpoints ensure validation at key milestones
