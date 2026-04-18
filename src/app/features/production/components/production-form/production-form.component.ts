import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';

// Lucide icons
import { LucideAngularModule, Factory, Plus, Trash2 } from 'lucide-angular';

// Enhanced Components
// Using inline enhanced styling instead of separate components for better compatibility

// Services
import { ProductionDemoService } from '../../services/production-demo.service';
import { WarehouseDemoService } from '../../../warehouse/services/warehouse-demo.service';
import { InventoryDemoService } from '../../../inventory/services/inventory-demo.service';

// Models
import { WOStatus } from '../../models/production.model';
import { Warehouse } from '../../../warehouse/models/warehouse.model';
import { Item, ItemType } from '../../../inventory/models/item.model';
import { EnhancedCardComponent, EnhancedFormFieldComponent, PageHeaderComponent } from '@app/shared/components';

/**
 * Production Form Component
 * Requirements: 9.2, 9.3, 9.4, 9.5
 */
@Component({
  selector: 'app-production-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    InputNumberModule,
    TableModule,
    ToastModule,
    DialogModule,
    LucideAngularModule,
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedFormFieldComponent,

  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Enhanced Page Header -->
      <app-page-header
        [title]="isEditMode ? 'Edit Work Order' : 'Create Work Order'"
        [subtitle]="isEditMode ? 'Edit production work order details' : 'Create a new production work order'"
        icon="pi pi-cog"
        [showBackButton]="true"
        [primaryAction]="{
          label: isEditMode ? 'Update Work Order' : 'Create Work Order',
          icon: 'pi pi-check',
          loading: loading,
          disabled: productionForm.invalid || loading || materials.length === 0
        }"
        (back)="onCancel()"
        (primaryActionClick)="onSubmit()">
      </app-page-header>

      <!-- Main Content -->
      <div class="p-6">

        <form [formGroup]="productionForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Basic Information Card -->
          <app-enhanced-card variant="standard" title="Basic Information" [header]="true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-enhanced-form-field
                label="WO Number"
                [required]="true"
                [hasError]="isFieldInvalid('wo_number')"
                errorMessage="WO number is required">
                <input 
                  pInputText 
                  formControlName="wo_number" 
                  class="w-full enhanced-input"
                  placeholder="Enter work order number" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="WO Date"
                [required]="true"
                [hasError]="isFieldInvalid('wo_date')"
                errorMessage="WO date is required">
                <p-datepicker
                  formControlName="wo_date"
                  dateFormat="dd/mm/yy"
                  [showIcon]="true"
                  class="w-full enhanced-input"
                  placeholder="Select work order date" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Status"
                helpText="Status will be automatically managed">
                <p-select
                  formControlName="status"
                  [options]="statusOptions"
                  class="w-full enhanced-input"
                  [disabled]="isEditMode"
                  placeholder="Select status" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Warehouse"
                [required]="true"
                [hasError]="isFieldInvalid('warehouse_name')"
                errorMessage="Warehouse is required">
                <p-select
                  formControlName="warehouse_name"
                  [options]="warehouseOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select warehouse"
                  [filter]="true"
                  filterBy="label"
                  class="w-full enhanced-input"
                  (onChange)="onWarehouseChange($event)" />
              </app-enhanced-form-field>
            </div>
          </app-enhanced-card>

          <!-- Output Product Card -->
          <app-enhanced-card variant="standard" title="Output Product (Finished Goods)" [header]="true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-enhanced-form-field
                label="Output Item"
                [required]="true"
                [hasError]="isFieldInvalid('output_item_code')"
                errorMessage="Output item is required"
                helpText="Select the finished goods item to be produced">
                <p-select
                  formControlName="output_item_code"
                  [options]="itemOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select output item"
                  [filter]="true"
                  filterBy="label"
                  class="w-full enhanced-input"
                  (onChange)="onOutputItemChange($event)" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Output Item Name"
                helpText="Automatically filled when item is selected">
                <input 
                  pInputText 
                  formControlName="output_item_name" 
                  class="w-full enhanced-input" 
                  [readonly]="true"
                  placeholder="Item name will appear here" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Planned Quantity"
                [required]="true"
                [hasError]="isFieldInvalid('planned_quantity')"
                errorMessage="Planned quantity is required">
                <p-inputnumber 
                  formControlName="planned_quantity" 
                  [min]="0" 
                  class="w-full enhanced-input"
                  placeholder="Enter planned quantity" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Unit"
                helpText="Unit of measurement for the item">
                <input 
                  pInputText 
                  formControlName="unit" 
                  class="w-full enhanced-input" 
                  [readonly]="true"
                  placeholder="Unit will appear here" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Actual Quantity"
                helpText="Enter actual produced quantity (edit mode only)">
                <p-inputnumber 
                  formControlName="actual_quantity" 
                  [min]="0" 
                  class="w-full enhanced-input" 
                  [disabled]="!isEditMode"
                  placeholder="Enter actual quantity" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Yield Percentage"
                helpText="Automatically calculated based on actual vs planned">
                <p-inputnumber 
                  formControlName="yield_percentage" 
                  [min]="0" 
                  [max]="100" 
                  suffix="%" 
                  class="w-full enhanced-input" 
                  [disabled]="true"
                  placeholder="Auto-calculated" />
              </app-enhanced-form-field>
            </div>
          </app-enhanced-card>

          <!-- Scrap Information Card -->
          <app-enhanced-card variant="standard" title="Scrap Information" [header]="true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-enhanced-form-field
                label="Scrap Quantity"
                helpText="Enter quantity of scrapped materials">
                <p-inputnumber 
                  formControlName="scrap_quantity" 
                  [min]="0" 
                  class="w-full enhanced-input" 
                  [disabled]="!isEditMode"
                  placeholder="Enter scrap quantity" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Scrap Reason"
                helpText="Reason for material scrap">
                <input 
                  pInputText 
                  formControlName="scrap_reason" 
                  class="w-full enhanced-input" 
                  [disabled]="!isEditMode"
                  placeholder="Enter scrap reason" />
              </app-enhanced-form-field>
            </div>
          </app-enhanced-card>

          <!-- Production Dates Card -->
          <app-enhanced-card variant="standard" title="Production Dates" [header]="true">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <app-enhanced-form-field
                label="Start Date"
                helpText="When production is scheduled to start">
                <p-datepicker
                  formControlName="start_date"
                  dateFormat="dd/mm/yy"
                  [showIcon]="true"
                  class="w-full enhanced-input"
                  placeholder="Select start date" />
              </app-enhanced-form-field>

              <app-enhanced-form-field
                label="Completion Date"
                helpText="When production was completed (edit mode only)">
                <p-datepicker
                  formControlName="completion_date"
                  dateFormat="dd/mm/yy"
                  [showIcon]="true"
                  class="w-full enhanced-input"
                  [disabled]="!isEditMode"
                  placeholder="Select completion date" />
              </app-enhanced-form-field>
            </div>
          </app-enhanced-card>

          <!-- Material Requirements Card -->
          <app-enhanced-card variant="standard" [header]="true">
            <div slot="header" class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Material Requirements (Raw Materials)</h3>
                <p class="text-sm text-gray-600 mt-1">Add raw materials needed for production</p>
              </div>
              <button
                pButton
                type="button"
                label="Add Material"
                icon="pi pi-plus"
                class="p-button-primary hover:shadow-lg hover:scale-105 transition-all duration-200"
                (click)="showAddMaterialDialog()">
              </button>
            </div>

            <p-table [value]="materials" [paginator]="false">
              <ng-template pTemplate="header">
                <tr>
                  <th class="text-left font-semibold text-gray-700 uppercase tracking-wide">Material Code</th>
                  <th class="text-left font-semibold text-gray-700 uppercase tracking-wide">Material Name</th>
                  <th class="text-center font-semibold text-gray-700 uppercase tracking-wide">Required Qty</th>
                  <th class="text-center font-semibold text-gray-700 uppercase tracking-wide">Consumed Qty</th>
                  <th class="text-center font-semibold text-gray-700 uppercase tracking-wide">Unit</th>
                  <th class="text-center font-semibold text-gray-700 uppercase tracking-wide">Batch Number</th>
                  <th class="text-left font-semibold text-gray-700 uppercase tracking-wide">Warehouse</th>
                  <th class="text-center font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-material let-rowIndex="rowIndex">
                <tr class="hover:bg-gray-50 transition-colors duration-200">
                  <td class="font-medium text-gray-900">{{ material.material_item_code }}</td>
                  <td class="text-gray-900">{{ material.material_item_name }}</td>
                  <td class="text-center text-gray-700 font-medium">{{ material.required_quantity | number:'1.0-2' }}</td>
                  <td class="text-center text-gray-700 font-medium">{{ material.consumed_quantity | number:'1.0-2' }}</td>
                  <td class="text-center text-gray-600">{{ material.unit }}</td>
                  <td class="text-center text-gray-600">{{ material.batch_number || '-' }}</td>
                  <td class="text-gray-600">{{ material.warehouse_name }}</td>
                  <td class="text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        pButton
                        icon="pi pi-pencil"
                        class="p-button-text p-button-sm hover:bg-warning-50 hover:text-warning-600 transition-all duration-200 hover:scale-110"
                        pTooltip="Edit Material"
                        tooltipPosition="top"
                        (click)="showEditMaterialDialog(rowIndex)">
                      </button>
                      <button
                        pButton
                        icon="pi pi-trash"
                        class="p-button-text p-button-sm hover:bg-error-50 hover:text-error-600 transition-all duration-200 hover:scale-110"
                        pTooltip="Remove Material"
                        tooltipPosition="top"
                        (click)="removeMaterial(rowIndex)">
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="8" class="text-center py-12">
                    <div class="flex flex-col items-center gap-4">
                      <i class="pi pi-box text-4xl text-gray-300"></i>
                      <div>
                        <h4 class="text-lg font-semibold text-gray-700 mb-2">No Materials Added</h4>
                        <p class="text-gray-500 mb-4">No materials have been added yet. Click "Add Material" to start adding raw materials for production.</p>
                        <button 
                          pButton 
                          type="button" 
                          label="Add First Material" 
                          icon="pi pi-plus"
                          class="p-button-primary hover:shadow-lg hover:scale-105 transition-all duration-200"
                          (click)="showAddMaterialDialog()">
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </app-enhanced-card>

          <!-- Notes Card -->
          <app-enhanced-card variant="standard" title="Additional Notes" [header]="true">
            <app-enhanced-form-field
              label="Notes"
              helpText="Add any additional notes or instructions for this work order">
              <textarea
                pInputTextarea
                formControlName="notes"
                rows="4"
                class="w-full enhanced-input"
                placeholder="Enter additional notes or instructions...">
              </textarea>
            </app-enhanced-form-field>
          </app-enhanced-card>

          <!-- Form Actions -->
          <app-enhanced-card variant="standard">
            <div class="flex justify-end gap-4">
              <button
                pButton
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                class="hover:shadow-md hover:scale-105 transition-all duration-200"
                (click)="onCancel()">
              </button>
              <button
                pButton
                type="submit"
                [label]="isEditMode ? 'Update Work Order' : 'Create Work Order'"
                icon="pi pi-check"
                [loading]="loading"
                [disabled]="productionForm.invalid || loading || materials.length === 0"
                class="hover:shadow-lg hover:scale-105 transition-all duration-200">
              </button>
            </div>
          </app-enhanced-card>
        </form>
      </div>

      <!-- Enhanced Material Dialog -->
      <p-dialog
        [(visible)]="displayMaterialDialog"
        [header]="isEditingMaterial ? 'Edit Material' : 'Add Material'"
        [modal]="true"
        [style]="{width: '700px'}"
        [draggable]="false"
        styleClass="enhanced-dialog">
        
        <form [formGroup]="materialForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Material Selection -->
            <div class="md:col-span-2">
              <app-enhanced-form-field
                label="Material (Raw Material)"
                [required]="true"
                helpText="Select the raw material needed for production">
                <p-select
                  formControlName="material_item_id"
                  [options]="rawMaterialOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select material"
                  [filter]="true"
                  filterBy="label"
                  class="w-full enhanced-input"
                  (onChange)="onMaterialSelect($event)" />
              </app-enhanced-form-field>
            </div>

            <!-- Material Code (readonly) -->
            <app-enhanced-form-field
              label="Material Code"
              helpText="Automatically filled when material is selected">
              <input 
                pInputText 
                formControlName="material_item_code" 
                class="w-full enhanced-input" 
                [readonly]="true"
                placeholder="Material code will appear here" />
            </app-enhanced-form-field>

            <!-- Material Name (readonly) -->
            <app-enhanced-form-field
              label="Material Name"
              helpText="Automatically filled when material is selected">
              <input 
                pInputText 
                formControlName="material_item_name" 
                class="w-full enhanced-input" 
                [readonly]="true"
                placeholder="Material name will appear here" />
            </app-enhanced-form-field>

            <!-- Required Quantity -->
            <app-enhanced-form-field
              label="Required Quantity"
              [required]="true"
              helpText="Quantity needed for production">
              <p-inputNumber
                formControlName="required_quantity"
                [min]="0"
                class="w-full enhanced-input"
                placeholder="Enter required quantity" />
            </app-enhanced-form-field>

            <!-- Consumed Quantity -->
            <app-enhanced-form-field
              label="Consumed Quantity"
              helpText="Actual quantity consumed (edit mode only)">
              <p-inputNumber
                formControlName="consumed_quantity"
                [min]="0"
                class="w-full enhanced-input"
                [disabled]="!isEditMode"
                placeholder="Enter consumed quantity" />
            </app-enhanced-form-field>

            <!-- Unit (readonly) -->
            <app-enhanced-form-field
              label="Unit"
              helpText="Unit of measurement">
              <input 
                pInputText 
                formControlName="unit" 
                class="w-full enhanced-input" 
                [readonly]="true"
                placeholder="Unit will appear here" />
            </app-enhanced-form-field>

            <!-- Batch Number -->
            <app-enhanced-form-field
              label="Batch Number"
              helpText="Optional batch number for traceability">
              <input 
                pInputText 
                formControlName="batch_number" 
                class="w-full enhanced-input"
                placeholder="Enter batch number (optional)" />
            </app-enhanced-form-field>

            <!-- Warehouse -->
            <div class="md:col-span-2">
              <app-enhanced-form-field
                label="Warehouse"
                [required]="true"
                helpText="Select warehouse where material is stored">
                <p-select
                  formControlName="warehouse_name"
                  [options]="warehouseOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select warehouse"
                  [filter]="true"
                  filterBy="label"
                  class="w-full enhanced-input"
                  appendTo="body"
                  (onChange)="onMaterialWarehouseChange($event)" />
              </app-enhanced-form-field>
            </div>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <div class="flex justify-end gap-3">
            <button
              pButton
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              class="hover:shadow-md hover:scale-105 transition-all duration-200"
              (click)="displayMaterialDialog = false">
            </button>
            <button
              pButton
              [label]="isEditingMaterial ? 'Update' : 'Add'"
              icon="pi pi-check"
              [disabled]="materialForm.invalid"
              class="hover:shadow-lg hover:scale-105 transition-all duration-200"
              (click)="saveMaterial()">
            </button>
          </div>
        </ng-template>
      </p-dialog>
    </div>

    <p-toast />
  `
})
export class ProductionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productionService = inject(ProductionDemoService);
  private warehouseService = inject(WarehouseDemoService);
  private inventoryService = inject(InventoryDemoService);
  private messageService = inject(MessageService);

  // Icons
  FactoryIcon = Factory;
  PlusIcon = Plus;
  Trash2Icon = Trash2;

  // Data
  warehouses: Warehouse[] = [];
  warehouseOptions: { label: string; value: string }[] = [];
  items: Item[] = [];
  itemOptions: { label: string; value: string }[] = [];
  rawMaterialOptions: { label: string; value: string }[] = [];
  materials: any[] = [];

  // Form
  productionForm!: FormGroup;
  materialForm!: FormGroup;
  isEditMode = false;
  productionId: string | null = null;
  loading = false;

  // Dialog
  displayMaterialDialog = false;
  isEditingMaterial = false;
  editingMaterialIndex: number = -1;

  // Dropdown options
  statusOptions = [
    { label: 'Planned', value: WOStatus.PLANNED },
    { label: 'In Progress', value: WOStatus.IN_PROGRESS },
    { label: 'Completed', value: WOStatus.COMPLETED },
    { label: 'Cancelled', value: WOStatus.CANCELLED }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.initializeMaterialForm();
    this.loadWarehouses();
    this.loadItems();
    this.checkEditMode();
  }

  loadWarehouses(): void {
    this.warehouseService.getAll().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.warehouseOptions = warehouses.map(warehouse => ({
          label: `${warehouse.warehouse_name} (${warehouse.warehouse_code})`,
          value: warehouse.warehouse_name
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load warehouses'
        });
      }
    });
  }

  loadItems(): void {
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.items = items;
        // Filter only finished goods for output product
        const finishedGoods = items.filter(item => item.item_type === ItemType.FG);
        this.itemOptions = finishedGoods.map(item => ({
          label: `${item.item_code} - ${item.item_name}`,
          value: item.item_code
        }));

        // Filter raw materials for material requirements
        const rawMaterials = items.filter(item => item.item_type === ItemType.RAW);
        this.rawMaterialOptions = rawMaterials.map(item => ({
          label: `${item.item_code} - ${item.item_name}`,
          value: item.id
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load items'
        });
      }
    });
  }

  onWarehouseChange(event: any): void {
    const selectedWarehouseName = event.value;
    const selectedWarehouse = this.warehouses.find(w => w.warehouse_name === selectedWarehouseName);

    if (selectedWarehouse) {
      this.productionForm.patchValue({
        warehouse_id: selectedWarehouse.id,
        warehouse_code: selectedWarehouse.warehouse_code
      });
    }
  }

  onOutputItemChange(event: any): void {
    const selectedItemCode = event.value;
    const selectedItem = this.items.find(item => item.item_code === selectedItemCode);

    if (selectedItem) {
      this.productionForm.patchValue({
        output_item_id: selectedItem.id,
        output_item_name: selectedItem.item_name,
        unit: selectedItem.unit
      });
    }
  }

  initializeForm(): void {
    this.productionForm = this.fb.group({
      wo_number: ['', Validators.required],
      wo_date: [new Date(), Validators.required],
      status: [WOStatus.PLANNED],
      output_item_id: [''],
      output_item_code: ['', Validators.required],
      output_item_name: ['', Validators.required],
      planned_quantity: [0, [Validators.required, Validators.min(1)]],
      actual_quantity: [0],
      unit: ['', Validators.required],
      warehouse_id: [''],
      warehouse_code: [''],
      warehouse_name: ['', Validators.required],
      yield_percentage: [0],
      scrap_quantity: [0],
      scrap_reason: [''],
      start_date: [null],
      completion_date: [null],
      notes: [''],
      materials: this.fb.array([])
    });

    // Auto-calculate yield percentage when actual or planned quantity changes
    this.productionForm.get('actual_quantity')?.valueChanges.subscribe(() => {
      this.calculateYieldPercentage();
    });

    this.productionForm.get('planned_quantity')?.valueChanges.subscribe(() => {
      this.calculateYieldPercentage();
    });
  }

  initializeMaterialForm(): void {
    this.materialForm = this.fb.group({
      material_item_id: ['', Validators.required],
      material_item_code: [''],
      material_item_name: [''],
      required_quantity: [0, [Validators.required, Validators.min(0)]],
      consumed_quantity: [0],
      unit: [''],
      batch_number: [''],
      warehouse_id: [''],
      warehouse_code: [''],
      warehouse_name: ['', Validators.required]
    });
  }

  calculateYieldPercentage(): void {
    const plannedQty = this.productionForm.get('planned_quantity')?.value || 0;
    const actualQty = this.productionForm.get('actual_quantity')?.value || 0;

    if (plannedQty > 0) {
      const yieldPercentage = (actualQty / plannedQty) * 100;
      this.productionForm.patchValue({
        yield_percentage: Math.round(yieldPercentage * 100) / 100 // Round to 2 decimal places
      }, { emitEvent: false });
    } else {
      this.productionForm.patchValue({
        yield_percentage: 0
      }, { emitEvent: false });
    }
  }

  showAddMaterialDialog(): void {
    this.isEditingMaterial = false;
    this.editingMaterialIndex = -1;
    this.materialForm.reset({
      required_quantity: 0,
      consumed_quantity: 0
    });
    this.displayMaterialDialog = true;
  }

  showEditMaterialDialog(index: number): void {
    this.isEditingMaterial = true;
    this.editingMaterialIndex = index;
    const material = this.materials[index];
    this.materialForm.patchValue(material);
    this.displayMaterialDialog = true;
  }

  onMaterialSelect(event: any): void {
    const selectedItemId = event.value;
    const selectedItem = this.items.find(item => item.id === selectedItemId);

    if (selectedItem) {
      this.materialForm.patchValue({
        material_item_code: selectedItem.item_code,
        material_item_name: selectedItem.item_name,
        unit: selectedItem.unit
      });
    }
  }

  onMaterialWarehouseChange(event: any): void {
    const selectedWarehouseName = event.value;
    const selectedWarehouse = this.warehouses.find(w => w.warehouse_name === selectedWarehouseName);

    if (selectedWarehouse) {
      this.materialForm.patchValue({
        warehouse_id: selectedWarehouse.id,
        warehouse_code: selectedWarehouse.warehouse_code
      });
    }
  }

  saveMaterial(): void {
    if (this.materialForm.invalid) {
      return;
    }

    const materialData = this.materialForm.value;

    if (this.isEditingMaterial) {
      this.materials[this.editingMaterialIndex] = materialData;
    } else {
      this.materials.push(materialData);
    }

    this.displayMaterialDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: this.isEditingMaterial ? 'Material updated' : 'Material added'
    });
  }

  removeMaterial(index: number): void {
    this.materials.splice(index, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Material removed'
    });
  }

  addMaterial(): void {
    this.showAddMaterialDialog();
  }

  checkEditMode(): void {
    this.productionId = this.route.snapshot.paramMap.get('id');
    if (this.productionId) {
      this.isEditMode = true;
      this.loadProduction(this.productionId);
    }
  }

  loadProduction(id: string): void {
    this.loading = true;
    this.productionService.getById(id).subscribe({
      next: (production) => {
        this.productionForm.patchValue({
          ...production,
          wo_date: new Date(production.wo_date),
          start_date: production.start_date ? new Date(production.start_date) : null,
          completion_date: production.completion_date ? new Date(production.completion_date) : null
        });

        // Load materials
        this.productionService.getMaterials(id).subscribe({
          next: (materialsData) => {
            this.materials = materialsData;
            this.loading = false;
          }
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load production order'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productionForm.invalid || this.materials.length === 0) {
      Object.keys(this.productionForm.controls).forEach(key => {
        this.productionForm.get(key)?.markAsTouched();
      });

      if (this.materials.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please add at least one material'
        });
      }
      return;
    }

    this.loading = true;

    const formValue = this.productionForm.value;
    const orderData = {
      ...formValue,
      created_by: 'admin'
    };
    delete orderData.materials;

    this.productionService.create(orderData, this.materials).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Production work order created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/production']);
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to save production order'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/production']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
