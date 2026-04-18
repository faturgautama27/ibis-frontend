import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * Enhanced Table Component
 * Implements modern table design with alternating rows, hover effects, proper padding, and responsive behavior
 * 
 * Requirements: 5.1-5.8 - Modern table design enhancements
 */
@Component({
  selector: 'app-enhanced-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule
  ],
  template: `
    <div [class]="computedTableClass">
      <!-- Table Header with Search and Actions -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title-section">
          <h3 class="table-title" *ngIf="title">{{ title }}</h3>
          <p class="table-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>

        <div class="table-actions">
          <!-- Search -->
          <div class="table-search" *ngIf="searchable">
            <p-iconField iconPosition="left">
              <p-inputIcon styleClass="pi pi-search"></p-inputIcon>
              <input
                type="text"
                pInputText
                [placeholder]="searchPlaceholder"
                [value]="searchValue"
                (input)="handleSearch($event)"
                class="search-input" />
            </p-iconField>
          </div>

          <!-- Custom Actions -->
          <div class="table-custom-actions">
            <ng-content select="[slot=actions]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="table-container">
        <p-table
          [value]="data"
          [loading]="loading"
          [paginator]="paginator"
          [rows]="rows"
          [totalRecords]="totalRecords"
          [lazy]="lazy"
          [responsiveLayout]="responsiveLayout"
          [breakpoint]="breakpoint"
          [styleClass]="tableStyleClass"
          [scrollable]="scrollable"
          [scrollHeight]="scrollHeight"
          (onLazyLoad)="onLazyLoad.emit($event)"
          (onPage)="onPageChange.emit($event)"
          (onSort)="onSort.emit($event)">

          <!-- Table Header Template -->
          <ng-template pTemplate="header">
            <tr class="table-header-row">
              <ng-content select="[slot=header]"></ng-content>
            </tr>
          </ng-template>

          <!-- Table Body Template -->
          <ng-template pTemplate="body" let-rowData let-rowIndex="rowIndex">
            <tr 
              class="table-body-row"
              [class.row-selected]="isRowSelected(rowData)"
              [class.row-clickable]="rowClickable"
              (click)="handleRowClick(rowData, rowIndex)">
              <ng-content select="[slot=body]" [ngTemplateOutlet]="bodyTemplate" [ngTemplateOutletContext]="{ $implicit: rowData, rowIndex: rowIndex }"></ng-content>
            </tr>
          </ng-template>

          <!-- Loading Template -->
          <ng-template pTemplate="loadingbody" *ngIf="showSkeleton">
            <tr *ngFor="let item of skeletonRows">
              <td *ngFor="let col of skeletonCols">
                <p-skeleton height="1.5rem" styleClass="mb-2"></p-skeleton>
              </td>
            </tr>
          </ng-template>

          <!-- Empty Template -->
          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="columnCount" class="empty-message">
                <div class="empty-state">
                  <i [class]="emptyIcon" class="empty-icon"></i>
                  <h4 class="empty-title">{{ emptyTitle }}</h4>
                  <p class="empty-description">{{ emptyMessage }}</p>
                  <ng-content select="[slot=empty-actions]"></ng-content>
                </div>
              </td>
            </tr>
          </ng-template>

          <!-- Footer Template -->
          <ng-template pTemplate="footer" *ngIf="showFooter">
            <tr class="table-footer-row">
              <ng-content select="[slot=footer]"></ng-content>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Custom Pagination -->
      <div class="table-pagination" *ngIf="paginator && !lazy">
        <p-paginator
          [rows]="rows"
          [totalRecords]="totalRecords"
          [first]="first"
          [showCurrentPageReport]="true"
          [currentPageReportTemplate]="paginationTemplate"
          [showFirstLastIcon]="true"
          [showPageLinks]="true"
          [pageLinkSize]="5"
          (onPageChange)="onPageChange.emit($event)">
        </p-paginator>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* Table Container */
    .enhanced-table {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--card-shadow);
      overflow: hidden;
      border: 1px solid var(--gray-200);
    }

    /* Table Header Section */
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--padding-lg);
      border-bottom: 1px solid var(--gray-200);
      background: var(--gray-50);
      gap: var(--space-4);
    }

    .table-title-section {
      flex: 1;
    }

    .table-title {
      margin: 0 0 var(--space-1) 0;
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      line-height: var(--leading-tight);
    }

    .table-subtitle {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--gray-600);
      line-height: var(--leading-normal);
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-shrink: 0;
    }

    .table-search {
      min-width: 250px;
    }

    .search-input {
      width: 100%;
    }

    .table-custom-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    /* Table Container */
    .table-container {
      overflow: hidden;
    }

    /* PrimeNG Table Overrides */
    :host ::ng-deep .p-datatable {
      border: none;
      border-radius: 0;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: var(--gray-50);
      border-bottom: var(--table-header-border-width) solid var(--gray-200);
      padding: var(--padding-md) var(--padding-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-700);
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
      border-top: none;
      border-left: none;
      border-right: none;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      border-bottom: var(--table-border-width) solid var(--gray-100);
      transition: all var(--duration-fast) var(--ease-out);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(even) {
      background: var(--gray-25);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: var(--gray-50) !important;
      transform: translateX(2px);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr.row-selected {
      background: var(--primary-50) !important;
      border-left: 3px solid var(--primary-500);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr.row-clickable {
      cursor: pointer;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr.row-clickable:hover {
      box-shadow: inset 0 0 0 1px var(--primary-200);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: var(--padding-md) var(--padding-lg);
      color: var(--gray-600);
      font-size: var(--text-sm);
      border-left: none;
      border-right: none;
      border-top: none;
      vertical-align: middle;
    }

    /* Table Footer */
    :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > td {
      background: var(--gray-50);
      border-top: var(--table-header-border-width) solid var(--gray-200);
      padding: var(--padding-md) var(--padding-lg);
      font-weight: var(--font-medium);
      color: var(--gray-700);
      border-bottom: none;
      border-left: none;
      border-right: none;
    }

    /* Empty State */
    .empty-message {
      text-align: center;
      padding: var(--padding-xl) !important;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      max-width: 400px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--gray-300);
      margin-bottom: var(--space-2);
    }

    .empty-title {
      margin: 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-700);
    }

    .empty-description {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--gray-500);
      text-align: center;
      line-height: var(--leading-relaxed);
    }

    /* Pagination */
    .table-pagination {
      padding: var(--padding-md) var(--padding-lg);
      border-top: 1px solid var(--gray-200);
      background: var(--gray-50);
    }

    :host ::ng-deep .p-paginator {
      background: transparent;
      border: none;
      padding: 0;
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
      border-radius: var(--radius-md);
      margin: 0 var(--space-1);
      min-width: var(--min-touch-target);
      height: var(--min-touch-target);
      transition: all var(--duration-fast) var(--ease-out);
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page:hover {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
      background: var(--primary-500);
      color: white;
    }

    /* Loading State */
    :host ::ng-deep .p-datatable .p-datatable-loading-overlay {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(2px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-3);
      }

      .table-actions {
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-2);
      }

      .table-search {
        min-width: auto;
      }

      .table-custom-actions {
        justify-content: center;
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td,
      :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > td {
        padding: var(--padding-sm) var(--padding-md);
        font-size: var(--text-xs);
      }

      .table-title {
        font-size: var(--text-lg);
      }

      .empty-icon {
        font-size: 2rem;
      }

      .empty-title {
        font-size: var(--text-base);
      }
    }

    /* Compact Table Variant */
    .table-compact :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
    .table-compact :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td,
    .table-compact :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > td {
      padding: var(--padding-sm) var(--padding-md);
    }

    .table-compact .table-header {
      padding: var(--padding-md);
    }

    .table-compact .table-pagination {
      padding: var(--padding-sm) var(--padding-md);
    }

    /* Striped Table Variant */
    .table-striped :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(odd) {
      background: white;
    }

    .table-striped :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(even) {
      background: var(--gray-25);
    }

    /* Bordered Table Variant */
    .table-bordered :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
    .table-bordered :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td,
    .table-bordered :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > td {
      border-right: 1px solid var(--gray-200);
    }

    .table-bordered :host ::ng-deep .p-datatable .p-datatable-thead > tr > th:last-child,
    .table-bordered :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td:last-child,
    .table-bordered :host ::ng-deep .p-datatable .p-datatable-tfoot > tr > td:last-child {
      border-right: none;
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .enhanced-table {
        border-width: 2px;
        border-color: var(--gray-900);
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
        border-bottom-width: 2px;
        border-bottom-color: var(--gray-900);
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
        border-bottom-width: 1px;
        border-bottom-color: var(--gray-900);
      }
    }

    /* Print Styles */
    @media print {
      .table-header,
      .table-pagination {
        display: none;
      }

      .enhanced-table {
        box-shadow: none;
        border: 2px solid #000;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr:nth-child(even) {
        background: #f5f5f5 !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedTableComponent {
  /**
   * Table data
   */
  @Input() data: any[] = [];

  /**
   * Table title
   */
  @Input() title?: string;

  /**
   * Table subtitle
   */
  @Input() subtitle?: string;

  /**
   * Show table header
   */
  @Input() showHeader = true;

  /**
   * Show table footer
   */
  @Input() showFooter = false;

  /**
   * Loading state
   */
  @Input() loading = false;

  /**
   * Show skeleton loading
   */
  @Input() showSkeleton = true;

  /**
   * Number of skeleton rows
   */
  @Input() skeletonRows = Array(5).fill(0);

  /**
   * Number of skeleton columns
   */
  @Input() skeletonCols = Array(4).fill(0);

  /**
   * Enable pagination
   */
  @Input() paginator = true;

  /**
   * Rows per page
   */
  @Input() rows = 10;

  /**
   * Total records
   */
  @Input() totalRecords = 0;

  /**
   * First record index
   */
  @Input() first = 0;

  /**
   * Lazy loading
   */
  @Input() lazy = false;

  /**
   * Searchable table
   */
  @Input() searchable = true;

  /**
   * Search placeholder
   */
  @Input() searchPlaceholder = 'Search...';

  /**
   * Search value
   */
  @Input() searchValue = '';

  /**
   * Row clickable
   */
  @Input() rowClickable = false;

  /**
   * Selected rows
   */
  @Input() selectedRows: any[] = [];

  /**
   * Table variant
   */
  @Input() variant: 'default' | 'compact' | 'striped' | 'bordered' = 'default';

  /**
   * Responsive layout
   */
  @Input() responsiveLayout: 'stack' | 'scroll' = 'scroll';

  /**
   * Responsive breakpoint
   */
  @Input() breakpoint = '768px';

  /**
   * Scrollable table
   */
  @Input() scrollable = false;

  /**
   * Scroll height
   */
  @Input() scrollHeight?: string;

  /**
   * Column count for empty state
   */
  @Input() columnCount = 1;

  /**
   * Empty state configuration
   */
  @Input() emptyTitle = 'No data found';
  @Input() emptyMessage = 'There are no records to display';
  @Input() emptyIcon = 'pi pi-inbox';

  /**
   * Pagination template
   */
  @Input() paginationTemplate = 'Showing {first} to {last} of {totalRecords} entries';

  /**
   * Custom CSS classes
   */
  @Input() customClass = '';

  /**
   * Event emitters
   */
  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<{ data: any, index: number }>();

  /**
   * Content templates
   */
  @ContentChild('bodyTemplate') bodyTemplate?: TemplateRef<any>;

  /**
   * Computed table class
   */
  get computedTableClass(): string {
    const classes = [
      'enhanced-table',
      `table-${this.variant}`,
      this.customClass
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Computed table style class for PrimeNG
   */
  get tableStyleClass(): string {
    return 'p-datatable-striped p-datatable-gridlines';
  }

  /**
   * Handle search input
   */
  handleSearch(event: any): void {
    const value = event.target.value;
    this.searchValue = value;
    this.searchChange.emit(value);
  }

  /**
   * Handle row click
   */
  handleRowClick(data: any, index: number): void {
    if (this.rowClickable) {
      this.rowClick.emit({ data, index });
    }
  }

  /**
   * Check if row is selected
   */
  isRowSelected(rowData: any): boolean {
    return this.selectedRows.includes(rowData);
  }
}