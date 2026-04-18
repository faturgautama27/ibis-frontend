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
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

// Services
import { StockOpnameService } from '../../services/stock-opname.service';
import { WarehouseDemoService } from '../../../warehouse/services/warehouse-demo.service';
import { InventoryDemoService } from '../../../inventory/services/inventory-demo.service';

// Models
import { OpnameType, calculateDifference } from '../../models/stock-opname.model';
import { Warehouse } from '../../../warehouse/models/warehouse.model';
import { Item } from '../../../inventory/models/item.model';

/**
 * Stock Opname Form Component
 * Requirements: 11.2, 11.4, 11.5
 */
@Component({
  selector: 'app-stock-opname-form',
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
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent
  ],
  providers: [MessageService],
  templateUrl: './stock-opname-form.component.html',
  styleUrls: ['./stock-opname-form.component.scss']
})
export class StockOpnameFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private opnameService = inject(StockOpnameService);
  private warehouseService = inject(WarehouseDemoService);
  private inventoryService = inject(InventoryDemoService);
  private messageService = inject(MessageService);

  // Form
  opnameForm!: FormGroup;
  detailForm!: FormGroup;
  isEditMode = false;
  opnameId: string | null = null;
  loading = false;

  // Dialog
  displayDetailDialog = false;
  isEditingDetail = false;
  editingDetailIndex: number = -1;

  // Data
  warehouses: Warehouse[] = [];
  warehouseOptions: { label: string; value: string }[] = [];
  items: Item[] = [];
  itemOptions: { label: string; value: string }[] = [];
  details: any[] = [];

  // Dropdown options
  typeOptions = [
    { label: 'Periodic', value: OpnameType.PERIODIC },
    { label: 'Spot Check', value: OpnameType.SPOT_CHECK },
    { label: 'Year End', value: OpnameType.YEAR_END }
  ];

  statusOptions = [
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Completed', value: 'COMPLETED' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.initializeDetailForm();
    this.loadWarehouses();
    this.loadItems();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.opnameForm = this.fb.group({
      opname_number: ['', Validators.required],
      opname_date: [new Date(), Validators.required],
      opname_type: ['', Validators.required],
      warehouse_id: [''],
      warehouse_code: [''],
      warehouse_name: ['', Validators.required],
      status: ['DRAFT'],
      notes: ['']
    });
  }

  initializeDetailForm(): void {
    this.detailForm = this.fb.group({
      item_id: ['', Validators.required],
      item_code: [''],
      item_name: [''],
      system_quantity: [0, [Validators.required, Validators.min(0)]],
      physical_quantity: [0, [Validators.required, Validators.min(0)]],
      difference: [0],
      unit: [''],
      batch_number: [''],
      adjustment_reason: ['']
    });

    // Auto-calculate difference when quantities change
    this.detailForm.get('system_quantity')?.valueChanges.subscribe(() => {
      this.calculateDetailDifference();
    });

    this.detailForm.get('physical_quantity')?.valueChanges.subscribe(() => {
      this.calculateDetailDifference();
    });
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
        this.itemOptions = items.map(item => ({
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
      this.opnameForm.patchValue({
        warehouse_id: selectedWarehouse.id,
        warehouse_code: selectedWarehouse.warehouse_code
      });
    }
  }

  showAddDetailDialog(): void {
    this.isEditingDetail = false;
    this.editingDetailIndex = -1;
    this.detailForm.reset({
      system_quantity: 0,
      physical_quantity: 0,
      difference: 0
    });
    this.displayDetailDialog = true;
  }

  showEditDetailDialog(index: number): void {
    this.isEditingDetail = true;
    this.editingDetailIndex = index;
    const detail = this.details[index];
    this.detailForm.patchValue(detail);
    this.displayDetailDialog = true;
  }

  onItemSelect(event: any): void {
    const selectedItemId = event.value;
    const selectedItem = this.items.find(item => item.id === selectedItemId);

    if (selectedItem) {
      this.detailForm.patchValue({
        item_code: selectedItem.item_code,
        item_name: selectedItem.item_name,
        unit: selectedItem.unit
      });
    }
  }

  calculateDetailDifference(): void {
    const systemQty = this.detailForm.get('system_quantity')?.value || 0;
    const physicalQty = this.detailForm.get('physical_quantity')?.value || 0;
    const difference = calculateDifference(systemQty, physicalQty);

    this.detailForm.patchValue({ difference }, { emitEvent: false });
  }

  saveDetail(): void {
    if (this.detailForm.invalid) {
      return;
    }

    const detailData = this.detailForm.value;
    const difference = detailData.difference || 0;

    // Validate adjustment reason is required when difference !== 0
    if (difference !== 0 && !detailData.adjustment_reason?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Adjustment reason is required when there is a difference'
      });
      return;
    }

    if (this.isEditingDetail) {
      this.details[this.editingDetailIndex] = detailData;
    } else {
      this.details.push(detailData);
    }

    this.displayDetailDialog = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: this.isEditingDetail ? 'Item updated' : 'Item added'
    });
  }

  removeDetail(index: number): void {
    this.details.splice(index, 1);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item removed'
    });
  }

  hasInvalidDetails(): boolean {
    return this.details.some(detail => {
      const difference = detail.difference || 0;
      const reason = detail.adjustment_reason || '';
      return difference !== 0 && !reason.trim();
    });
  }

  getDifferenceClass(difference: number): string {
    if (difference > 0) return 'text-green-600 font-semibold';
    if (difference < 0) return 'text-red-600 font-semibold';
    return 'text-gray-600';
  }

  getTotalDifferenceClass(): string {
    const total = this.getTotalDifference();
    if (total > 0) return 'text-green-600';
    if (total < 0) return 'text-red-600';
    return 'text-gray-900';
  }

  getItemsWithDifferences(): number {
    return this.details.filter(detail => {
      const diff = detail.difference || 0;
      return diff !== 0;
    }).length;
  }

  getTotalDifference(): number {
    return this.details.reduce((sum, detail) => {
      return sum + (detail.difference || 0);
    }, 0);
  }

  checkEditMode(): void {
    this.opnameId = this.route.snapshot.paramMap.get('id');
    if (this.opnameId) {
      this.isEditMode = true;
      this.loadOpname(this.opnameId);
    }
  }

  loadOpname(id: string): void {
    this.loading = true;
    this.opnameService.getAll().subscribe({
      next: (opnames) => {
        const opname = opnames.find(o => o.id === id);
        if (opname) {
          this.opnameForm.patchValue({
            ...opname,
            opname_date: new Date(opname.opname_date)
          });

          // Load details
          this.opnameService.getDetails(id).subscribe({
            next: (detailsData) => {
              this.details = detailsData;
              this.loading = false;
            }
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load stock opname'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.opnameForm.invalid || this.details.length === 0 || this.hasInvalidDetails()) {
      Object.keys(this.opnameForm.controls).forEach(key => {
        this.opnameForm.get(key)?.markAsTouched();
      });

      if (this.details.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Please add at least one item'
        });
      } else if (this.hasInvalidDetails()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation Error',
          detail: 'Please provide adjustment reasons for all items with differences'
        });
      }
      return;
    }

    this.loading = true;

    const opnameData = {
      ...this.opnameForm.value,
      created_by: 'admin'
    };

    this.opnameService.create(opnameData, this.details).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock opname created successfully'
        });
        setTimeout(() => {
          this.router.navigate(['/stock-opname']);
        }, 1000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to save stock opname'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stock-opname']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.opnameForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
