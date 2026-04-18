import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';

// Enhanced Components
import {
    EnhancedButtonComponent,
    EnhancedCardComponent,
    EnhancedFormFieldComponent,
    PageHeaderComponent
} from '../../../../shared/components';
import { InputMethod } from '../../models/sales-order.model';
import { createOrder, updateOrder } from '../../store/sales-order.actions';

/**
 * Sales Order Form Component
 * Multi-method input selector (Excel/API/Manual) with dynamic form
 * 
 * Requirements:
 * - 18.2: Apply enhanced styling to Sales Order Form page
 * - 18.4: Apply consistent styling patterns across sales order workflows
 * - 18.5: Maintain all existing functionality in the Sales Order module
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
        // Enhanced Components
        EnhancedButtonComponent,
        EnhancedCardComponent,
        EnhancedFormFieldComponent,
        PageHeaderComponent
    ],
    templateUrl: './sales-order-form.component.html',
    styleUrls: ['./sales-order-form.component.scss']
})
export class SalesOrderFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // Expose enum to template
    InputMethod = InputMethod;

    // Selected input method
    selectedInputMethod: InputMethod = InputMethod.MANUAL;

    // Form group
    salesOrderForm!: FormGroup;

    // Mode (create or edit)
    isEditMode = false;
    orderId: string | null = null;

    // Input method options
    inputMethodOptions = [
        { label: 'Excel Upload', value: InputMethod.EXCEL, icon: 'pi pi-file-excel' },
        { label: 'API Integration', value: InputMethod.API, icon: 'pi pi-cloud' },
        { label: 'Manual Entry', value: InputMethod.MANUAL, icon: 'pi pi-pencil' }
    ];

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.orderId;

        this.initializeForm();

        if (this.isEditMode && this.orderId) {
            this.loadOrder(this.orderId);
        }
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
            notes: ['']
        });
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
    }

    /**
     * Handle form submission
     */
    onSubmit(): void {
        if (this.salesOrderForm.invalid) {
            this.salesOrderForm.markAllAsTouched();
            return;
        }

        const formValue = this.salesOrderForm.value;
        const orderData = {
            ...formValue,
            inputMethod: this.selectedInputMethod
        };

        if (this.isEditMode && this.orderId) {
            this.store.dispatch(updateOrder({
                orderId: this.orderId,
                order: orderData,
                details: []
            }));
        } else {
            this.store.dispatch(createOrder({
                order: orderData,
                details: []
            }));
        }

        this.router.navigate(['/sales-order']);
    }

    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/sales-order']);
    }
}
