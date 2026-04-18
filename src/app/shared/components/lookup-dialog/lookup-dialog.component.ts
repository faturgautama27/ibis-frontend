import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

/**
 * Reusable Lookup Dialog Base Component
 * Generic dialog for searching and selecting records
 * 
 * Requirements: All - Shared component for PO/SO lookup functionality
 */
@Component({
    selector: 'app-lookup-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        TableModule,
        ButtonModule,
        InputTextModule
    ],
    template: `
    <p-dialog
      [(visible)]="visible"
      [header]="title"
      [modal]="true"
      [style]="{ width: dialogWidth }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()">
      
      <ng-template pTemplate="content">
        <!-- Search Section -->
        <div class="mb-4">
          <div class="p-inputgroup">
            <input
              type="text"
              pInputText
              [(ngModel)]="searchQuery"
              [placeholder]="searchPlaceholder"
              (keyup.enter)="onSearch()"
              class="w-full" />
            <button
              pButton
              type="button"
              icon="pi pi-search"
              (click)="onSearch()"
              label="Search">
            </button>
          </div>
        </div>

        <!-- Custom Filters Slot -->
        <div *ngIf="hasFilters" class="mb-4">
          <ng-content select="[filters]"></ng-content>
        </div>

        <!-- Results Table -->
        <p-table
          [value]="items"
          [loading]="loading"
          [paginator]="true"
          [rows]="pageSize"
          [totalRecords]="totalRecords"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          selectionMode="single"
          [(selection)]="selectedItem"
          (onRowSelect)="onRowSelect($event)"
          [rowHover]="true"
          styleClass="p-datatable-sm">
          
          <!-- Custom Columns Slot -->
          <ng-content select="[columns]"></ng-content>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td [attr.colspan]="columnCount" class="text-center">
                {{ emptyMessage }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      </ng-template>

      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          (click)="onCancel()">
        </button>
        <button
          pButton
          type="button"
          label="Select"
          icon="pi pi-check"
          [disabled]="!selectedItem"
          (click)="onConfirm()">
        </button>
      </ng-template>
    </p-dialog>
  `,
    styles: [`
    :host ::ng-deep {
      .p-dialog-content {
        padding: 1.5rem;
      }

      .p-datatable {
        font-size: 0.875rem;
      }

      .p-datatable .p-datatable-tbody > tr {
        cursor: pointer;
      }

      .p-datatable .p-datatable-tbody > tr:hover {
        background-color: var(--surface-hover);
      }
    }
  `]
})
export class LookupDialogComponent<T = any> implements OnInit {
    @Input() visible = false;
    @Input() title = 'Select Item';
    @Input() searchPlaceholder = 'Search...';
    @Input() emptyMessage = 'No items found';
    @Input() dialogWidth = '70vw';
    @Input() pageSize = 10;
    @Input() columnCount = 4;
    @Input() hasFilters = false;

    @Input() items: T[] = [];
    @Input() totalRecords = 0;
    @Input() loading = false;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() search = new EventEmitter<string>();
    @Output() pageChange = new EventEmitter<any>();
    @Output() select = new EventEmitter<T>();
    @Output() cancel = new EventEmitter<void>();

    searchQuery = '';
    selectedItem: T | null = null;

    ngOnInit(): void {
        // Initial search when dialog opens
        if (this.visible) {
            this.onSearch();
        }
    }

    onSearch(): void {
        this.search.emit(this.searchQuery);
    }

    onPageChange(event: any): void {
        this.pageChange.emit(event);
    }

    onRowSelect(event: any): void {
        // Row selected, could emit event if needed
    }

    onConfirm(): void {
        if (this.selectedItem) {
            this.select.emit(this.selectedItem);
            this.closeDialog();
        }
    }

    onCancel(): void {
        this.cancel.emit();
        this.closeDialog();
    }

    onDialogHide(): void {
        this.closeDialog();
    }

    private closeDialog(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.selectedItem = null;
        this.searchQuery = '';
    }
}
