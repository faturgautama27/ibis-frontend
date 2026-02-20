# Requirements Document

## Introduction

This document specifies the requirements for enhancing the IBIS (Integrated Bonded Inventory System) with six major feature improvements: separation of master data items into Raw Materials and Finished Goods, enhanced Purchase Order input methods, Inbound-PO integration, new Sales Order functionality, Outbound-SO integration, and Stock Adjustment capabilities. These enhancements will improve data organization, streamline order processing, and provide better inventory control mechanisms.

## Glossary

- **IBIS**: Integrated Bonded Inventory System - the inventory management application
- **Raw_Material**: Items used as input in production processes (Bahan Baku)
- **Finished_Good**: Completed products ready for sale (Barang Jadi)
- **Item_Master**: Master data repository for inventory items
- **Purchase_Order**: Document specifying items to be purchased from suppliers (PO)
- **Sales_Order**: Document specifying items to be sold to customers (SO)
- **Inbound_Transaction**: Record of goods received into inventory
- **Outbound_Transaction**: Record of goods shipped from inventory
- **Stock_Adjustment**: Manual correction to inventory quantities
- **Excel_Importer**: Component that processes Excel file uploads
- **API_Integrator**: Component that receives data from external systems
- **Manual_Form**: User interface for direct data entry
- **Lookup_Component**: Search interface for finding existing records
- **Approval_Workflow**: Process requiring authorization before completion
- **Audit_Trail**: Historical record of all changes to data

## Requirements

### Requirement 1: Separate Raw Materials and Finished Goods

**User Story:** As an inventory manager, I want to manage Raw Materials and Finished Goods separately, so that I can organize items by their purpose in the supply chain.

#### Acceptance Criteria

1. THE Item_Master SHALL categorize each item as either Raw_Material or Finished_Good
2. THE IBIS SHALL provide separate list views for Raw_Material and Finished_Good
3. THE IBIS SHALL provide separate creation forms for Raw_Material and Finished_Good
4. THE IBIS SHALL provide separate edit forms for Raw_Material and Finished_Good
5. WHEN displaying the item list, THE IBIS SHALL provide filter controls to switch between Raw_Material and Finished_Good views
6. THE IBIS SHALL prevent changing an item's category after creation
7. WHEN searching for items, THE IBIS SHALL allow filtering by item category

### Requirement 2: Purchase Order Multi-Method Input

**User Story:** As a procurement officer, I want to create Purchase Orders through Excel upload, API integration, or manual entry, so that I can efficiently process orders from various sources.

#### Acceptance Criteria

1. THE Purchase_Order_Form SHALL provide three input method options: Excel upload, API integration, and manual entry
2. WHEN Excel upload is selected, THE Excel_Importer SHALL accept Excel files containing Purchase Order data
3. WHEN Excel upload is selected, THE Excel_Importer SHALL validate all required fields are present in the uploaded file
4. WHEN Excel upload is selected, THE Excel_Importer SHALL display a preview of parsed data before saving
5. WHEN API integration is selected, THE API_Integrator SHALL receive Purchase Order data from external systems
6. WHEN API integration is selected, THE API_Integrator SHALL validate all required fields are present in the received data
7. WHEN API integration is selected, THE API_Integrator SHALL display a preview of received data before saving
8. WHEN manual entry is selected, THE Manual_Form SHALL provide input fields for all Purchase Order attributes
9. WHEN manual entry is selected, THE Manual_Form SHALL validate all required fields before allowing save
10. THE IBIS SHALL store the input method used for each Purchase Order
11. WHEN validation fails for any input method, THE IBIS SHALL display specific error messages indicating which fields are invalid
12. WHEN the user confirms the preview, THE IBIS SHALL save the Purchase Order to the database

### Requirement 3: Purchase Order Excel Template

**User Story:** As a procurement officer, I want to download an Excel template for Purchase Orders, so that I can ensure my uploaded files have the correct format.

#### Acceptance Criteria

1. THE IBIS SHALL provide a downloadable Excel template for Purchase Order data entry
2. THE Excel_Template SHALL include column headers for all required Purchase Order fields
3. THE Excel_Template SHALL include example data rows demonstrating correct format
4. THE Excel_Template SHALL include data validation rules where applicable

### Requirement 4: Inbound Transaction with Purchase Order Lookup

**User Story:** As a warehouse operator, I want to link Inbound Transactions to existing Purchase Orders, so that I can track which orders have been received.

#### Acceptance Criteria

1. THE Inbound_Form SHALL provide a Purchase Order lookup function
2. WHEN the user searches for a Purchase Order, THE Lookup_Component SHALL display matching Purchase Orders based on PO number or supplier
3. WHEN the user selects a Purchase Order, THE Inbound_Form SHALL auto-populate item details from the selected Purchase Order
4. WHEN the user selects a Purchase Order, THE Inbound_Form SHALL auto-populate quantity from the selected Purchase Order
5. WHEN the user selects a Purchase Order, THE Inbound_Form SHALL auto-populate supplier information from the selected Purchase Order
6. THE IBIS SHALL store the Purchase Order reference with each Inbound_Transaction
7. THE IBIS SHALL allow creating Inbound_Transaction without a Purchase Order reference
8. WHEN displaying Inbound_Transaction details, THE IBIS SHALL show the linked Purchase Order number if one exists

