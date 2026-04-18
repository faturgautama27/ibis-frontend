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
import { PurchaseOrderHeader, POStatus, POFilters } from '../../models/purchase-order.model';
import {
    loadOrders,
    deleteOrder,
    setFilters,
    setPagination
} from '../../store/purchase-order.actions';
import {
    selectFilteredOrders,
    selectLoading,
    selectFilters,
    selectPagination,
    selectTotalOrderCount
} from '../../store/purchase-order.selectors';
import { MOCK_PURCHASE_ORDERS } from './purchase-order-list.mock';

/**
 * Purchase Order List Component
 * Displays all purchase orders with filtering, search, and action capabilities
 * 
 * Requirements:
 * - 2.1: Display purchase orders with status indicators
 * - Filters by status, date range, supplier
 * - Search and sort functionality
 * - Action buttons (create, view, edit, delete)
 * - Connected to NgRx store
 * 
 * Development Mode:
 * - Set USE_MOCK_DATA = true to use mock data
 * - Set USE_MOCK_DATA = false to use NgRx store
 */
@Component({
    selector: 'app-purchase-order-list',
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
    templateUrl: './purchase-order-list.component.html',
    styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    // Development mode toggle
    private readonly USE_MOCK_DATA = true; // Set to false to use NgRx store

    // Expose enum to template
    POStatus = POStatus;

    // Filter properties for two-way binding
    searchQuery = '';
    selectedStatus: POStatus | null = null;
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    // Mock data properties
    private mockOrders: PurchaseOrderHeader[] = MOCK_PURCHASE_ORDERS;
    private filteredMockOrders: PurchaseOrderHeader[] = [...this.mockOrders];

    // Store selectors (used when USE_MOCK_DATA = false)
    private storeOrders$ = this.store.select(selectFilteredOrders);
    private storeLoading$ = this.store.select(selectLoading);
    private storeTotalCount$ = this.store.select(selectTotalOrderCount);

    // Public observables (switch between mock and store)
    orders$: Observable<PurchaseOrderHeader[]> = of([]);
    loading$: Observable<boolean> = of(false);
    filters$ = this.store.select(selectFilters);
    pagination$ = this.store.select(selectPagination);
    totalCount$: Observable<number> = of(0);

    // Status options for dropdown
    statusOptions = [
        { label: 'Pending', value: POStatus.PENDING },
        { label: 'Partially Received', value: POStatus.PARTIALLY_RECEIVED },
        { label: 'Fully Received', value: POStatus.FULLY_RECEIVED },
        { label: 'Cancelled', value: POStatus.CANCELLED }
    ];

    // Table columns
    columns = [
        { field: 'poNumber', header: 'PO Number' },
        { field: 'poDate', header: 'PO Date' },
        { field: 'supplierName', header: 'Supplier' },
        { field: 'status', header: 'Status' },
        { field: 'totalItems', header: 'Total Items' },
        { field: 'totalQuantity', header: 'Total Quantity' },
        { field: 'totalValue', header: 'Total Value' },
        { field: 'inputMethod', header: 'Input Method' }
    ];

    ngOnInit(): void {
        if (this.USE_MOCK_DATA) {
            // Use mock data
            this.initializeMockData();
        } else {
            // Use NgRx store
            this.orders$ = this.storeOrders$;
            this.loading$ = this.storeLoading$;
            this.totalCount$ = this.storeTotalCount$;
            this.store.dispatch(loadOrders({ filters: {} }));
        }
    }

    /**
     * Initialize mock data mode
     */
    private initializeMockData(): void {
        this.filteredMockOrders = [...this.mockOrders];
        this.orders$ = of(this.filteredMockOrders);
        this.loading$ = of(false);
        this.totalCount$ = of(this.filteredMockOrders.length);
    }

    /**
     * Apply filters to mock data
     */
    private applyMockFilters(): void {
        let filtered = [...this.mockOrders];

        // Apply search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.poNumber.toLowerCase().includes(query) ||
                order.supplierName.toLowerCase().includes(query) ||
                order.supplierCode.toLowerCase().includes(query) ||
                order.warehouseName.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (this.selectedStatus) {
            filtered = filtered.filter(order => order.status === this.selectedStatus);
        }

        // Apply date from filter
        if (this.dateFrom) {
            filtered = filtered.filter(order => new Date(order.poDate) >= this.dateFrom!);
        }

        // Apply date to filter
        if (this.dateTo) {
            filtered = filtered.filter(order => new Date(order.poDate) <= this.dateTo!);
        }

        this.filteredMockOrders = filtered;
        this.orders$ = of(this.filteredMockOrders);
        this.totalCount$ = of(this.filteredMockOrders.length);
    }

    /**
     * Handle search input
     */
    onSearch(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.searchQuery = query;

        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.applyFilters();
        }
    }

    /**
     * Handle status filter change
     */
    onStatusChange(status: POStatus | null): void {
        this.selectedStatus = status;

        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.applyFilters();
        }
    }

    /**
     * Handle date from filter change
     */
    onDateFromChange(date: Date | null): void {
        this.dateFrom = date;

        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.applyFilters();
        }
    }

    /**
     * Handle date to filter change
     */
    onDateToChange(date: Date | null): void {
        this.dateTo = date;

        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.applyFilters();
        }
    }

    /**
     * Apply all filters to the store
     */
    private applyFilters(): void {
        const filters: POFilters = {
            searchQuery: this.searchQuery || undefined,
            status: this.selectedStatus ? [this.selectedStatus] : undefined,
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
        this.selectedStatus = null;
        this.dateFrom = null;
        this.dateTo = null;

        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.store.dispatch(setFilters({ filters: {} }));
        }
    }

    /**
     * Navigate to create purchase order page
     */
    onCreateOrder(): void {
        this.router.navigate(['/purchase-orders/new']);
    }

    /**
     * Navigate to view purchase order details
     */
    onViewOrder(order: PurchaseOrderHeader): void {
        this.router.navigate(['/purchase-orders', order.id]);
    }

    /**
     * Navigate to edit purchase order page
     */
    onEditOrder(order: PurchaseOrderHeader): void {
        this.router.navigate(['/purchase-orders', order.id, 'edit']);
    }

    /**
     * Delete purchase order with confirmation
     */
    onDeleteOrder(order: PurchaseOrderHeader): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete Purchase Order "${order.poNumber}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.USE_MOCK_DATA) {
                    // Remove from mock data
                    const index = this.mockOrders.findIndex(o => o.id === order.id);
                    if (index > -1) {
                        this.mockOrders.splice(index, 1);
                        this.applyMockFilters();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `Purchase Order ${order.poNumber} deleted successfully`
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
