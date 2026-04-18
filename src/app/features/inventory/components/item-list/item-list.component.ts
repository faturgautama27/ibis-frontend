import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';

// Lucide icons
import {
  LucideAngularModule,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
} from 'lucide-angular';

// Services
import { InventoryDemoService } from '../../services/inventory-demo.service';

// Models
import { Item, ItemType } from '../../models/item.model';

/**
 * Item List Component
 *
 * Displays inventory items in a data table with filtering, search, and CRUD actions.
 * Uses Tailwind CSS inline styling (no separate .scss file).
 *
 * Requirements: 2.1, 2.9, 7.8, 23.3
 */
@Component({
  selector: 'app-item-list',
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
    LucideAngularModule,
    IconFieldModule,
    InputIconModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="inventory-list-container">
      <!-- Enhanced Page Header -->
      <div class="page-header-enhanced">
        <div class="header-content">
          <div class="header-title-section">
            <div class="flex items-center gap-3 mb-2">
              <div class="icon-container">
                <lucide-icon [img]="PackageIcon" class="w-8 h-8 text-primary-600"></lucide-icon>
              </div>
              <div>
                <h1 class="page-title">{{ pageTitle }}</h1>
                <p class="page-subtitle">{{ pageSubtitle }}</p>
              </div>
            </div>
            <p-button
              *ngIf="categoryFilter"
              label="Back to Dashboard"
              icon="pi pi-arrow-left"
              severity="secondary"
              [text]="true"
              size="small"
              class="mt-2"
              (onClick)="onBackToDashboard()">
            </p-button>
          </div>
          <div class="header-actions">
            <p-button
              label="Add Item"
              icon="pi pi-plus"
              severity="primary"
              class="enhanced-button"
              (onClick)="onCreateItem()">
            </p-button>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters Card -->
      <div class="enhanced-card mb-6">
        <div class="card-header">
          <h3 class="card-title">Filters</h3>
          <p-button
            label="Clear All"
            icon="pi pi-filter-slash"
            severity="secondary"
            [text]="true"
            size="small"
            (onClick)="onClearFilters()"
            [disabled]="!hasActiveFilters">
          </p-button>
        </div>
        <div class="card-content">
          <div class="filter-grid">
            <!-- Search -->
            <div class="filter-field">
              <label class="field-label">Search Items</label>
              <p-iconfield>
                <p-inputicon class="pi pi-search" />
                <input
                  type="text"
                  pInputText
                  placeholder="Search by code, name, or HS code..."
                  [(ngModel)]="searchQuery"
                  (input)="onSearchChange()"
                  class="enhanced-input" />
              </p-iconfield>
            </div>

            <!-- Item Type Filter -->
            <div class="filter-field">
              <label class="field-label">Item Type</label>
              <p-select
                [options]="itemTypeOptions"
                [(ngModel)]="selectedItemType"
                (onChange)="onFilterChange()"
                placeholder="All Types"
                [showClear]="true"
                styleClass="enhanced-select">
              </p-select>
            </div>

            <!-- Hazardous Filter -->
            <div class="filter-field">
              <label class="field-label">Material Type</label>
              <p-select
                [options]="hazardousOptions"
                [(ngModel)]="selectedHazardous"
                (onChange)="onFilterChange()"
                placeholder="All Materials"
                [showClear]="true"
                styleClass="enhanced-select">
              </p-select>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Data Table -->
      <div class="enhanced-card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Inventory Items</h3>
            <p class="card-subtitle">{{ getTableSubtitle() }}</p>
          </div>
        </div>
        <div class="card-content p-0">
          <p-table
            [value]="filteredItems"
            [loading]="loading"
            [paginator]="true"
            [rows]="50"
            [rowsPerPageOptions]="[10, 25, 50, 100]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
            styleClass="enhanced-table"
            responsiveLayout="scroll">

            <ng-template pTemplate="header">
              <tr>
                <th class="table-header">Item Code</th>
                <th class="table-header">Item Name</th>
                <th class="table-header">HS Code</th>
                <th class="table-header">Type</th>
                <th class="table-header">Unit</th>
                <th class="table-header text-center">Hazardous</th>
                <th class="table-header text-center">Status</th>
                <th class="table-header text-center">Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-item>
              <tr class="table-row">
                <!-- Item Code -->
                <td class="table-cell">
                  <div class="flex items-center gap-2">
                    <span class="item-code-badge">{{ item.item_code }}</span>
                  </div>
                </td>

                <!-- Item Name -->
                <td class="table-cell">
                  <div class="flex items-start gap-2">
                    <div class="flex-1">
                      <div class="item-name">{{ item.item_name }}</div>
                      <div *ngIf="item.description" class="item-description">
                        {{ item.description }}
                      </div>
                    </div>
                    <lucide-icon
                      *ngIf="item.is_hazardous"
                      [img]="AlertTriangleIcon"
                      class="hazard-icon"
                      pTooltip="Hazardous Material"
                      tooltipPosition="top">
                    </lucide-icon>
                  </div>
                </td>

                <!-- HS Code -->
                <td class="table-cell">
                  <span class="hs-code-badge">{{ item.hs_code }}</span>
                </td>

                <!-- Type -->
                <td class="table-cell">
                  <p-tag
                    [value]="getItemTypeLabel(item.item_type)"
                    [severity]="getItemTypeSeverity(item.item_type)"
                    [icon]="getItemTypeIcon(item.item_type)">
                  </p-tag>
                </td>

                <!-- Unit -->
                <td class="table-cell">
                  <span class="unit-text">{{ item.unit }}</span>
                </td>

                <!-- Hazardous -->
                <td class="table-cell text-center">
                  <div *ngIf="item.is_hazardous" class="hazard-indicator">
                    <lucide-icon
                      [img]="AlertTriangleIcon"
                      class="w-4 h-4 text-orange-600">
                    </lucide-icon>
                  </div>
                  <span *ngIf="!item.is_hazardous" class="text-gray-400 text-sm">—</span>
                </td>

                <!-- Status -->
                <td class="table-cell text-center">
                  <p-tag
                    [value]="item.active ? 'Active' : 'Inactive'"
                    [severity]="item.active ? 'success' : 'danger'"
                    [icon]="item.active ? 'pi pi-check-circle' : 'pi pi-times-circle'">
                  </p-tag>
                </td>

                <!-- Actions -->
                <td class="table-cell text-center">
                  <div class="action-buttons">
                    <p-button
                      icon="pi pi-pencil"
                      severity="info"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      pTooltip="Edit Item"
                      tooltipPosition="top"
                      class="action-button"
                      (onClick)="onEditItem(item)">
                    </p-button>
                    <p-button
                      icon="pi pi-trash"
                      severity="danger"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      pTooltip="Delete Item"
                      tooltipPosition="top"
                      class="action-button"
                      (onClick)="onDeleteItem(item)">
                    </p-button>
                  </div>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8" class="empty-state">
                  <div class="empty-content">
                    <lucide-icon [img]="PackageIcon" class="empty-icon"></lucide-icon>
                    <h4 class="empty-title">{{ getEmptyMessage() }}</h4>
                    <p-button
                      label="Add First Item"
                      icon="pi pi-plus"
                      severity="primary"
                      (onClick)="onCreateItem()">
                    </p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <p-confirmDialog styleClass="enhanced-dialog"></p-confirmDialog>
      
      <!-- Toast Notifications -->
      <p-toast position="top-right" styleClass="enhanced-toast"></p-toast>
    </div>
  `,
  styles: [`
    .inventory-list-container {
      padding: var(--space-6);
      min-height: 100vh;
      background: var(--gray-50);
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Enhanced table styling */
    :host ::ng-deep .inventory-table .p-datatable-tbody > tr:hover {
      background: var(--primary-50) !important;
      transform: translateX(2px);
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
    }

    /* Enhanced dialog styling */
    :host ::ng-deep .enhanced-confirm-dialog {
      border-radius: var(--radius-xl);
      box-shadow: var(--modal-shadow);
      border: 1px solid var(--gray-200);
    }

    :host ::ng-deep .enhanced-confirm-dialog .p-dialog-header {
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    :host ::ng-deep .enhanced-confirm-dialog .p-dialog-content {
      padding: var(--padding-lg);
    }

    :host ::ng-deep .enhanced-confirm-dialog .p-dialog-footer {
      background: var(--gray-50);
      border-top: 1px solid var(--gray-200);
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
      padding: var(--padding-md) var(--padding-lg);
    }

    /* Enhanced toast styling */
    :host ::ng-deep .enhanced-toast .p-toast-message {
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--gray-200);
    }

    :host ::ng-deep .enhanced-toast .p-toast-message-success {
      background: var(--success-50);
      border-color: var(--success-200);
      color: var(--success-800);
    }

    :host ::ng-deep .enhanced-toast .p-toast-message-error {
      background: var(--error-50);
      border-color: var(--error-200);
      color: var(--error-800);
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .inventory-list-container {
        padding: var(--space-4);
      }

      .grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--space-3);
      }
    }

    /* Animation enhancements */
    .inventory-list-container > * {
      animation: slideInUp 0.3s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Focus enhancements */
    :host ::ng-deep .p-button:focus {
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-primary);
    }

    :host ::ng-deep .p-inputtext:focus {
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
    }
  `]
})
export class ItemListComponent implements OnInit {
  private inventoryService = inject(InventoryDemoService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);

  // Icons
  PackageIcon = Package;
  SearchIcon = Search;
  EditIcon = Edit;
  Trash2Icon = Trash2;
  AlertTriangleIcon = AlertTriangle;
  PlusIcon = Plus;

  // Data
  items: Item[] = [];
  filteredItems: Item[] = [];
  loading = false;
  router = inject(Router); // Make router public for template access

  // Filter properties
  searchQuery = '';
  selectedItemType: string | null = null;
  selectedHazardous: boolean | null = null;
  categoryFilter: string | null = null; // For RAW_MATERIAL or FINISHED_GOOD filtering
  pageTitle = 'Inventory Items';
  pageSubtitle = 'Manage your inventory items and stock';

  // Dropdown options
  itemTypeOptions = [
    { label: 'Raw Material', value: ItemType.RAW },
    { label: 'Work In Progress', value: ItemType.WIP },
    { label: 'Finished Goods', value: ItemType.FG },
    { label: 'Asset', value: ItemType.ASSET },
  ];

  hazardousOptions = [
    { label: 'Hazardous Only', value: true },
    { label: 'Non-Hazardous Only', value: false },
  ];

  constructor() { }

  ngOnInit(): void {
    // Check if we have a category filter from route data
    this.route.data.subscribe(data => {
      if (data['category']) {
        this.categoryFilter = data['category'];
        if (this.categoryFilter === 'RAW_MATERIAL') {
          this.pageTitle = 'Raw Materials';
          this.pageSubtitle = 'Manage raw material inventory';
          this.selectedItemType = ItemType.RAW;
        } else if (this.categoryFilter === 'FINISHED_GOOD') {
          this.pageTitle = 'Finished Goods';
          this.pageSubtitle = 'Manage finished goods inventory';
          this.selectedItemType = ItemType.FG;
        }
      }
    });

    this.loadItems();
  }

  /**
   * Get table subtitle with item count
   */
  getTableSubtitle(): string {
    const count = this.filteredItems.length;
    const total = this.items.length;
    if (count === total) {
      return `${count} items total`;
    }
    return `${count} of ${total} items`;
  }

  /**
   * Get empty message based on filters
   */
  getEmptyMessage(): string {
    if (this.hasActiveFilters) {
      return 'No items match your current filters. Try adjusting your search criteria.';
    }
    return 'No items have been added yet. Create your first item to get started.';
  }

  /**
   * Check if there are active filters
   */
  get hasActiveFilters(): boolean {
    return !!(this.searchQuery || this.selectedItemType || this.selectedHazardous !== null);
  }

  /**
   * Get item type label for display
   */
  getItemTypeLabel(itemType: ItemType): string {
    switch (itemType) {
      case ItemType.RAW:
        return 'Raw Material';
      case ItemType.WIP:
        return 'Work In Progress';
      case ItemType.FG:
        return 'Finished Goods';
      case ItemType.ASSET:
        return 'Asset';
      default:
        return itemType;
    }
  }

  /**
   * Get item type icon
   */
  getItemTypeIcon(itemType: ItemType): string {
    switch (itemType) {
      case ItemType.RAW:
        return 'pi pi-circle';
      case ItemType.WIP:
        return 'pi pi-cog';
      case ItemType.FG:
        return 'pi pi-check-circle';
      case ItemType.ASSET:
        return 'pi pi-building';
      default:
        return 'pi pi-circle';
    }
  }

  /**
   * Handle back to dashboard navigation
   */
  onBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Clear all filters
   */
  onClearFilters(): void {
    this.searchQuery = '';
    this.selectedItemType = this.categoryFilter === 'RAW_MATERIAL' ? ItemType.RAW :
      this.categoryFilter === 'FINISHED_GOOD' ? ItemType.FG : null;
    this.selectedHazardous = null;
    this.applyFilters();
  }

  loadItems(): void {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.items = items;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load items'
        });
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.items];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.item_code.toLowerCase().includes(query) ||
          item.item_name.toLowerCase().includes(query) ||
          item.hs_code.includes(query)
      );
    }

    if (this.selectedItemType) {
      filtered = filtered.filter(item => item.item_type === this.selectedItemType);
    }

    if (this.selectedHazardous !== null) {
      filtered = filtered.filter(item => item.is_hazardous === this.selectedHazardous);
    }

    this.filteredItems = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onCreateItem(): void {
    this.router.navigate(['/inventory/items/new']);
  }

  onEditItem(item: Item): void {
    this.router.navigate(['/inventory/items', item.id, 'edit']);
  }

  onDeleteItem(item: Item): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete item "${item.item_name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.loading = true;
        this.inventoryService.delete(item.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Item deleted successfully'
            });
            this.loadItems();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete item'
            });
            this.loading = false;
          }
        });
      },
    });
  }

  getItemTypeSeverity(itemType: ItemType): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (itemType) {
      case ItemType.RAW:
        return 'info';
      case ItemType.WIP:
        return 'warn';
      case ItemType.FG:
        return 'success';
      case ItemType.ASSET:
        return 'danger';
      default:
        return 'info';
    }
  }
}
