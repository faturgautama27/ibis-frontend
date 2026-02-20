import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { SalesOrderHeader, SOStatus, SOFilters } from '../../models/sales-order.model';
import {
    loadOrders,
    deleteOrder,
    setFilters,
    setPagination
} from '../../store/sales-order.actions';
import {
    selectFilteredOrders,
    selectLoading,
    selectFilters,
    selectPagination,
    selectTotalOrderCount
} from '../../store/sales-order.selectors';

/**
 * Sales Order List Component
 * Displays all sales orders with filtering, search, and action capabilities
 * 
 * Requirements:
 * - 5.14: Display sales orders with status indicators
 * - Filters by status, date range, customer
 * - Search and sort functionality
 * - Action buttons (create, view, edit, delete)
 * - Connected to NgRx store
 */
@Component({
    selector: 'app-sales-order-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        TagModule,
        ConfirmDialogModule,
        TooltipModule
    ],
    providers: [ConfirmationService],
    templateUrl: './sales-order-list.component.html',
    styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);

    // Expose enum to template
    SOStatus = SOStatus;

    // Filter properties for two-way binding
    searchQuery = '';
    selectedStatus: SOStatus[] = [];
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    // Store selectors
    orders$ = this.store.select(selectFilteredOrders);
    loading$ = this.store.select(selectLoading);
    filters$ = this.store.select(selectFilters);
    pagination$ = this.store.select(selectPagination);
    totalCount$ = this.store.select(selectTotalOrderCount);

    // Status options for dropdown
    statusOptions = [
        { label: 'Pending', value: SOStatus.PENDING },
        { label: 'Partially Shipped', value: SOStatus.PARTIALLY_SHIPPED },
        { label: 'Fully Shipped', value: SOStatus.FULLY_SHIPPED },
        { label: 'Cancelled', value: SOStatus.CANCELLED }
    ];

    // Table columns
    columns = [
        { field: 'soNumber', header: 'SO Number' },
        { field: 'soDate', header: 'SO Date' },
        { field: 'customerName', header: 'Customer' },
        { field: 'status', header: 'Status' },
        { field: 'totalItems', header: 'Total Items' },
        { field: 'totalQuantity', header: 'Total Quantity' },
        { field: 'totalValue', header: 'Total Value' },
        { field: 'inputMethod', header: 'Input Method' }
    ];

    ngOnInit(): void {
        // Load all orders on init
        this.store.dispatch(loadOrders({ filters: {} }));
    }

    /**
     * Handle search input
     */
    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery = query;
        this.applyFilters();
    }

    /**
     * Handle status filter change
     */
    onStatusChange(status: SOStatus[]): void {
        this.selectedStatus = status;
        this.applyFilters();
    }

    /**
     * Handle date from filter change
     */
    onDateFromChange(date: Date | null): void {
        this.dateFrom = date;
        this.applyFilters();
    }

    /**
     * Handle date to filter change
     */
    onDateToChange(date: Date | null): void {
        this.dateTo = date;
        this.applyFilters();
    }

    /**
     * Apply all filters to the store
     */
    private applyFilters(): void {
        const filters: SOFilters = {
            searchQuery: this.searchQuery || undefined,
            status: this.selectedStatus.length > 0 ? this.selectedStatus : undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined
        };

        this.store.dispatch(setFilters({ filters }));
    }

    /**
     * Clear all filters
     */
    onClearFilters(): void {
        this.searchQuery = '';
        this.selectedStatus = [];
        this.dateFrom = null;
        this.dateTo = null;
        this.store.dispatch(setFilters({ filters: {} }));
    }

    /**
     * Navigate to create sales order page
     */
    onCreateOrder(): void {
        this.router.navigate(['/sales-order/create']);
    }

    /**
     * Navigate to view sales order details
     */
    onViewOrder(order: SalesOrderHeader): void {
        this.router.navigate(['/sales-order/view', order.id]);
    }

    /**
     * Navigate to edit sales order page
     */
    onEditOrder(order: SalesOrderHeader): void {
        this.router.navigate(['/sales-order/edit', order.id]);
    }

    /**
     * Delete sales order with confirmation
     * Requirements: 5.16, 5.17 - Validates no linked outbound transactions
     */
    onDeleteOrder(order: SalesOrderHeader): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Sales Order "${order.soNumber}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.store.dispatch(deleteOrder({ orderId: order.id }));
            }
        });
    }

    /**
     * Handle table lazy loading
     */
    onLazyLoad(event: any): void {
        const page = event.first / event.rows;
        const pageSize = event.rows;
        this.store.dispatch(setPagination({ page, pageSize }));
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
    formatCurrency(value: number, currency: string): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency || 'IDR'
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
