import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * Filter configuration for individual filter controls
 */
export interface FilterConfig {
    /** Unique key for this filter */
    key: string;
    /** Display label */
    label: string;
    /** Type of filter control */
    type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
    /** Options for select/multiselect */
    options?: { label: string; value: any }[];
    /** Placeholder text */
    placeholder?: string;
    /** Current value */
    value?: any;
    /** Whether this filter spans full width */
    fullWidth?: boolean;
}

/**
 * Filter change event payload
 */
export interface FilterChangeEvent {
    key: string;
    value: any;
}

/**
 * Enhanced Filter Bar Component
 * Provides a styled, reusable filter/search bar for list pages.
 *
 * Requirements: 28.1, 28.2, 28.3, 28.4, 28.5, 28.6
 */
@Component({
    selector: 'app-enhanced-filter-bar',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        MultiSelectModule,
        IconFieldModule,
        InputIconModule,
    ],
    template: `
    <div class="filter-bar-card">
      <!-- Search Row -->
      <div class="filter-bar-search-row" *ngIf="showSearch">
        <div class="filter-search-field">
          <p-iconField iconPosition="left" class="w-full">
            <p-inputIcon styleClass="pi pi-search filter-search-icon"></p-inputIcon>
            <input
              type="text"
              pInputText
              class="filter-search-input"
              [placeholder]="searchPlaceholder"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange($event)"
              aria-label="Search" />
          </p-iconField>
        </div>

        <!-- Clear button shown inline when no extra filters -->
        <button
          *ngIf="!filters || filters.length === 0"
          class="filter-clear-btn"
          type="button"
          [class.filter-clear-btn--visible]="hasActiveFilters"
          (click)="onClearFilters()"
          aria-label="Clear filters">
          <i class="pi pi-times-circle"></i>
          <span>Clear</span>
        </button>
      </div>

      <!-- Filter Controls Row -->
      <div class="filter-controls-row" *ngIf="filters && filters.length > 0">
        <div
          *ngFor="let filter of filters"
          class="filter-control-item"
          [class.filter-control-item--full]="filter.fullWidth">

          <!-- Select Filter -->
          <p-select
            *ngIf="filter.type === 'select'"
            [options]="filter.options || []"
            [(ngModel)]="filterValues[filter.key]"
            [placeholder]="filter.placeholder || ('Filter by ' + filter.label)"
            optionLabel="label"
            optionValue="value"
            [showClear]="true"
            styleClass="filter-select w-full"
            (onChange)="onFilterChange(filter.key, $event.value)"
            [attr.aria-label]="filter.label">
          </p-select>

          <!-- MultiSelect Filter -->
          <p-multiSelect
            *ngIf="filter.type === 'multiselect'"
            [options]="filter.options || []"
            [(ngModel)]="filterValues[filter.key]"
            [placeholder]="filter.placeholder || ('Select ' + filter.label)"
            optionLabel="label"
            optionValue="value"
            styleClass="filter-multiselect w-full"
            (onChange)="onFilterChange(filter.key, $event.value)"
            [attr.aria-label]="filter.label">
          </p-multiSelect>

          <!-- Date Filter -->
          <p-datepicker
            *ngIf="filter.type === 'date'"
            [(ngModel)]="filterValues[filter.key]"
            [placeholder]="filter.placeholder || filter.label"
            dateFormat="dd/mm/yy"
            [showIcon]="true"
            styleClass="filter-datepicker w-full"
            (onSelect)="onFilterChange(filter.key, $event)"
            (onClear)="onFilterChange(filter.key, null)"
            [attr.aria-label]="filter.label">
          </p-datepicker>

          <!-- Date Range Filter -->
          <p-datepicker
            *ngIf="filter.type === 'daterange'"
            [(ngModel)]="filterValues[filter.key]"
            [placeholder]="filter.placeholder || filter.label"
            dateFormat="dd/mm/yy"
            selectionMode="range"
            [showIcon]="true"
            styleClass="filter-datepicker w-full"
            (onSelect)="onFilterChange(filter.key, $event)"
            (onClear)="onFilterChange(filter.key, null)"
            [attr.aria-label]="filter.label">
          </p-datepicker>

          <!-- Text Filter -->
          <input
            *ngIf="filter.type === 'text'"
            type="text"
            pInputText
            class="filter-text-input w-full"
            [placeholder]="filter.placeholder || filter.label"
            [(ngModel)]="filterValues[filter.key]"
            (ngModelChange)="onFilterChange(filter.key, $event)"
            [attr.aria-label]="filter.label" />
        </div>

        <!-- Clear Filters Button -->
        <div class="filter-clear-wrapper">
          <button
            class="filter-clear-btn"
            type="button"
            [class.filter-clear-btn--visible]="hasActiveFilters"
            (click)="onClearFilters()"
            aria-label="Clear all filters">
            <i class="pi pi-filter-slash"></i>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    /* ===== Filter Bar Card ===== */
    .filter-bar-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--card-shadow);
      border: 1px solid var(--gray-200);
      padding: var(--padding-md) var(--padding-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      transition: box-shadow var(--duration-normal) var(--ease-out);
    }

    .filter-bar-card:focus-within {
      box-shadow: var(--card-hover-shadow);
    }

    /* ===== Search Row ===== */
    .filter-bar-search-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .filter-search-field {
      flex: 1;
      min-width: 0;
    }

    /* ===== Search Input ===== */
    .filter-search-input {
      width: 100%;
      padding: var(--padding-sm) var(--padding-md);
      padding-left: 2.5rem;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--gray-700);
      background: var(--gray-50);
      transition: all var(--duration-normal) var(--ease-out);
      outline: none;
    }

    .filter-search-input::placeholder {
      color: var(--gray-400);
    }

    .filter-search-input:hover {
      border-color: var(--gray-300);
      background: white;
    }

    .filter-search-input:focus {
      border-color: var(--primary-500);
      background: white;
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
    }

    /* ===== Filter Controls Row ===== */
    .filter-controls-row {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: var(--space-3);
    }

    .filter-control-item {
      flex: 1 1 180px;
      min-width: 0;
    }

    .filter-control-item--full {
      flex: 1 1 100%;
    }

    /* ===== Select Styling ===== */
    :host ::ng-deep .filter-select.p-select,
    :host ::ng-deep .filter-multiselect.p-multiselect {
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: var(--gray-50);
      transition: all var(--duration-normal) var(--ease-out);
      font-size: var(--text-sm);
    }

    :host ::ng-deep .filter-select.p-select:hover,
    :host ::ng-deep .filter-multiselect.p-multiselect:hover {
      border-color: var(--gray-300);
      background: white;
    }

    :host ::ng-deep .filter-select.p-select.p-focus,
    :host ::ng-deep .filter-select.p-select:focus-within,
    :host ::ng-deep .filter-multiselect.p-multiselect.p-focus,
    :host ::ng-deep .filter-multiselect.p-multiselect:focus-within {
      border-color: var(--primary-500);
      background: white;
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
      outline: none;
    }

    :host ::ng-deep .filter-select .p-select-label,
    :host ::ng-deep .filter-multiselect .p-multiselect-label {
      font-size: var(--text-sm);
      color: var(--gray-700);
      padding: var(--padding-sm) var(--padding-md);
    }

    :host ::ng-deep .filter-select .p-placeholder,
    :host ::ng-deep .filter-multiselect .p-placeholder {
      color: var(--gray-400);
    }

    /* ===== DatePicker Styling ===== */
    :host ::ng-deep .filter-datepicker .p-inputtext {
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: var(--gray-50);
      font-size: var(--text-sm);
      color: var(--gray-700);
      padding: var(--padding-sm) var(--padding-md);
      transition: all var(--duration-normal) var(--ease-out);
    }

    :host ::ng-deep .filter-datepicker .p-inputtext:hover {
      border-color: var(--gray-300);
      background: white;
    }

    :host ::ng-deep .filter-datepicker .p-inputtext:focus {
      border-color: var(--primary-500);
      background: white;
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
      outline: none;
    }

    /* ===== Text Filter Input ===== */
    .filter-text-input {
      padding: var(--padding-sm) var(--padding-md);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      color: var(--gray-700);
      background: var(--gray-50);
      transition: all var(--duration-normal) var(--ease-out);
      outline: none;
    }

    .filter-text-input::placeholder {
      color: var(--gray-400);
    }

    .filter-text-input:hover {
      border-color: var(--gray-300);
      background: white;
    }

    .filter-text-input:focus {
      border-color: var(--primary-500);
      background: white;
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
    }

    /* ===== Clear Button ===== */
    .filter-clear-wrapper {
      display: flex;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .filter-clear-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--padding-sm) var(--padding-md);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      background: white;
      color: var(--gray-500);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
    }

    .filter-clear-btn--visible {
      opacity: 1;
      pointer-events: auto;
    }

    .filter-clear-btn--visible:hover {
      border-color: var(--error-300);
      background: var(--error-50);
      color: var(--error-600);
    }

    .filter-clear-btn--visible:active {
      background: var(--error-100);
      transform: scale(0.98);
    }

    .filter-clear-btn--visible:focus-visible {
      outline: none;
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-error);
      border-color: var(--error-400);
    }

    /* ===== Responsive Design ===== */
    @media (max-width: 768px) {
      .filter-bar-card {
        padding: var(--padding-sm) var(--padding-md);
      }

      .filter-bar-search-row {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-controls-row {
        flex-direction: column;
      }

      .filter-control-item {
        flex: 1 1 100%;
      }

      .filter-clear-wrapper {
        align-items: stretch;
      }

      .filter-clear-btn {
        justify-content: center;
      }
    }

    /* ===== Reduced Motion ===== */
    @media (prefers-reduced-motion: reduce) {
      .filter-search-input,
      .filter-text-input,
      .filter-clear-btn,
      .filter-bar-card {
        transition: none;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedFilterBarComponent implements OnInit, OnDestroy {
    /** Array of filter configurations */
    @Input() filters: FilterConfig[] = [];

    /** Placeholder text for the search input */
    @Input() searchPlaceholder = 'Search...';

    /** Whether to show the search input */
    @Input() showSearch = true;

    /** Debounce time in ms for search input */
    @Input() searchDebounce = 300;

    /** Emits when any filter control changes */
    @Output() filterChange = new EventEmitter<FilterChangeEvent>();

    /** Emits the search query string */
    @Output() searchChange = new EventEmitter<string>();

    /** Emits when the clear button is clicked */
    @Output() clearFilters = new EventEmitter<void>();

    /** Internal search query model */
    searchQuery = '';

    /** Internal map of filter key → current value */
    filterValues: Record<string, any> = {};

    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    ngOnInit(): void {
        // Initialize filter values from input configs
        if (this.filters) {
            this.filters.forEach(f => {
                this.filterValues[f.key] = f.value ?? null;
            });
        }

        // Debounce search emissions
        this.searchSubject.pipe(
            debounceTime(this.searchDebounce),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(query => {
            this.searchChange.emit(query);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** Returns true if any filter or search has a value */
    get hasActiveFilters(): boolean {
        if (this.searchQuery && this.searchQuery.trim().length > 0) {
            return true;
        }
        return Object.values(this.filterValues).some(v =>
            v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
        );
    }

    onSearchChange(value: string): void {
        this.searchSubject.next(value);
    }

    onFilterChange(key: string, value: any): void {
        this.filterValues[key] = value;
        this.filterChange.emit({ key, value });
    }

    onClearFilters(): void {
        this.searchQuery = '';
        this.filters.forEach(f => {
            this.filterValues[f.key] = null;
        });
        this.searchSubject.next('');
        this.clearFilters.emit();
    }
}
