import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

// Models and Services
import {
    AdjustmentType,
    ReasonCategory,
    CreateStockAdjustmentDto,
    CreateStockAdjustmentDetailDto,
    getAdjustmentTypeLabel,
    getReasonCategoryLabel
} from '../../models/stock-adjustment.model';
import * as StockAdjustmentActions from '../../store/stock-adjustment.actions';
import { selectLoading, selectSaving, selectError } from '../../store/stock-adjustment.selectors';

// Validators
import {
    positiveNumberValidator,
    adjustmentReasonValidator,
    adjustmentDateValidator,
    itemCategoryValidator,
    getValidationErrorMessage
} from '../../validators/stock-adjustment.validators';

/**
 * StockAdjustmentFormComponent
 * 
 * Form for creating stock adjustments with approval workflow.
 * Supports item lookup, adjustment type selection, quantity validation,
 * and reason categorization.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
@Component({
    selector: 'app-stock-adjustment-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        CardModule,
        SelectModule,
        InputTextModule,
        InputNumberModule,
        TextareaModule,
        DatePickerModule,
        TableModule,
        MessageModule,
        ToastModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        RadioButtonModule
    ],
    providers: [MessageService],
    templateUrl: './stock-adjustment-form.component.html',
    styleUrls: ['./stock-adjustment-form.component.scss']
})
export class StockAdjustmentFormComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private store = inject(Store);
    private messageService = inject(MessageService);

    // Form
    adjustmentForm!: FormGroup;

    // Enums for template
    AdjustmentType = AdjustmentType;
    ReasonCategory = ReasonCategory;

    // Dropdown options
    adjustmentTypes = [
        { label: getAdjustmentTypeLabel(AdjustmentType.INCREASE), value: AdjustmentType.INCREASE },
        { label: getAdjustmentTypeLabel(AdjustmentType.DECREASE), value: AdjustmentType.DECREASE }
    ];

    reasonCategories = [
        { label: getReasonCategoryLabel(ReasonCategory.PHYSICAL_COUNT), value: ReasonCategory.PHYSICAL_COUNT },
        { label: getReasonCategoryLabel(ReasonCategory.DAMAGE), value: ReasonCategory.DAMAGE },
        { label: getReasonCategoryLabel(ReasonCategory.EXPIRY), value: ReasonCategory.EXPIRY },
        { label: getReasonCategoryLabel(ReasonCategory.THEFT), value: ReasonCategory.THEFT },
        { label: getReasonCategoryLabel(ReasonCategory.SYSTEM_ERROR), value: ReasonCategory.SYSTEM_ERROR },
        { label: getReasonCategoryLabel(ReasonCategory.OTHER), value: ReasonCategory.OTHER }
    ];

    warehouses = [
        { label: 'Warehouse 1', value: 'WH-001' },
        { label: 'Warehouse 2', value: 'WH-002' },
        { label: 'Warehouse 3', value: 'WH-003' }
    ];

    // Item lookup
    showItemLookup = false;
    itemSearchQuery = '';
    availableItems: any[] = [];
    selectedItemForLookup: any = null;

    // State
    loading$ = this.store.select(selectLoading);
    saving$ = this.store.select(selectSaving);
    error$ = this.store.select(selectError);

    constructor() { }

    ngOnInit(): void {
        this.initializeForm();
        this.loadMockItems();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialize the stock adjustment form
     */
    private initializeForm(): void {
        this.adjustmentForm = this.fb.group({
            adjustmentDate: [new Date(), [Validators.required, adjustmentDateValidator()]],
            warehouseId: ['', Validators.required],
            notes: ['', Validators.maxLength(500)],
            details: this.fb.array([], Validators.minLength(1))
        });
    }

    /**
     * Get form array for adjustment details
     */
    get details(): FormArray {
        return this.adjustmentForm.get('details') as FormArray;
    }

    /**
     * Load mock items for lookup (in real app, would call service)
     */
    private loadMockItems(): void {
        this.availableItems = [
            {
                id: 'ITEM-001',
                item_code: 'RM-001',
                item_name: 'Raw Material A',
                category: 'RAW_MATERIAL',
                current_stock: 1000,
                unit: 'pcs',
                active: true
            },
            {
                id: 'ITEM-002',
                item_code: 'RM-002',
                item_name: 'Raw Material B',
                category: 'RAW_MATERIAL',
                current_stock: 500,
                unit: 'kg',
                active: true
            },
            {
                id: 'ITEM-003',
                item_code: 'FG-001',
                item_name: 'Finished Good A',
                category: 'FINISHED_GOOD',
                current_stock: 200,
                unit: 'pcs',
                active: true
            },
            {
                id: 'ITEM-004',
                item_code: 'FG-002',
                item_name: 'Finished Good B',
                category: 'FINISHED_GOOD',
                current_stock: 150,
                unit: 'pcs',
                active: true
            }
        ];
    }

    /**
     * Open item lookup dialog
     */
    openItemLookup(): void {
        this.showItemLookup = true;
        this.itemSearchQuery = '';
        this.selectedItemForLookup = null;
    }

    /**
     * Filter items based on search query
     */
    get filteredItems(): any[] {
        if (!this.itemSearchQuery) {
            return this.availableItems;
        }

        const query = this.itemSearchQuery.toLowerCase();
        return this.availableItems.filter(item =>
            item.item_code.toLowerCase().includes(query) ||
            item.item_name.toLowerCase().includes(query)
        );
    }

    /**
     * Select item from lookup
     */
    selectItem(item: any): void {
        this.selectedItemForLookup = item;
    }

    /**
     * Confirm item selection and add to form
     */
    confirmItemSelection(): void {
        if (!this.selectedItemForLookup) {
            this.messageService.add({
                severity: 'warn',
                summary: 'No Selection',
                detail: 'Please select an item'
            });
            return;
        }

        // Check if item already exists in details
        const existingItem = this.details.controls.find(control =>
            control.get('itemId')?.value === this.selectedItemForLookup.id
        );

        if (existingItem) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Duplicate Item',
                detail: 'This item is already in the adjustment list'
            });
            return;
        }

        this.addAdjustmentDetail(this.selectedItemForLookup);
        this.showItemLookup = false;
        this.selectedItemForLookup = null;
    }

    /**
     * Cancel item lookup
     */
    cancelItemLookup(): void {
        this.showItemLookup = false;
        this.selectedItemForLookup = null;
    }

    /**
     * Add adjustment detail line item
     */
    private addAdjustmentDetail(item: any): void {
        const detailGroup = this.fb.group({
            lineNumber: [this.details.length + 1],
            itemId: [item.id, Validators.required],
            itemCode: [item.item_code],
            itemName: [item.item_name],
            item: [item, [Validators.required, itemCategoryValidator()]],
            currentStock: [item.current_stock],
            unit: [item.unit],
            adjustmentType: [AdjustmentType.INCREASE, Validators.required],
            quantity: [0, [Validators.required, positiveNumberValidator()]],
            reasonCategory: [ReasonCategory.PHYSICAL_COUNT, Validators.required],
            reason: ['', [Validators.required, adjustmentReasonValidator()]],
            notes: ['', Validators.maxLength(200)]
        });

        // Add async validator for stock availability when adjustment type changes
        detailGroup.get('adjustmentType')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                detailGroup.get('quantity')?.updateValueAndValidity();
            });

        this.details.push(detailGroup);

        this.messageService.add({
            severity: 'success',
            summary: 'Item Added',
            detail: `${item.item_name} added to adjustment`
        });
    }

    /**
     * Remove adjustment detail line item
     */
    removeDetail(index: number): void {
        const itemName = this.details.at(index).get('itemName')?.value;
        this.details.removeAt(index);

        // Renumber remaining items
        this.details.controls.forEach((control, i) => {
            control.get('lineNumber')?.setValue(i + 1);
        });

        this.messageService.add({
            severity: 'info',
            summary: 'Item Removed',
            detail: `${itemName} removed from adjustment`
        });
    }

    /**
     * Calculate after quantity for a detail line
     */
    getAfterQuantity(detail: any): number {
        const currentStock = detail.get('currentStock')?.value || 0;
        const adjustmentType = detail.get('adjustmentType')?.value;
        const quantity = detail.get('quantity')?.value || 0;

        if (adjustmentType === AdjustmentType.INCREASE) {
            return currentStock + quantity;
        } else {
            return currentStock - quantity;
        }
    }

    /**
     * Check if quantity exceeds available stock for decrease
     */
    hasStockError(detail: any): boolean {
        const adjustmentType = detail.get('adjustmentType')?.value;
        const quantity = detail.get('quantity')?.value || 0;
        const currentStock = detail.get('currentStock')?.value || 0;

        return adjustmentType === AdjustmentType.DECREASE && quantity > currentStock;
    }

    /**
     * Get stock error message
     */
    getStockErrorMessage(detail: any): string {
        const quantity = detail.get('quantity')?.value || 0;
        const currentStock = detail.get('currentStock')?.value || 0;
        return `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`;
    }

    /**
     * Submit the stock adjustment for approval
     */
    onSubmit(): void {
        if (this.adjustmentForm.invalid) {
            this.markFormGroupTouched(this.adjustmentForm);
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields correctly'
            });
            return;
        }

        if (this.details.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'No Items',
                detail: 'Please add at least one item to adjust'
            });
            return;
        }

        // Check for stock errors
        const hasStockErrors = this.details.controls.some(detail => this.hasStockError(detail));
        if (hasStockErrors) {
            this.messageService.add({
                severity: 'error',
                summary: 'Stock Error',
                detail: 'Some items have insufficient stock for decrease adjustments'
            });
            return;
        }

        const formValue = this.adjustmentForm.value;
        const createDto: CreateStockAdjustmentDto = {
            warehouseId: formValue.warehouseId,
            adjustmentDate: formValue.adjustmentDate,
            notes: formValue.notes,
            details: formValue.details.map((detail: any): CreateStockAdjustmentDetailDto => ({
                itemId: detail.itemId,
                adjustmentType: detail.adjustmentType,
                quantity: detail.quantity,
                reason: detail.reason,
                reasonCategory: detail.reasonCategory,
                notes: detail.notes
            }))
        };

        this.store.dispatch(StockAdjustmentActions.createAdjustment({ adjustment: createDto }));

        // Subscribe to success/error
        this.error$
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: string | null) => {
                if (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error
                    });
                }
            });

        // Navigate on success (would typically listen to a success action)
        setTimeout(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Stock adjustment submitted for approval'
            });
            setTimeout(() => {
                this.router.navigate(['/stock-adjustments']);
            }, 1500);
        }, 500);
    }

    /**
     * Cancel and return to list
     */
    onCancel(): void {
        this.router.navigate(['/stock-adjustments']);
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
        const field = this.adjustmentForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.adjustmentForm.get(fieldName);
        if (!field || !field.errors) return '';

        return getValidationErrorMessage(field.errors);
    }

    /**
     * Check if detail field has error
     */
    hasDetailError(detail: any, fieldName: string): boolean {
        const field = detail.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for detail field
     */
    getDetailErrorMessage(detail: any, fieldName: string): string {
        const field = detail.get(fieldName);
        if (!field || !field.errors) return '';

        return getValidationErrorMessage(field.errors);
    }
}
