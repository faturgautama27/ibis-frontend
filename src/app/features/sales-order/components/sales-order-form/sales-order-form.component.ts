import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Shared Components
import { InputMethodSelectorComponent, InputMethod } from '../../../../shared/components/input-method-selector/input-method-selector.component';
import { LineItemsFormComponent, LineItemData } from '../../../../shared/components/line-items-form/line-items-form.component';

// Services and Models
import { createOrder, updateOrder } from '../../store/sales-order.actions';
import { ExcelService, ExcelParseResult } from '../../../../core/services/excel.service';
import { ApiIntegrationService, ApiSyncResult } from '../../../../core/services/api-integration.service';
import { ItemCategory } from '../../../../features/item-master/models/item-category.enum';

/**
 * Sales Order Form Component
 * Multi-method input selector (Excel/API/Manual) with dynamic form
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.12
 * - Implements input method selection (Excel/API/Manual)
 * - Dynamic form based on selected method
 * - Preview panel for Excel/API data
 * - Validation and error display
 * - Reuses ExcelUploadComponent and ApiIntegrationComponent
 */
@Component({
    selector: 'app-sales-order-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        TextareaModule,
        CardModule,
        TableModule,
        MessageModule,
        ToastModule,
        InputMethodSelectorComponent,
        LineItemsFormComponent
    ],
    providers: [MessageService],
    templateUrl: './sales-order-form.component.html',
    styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit, OnDestroy {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private excelService = inject(ExcelService);
    private apiIntegrationService = inject(ApiIntegrationService);
    private messageService = inject(MessageService);
    private destroy$ = new Subject<void>();

    // Expose enums to template
    InputMethod = InputMethod;
    ItemCategory = ItemCategory;

    // Selected input method
    selectedInputMethod: InputMethod = InputMethod.MANUAL;

    // Form group
    salesOrderForm!: FormGroup;

    // Mode (create or edit)
    isEditMode = false;
    orderId: string | null = null;

    // Preview data
    previewData: any[] = [];
    showPreview = false;
    hasErrors = false;
    errorMessages: string[] = [];

    // Loading states
    loading = false;
    saving = false;

    // Dropdown options
    customers = [
        { label: 'PT Retail Sejahtera', value: 'CUST-001' },
        { label: 'CV Distributor Maju', value: 'CUST-002' },
        { label: 'PT Toko Modern', value: 'CUST-003' },
        { label: 'UD Warung Berkah', value: 'CUST-004' },
        { label: 'PT Grosir Nusantara', value: 'CUST-005' }
    ];

    warehouses = [
        { label: 'Warehouse Jakarta', value: 'WH-001' },
        { label: 'Warehouse Surabaya', value: 'WH-002' },
        { label: 'Warehouse Bandung', value: 'WH-003' }
    ];

    currencies = [
        { label: 'Indonesian Rupiah (IDR)', value: 'IDR' },
        { label: 'US Dollar (USD)', value: 'USD' },
        { label: 'Euro (EUR)', value: 'EUR' }
    ];

    shippingMethods = [
        { label: 'Express Delivery', value: 'EXPRESS' },
        { label: 'Standard Delivery', value: 'STANDARD' },
        { label: 'Economy Delivery', value: 'ECONOMY' },
        { label: 'Pickup', value: 'PICKUP' }
    ];

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.orderId;

        this.initializeForm();

        if (this.isEditMode && this.orderId) {
            this.loadOrder(this.orderId);
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize the form
     */
    private initializeForm(): void {
        this.salesOrderForm = this.fb.group({
            soNumber: ['', Validators.required],
            soDate: [new Date(), Validators.required],
            customerId: ['', Validators.required],
            warehouseId: ['', Validators.required],
            shippingAddress: ['', Validators.required],
            shippingMethod: [''],
            deliveryDate: [null],
            currency: ['IDR', Validators.required],
            exchangeRate: [1],
            paymentTerms: [''],
            notes: [''],
            details: this.fb.array([])
        });
    }

    /**
     * Get form array for line items
     */
    get details(): FormArray {
        return this.salesOrderForm.get('details') as FormArray;
    }

    /**
     * Load order for editing
     */
    private loadOrder(orderId: string): void {
        // TODO: Load order from store
        console.log('Loading order:', orderId);
    }

    /**
     * Handle input method selection
     */
    onInputMethodChange(method: InputMethod): void {
        this.selectedInputMethod = method;
        this.resetPreview();
    }

    /**
     * Handle line items changes
     */
    onLineItemsChanged(items: LineItemData[]): void {
        // Update form validation or perform other actions
        console.log('Line items changed:', items);
    }

    /**
     * Handle Excel file upload
     */
    onExcelFileSelected(event: any): void {
        const file = event.target.files[0];
        if (!file) return;

        this.loading = true;
        this.resetPreview();

        // Define column mapping for Sales Order Excel
        const columnMapping = {
            lineNumber: { excelColumn: 'Line Number', required: true, type: 'number' as const },
            itemCode: { excelColumn: 'Item Code', required: true, type: 'string' as const },
            itemName: { excelColumn: 'Item Name', required: true, type: 'string' as const },
            hsCode: { excelColumn: 'HS Code', required: true, type: 'string' as const },
            quantity: { excelColumn: 'Quantity', required: true, type: 'number' as const },
            unit: { excelColumn: 'Unit', required: true, type: 'string' as const },
            unitPrice: { excelColumn: 'Unit Price', required: true, type: 'number' as const },
            deliveryDate: { excelColumn: 'Delivery Date', required: false, type: 'date' as const },
            notes: { excelColumn: 'Notes', required: false, type: 'string' as const }
        };

        this.excelService.parseExcelFile<any>(file, columnMapping)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (result: ExcelParseResult<any>) => {
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
    private handleExcelParseResult(result: ExcelParseResult<any>): void {
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
            fileName: 'sales_order_template.xlsx',
            sheetName: 'Sales Orders',
            sampleData: [
                {
                    'Line Number': 1,
                    'Item Code': 'ITEM-001',
                    'Item Name': 'Finished Product X',
                    'HS Code': '1234.56.78',
                    'Quantity': 10,
                    'Unit': 'pcs',
                    'Unit Price': 75000,
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

        this.excelService.exportErrorReport(errors, 'sales_order_errors.xlsx');
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

        this.apiIntegrationService.fetchSalesOrders(criteria)
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
                quantity: item.quantity || 0,
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
                detail: 'No sales orders found in the specified date range'
            });
        }
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
                quantity: [line.quantity, [Validators.required, Validators.min(1)]],
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
     * Handle form submission
     */
    onSubmit(): void {
        if (this.salesOrderForm.invalid) {
            this.markFormGroupTouched(this.salesOrderForm);
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

        const formValue = this.salesOrderForm.value;
        const orderData = {
            ...formValue,
            inputMethod: this.selectedInputMethod,
            details: formValue.details || []
        };

        if (this.isEditMode && this.orderId) {
            this.store.dispatch(updateOrder({
                orderId: this.orderId,
                order: orderData,
                details: orderData.details
            }));
        } else {
            this.store.dispatch(createOrder({
                order: orderData,
                details: orderData.details
            }));
        }

        // Navigate back after a delay
        setTimeout(() => {
            this.router.navigate(['/sales-order']);
        }, 1500);
    }

    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/sales-order']);
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
        const field = this.salesOrderForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.salesOrderForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) return `${fieldName} is required`;
        if (field.errors['maxlength']) return `Maximum length exceeded`;
        if (field.errors['min']) return `Value must be greater than ${field.errors['min'].min}`;

        return 'Invalid value';
    }
}
