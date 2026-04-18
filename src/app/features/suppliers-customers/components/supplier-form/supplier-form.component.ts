import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

// Services
import { SupplierDemoService } from '../../services/supplier-demo.service';

// Models
import { Supplier, validateNPWP, formatNPWP } from '../../models/supplier.model';

/**
 * Supplier Form Component
 * Requirements: 4.1, 4.2, 4.3
 */
@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    MessageModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent
  ],
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supplierService = inject(SupplierDemoService);

  supplierForm!: FormGroup;
  isEditMode = false;
  supplierId: string | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.supplierForm = this.fb.group({
      supplier_code: ['', Validators.required],
      supplier_name: ['', Validators.required],
      address: ['', Validators.required],
      city: [''],
      postal_code: [''],
      country: ['Indonesia'],
      contact_person: [''],
      phone: [''],
      email: ['', Validators.email],
      tax_id: ['', [Validators.required, this.npwpValidator]],
      active: [true]
    });
  }

  npwpValidator(control: any) {
    if (!control.value) return null;
    return validateNPWP(control.value) ? null : { invalidNPWP: true };
  }

  onNPWPBlur(): void {
    const taxIdControl = this.supplierForm.get('tax_id');
    if (taxIdControl?.value) {
      const formatted = formatNPWP(taxIdControl.value);
      taxIdControl.setValue(formatted, { emitEvent: false });
    }
  }

  checkEditMode(): void {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.isEditMode = true;
      this.loadSupplier(this.supplierId);
    }
  }

  loadSupplier(id: string): void {
    this.loading = true;
    this.supplierService.getById(id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue(supplier);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load supplier';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      Object.keys(this.supplierForm.controls).forEach(key => {
        this.supplierForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode && this.supplierId
      ? this.supplierService.update(this.supplierId, this.supplierForm.value)
      : this.supplierService.create(this.supplierForm.value);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/suppliers']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to save supplier';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
