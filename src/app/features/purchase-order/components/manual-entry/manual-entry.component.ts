import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PurchaseOrderHeader } from '../../models/purchase-order.model';

/**
 * ManualEntryComponent
 * Component for manual entry of Purchase Orders with header form and line items table
 * Requirements: 2.8, 2.9
 */
@Component({
    selector: 'app-manual-entry',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        DatePickerModule,
        SelectModule,
        InputNumberModule,
        TextareaModule,
        ButtonModule,
        TableModule,
        DialogModule
    ],
    templateUrl: './manual-entry.component.html',
    styleUrls: ['./manual-entry.component.css']
})
export class ManualEntryComponent implements OnInit {
    @Output() formSubmit = new EventEmitter<any>();
    @Output() formCancel = new EventEmitter<void>();

    poForm!: FormGroup;
    showItemLookup: boolean = false;
    selectedLineIndex: number = -1;

    // Dropdown options (in real app, these would come from services)
    suppliers = [
        { id: 'SUP-001', code: 'SUP-001', name: 'Supplier A' },
        { id: 'SUP-002', code: 'SUP-002', name: 'Supplier B' },
        { id: 'SUP-003', code: 'SUP-003', name: 'Supplier C' }
    ];

    warehouses = [
        { id: 'WH-001', code: 'WH-001', name: 'Warehouse Main' },
        { id: 'WH-002', code: 'WH-002', name: 'Warehouse Secondary' }
    ];

    currencies = [
        { code: 'IDR', name: 'Indonesian Rupiah' },
        { code: 'USD', name: 'US Dollar' },
        { code: 'EUR', name: 'Euro' }
    ];

    units = [
        { code: 'pcs', name: 'Pieces' },
        { code: 'kg', name: 'Kilogram' },
        { code: 'liter', name: 'Liter' },
        { code: 'box', name: 'Box' }
    ];

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    /**
     * Initialize the purchase order form
     */
    private initializeForm(): void {
        this.poForm = this.fb.group({
            poNumber: ['', [Validators.required, Validators.maxLength(50)]],
            poDate: [new Date(), Validators.required],
            supplierId: ['', Validators.required],
            warehouseId: ['', Validators.required],
            deliveryDate: [''],
            currency: ['IDR', Validators.required],
            exchangeRate: [1],
            paymentTerms: ['', Validators.maxLength(200)],
            notes: ['', Validators.maxLength(500)],
            details: this.fb.array([], Validators.minLength(1))
        });
    }

    /**
     * Get line items form array
     */
    get lineItems(): FormArray {
        return this.poForm.get('details') as FormArray;
    }

    /**
     * Create a new line item form group
     */
    private createLineItemForm(): FormGroup {
        return this.fb.group({
            lineNumber: [this.lineItems.length + 1],
            itemId: ['', Validators.required],
            itemCode: ['', Validators.required],
            itemName: ['', Validators.required],
            hsCode: [''],
            orderedQuantity: [0, [Validators.required, Validators.min(1)]],
            unit: ['pcs', Validators.required],
            unitPrice: [0, [Validators.required, Validators.min(0)]],
            totalPrice: [{ value: 0, disabled: true }],
            deliveryDate: [''],
            notes: ['', Validators.maxLength(200)]
        });
    }

    /**
     * Add new line item
     */
    addLineItem(): void {
        const lineItem = this.createLineItemForm();

        // Subscribe to quantity and price changes to calculate total
        lineItem.get('orderedQuantity')?.valueChanges.subscribe(() => {
            this.calculateLineTotal(this.lineItems.length);
        });

        lineItem.get('unitPrice')?.valueChanges.subscribe(() => {
            this.calculateLineTotal(this.lineItems.length);
        });

        this.lineItems.push(lineItem);
    }

    /**
     * Remove line item at index
     */
    removeLineItem(index: number): void {
        this.lineItems.removeAt(index);
        this.updateLineNumbers();
    }

    /**
     * Update line numbers after removal
     */
    private updateLineNumbers(): void {
        this.lineItems.controls.forEach((control, index) => {
            control.get('lineNumber')?.setValue(index + 1);
        });
    }

    /**
     * Calculate total price for a line item
     */
    private calculateLineTotal(index: number): void {
        const lineItem = this.lineItems.at(index);
        const quantity = lineItem.get('orderedQuantity')?.value || 0;
        const unitPrice = lineItem.get('unitPrice')?.value || 0;
        const total = quantity * unitPrice;

        lineItem.get('totalPrice')?.setValue(total, { emitEvent: false });
    }

    /**
     * Open item lookup dialog for a specific line
     */
    openItemLookup(index: number): void {
        this.selectedLineIndex = index;
        this.showItemLookup = true;
    }

    /**
     * Handle item selection from lookup
     */
    onItemSelected(item: any): void {
        if (this.selectedLineIndex >= 0) {
            const lineItem = this.lineItems.at(this.selectedLineIndex);
            lineItem.patchValue({
                itemId: item.id,
                itemCode: item.itemCode,
                itemName: item.itemName,
                hsCode: item.hsCode,
                unit: item.unit || 'pcs'
            });
        }
        this.showItemLookup = false;
        this.selectedLineIndex = -1;
    }

    /**
     * Get total quantity across all line items
     */
    getTotalQuantity(): number {
        return this.lineItems.controls.reduce((sum, control) => {
            return sum + (control.get('orderedQuantity')?.value || 0);
        }, 0);
    }

    /**
     * Get total value across all line items
     */
    getTotalValue(): number {
        return this.lineItems.controls.reduce((sum, control) => {
            const quantity = control.get('orderedQuantity')?.value || 0;
            const unitPrice = control.get('unitPrice')?.value || 0;
            return sum + (quantity * unitPrice);
        }, 0);
    }

    /**
     * Check if form is valid
     */
    isFormValid(): boolean {
        return this.poForm.valid && this.lineItems.length > 0;
    }

    /**
     * Submit the form
     */
    onSubmit(): void {
        if (this.isFormValid()) {
            const formValue = this.poForm.getRawValue();

            // Add calculated totals
            const poData = {
                ...formValue,
                totalItems: this.lineItems.length,
                totalQuantity: this.getTotalQuantity(),
                totalValue: this.getTotalValue(),
                inputMethod: 'MANUAL'
            };

            this.formSubmit.emit(poData);
        }
    }

    /**
     * Cancel form and reset
     */
    onCancel(): void {
        this.poForm.reset();
        this.lineItems.clear();
        this.formCancel.emit();
    }

    /**
     * Get error message for a form control
     */
    getErrorMessage(controlName: string): string {
        const control = this.poForm.get(controlName);
        if (!control || !control.errors || !control.touched) return '';

        if (control.errors['required']) return `${controlName} is required`;
        if (control.errors['maxlength']) return `Maximum length exceeded`;
        if (control.errors['min']) return `Value must be greater than ${control.errors['min'].min}`;

        return 'Invalid value';
    }

    /**
     * Get error message for a line item control
     */
    getLineItemError(index: number, controlName: string): string {
        const control = this.lineItems.at(index).get(controlName);
        if (!control || !control.errors || !control.touched) return '';

        if (control.errors['required']) return 'Required';
        if (control.errors['min']) return `Min: ${control.errors['min'].min}`;

        return 'Invalid';
    }
}
