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
import { CustomerDemoService } from '../../services/customer-demo.service';

// Models
import { Customer, validateNPWP, formatNPWP } from '../../models/customer.model';

@Component({
  selector: 'app-customer-form',
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
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerDemoService);

  customerForm!: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  initializeForm(): void {
    this.customerForm = this.fb.group({
      customer_code: ['', Validators.required],
      customer_name: ['', Validators.required],
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
    const taxIdControl = this.customerForm.get('tax_id');
    if (taxIdControl?.value) {
      const formatted = formatNPWP(taxIdControl.value);
      taxIdControl.setValue(formatted, { emitEvent: false });
    }
  }

  checkEditMode(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: string): void {
    this.loading = true;
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load customer';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      Object.keys(this.customerForm.controls).forEach(key => {
        this.customerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode && this.customerId
      ? this.customerService.update(this.customerId, this.customerForm.value)
      : this.customerService.create(this.customerForm.value);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/customers']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to save customer';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