### Requirement 5: Sales Order Implementation

**User Story:** As a sales coordinator, I want to create and manage Sales Orders, so that I can track customer orders and prepare for shipments.

#### Acceptance Criteria

1. THE IBIS SHALL provide a Sales Order management module
2. THE Sales_Order_Form SHALL provide three input method options: Excel upload, API integration, and manual entry
3. WHEN Excel upload is selected, THE Excel_Importer SHALL accept Excel files containing Sales Order data
4. WHEN Excel upload is selected, THE Excel_Importer SHALL validate all required fields are present in the uploaded file
5. WHEN Excel upload is selected, THE Excel_Importer SHALL display a preview of parsed data before saving
6. WHEN API integration is selected, THE API_Integrator SHALL receive Sales Order data from external systems
7. WHEN API integration is selected, THE API_Integrator SHALL validate all required fields are present in the received data
8. WHEN API integration is selected, THE API_Integrator SHALL display a preview of received data before saving
9. WHEN manual entry is selected, THE Manual_Form SHALL provide input fields for all Sales Order attributes
10. WHEN manual entry is selected, THE Manual_Form SHALL validate all required fields before allowing save
11. THE IBIS SHALL store the input method used for each Sales Order
12. WHEN validation fails for any input method, THE IBIS SHALL display specific error messages indicating which fields are invalid
13. WHEN the user confirms the preview, THE IBIS SHALL save the Sales Order to the database
14. THE IBIS SHALL provide a list view displaying all Sales Orders
15. THE IBIS SHALL allow editing existing Sales Orders
16. THE IBIS SHALL allow deleting Sales Orders that have no linked Outbound_Transaction
17. THE IBIS SHALL prevent deleting Sales Orders that have linked Outbound_Transaction

### Requirement 6: Sales Order Excel Template

**User Story:** As a sales coordinator, I want to download an Excel template for Sales Orders, so that I can ensure my uploaded files have the correct format.

#### Acceptance Criteria

1. THE IBIS SHALL provide a downloadable Excel template for Sales Order data entry
2. THE Excel_Template SHALL include column headers for all required Sales Order fields
3. THE Excel_Template SHALL include example data rows demonstrating correct format
4. THE Excel_Template SHALL include data validation rules where applicable

### Requirement 7: Outbound Transaction with Sales Order Lookup

**User Story:** As a warehouse operator, I want to link Outbound Transactions to existing Sales Orders, so that I can track which orders have been shipped.

#### Acceptance Criteria

1. THE Outbound_Form SHALL provide a Sales Order lookup function
2. WHEN the user searches for a Sales Order, THE Lookup_Component SHALL display matching Sales Orders based on SO number or customer
3. WHEN the user selects a Sales Order, THE Outbound_Form SHALL auto-populate item details from the selected Sales Order
4. WHEN the user selects a Sales Order, THE Outbound_Form SHALL auto-populate quantity from the selected Sales Order
5. WHEN the user selects a Sales Order, THE Outbound_Form SHALL auto-populate customer information from the selected Sales Order
6. THE IBIS SHALL store the Sales Order reference with each Outbound_Transaction
7. THE IBIS SHALL allow creating Outbound_Transaction without a Sales Order reference
8. WHEN displaying Outbound_Transaction details, THE IBIS SHALL show the linked Sales Order number if one exists

### Requirement 8: Stock Adjustment Feature

**User Story:** As an inventory manager, I want to manually adjust stock quantities with proper documentation, so that I can correct inventory discrepancies.

#### Acceptance Criteria

1. THE IBIS SHALL provide a Stock Adjustment creation form
2. THE Stock_Adjustment_Form SHALL require selection of an item from Item_Master
3. THE Stock_Adjustment_Form SHALL require entry of adjustment quantity (positive or negative)
4. THE Stock_Adjustment_Form SHALL require entry of adjustment reason
5. THE Stock_Adjustment_Form SHALL allow entry of additional notes
6. WHEN a Stock Adjustment is submitted, THE IBIS SHALL route it to the Approval_Workflow
7. THE IBIS SHALL provide a list view displaying all Stock Adjustments with their approval status
8. THE IBIS SHALL allow authorized users to approve pending Stock Adjustments
9. THE IBIS SHALL allow authorized users to reject pending Stock Adjustments
10. WHEN a Stock Adjustment is approved, THE IBIS SHALL update the inventory quantity for the affected item
11. WHEN a Stock Adjustment is rejected, THE IBIS SHALL not update the inventory quantity
12. THE IBIS SHALL prevent editing Stock Adjustments after submission
13. THE IBIS SHALL prevent deleting Stock Adjustments after submission

