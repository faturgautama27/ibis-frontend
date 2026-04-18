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
import {
    StockAdjustmentHeader,
    AdjustmentStatus,
    AdjustmentFilters,
    getAdjustmentStatusLabel,
    getAdjustmentStatusSeverity
} from '../../models/stock-adjustment.model';
import {
    loadAdjustments,
    setFilters,
    loadPendingApprovals
} from '../../store/stock-adjustment.actions';
import {
    selectFilteredAdjustments,
    selectLoading,
    selectFilters,
    selectPagination
} from '../../store/stock-adjustment.selectors';

/**
 * Stock Adjustment List Component
 * Displays all stock adjustments with filtering, search, and action capabilities
 * 
 * Requirements: 8.7
 * - Implement PrimeNG table with lazy loading
 * - Add filters (status, date range, item, user)
 * - Add status badges with color coding using PrimeNG p-tag
 * - Add action buttons based on permissions
 * - Connect to NgRx store
 */
@Component({
    selector: 'app-stock-adjustment-list',
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
    templateUrl: './stock-adjustment-list.component.html',
    styleUrls: ['./stock-adjustment-list.component.scss']
})
export class StockAdjustmentListComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private confirmationService = inject(ConfirmationService);

    // Expose enum to template
    AdjustmentStatus = AdjustmentStatus;

    // Filter properties for two-way binding
    searchQuery = '';
    selectedStatus: AdjustmentStatus | null = null;
    dateFrom: Date | null = null;
    dateTo: Date | null = null;
    selectedWarehouse: string | null = null;
    selectedUser: string | null = null;

    // Store selectors
    adjustments$ = this.store.select(selectFilteredAdjustments);
    loading$ = this.store.select(selectLoading);
    filters$ = this.store.select(selectFilters);
    pagination$ = this.store.select(selectPagination);

    // Status options for dropdown
    statusOptions = [
        { label: 'Pending Approval', value: AdjustmentStatus.PENDING },
        { label: 'Approved', value: AdjustmentStatus.APPROVED },
        { label: 'Rejected', value: AdjustmentStatus.REJECTED }
    ];

    // Table columns
    columns = [
        { field: 'adjustmentNumber', header: 'Adjustment Number' },
        { field: 'adjustmentDate', header: 'Date' },
        { field: 'warehouseName', header: 'Warehouse' },
        { field: 'status', header: 'Status' },
        { field: 'totalItems', header: 'Total Items' },
        { field: 'submittedByName', header: 'Submitted By' },
        { field: 'submittedAt', header: 'Submitted At' }
    ];

    // Permission flags (would come from auth service in real app)
    canApprove = true; // TODO: Get from auth service
    canCreate = true;  // TODO: Get from auth service

    ngOnInit(): void {
        // Load all adjustments on init
        this.store.dispatch(loadAdjustments({ filters: {} }));

        // Load pending approvals if user has approval permission
        if (this.canApprove) {
            this.store.dispatch(loadPendingApprovals());
        }
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
    onStatusChange(status: AdjustmentStatus | null): void {
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
        const filters: AdjustmentFilters = {
            searchQuery: this.searchQuery || undefined,
            status: this.selectedStatus ? [this.selectedStatus] : undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
            warehouseId: this.selectedWarehouse || undefined,
            submittedBy: this.selectedUser || undefined
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
        this.selectedWarehouse = null;
        this.selectedUser = null;
        this.store.dispatch(setFilters({ filters: {} }));
    }

    /**
     * Navigate to create stock adjustment page
     */
    onCreateAdjustment(): void {
        this.router.navigate(['/stock-adjustment/new']);
    }

    /**
     * Navigate to pending approvals page
     */
    onNavigateToApprovals(): void {
        this.router.navigate(['/stock-adjustment/approve']);
    }

    /**
     * Navigate to view stock adjustment details
     */
    onViewAdjustment(adjustment: StockAdjustmentHeader): void {
        this.router.navigate(['/stock-adjustment/view', adjustment.id]);
    }

    /**
     * Navigate to approval page for pending adjustments
     */
    onApproveAdjustment(adjustment: StockAdjustmentHeader): void {
        this.router.navigate(['/stock-adjustment/approve', adjustment.id]);
    }

    /**
     * Get status badge label
     */
    getStatusLabel(status: AdjustmentStatus): string {
        return getAdjustmentStatusLabel(status);
    }

    /**
     * Get status badge severity for PrimeNG tag
     */
    getStatusSeverity(status: AdjustmentStatus): 'success' | 'warn' | 'danger' {
        const severity = getAdjustmentStatusSeverity(status);
        return severity === 'warning' ? 'warn' : severity;
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

    /**
     * Format datetime
     */
    formatDateTime(date: Date): string {
        return new Date(date).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Check if user can approve adjustment
     */
    canApproveAdjustment(adjustment: StockAdjustmentHeader): boolean {
        return this.canApprove && adjustment.status === AdjustmentStatus.PENDING;
    }

    /**
     * Check if user can view adjustment
     */
    canViewAdjustment(adjustment: StockAdjustmentHeader): boolean {
        return true; // All users can view
    }
}
