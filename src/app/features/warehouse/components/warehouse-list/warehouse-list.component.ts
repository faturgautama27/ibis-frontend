import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

// Services
import { WarehouseDemoService } from '../../services/warehouse-demo.service';
import { environment } from '../../../../../environments/environment';

// Models
import { Warehouse, WarehouseType } from '../../models/warehouse.model';

/**
 * Warehouse List Component
 *
 * Displays warehouses in a data table with filtering, search, and CRUD actions.
 * Shows license expiry alerts and capacity/utilization metrics.
 *
 * Requirements: 3.1, 3.2, 3.4, 3.6
 */
@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ProgressBarModule,
    IconFieldModule,
    InputIconModule,
    // Enhanced Components
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedButtonComponent,
    StatusBadgeComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent implements OnInit {
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private warehouseService = inject(WarehouseDemoService);

  // Data
  warehouses: Warehouse[] = [];
  filteredWarehouses: Warehouse[] = [];
  expiringWarehouses: Warehouse[] = [];
  loading = false;
  error: string | null = null;

  // Filter properties
  searchQuery = '';
  selectedWarehouseType: string | null = null;
  selectedBonded: boolean | null = null;

  // Dropdown options
  warehouseTypeOptions = [
    { label: 'Raw Material', value: WarehouseType.RAW_MATERIAL },
    { label: 'Work In Progress', value: WarehouseType.WIP },
    { label: 'Finished Goods', value: WarehouseType.FINISHED_GOODS },
    { label: 'Quarantine', value: WarehouseType.QUARANTINE }
  ];

  bondedOptions = [
    { label: 'Bonded Only', value: true },
    { label: 'Non-Bonded Only', value: false }
  ];

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadExpiringLicenses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = null;

    this.warehouseService.getAll().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load warehouses';
        this.loading = false;
      }
    });
  }

  loadExpiringLicenses(): void {
    this.warehouseService.getExpiringLicenses(environment.alerts.licenseExpiryWarningDays).subscribe({
      next: (warehouses) => {
        this.expiringWarehouses = warehouses;
      },
      error: (error) => {
        console.error('Failed to load expiring licenses:', error);
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
    let filtered = [...this.warehouses];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.warehouse_code.toLowerCase().includes(query) ||
        w.warehouse_name.toLowerCase().includes(query) ||
        w.location.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (this.selectedWarehouseType) {
      filtered = filtered.filter(w => w.warehouse_type === this.selectedWarehouseType);
    }

    // Bonded filter
    if (this.selectedBonded !== null) {
      filtered = filtered.filter(w => w.is_bonded === this.selectedBonded);
    }

    this.filteredWarehouses = filtered;
  }

  onCreateWarehouse(): void {
    this.router.navigate(['/warehouses/new']);
  }

  onEditWarehouse(warehouse: Warehouse): void {
    this.router.navigate(['/warehouses', warehouse.id, 'edit']);
  }

  onDeleteWarehouse(warehouse: Warehouse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete warehouse "${warehouse.warehouse_name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.warehouseService.delete(warehouse.id).subscribe({
          next: () => {
            this.loadWarehouses();
            this.loadExpiringLicenses();
          },
          error: (error) => {
            this.error = error.error?.message || 'Failed to delete warehouse';
          }
        });
      }
    });
  }

  getWarehouseTypeLabel(type: WarehouseType): string {
    switch (type) {
      case WarehouseType.RAW_MATERIAL:
        return 'Raw Material';
      case WarehouseType.WIP:
        return 'WIP';
      case WarehouseType.FINISHED_GOODS:
        return 'Finished Goods';
      case WarehouseType.QUARANTINE:
        return 'Quarantine';
      default:
        return type;
    }
  }

  getWarehouseTypeSeverity(type: WarehouseType): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (type) {
      case WarehouseType.RAW_MATERIAL:
        return 'info';
      case WarehouseType.WIP:
        return 'warn';
      case WarehouseType.FINISHED_GOODS:
        return 'success';
      case WarehouseType.QUARANTINE:
        return 'danger';
      default:
        return 'info';
    }
  }

  getUtilizationPercentage(warehouse: Warehouse): number {
    if (!warehouse.capacity || warehouse.capacity === 0) {
      return 0;
    }
    return Math.round(((warehouse.current_utilization || 0) / warehouse.capacity) * 100);
  }

  isLicenseExpiringSoon(warehouse: Warehouse): boolean {
    if (!warehouse.is_bonded || !warehouse.license_expiry) {
      return false;
    }

    const now = new Date();
    const expiryDate = new Date(warehouse.license_expiry);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= environment.alerts.licenseExpiryWarningDays && daysUntilExpiry >= 0;
  }
}
