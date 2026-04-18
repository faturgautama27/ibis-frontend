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
import { SupplierDemoService } from '../../services/supplier-demo.service';

// Models
import { Supplier } from '../../models/supplier.model';

/**
 * Supplier List Component
 *
 * Displays suppliers in a data table with filtering, search, and CRUD actions.
 *
 * Requirements: 4.1, 4.2, 4.3
 */
@Component({
  selector: 'app-supplier-list',
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
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private supplierService = inject(SupplierDemoService);

  // Data
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  loading = false;
  error: string | null = null;

  // Filters
  searchQuery = '';
  selectedStatus: boolean | null = null;

  statusOptions = [
    { label: 'Active Only', value: true },
    { label: 'Inactive Only', value: false }
  ];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.error = null;

    this.supplierService.getAll().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load suppliers';
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
    let filtered = [...this.suppliers];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.supplier_code.toLowerCase().includes(query) ||
        s.supplier_name.toLowerCase().includes(query) ||
        s.tax_id.toLowerCase().includes(query)
      );
    }

    if (this.selectedStatus !== null) {
      filtered = filtered.filter(s => s.active === this.selectedStatus);
    }

    this.filteredSuppliers = filtered;
  }

  onCreateSupplier(): void {
    this.router.navigate(['/suppliers/new']);
  }

  onEditSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'edit']);
  }

  onDeleteSupplier(supplier: Supplier): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete supplier "${supplier.supplier_name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.supplierService.delete(supplier.id).subscribe({
          next: () => {
            this.loadSuppliers();
          },
          error: (error) => {
            this.error = error.error?.message || 'Failed to delete supplier';
          }
        });
      }
    });
  }
}
