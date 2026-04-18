import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

// Services
import { CustomerDemoService } from '../../services/customer-demo.service';

// Models
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TooltipModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedTableComponent,
    EnhancedButtonComponent,
    StatusBadgeComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private customerService = inject(CustomerDemoService);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedStatus: boolean | null = null;

  statusOptions = [
    { label: 'Active Only', value: true },
    { label: 'Inactive Only', value: false }
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = null;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load customers';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.customers];
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.customer_code.toLowerCase().includes(query) ||
        c.customer_name.toLowerCase().includes(query) ||
        c.tax_id.toLowerCase().includes(query)
      );
    }
    if (this.selectedStatus !== null) {
      filtered = filtered.filter(c => c.active === this.selectedStatus);
    }
    this.filteredCustomers = filtered;
  }

  onCreateCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  onEditCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  onDeleteCustomer(customer: Customer): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete customer "${customer.customer_name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.customerService.delete(customer.id).subscribe({
          next: () => {
            this.loadCustomers();
          },
          error: (error) => {
            this.error = error.error?.message || 'Failed to delete customer';
          }
        });
      }
    });
  }
}
