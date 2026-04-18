import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { MOCK_SALES_ORDERS } from './sales-order-list.mock';

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
 * 
 * Development Mode:
 * - Set USE_MOCK_DATA = true to use mock data
 * - Set USE_MOCK_DATA = false to use NgRx store
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
        TooltipModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './sales-order-list.component.html',
    styleUrls: ['./sales-order-list.component.scss']
})
export class SalesOrderListComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    // Development mode toggle
    private readonly USE_MOCK_DATA = true; // Set to false to use NgRx store

    // Expose enum to template
    SOStatus = SOStatus;

    // Filter properties for two-way binding
    searchQuery = '';
    selectedStatus: SOStatus | null = null;
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    // Mock data properties
    private mockOrders: SalesOrderHeader[] = MOCK_SALES_ORDERS;
    private filteredMockOrders: SalesOrderHeader[] = [...this.mockOrders];

    // Store selectors (used when USE_MOCK_DATA = false)
    private storeOrders$ = this.store.select(selectFilteredOrders);
    private storeLoading$ = this.store.select(selectLoading);
    private storeTotalCount$ = this.store.select(selectTotalOrderCount);

    // Public observables (switch between mock and store)
    orders$: Observable<SalesOrderHeader[]> = of([]);
    loading$: Observable<boolean> = of(false);
    filters$ = this.store.select(selectFilters);
    pagination$ = this.store.select(selectPagination);
    totalCount$: Observable<number> = of(0);

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
        if (this.USE_MOCK_DATA) {
            this.initializeMockData();
        } else {
            this.orders$ = this.storeOrders$;
            this.loading$ = this.storeLoading$;
            this.totalCount$ = this.storeTotalCount$;
            this.store.dispatch(loadOrders({ filters: {} }));
        }
    }

    private initializeMockData(): void {
        this.filteredMockOrders = [...this.mockOrders];
        this.orders$ = of(this.filteredMockOrders);
        this.loading$ = of(false);
        this.totalCount$ = of(this.filteredMockOrders.length);
    }

    private applyMockFilters(): void {
        let filtered = [...this.mockOrders];

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.soNumber.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.customerCode.toLowerCase().includes(query) ||
                order.warehouseName.toLowerCase().includes(query)
            );
        }

        if (this.selectedStatus) {
            filtered = filtered.filter(order => order.status === this.selectedStatus);
        }

        if (this.dateFrom) {
            filtered = filtered.filter(order => new Date(order.soDate) >= this.dateFrom!);
        }

        if (this.dateTo) {
            filtered = filtered.filter(order => new Date(order.soDate) <= this.dateTo!);
        }

        this.filteredMockOrders = filtered;
        this.orders$ = of(this.filteredMockOrders);
        this.totalCount$ = of(this.filteredMockOrders.length);
    }

    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery = query;
        this.USE_MOCK_DATA ? this.applyMockFilters() : this.applyFilters();
    }

    onStatusChange(status: SOStatus | null): void {
        this.selectedStatus = status;
        this.USE_MOCK_DATA ? this.applyMockFilters() : this.applyFilters();
    }

    onDateFromChange(date: Date | null): void {
        this.dateFrom = date;
        this.USE_MOCK_DATA ? this.applyMockFilters() : this.applyFilters();
    }

    onDateToChange(date: Date | null): void {
        this.dateTo = date;
        this.USE_MOCK_DATA ? this.applyMockFilters() : this.applyFilters();
    }

    /**
     * Apply all filters to the store
     */
    private applyFilters(): void {
        const filters: SOFilters = {
            searchQuery: this.searchQuery || undefined,
            status: this.selectedStatus ? [this.selectedStatus] : undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined
        };

        this.store.dispatch(setFilters({ filters }));
    }

    onClearFilters(): void {
        this.searchQuery = '';
        this.selectedStatus = null;
        this.dateFrom = null;
        this.dateTo = null;
        this.USE_MOCK_DATA ? this.applyMockFilters() : this.store.dispatch(setFilters({ filters: {} }));
    }

    /**
     * Navigate to create sales order page
     */
    onCreateOrder(): void {
        this.router.navigate(['/sales-orders/new']);
    }

    /**
     * Navigate to view sales order details
     */
    onViewOrder(order: SalesOrderHeader): void {
        this.router.navigate(['/sales-orders', order.id]);
    }

    /**
     * Navigate to edit sales order page
     */
    onEditOrder(order: SalesOrderHeader): void {
        this.router.navigate(['/sales-orders', order.id, 'edit']);
    }

    onDeleteOrder(order: SalesOrderHeader): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Sales Order "${order.soNumber}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.USE_MOCK_DATA) {
                    const index = this.mockOrders.findIndex(o => o.id === order.id);
                    if (index > -1) {
                        this.mockOrders.splice(index, 1);
                        this.applyMockFilters();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `Sales Order ${order.soNumber} deleted successfully`
                        });
                    }
                } else {
                    this.store.dispatch(deleteOrder({ orderId: order.id }));
                }
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
