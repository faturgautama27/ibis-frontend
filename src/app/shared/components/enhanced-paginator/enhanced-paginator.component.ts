import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

/**
 * Page change event payload emitted by EnhancedPaginatorComponent
 */
export interface PageChangeEvent {
    /** Zero-based page index */
    page: number;
    /** Number of rows per page */
    rows: number;
    /** Zero-based index of the first record on the current page */
    first: number;
    /** Total number of records */
    totalRecords: number;
}

/**
 * Enhanced Paginator Component
 * Provides styled pagination controls with highlighted current page and hover effects.
 *
 * Requirements: 29.1, 29.2, 29.3, 29.4, 29.5
 */
@Component({
    selector: 'app-enhanced-paginator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        ButtonModule,
    ],
    template: `
    <div class="paginator-container" *ngIf="totalPages > 0" role="navigation" aria-label="Pagination">

      <!-- Left: Records info -->
      <div class="paginator-info">
        <span class="paginator-info-text">
          Showing
          <strong>{{ firstRecord }}</strong>–<strong>{{ lastRecord }}</strong>
          of <strong>{{ totalRecords }}</strong>
        </span>
      </div>

      <!-- Center: Page controls -->
      <div class="paginator-controls">
        <!-- First page -->
        <button
          class="paginator-btn paginator-btn--nav"
          type="button"
          [disabled]="currentPage === 0"
          (click)="goToPage(0)"
          aria-label="First page"
          title="First page">
          <i class="pi pi-angle-double-left"></i>
        </button>

        <!-- Previous page -->
        <button
          class="paginator-btn paginator-btn--nav"
          type="button"
          [disabled]="currentPage === 0"
          (click)="goToPage(currentPage - 1)"
          aria-label="Previous page"
          title="Previous page">
          <i class="pi pi-angle-left"></i>
        </button>

        <!-- Page number buttons -->
        <ng-container *ngFor="let page of visiblePages">
          <!-- Ellipsis -->
          <span *ngIf="page === -1" class="paginator-ellipsis" aria-hidden="true">…</span>

          <!-- Page button -->
          <button
            *ngIf="page !== -1"
            class="paginator-btn paginator-btn--page"
            type="button"
            [class.paginator-btn--active]="page === currentPage"
            [attr.aria-current]="page === currentPage ? 'page' : null"
            [attr.aria-label]="'Page ' + (page + 1)"
            (click)="goToPage(page)">
            {{ page + 1 }}
          </button>
        </ng-container>

        <!-- Next page -->
        <button
          class="paginator-btn paginator-btn--nav"
          type="button"
          [disabled]="currentPage === totalPages - 1"
          (click)="goToPage(currentPage + 1)"
          aria-label="Next page"
          title="Next page">
          <i class="pi pi-angle-right"></i>
        </button>

        <!-- Last page -->
        <button
          class="paginator-btn paginator-btn--nav"
          type="button"
          [disabled]="currentPage === totalPages - 1"
          (click)="goToPage(totalPages - 1)"
          aria-label="Last page"
          title="Last page">
          <i class="pi pi-angle-double-right"></i>
        </button>
      </div>

      <!-- Right: Rows per page -->
      <div class="paginator-rows-selector" *ngIf="rowsPerPageOptions && rowsPerPageOptions.length > 1">
        <span class="paginator-rows-label">Rows per page:</span>
        <p-select
          [options]="rowsOptions"
          [(ngModel)]="currentRows"
          optionLabel="label"
          optionValue="value"
          styleClass="paginator-rows-select"
          (onChange)="onRowsChange($event.value)"
          aria-label="Rows per page">
        </p-select>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    /* ===== Paginator Container ===== */
    .paginator-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-3);
      padding: var(--padding-sm) var(--padding-md);
      background: white;
      border-top: 1px solid var(--gray-200);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }

    /* ===== Info Text ===== */
    .paginator-info {
      flex-shrink: 0;
    }

    .paginator-info-text {
      font-size: var(--text-sm);
      color: var(--gray-500);
    }

    .paginator-info-text strong {
      color: var(--gray-700);
      font-weight: var(--font-semibold);
    }

    /* ===== Controls ===== */
    .paginator-controls {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    /* ===== Base Button ===== */
    .paginator-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--space-2);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: white;
      color: var(--gray-600);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
      outline: none;
      user-select: none;
    }

    /* ===== Nav Buttons (prev/next/first/last) ===== */
    .paginator-btn--nav {
      color: var(--gray-500);
    }

    .paginator-btn--nav:hover:not(:disabled) {
      background: var(--primary-50);
      border-color: var(--primary-200);
      color: var(--primary-600);
    }

    .paginator-btn--nav:active:not(:disabled) {
      background: var(--primary-100);
      transform: scale(0.95);
    }

    .paginator-btn--nav:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ===== Page Number Buttons ===== */
    .paginator-btn--page {
      min-width: 2rem;
    }

    .paginator-btn--page:hover:not(.paginator-btn--active) {
      background: var(--primary-50);
      border-color: var(--primary-200);
      color: var(--primary-600);
    }

    .paginator-btn--page:active:not(.paginator-btn--active) {
      background: var(--primary-100);
      transform: scale(0.95);
    }

    /* ===== Active Page ===== */
    .paginator-btn--active {
      background: var(--primary-500);
      border-color: var(--primary-500);
      color: white;
      font-weight: var(--font-semibold);
      cursor: default;
      box-shadow: var(--shadow-sm);
    }

    .paginator-btn--active:hover {
      background: var(--primary-600);
      border-color: var(--primary-600);
    }

    /* Focus ring for keyboard navigation */
    .paginator-btn:focus-visible {
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
      border-color: var(--primary-400);
    }

    /* ===== Ellipsis ===== */
    .paginator-ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      color: var(--gray-400);
      font-size: var(--text-sm);
      user-select: none;
    }

    /* ===== Rows Per Page ===== */
    .paginator-rows-selector {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    .paginator-rows-label {
      font-size: var(--text-sm);
      color: var(--gray-500);
      white-space: nowrap;
    }

    :host ::ng-deep .paginator-rows-select.p-select {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: white;
      font-size: var(--text-sm);
      min-width: 5rem;
      transition: all var(--duration-fast) var(--ease-out);
    }

    :host ::ng-deep .paginator-rows-select.p-select:hover {
      border-color: var(--primary-300);
    }

    :host ::ng-deep .paginator-rows-select.p-select.p-focus,
    :host ::ng-deep .paginator-rows-select.p-select:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
      outline: none;
    }

    :host ::ng-deep .paginator-rows-select .p-select-label {
      font-size: var(--text-sm);
      color: var(--gray-700);
      padding: var(--space-1) var(--space-3);
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      .paginator-container {
        justify-content: center;
        padding: var(--padding-sm);
      }

      .paginator-info {
        width: 100%;
        text-align: center;
        order: 3;
      }

      .paginator-controls {
        order: 1;
      }

      .paginator-rows-selector {
        order: 2;
      }

      /* Reduce button size on mobile */
      .paginator-btn {
        min-width: 1.75rem;
        height: 1.75rem;
        font-size: var(--text-xs);
      }
    }

    /* ===== Reduced Motion ===== */
    @media (prefers-reduced-motion: reduce) {
      .paginator-btn {
        transition: none;
        transform: none !important;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedPaginatorComponent implements OnChanges {
    /** Total number of records */
    @Input() totalRecords = 0;

    /** Number of rows per page */
    @Input() rows = 10;

    /** Available rows-per-page options */
    @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];

    /** Zero-based current page index */
    @Input() page = 0;

    /** Emits when the page or rows-per-page changes */
    @Output() pageChange = new EventEmitter<PageChangeEvent>();

    /** Current zero-based page index */
    currentPage = 0;

    /** Current rows per page */
    currentRows = 10;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rows']) {
            this.currentRows = this.rows;
        }
        if (changes['page']) {
            this.currentPage = this.page;
        }
        if (changes['rowsPerPageOptions'] && this.rowsPerPageOptions?.length) {
            if (!this.rowsPerPageOptions.includes(this.currentRows)) {
                this.currentRows = this.rowsPerPageOptions[0];
            }
        }
    }

    /** Total number of pages */
    get totalPages(): number {
        if (!this.totalRecords || !this.currentRows) return 0;
        return Math.ceil(this.totalRecords / this.currentRows);
    }

    /** 1-based index of the first record on the current page */
    get firstRecord(): number {
        if (!this.totalRecords) return 0;
        return this.currentPage * this.currentRows + 1;
    }

    /** 1-based index of the last record on the current page */
    get lastRecord(): number {
        return Math.min((this.currentPage + 1) * this.currentRows, this.totalRecords);
    }

    /** Dropdown options for rows-per-page selector */
    get rowsOptions(): { label: string; value: number }[] {
        return (this.rowsPerPageOptions || [10, 25, 50]).map(n => ({
            label: String(n),
            value: n
        }));
    }

    /**
     * Computes the visible page numbers with ellipsis (-1) markers.
     * Always shows first, last, current, and up to 2 neighbours.
     */
    get visiblePages(): number[] {
        const total = this.totalPages;
        const current = this.currentPage;

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i);
        }

        const pages: number[] = [];
        const addPage = (p: number) => {
            if (!pages.includes(p)) pages.push(p);
        };

        // Always include first and last
        addPage(0);
        addPage(total - 1);

        // Include current and neighbours
        for (let i = Math.max(1, current - 2); i <= Math.min(total - 2, current + 2); i++) {
            addPage(i);
        }

        // Sort and insert ellipsis
        pages.sort((a, b) => a - b);

        const result: number[] = [];
        for (let i = 0; i < pages.length; i++) {
            result.push(pages[i]);
            if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) {
                result.push(-1); // ellipsis marker
            }
        }

        return result;
    }

    goToPage(page: number): void {
        if (page < 0 || page >= this.totalPages || page === this.currentPage) return;
        this.currentPage = page;
        this.emitPageChange();
        this.cdr.markForCheck();
    }

    onRowsChange(newRows: number): void {
        this.currentRows = newRows;
        // Reset to first page when rows change
        this.currentPage = 0;
        this.emitPageChange();
        this.cdr.markForCheck();
    }

    private emitPageChange(): void {
        this.pageChange.emit({
            page: this.currentPage,
            rows: this.currentRows,
            first: this.currentPage * this.currentRows,
            totalRecords: this.totalRecords
        });
    }
}
