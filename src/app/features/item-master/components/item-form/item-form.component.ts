import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ItemEnhanced, CreateItemEnhancedDto, UpdateItemEnhancedDto } from '../../models/item-enhanced.model';
import { ItemCategory } from '../../models/item-category.enum';
import { ItemType, FacilityStatus } from '../../../inventory/models/item.model';
import { ItemActions } from '../../../../store/item/item.actions';
import { selectSelectedItem, selectItemSaving } from '../../../../store/item/item.selectors';

/**
 * Item Form Component
 * Handles creation and editing of items with category selection
 * 
 * Requirements:
 * - 1.3: Separate creation forms for Raw Material and Finished Good
 * - 1.4: Separate edit forms for Raw Material and Finished Good
 * - 1.6: Category cannot be changed after creation
 */
@Component({
    selector: 'app-item-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        InputNumberModule,
        CheckboxModule,
        TextareaModule,
        CardModule,
        MessageModule
    ],
    templateUrl: './item-form.component.html',
    styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // Form and state
    itemForm!: FormGroup;
    isEditMode = signal(false);
    itemId = signal<string | null>(null);

    // Store selectors
    selectedItem$ = this.store.select(selectSelectedItem);
    saving$ = this.store.select(selectItemSaving);

    // Dropdown options
    categoryOptions = [
        { label: 'Raw Material', value: ItemCategory.RAW_MATERIAL },
        { label: 'Finished Good', value: ItemCategory.FINISHED_GOOD }
    ];

    itemTypeOptions = [
        { label: 'Raw Material', value: ItemType.RAW },
        { label: 'Work In Progress', value: ItemType.WIP },
        { label: 'Finished Goods', value: ItemType.FG },
        { label: 'Asset', value: ItemType.ASSET }
    ];

    facilityStatusOptions = [
        { label: 'Facility (Bonded)', value: FacilityStatus.FASILITAS },
        { label: 'Non-Facility', value: FacilityStatus.NON }
    ];

    unitOptions = [
        { label: 'Pieces (pcs)', value: 'pcs' },
        { label: 'Kilogram (kg)', value: 'kg' },
        { label: 'Meter (m)', value: 'm' },
        { label: 'Liter (liter)', value: 'liter' },
        { label: 'Box', value: 'box' }
    ];

    currencyOptions = [
        { label: 'IDR', value: 'IDR' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' }
    ];

    ngOnInit(): void {
        this.initializeForm();
        this.checkEditMode();
    }

    /**
     * Initialize the form with validators
     */
    private initializeForm(): void {
        this.itemForm = this.fb.group({
            item_code: ['', [Validators.required, Validators.maxLength(50)]],
            item_name: ['', [Validators.required, Validators.maxLength(200)]],
            hs_code: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
            category: [null, Validators.required],
            item_type: [ItemType.RAW, Validators.required],
            unit: ['', Validators.required],
            is_hazardous: [false],
            facility_status: [FacilityStatus.FASILITAS, Validators.required],
            active: [true],
            description: ['', Validators.maxLength(500)],
            brand: ['', Validators.maxLength(100)],
            min_stock: [null, Validators.min(0)],
            max_stock: [null, Validators.min(0)],
            reorder_point: [null, Validators.min(0)],
            lead_time_days: [null, Validators.min(0)],
            price: [null, Validators.min(0)],
            currency: ['IDR'],
            barcode: ['', Validators.maxLength(50)],
            shelf_life_days: [null, Validators.min(0)],
            storage_condition: ['', Validators.maxLength(200)]
        });
    }

    /**
     * Check if we're in edit mode and load item data
     */
    private checkEditMode(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode.set(true);
            this.itemId.set(id);
            this.store.dispatch(ItemActions.loadItem({ id }));

            // Subscribe to selected item and populate form
            this.selectedItem$.subscribe(item => {
                if (item) {
                    this.populateForm(item);
                    // Lock category field in edit mode
                    this.itemForm.get('category')?.disable();
                }
            });
        }
    }

    /**
     * Populate form with item data
     */
    private populateForm(item: ItemEnhanced): void {
        this.itemForm.patchValue({
            item_code: item.item_code,
            item_name: item.item_name,
            hs_code: item.hs_code,
            category: item.category,
            item_type: item.item_type,
            unit: item.unit,
            is_hazardous: item.is_hazardous,
            facility_status: item.facility_status,
            active: item.active,
            description: item.description,
            brand: item.brand,
            min_stock: item.min_stock,
            max_stock: item.max_stock,
            reorder_point: item.reorder_point,
            lead_time_days: item.lead_time_days,
            price: item.price,
            currency: item.currency,
            barcode: item.barcode,
            shelf_life_days: item.shelf_life_days,
            storage_condition: item.storage_condition
        });
    }

    /**
     * Submit form
     */
    onSubmit(): void {
        if (this.itemForm.invalid) {
            this.itemForm.markAllAsTouched();
            return;
        }

        const formValue = this.itemForm.getRawValue();

        if (this.isEditMode()) {
            // Update existing item
            const updateDto: UpdateItemEnhancedDto = {
                item_name: formValue.item_name,
                hs_code: formValue.hs_code,
                item_type: formValue.item_type,
                unit: formValue.unit,
                is_hazardous: formValue.is_hazardous,
                facility_status: formValue.facility_status,
                active: formValue.active,
                description: formValue.description,
                brand: formValue.brand,
                min_stock: formValue.min_stock,
                max_stock: formValue.max_stock,
                reorder_point: formValue.reorder_point,
                lead_time_days: formValue.lead_time_days,
                price: formValue.price,
                currency: formValue.currency,
                barcode: formValue.barcode,
                shelf_life_days: formValue.shelf_life_days,
                storage_condition: formValue.storage_condition
            };

            this.store.dispatch(ItemActions.updateItem({
                id: this.itemId()!,
                item: updateDto
            }));
        } else {
            // Create new item
            const createDto: CreateItemEnhancedDto = {
                item_code: formValue.item_code,
                item_name: formValue.item_name,
                hs_code: formValue.hs_code,
                category: formValue.category,
                item_type: formValue.item_type,
                unit: formValue.unit,
                is_hazardous: formValue.is_hazardous,
                facility_status: formValue.facility_status,
                active: formValue.active,
                description: formValue.description,
                brand: formValue.brand,
                min_stock: formValue.min_stock,
                max_stock: formValue.max_stock,
                reorder_point: formValue.reorder_point,
                lead_time_days: formValue.lead_time_days,
                price: formValue.price,
                currency: formValue.currency,
                barcode: formValue.barcode,
                shelf_life_days: formValue.shelf_life_days,
                storage_condition: formValue.storage_condition
            };

            this.store.dispatch(ItemActions.createItem({ item: createDto }));
        }

        // Navigate back to list after a short delay
        setTimeout(() => {
            this.router.navigate(['/item-master']);
        }, 1000);
    }

    /**
     * Cancel and navigate back
     */
    onCancel(): void {
        this.router.navigate(['/item-master']);
    }

    /**
     * Check if field has error
     */
    hasError(fieldName: string): boolean {
        const field = this.itemForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Get error message for field
     */
    getErrorMessage(fieldName: string): string {
        const field = this.itemForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }
        if (field.errors['maxlength']) {
            return `${this.getFieldLabel(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
        }
        if (field.errors['pattern']) {
            return `${this.getFieldLabel(fieldName)} format is invalid`;
        }
        if (field.errors['min']) {
            return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['min'].min}`;
        }

        return 'Invalid value';
    }

    /**
     * Get field label for error messages
     */
    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            item_code: 'Item Code',
            item_name: 'Item Name',
            hs_code: 'HS Code',
            category: 'Category',
            item_type: 'Item Type',
            unit: 'Unit',
            facility_status: 'Facility Status',
            description: 'Description',
            brand: 'Brand',
            min_stock: 'Minimum Stock',
            max_stock: 'Maximum Stock',
            reorder_point: 'Reorder Point',
            lead_time_days: 'Lead Time',
            price: 'Price',
            currency: 'Currency',
            barcode: 'Barcode',
            shelf_life_days: 'Shelf Life',
            storage_condition: 'Storage Condition'
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Check if category is locked (edit mode)
     */
    isCategoryLocked(): boolean {
        return this.isEditMode();
    }
}
