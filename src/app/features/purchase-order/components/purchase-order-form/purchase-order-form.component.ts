import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { MessageModule as MessagesModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services and Models
import { PurchaseOrderService, CreatePurchaseOrderDto } from '../../services/purchase-order.service';
import { InputMethod, PurchaseOrderLine } from '../../models/purchase-order.model';
import { ExcelService, ExcelParseResult } from '../../../../core/services/excel.service';
import { ApiIntegrationService, ApiSyncResult } from '../../../../core/services/api-integration.service';

/**
 * PurchaseOrderFormComponent
 * 
 * Multi-method input form for creating Purchase Orders.
 * Supports three input methods:
 * - Excel Upload: Parse and validate Excel files
 * - API Integration: Fetch data from external systems
 * - Manual Entry: Direct form input
 * 
 * Requirements: 2.1, 2.8, 2.9, 2.11
 */
@Component({
    selector: 'app-purchase-order-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        SelectModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
        TableModule,
        MessageModule,
        MessagesModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './purchase-order-form.component.html',
    styleUrls: ['./purchase-order-form.component.css']
})
export class PurchaseOrderFormComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Form
    purchaseOrderForm!: FormGroup;

    // Input method selection
    inputMethods = [
        { label: 'Excel Upload', value: InputMethod.EXCEL, icon: 'pi pi-file-excel' },
        { label: 'API Integration', value: InputMethod.API, icon: 'pi pi-cloud-download' },
        { label: 'Manual Entry', value: InputMethod.MANUAL, icon: 'pi pi-pencil' }
    ];
    selectedInputMethod: InputMethod = InputMethod.MANUAL;

    // Preview data
    previewData: PurchaseOrderLine[] = [];
    showPreview = false;
    hasErrors = false;
    errorMessages: string[] = [];

    // Loading states
    loading = false;
    saving = false;

    // Dropdown options (would typically come from services)
    suppliers = [
        { label: 'Supplier A', value: 'SUP-001' },
        { label: 'Supplier B', value: 'SUP-002' },
        { label: 'Supplier C', value: 'SUP-003' }
    ];

    warehouses = [
        { label: 'Warehouse 1', value: 'WH-001' },
        { label: 'Warehouse 2', value: 'WH-002' }
    ];

    currencies = [
        { label: 'IDR', value: 'IDR' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private purchaseOrderService: PurchaseOrderService,
        private excelService: ExcelService,
        private apiIntegrationService: ApiIntegrationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize the purchase order form
     */
    private initializeForm(): void {
        this.purchaseOrderForm = this.fb.group({
            poNumber: ['', [Validators.required, Validators.maxLength(50)]],
            poDate: [new Date(), Validators.required],
            supplierId: ['', Validators.required],
            warehouseId: ['', Validators.required],
            deliveryDate: [''],
            currency: ['IDR', Validators.required],
            exchangeRate: [1],
            paymentTerms: [''],
            notes: ['', Validators.maxLength(500)],
            details: this.fb.array([])
        });
    }

    /**
     * Get form array for line items
     */
    get details(): FormArray {
        return this.purchaseOrderForm.get('details') as FormArray;
    }

    /**
     * Handle input method change
     */
    onInputMethodChange(method: InputMethod): void {
        this.selectedInputMethod = method;
        this.resetPreview();
    }

    /**
     * Handle Excel file upload
     */
    onExcelFileSelected(event: any): void {
        const file = event.target.files[0];
        if (!file) return;

        this.loading = true;
        this.resetPreview();

        // Define column mapping for Purchase Order Excel
        const columnMapping = {
            lineNumber: { excelColumn: 'Line Number', required: true, type: 'number' as const },
            itemCode: { excelColumn: 'Item Code', required: true, type: 'string' as const },
            itemName: { excelColumn: 'Item Name', required: true, type: 'string' as const },
            hsCode: { excelColumn: 'HS Code', required: true, type: 'string' as const },
            orderedQuantity: { excelColumn: 'Quantity', required: true, type: 'number' as const },
            unit: { excelColumn: 'Unit', required: true, type: 'string' as const },
            unitPrice: { excelColumn: 'Unit Price', required: true, type: 'number' as const },
            deliveryDate: { excelColumn: 'Delivery Date', required: false, type: 'date' as const },
            notes: { excelColumn: 'Notes', required: false, type: 'string' as const }
        };

        this.excelService.parseExcelFile<PurchaseOrderLine>(file, columnMapping)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result: ExcelParseResult<PurchaseOrderLine>) => {
                    this.handleExcelParseResult(result);
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Excel Parse Error',
                        detail: 'Failed to parse Excel file. Please check the file format.'
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Handle Excel parse result
     */
    private handleExcelParseResult(result: ExcelParseResult<PurchaseOrderLine>): void {
        if (result.success) {
            this.previewData = result.validRows;
            this.showPreview = true;
            this.hasErrors = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Excel Parsed Successfully',
                detail: `${result.validCount} rows validated successfully`
            });
        } else {
            this.hasErrors = true;
            this.errorMessages = result.errors.map(err =>
                `Row ${err.row}, Column ${err.column}: ${err.message}`
            );
            if (result.validCount > 0) {
                this.previewData = result.validRows;
                this.showPreview = true;
            }
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Errors',
                detail: `${result.errorCount} errors found. ${result.validCount} rows are valid.`
            });
        }
    }

    /**
     * Download Excel template
     */
    downloadTemplate(): void {
        const templateConfig = {
            fileName: 'purchase_order_template.xlsx',
            sheetName: 'Purchase Orders',
            sampleData: [
                {
                    'Line Number': 1,
                    'Item Code': 'ITEM-001',
                    'Item Name': 'Raw Material A',
                    'HS Code': '1234.56.78',
                    'Quantity': 100,
                    'Unit': 'pcs',
                    'Unit Price': 50000,
                    'Delivery Date': '2024-02-15',
                    'Notes': 'Sample notes'
                }
            ],
            columnWidths: [12, 15, 25, 15, 12, 10, 15, 15, 30]
        };

        this.excelService.generateTemplate(templateConfig);
        this.messageService.add({
            severity: 'info',
            summary: 'Template Downloaded',
            detail: 'Excel template has been downloaded'
        });
    }

    /**
     * Download error report
     */
    downloadErrorReport(): void {
        if (this.errorMessages.length === 0) return;

        const errors = this.errorMessages.map((msg, index) => {
            const parts = msg.split(':');
            const rowCol = parts[0].split(',');
            return {
                row: parseInt(rowCol[0].replace('Row ', '')),
                column: rowCol[1]?.replace(' Column ', '').trim() || '',
                value: '',
                message: parts[1]?.trim() || msg
            };
        });

        this.excelService.exportErrorReport(errors, 'purchase_order_errors.xlsx');
        this.messageService.add({
            severity: 'info',
            summary: 'Error Report Downloaded',
            detail: 'Error report has been downloaded'
        });
    }

    /**
     * Fetch data from API
     */
    fetchFromApi(): void {
        this.loading = true;
        this.resetPreview();

        const criteria = {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            dateTo: new Date()
        };

        this.apiIntegrationService.fetchPurchaseOrders(criteria)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result: ApiSyncResult<any>) => {
                    this.handleApiSyncResult(result);
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'API Integration Error',
                        detail: 'Failed to fetch data from API. Please try again.'
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Handle API sync result
     */
    private handleApiSyncResult(result: ApiSyncResult<any>): void {
        if (result.success && result.data.length > 0) {
            // Transform API data to preview format
            this.previewData = result.data.map((item: any, index: number) => ({
                lineNumber: index + 1,
                itemCode: item.itemCode || '',
                itemName: item.itemName || '',
                hsCode: item.hsCode || '',
                orderedQuantity: item.quantity || 0,
                unit: item.unit || '',
                unitPrice: item.unitPrice || 0,
                totalPrice: (item.quantity || 0) * (item.unitPrice || 0),
                deliveryDate: item.deliveryDate,
                notes: item.notes || ''
            }));
            this.showPreview = true;
            this.hasErrors = false;
            this.messageService.add({
                severity: 'success',
                summary: 'API Data Fetched',
                detail: `${result.data.length} items fetched successfully`
            });
        } else if (result.errors.length > 0) {
            this.hasErrors = true;
            this.errorMessages = result.errors.map(err => `${err.code}: ${err.message}`);
            this.messageService.add({
                severity: 'error',
                summary: 'API Validation Errors',
                detail: `${result.errors.length} errors found`
            });
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'No Data',
                detail: 'No purchase orders found in the specified date range'
            });
        }
    }

    /**
     * Add manual line item
     */
    addLineItem(): void {
        const lineItem = this.fb.group({
            lineNumber: [this.details.length + 1],
            itemCode: ['', Validators.required],
            itemName: ['', Validators.required],
            hsCode: ['', Validators.required],
            orderedQuantity: [0, [Validators.required, Validators.min(1)]],
            unit: ['', Validators.required],
            unitPrice: [0, [Validators.required, Validators.min(0)]],
            deliveryDate: [''],
            notes: ['']
        });

        this.details.push(lineItem);
    }

    /**
     * Remove line item
     */
    removeLineItem(index: number): void {
        this.details.removeAt(index);
        // Renumber remaining items
        this.details.controls.forEach((control, i) => {
            control.get('lineNumber')?.setValue(i + 1);
        });
    }

    /**
     * Confirm preview and populate form
     */
    confirmPreview(): void {
        if (this.hasErrors) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Errors',
                detail: 'Please fix all errors before confirming'
            });
            return;
        }

        // Clear existing line items
        this.details.clear();

        // Add preview data to form
        this.previewData.forEach(line => {
            const lineItem = this.fb.group({
                lineNumber: [line.lineNumber],
                itemCode: [line.itemCode, Validators.required],
                itemName: [line.itemName, Validators.required],
                hsCode: [line.hsCode, Validators.required],
                orderedQuantity: [line.orderedQuantity, [Validators.required, Validators.min(1)]],
                unit: [line.unit, Validators.required],
                unitPrice: [line.unitPrice, [Validators.required, Validators.min(0)]],
                deliveryDate: [line.deliveryDate],
                notes: [line.notes || '']
            });
            this.details.push(lineItem);
        });

        this.showPreview = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Data Loaded',
            detail: `${this.previewData.length} items loaded into form`
        });
    }

    /**
     * Cancel preview
     */
    cancelPreview(): void {
        this.resetPreview();
    }

    /**
     * Reset preview state
     */
    private resetPreview(): void {
        this.previewData = [];
        this.showPreview = false;
        this.hasErrors = false;
        this.errorMessages = [];
    }

    /**
     * Submit the purchase order
     */
    onSubmit(): void {
        if (this.purchaseOrderForm.invalid) {
            this.markFormGroupTouched(this.purchaseOrderForm);
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        if (this.details.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'No Line Items',
                detail: 'Please add at least one line item'
            });
            return;
        }

        this.saving = true;

        const formValue = this.purchaseOrderForm.value;
        const createDto: CreatePurchaseOrderDto = {
            poNumber: formValue.poNumber,
            poDate: formValue.poDate,
            supplierId: formValue.supplierId,
            warehouseId: formValue.warehouseId,
            inputMethod: this.selectedInputMethod,
            deliveryDate: formValue.deliveryDate,
            currency: formValue.currency,
            exchangeRate: formValue.exchangeRate,
            paymentTerms: formValue.paymentTerms,
            notes: formValue.notes,
            details: formValue.details.map((detail: any) => ({
                lineNumber: detail.lineNumber,
                itemId: detail.itemCode, // In real app, would lookup item ID
                orderedQuantity: detail.orderedQuantity,
                unit: detail.unit,
                unitPrice: detail.unitPrice,
                deliveryDate: detail.deliveryDate,
                notes: detail.notes
            }))
        };

        this.purchaseOrderService.createOrder(createDto)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (order) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Purchase Order ${order.poNumber} created successfully`
                    });
                    setTimeout(() => {
                        this.router.navigate(['/purchase-orders']);
                    }, 1500);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Failed to create purchase order'
                    });
                    this.saving = false;
                }
            });
    }

    /**
     * Cancel and return to list
     */
    onCancel(): void {
        this.router.navigate(['/purchase-orders']);
    }

    /**
     * Mark all form controls as touched to trigger validation
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            } else if (control instanceof FormArray) {
                control.controls.forEach(c => {
                    if (c instanceof FormGroup) {
                        this.markFormGroupTouched(c);
                    }
                });
            }
        });
    }

    /**
     * Check if form field has error
     */
    hasError(fieldName: string): boolean {
        const field = this.purchaseOrderForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.purchaseOrderForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) return `${fieldName} is required`;
        if (field.errors['maxlength']) return `Maximum length exceeded`;
        if (field.errors['min']) return `Value must be greater than ${field.errors['min'].min}`;

        return 'Invalid value';
    }
}
