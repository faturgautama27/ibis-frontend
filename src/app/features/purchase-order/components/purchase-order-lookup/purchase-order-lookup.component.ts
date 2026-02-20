/**
 * Purchase Order Lookup Component
 * 
 * Reusable lookup dialog for selecting purchase orders in Inbound transaction forms.
 * Requirements: 4.1, 4.2
 */

import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { PurchaseOrderHeader, POStatus, POLookupCriteria } from '../../models/purchase-order.model';
import { lookupPurchaseOrders, clearPOLookupResults } from '../../../inbound/store/inbound.actions';
import {
    selectPOLookupResults,
    selectPOLookupLoading,
    selectPOLookupError
} from '../../../inbound/store/inbound.selectors';

@Component({
    selector: 'app-purchase-order-lookup',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DatePickerModule,
        TagModule
    ],
    templateUrl: './purchase-order-lookup.component.html',
    styleUrls: ['./purchase-order-lookup.component.scss']
})
export class PurchaseOrderLookupComponent implements OnInit {
    private store = inject(Store);

    // Output event when PO is selected
    poSelected = output<PurchaseOrderHeader>();

    // Dialog visibility
    visible = false;

    // Search criteria
    poNumber = '';
    supplierId = '';
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    // Store selectors
    orders$ = this.store.select(selectPOLookupResults);
    loading$ = this.store.select(selectPOLookupLoading);
    error$ = this.store.select(selectPOLookupError);

    // Selected order
    selectedOrder: PurchaseOrderHeader | null = null;

    // Table columns
    columns = [
        { field: 'poNumber', header: 'PO Number' },
        { field: 'poDate', header: 'PO Date' },
        { field: 'supplierName', header: 'Supplier' },
        { field: 'status', header: 'Status' },
        { field: 'totalItems', header: 'Items' },
        { field: 'totalQuantity', header: 'Quantity' },
        { field: 'totalValue', header: 'Value' }
    ];

    ngOnInit(): void {
        // Initial search when dialog opens
    }

    /**
     * Show the lookup dialog
     */
    show(): void {
        this.visible = true;
        this.search();
    }

    /**
     * Hide the lookup dialog
     */
    hide(): void {
        this.visible = false;
        this.clearSearch();
    }

    /**
     * Search for purchase orders based on criteria
     */
    search(): void {
        const criteria: POLookupCriteria = {
            poNumber: this.poNumber || undefined,
            supplierId: this.supplierId || undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
            // Exclude fully received orders
            status: [POStatus.PENDING, POStatus.PARTIALLY_RECEIVED]
        };

        this.store.dispatch(lookupPurchaseOrders({ criteria }));
    }

    /**
     * Clear search criteria and results
     */
    clearSearch(): void {
        this.poNumber = '';
        this.supplierId = '';
        this.dateFrom = null;
        this.dateTo = null;
        this.selectedOrder = null;
        this.store.dispatch(clearPOLookupResults());
    }

    /**
     * Handle row selection
     */
    onRowSelect(event: any): void {
        this.selectedOrder = event.data || event;
    }

    /**
     * Confirm selection and emit event
     */
    onConfirmSelection(): void {
        if (this.selectedOrder) {
            this.poSelected.emit(this.selectedOrder);
            this.hide();
        }
    }

    /**
     * Get status badge severity for PrimeNG tag
     */
    getStatusSeverity(status: POStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case POStatus.PENDING:
                return 'warn';
            case POStatus.PARTIALLY_RECEIVED:
                return 'info';
            case POStatus.FULLY_RECEIVED:
                return 'success';
            case POStatus.CANCELLED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Get status display label
     */
    getStatusLabel(status: POStatus): string {
        switch (status) {
            case POStatus.PENDING:
                return 'Pending';
            case POStatus.PARTIALLY_RECEIVED:
                return 'Partially Received';
            case POStatus.FULLY_RECEIVED:
                return 'Fully Received';
            case POStatus.CANCELLED:
                return 'Cancelled';
            default:
                return status;
        }
    }

    /**
     * Format currency value
     */
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);
    }

    /**
     * Format date
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
