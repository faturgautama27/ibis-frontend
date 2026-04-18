import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

// Services
import { WarehouseDemoService } from '../../services/warehouse-demo.service';

// Models
import { Warehouse, WarehouseType } from '../../models/warehouse.model';

/**
 * Warehouse Form Component
 *
 * Form for creating and editing warehouses with validation.
 * Displays license expiry alerts and capacity metrics.
 *
 * Requirements: 3.1, 3.2, 3.4, 3.6
 */
@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    CheckboxModule,
    DatePickerModule,
    MessageModule,
    ProgressBarModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent
  ],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private warehouseService = inject(WarehouseDemoService);

  // Form
  warehouseForm!: FormGroup;
  isEditMode = false;
  warehouseId: string | null = null;
  loading = false;
  error: string | null = null;

  // Dropdown options
  warehouseTypeOptions = [
    { label: 'Raw Material', value: WarehouseType.RAW_MATERIAL },
    { label: 'Work In Progress', value: WarehouseType.WIP },
    { label: 'Finished Goods', value: WarehouseType.FINISHED_GOODS },
    { label: 'Quarantine', value: WarehouseType.QUARANTINE }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.setupBondedValidation();
  }

  initializeForm(): void {
    this.warehouseForm = this.fb.group({
      warehouse_code: ['', Validators.required],
      warehouse_name: ['', Validators.required],
      location: ['', Validators.required],
      warehouse_type: [WarehouseType.RAW_MATERIAL, Validators.required],
      capacity: [null],
      current_utilization: [0],
      manager_id: [''],
      address: [''],
      phone: [''],
      is_bonded: [false],
      license_number: [''],
      license_expiry: [null],
      active: [true]
    });
  }

  setupBondedValidation(): void {
    this.warehouseForm.get('is_bonded')?.valueChanges.subscribe(isBonded => {
      const licenseNumberControl = this.warehouseForm.get('license_number');
      const licenseExpiryControl = this.warehouseForm.get('license_expiry');

      if (isBonded) {
        licenseNumberControl?.setValidators([Validators.required]);
        licenseExpiryControl?.setValidators([Validators.required]);
      } else {
        licenseNumberControl?.clearValidators();
        licenseExpiryControl?.clearValidators();
        licenseNumberControl?.setValue('');
        licenseExpiryControl?.setValue(null);
      }

      licenseNumberControl?.updateValueAndValidity();
      licenseExpiryControl?.updateValueAndValidity();
    });
  }

  checkEditMode(): void {
    this.warehouseId = this.route.snapshot.paramMap.get('id');
    if (this.warehouseId) {
      this.isEditMode = true;
      this.loadWarehouse(this.warehouseId);
    }
  }

  loadWarehouse(id: string): void {
    this.loading = true;
    this.warehouseService.getById(id).subscribe({
      next: (warehouse) => {
        this.warehouseForm.patchValue({
          ...warehouse,
          license_expiry: warehouse.license_expiry ? new Date(warehouse.license_expiry) : null
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load warehouse';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      Object.keys(this.warehouseForm.controls).forEach(key => {
        this.warehouseForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const warehouseData = this.warehouseForm.value;

    const operation = this.isEditMode && this.warehouseId
      ? this.warehouseService.update(this.warehouseId, warehouseData)
      : this.warehouseService.create(warehouseData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/warehouses']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to save warehouse';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/warehouses']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.warehouseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getUtilizationPercentage(): number {
    const capacity = this.warehouseForm.get('capacity')?.value || 0;
    const utilization = this.warehouseForm.get('current_utilization')?.value || 0;

    if (capacity === 0) {
      return 0;
    }

    return Math.round((utilization / capacity) * 100);
  }

  isLicenseExpiringSoon(): boolean {
    const licenseExpiry = this.warehouseForm.get('license_expiry')?.value;
    if (!licenseExpiry) {
      return false;
    }

    const now = new Date();
    const expiryDate = new Date(licenseExpiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  }
}
