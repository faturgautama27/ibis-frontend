import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

// Services
import { StockMutationService } from '../../services/stock-mutation.service';

/**
 * Stock Mutation Form Component
 *
 * Form for creating stock mutations/transfers between warehouses.
 */
@Component({
  selector: 'app-stock-mutation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    ToastModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent
  ],
  providers: [MessageService],
  templateUrl: './stock-mutation-form.component.html',
  styleUrls: ['./stock-mutation-form.component.scss']
})
export class StockMutationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private mutationService = inject(StockMutationService);
  private messageService = inject(MessageService);

  // Form
  mutationForm!: FormGroup;
  loading = false;

  // Dropdown data
  items = [
    { id: '1', name: 'Raw Material A' },
    { id: '2', name: 'Work in Progress A' },
    { id: '3', name: 'Finished Product A' }
  ];

  warehouses = [
    { id: '1', name: 'Raw Material Warehouse' },
    { id: '2', name: 'WIP Warehouse' },
    { id: '3', name: 'Finished Goods Warehouse' }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.mutationForm = this.fb.group({
      item_id: ['', Validators.required],
      from_warehouse_id: ['', Validators.required],
      to_warehouse_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.mutationForm.invalid) {
      Object.keys(this.mutationForm.controls).forEach(key => {
        this.mutationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formValue = this.mutationForm.value;

    this.mutationService.createMutation(
      formValue.item_id,
      formValue.from_warehouse_id,
      formValue.to_warehouse_id,
      formValue.quantity,
      formValue.reason,
      'current_user'
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Stock mutation created successfully'
        });
        setTimeout(() => {
          this.onCancel();
        }, 1000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to create stock mutation'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stock-balance']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.mutationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
