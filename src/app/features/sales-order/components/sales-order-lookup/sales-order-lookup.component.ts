/**
 * Sales Order Lookup Component
 * 
 * Reusable lookup dialog for selecting sales orders in Outbound transaction forms.
 * Requirements: 7.1, 7.2
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
import { SalesOrderHeader, SOStatus, SOLookupCriteria } from '../../models/sales-order.model';
import { lookupSalesOrders, clearSOLookupResults } from '../../../outbound/store/outbound.actions';
import {
    selectSOLookupResults,
    selectSOLookupLoading,
    selectSOLookupError
} from '../../../outbound/store/outbound.selectors';

@Component({
    selector: 'app-sales-order-lookup',
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
    templateUrl: './sales-order-lookup.component.html',
    styleUrls: ['./sales-order-lookup.component.scss']
})
export class SalesOrderLookupComponent implements OnInit {
    private store = inject(Store);

    // Output event when SO is selected
    soSelected = output<SalesOrderHeader>();

    // Dialog visibility
    visible = false;

    // Search criteria
    soNumber = '';
    customerId = '';
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    // Store selectors
    orders$ = this.store.select(selectSOLookupResults);
    loading$ = this.store.select(selectSOLookupLoading);
    error$ = this.store.select(selectSOLookupError);

    // Selected order
    selectedOrder: SalesOrderHeader | null = null;

    // Table columns
    columns = [
        { field: 'soNumber', header: 'SO Number' },
        { field: 'soDate', header: 'SO Date' },
        { field: 'customerName', header: 'Customer' },
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
     * Search for sales orders based on criteria
     */
    search(): void {
        const criteria: SOLookupCriteria = {
            soNumber: this.soNumber || undefined,
            customerId: this.customerId || undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
            // Exclude fully shipped orders
            status: [SOStatus.PENDING, SOStatus.PARTIALLY_SHIPPED]
        };

        this.store.dispatch(lookupSalesOrders({ criteria }));
    }

    /**
     * Clear search criteria and results
     */
    clearSearch(): void {
        this.soNumber = '';
        this.customerId = '';
        this.dateFrom = null;
        this.dateTo = null;
        this.selectedOrder = null;
        this.store.dispatch(clearSOLookupResults());
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
            this.soSelected.emit(this.selectedOrder);
            this.hide();
        }
    }

    /**
     * Get status badge severity for PrimeNG tag
     */
    getStatusSeverity(status: SOStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case SOStatus.PENDING:
                return 'warn';
            case SOStatus.PARTIALLY_SHIPPED:
                return 'info';
            case SOStatus.FULLY_SHIPPED:
                return 'success';
            case SOStatus.CANCELLED:
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Get status display label
     */
    getStatusLabel(status: SOStatus): string {
        switch (status) {
            case SOStatus.PENDING:
                return 'Pending';
            case SOStatus.PARTIALLY_SHIPPED:
                return 'Partially Shipped';
            case SOStatus.FULLY_SHIPPED:
                return 'Fully Shipped';
            case SOStatus.CANCELLED:
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