### Requirement 9: Stock Adjustment Audit Trail

**User Story:** As an auditor, I want to view the complete history of stock adjustments, so that I can verify inventory accuracy and accountability.

#### Acceptance Criteria

1. THE IBIS SHALL record all Stock Adjustment transactions in the Audit_Trail
2. THE Audit_Trail SHALL capture the user who created each Stock Adjustment
3. THE Audit_Trail SHALL capture the timestamp when each Stock Adjustment was created
4. THE Audit_Trail SHALL capture the user who approved or rejected each Stock Adjustment
5. THE Audit_Trail SHALL capture the timestamp when each Stock Adjustment was approved or rejected
6. THE Audit_Trail SHALL capture the before and after inventory quantities for each approved Stock Adjustment
7. THE IBIS SHALL provide a view displaying the Audit_Trail for Stock Adjustments
8. WHEN viewing the Audit_Trail, THE IBIS SHALL allow filtering by date range, item, or user
9. THE IBIS SHALL prevent modification of Audit_Trail records

### Requirement 10: Data Validation for Order Items

**User Story:** As a data quality manager, I want all order items to reference valid inventory items, so that I can prevent data inconsistencies.

#### Acceptance Criteria

1. WHEN creating a Purchase Order, THE IBIS SHALL validate that all items exist in Item_Master
2. WHEN creating a Purchase Order, THE IBIS SHALL validate that all items are categorized as Raw_Material
3. WHEN creating a Sales Order, THE IBIS SHALL validate that all items exist in Item_Master
4. WHEN creating a Sales Order, THE IBIS SHALL validate that all items are categorized as Finished_Good
5. WHEN validation fails, THE IBIS SHALL display error messages identifying invalid items
6. THE IBIS SHALL prevent saving orders with invalid item references

### Requirement 11: Order Status Tracking

**User Story:** As an operations manager, I want to track the fulfillment status of orders, so that I can monitor order completion.

#### Acceptance Criteria

1. THE IBIS SHALL assign a status to each Purchase Order: Pending, Partially_Received, or Fully_Received
2. THE IBIS SHALL assign a status to each Sales Order: Pending, Partially_Shipped, or Fully_Shipped
3. WHEN an Inbound_Transaction is linked to a Purchase Order, THE IBIS SHALL update the Purchase Order status based on received quantities
4. WHEN an Outbound_Transaction is linked to a Sales Order, THE IBIS SHALL update the Sales Order status based on shipped quantities
5. THE IBIS SHALL display order status in list views
6. THE IBIS SHALL allow filtering orders by status

### Requirement 12: Excel Import Error Handling

**User Story:** As a data entry clerk, I want clear feedback when Excel imports fail, so that I can correct errors and successfully import data.

#### Acceptance Criteria

1. WHEN Excel file parsing fails, THE Excel_Importer SHALL display an error message indicating the file format is invalid
2. WHEN Excel data validation fails, THE Excel_Importer SHALL display error messages for each invalid row
3. THE Excel_Importer SHALL indicate the row number and column name for each validation error
4. THE Excel_Importer SHALL allow the user to download an error report listing all validation failures
5. WHEN validation errors exist, THE Excel_Importer SHALL prevent saving the data until errors are corrected

### Requirement 13: API Integration Error Handling

**User Story:** As a system administrator, I want proper error handling for API integrations, so that I can troubleshoot integration issues.

#### Acceptance Criteria

1. WHEN API data reception fails, THE API_Integrator SHALL log the error details
2. WHEN API data reception fails, THE API_Integrator SHALL display an error message to the user
3. WHEN API data validation fails, THE API_Integrator SHALL display error messages for each invalid field
4. WHEN API integration errors occur, THE IBIS SHALL send notifications to system administrators
5. THE IBIS SHALL provide a log view displaying API integration history and errors

### Requirement 14: User Permissions for Approvals

**User Story:** As a system administrator, I want to control which users can approve stock adjustments, so that I can maintain proper authorization controls.

#### Acceptance Criteria

1. THE IBIS SHALL define a permission for approving Stock Adjustments
2. THE IBIS SHALL only display approval actions to users with approval permission
3. WHEN a user without approval permission attempts to approve a Stock Adjustment, THE IBIS SHALL deny the action and display an error message
4. THE IBIS SHALL allow administrators to assign approval permissions to users

### Requirement 15: Concurrent Edit Prevention

**User Story:** As a user, I want to be notified if someone else is editing the same record, so that I don't overwrite their changes.

#### Acceptance Criteria

1. WHEN a user opens a record for editing, THE IBIS SHALL lock the record
2. WHEN another user attempts to edit a locked record, THE IBIS SHALL display a message indicating the record is being edited
3. WHEN a user saves or cancels editing, THE IBIS SHALL release the record lock
4. THE IBIS SHALL automatically release record locks after 30 minutes of inactivity
