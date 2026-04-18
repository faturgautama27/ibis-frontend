import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

import {
    StockAdjustmentAudit,
    AdjustmentFilters,
    AuditAction,
    getAuditActionLabel,
    getAdjustmentStatusSeverity
} from '../../models/stock-adjustment.model';
import { StockAdjustmentService } from '../../services/stock-adjustment.service';
import { loadAdjustments } from '../../store/stock-adjustment.actions';
import { selectLoading } from '../../store/stock-adjustment.selectors';

/**
 * Stock Adjustment Audit Component
 * Comprehensive audit trail view with filtering and export capabilities
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8
 * - Implement comprehensive audit trail view
 * - Add filters (date, item, user, action)
 * - Add export to Excel functionality
 * - Create timeline visualization
 */
@Component({
    selector: 'app-stock-adjustment-audit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        TimelineModule,
        CardModule,
        TagModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        StatusBadgeComponent
    ],
    templateUrl: './stock-adjustment-audit.component.html',
    styleUrls: ['./stock-adjustment-audit.component.scss']
})
export class StockAdjustmentAuditComponent implements OnInit {
    private store = inject(Store);
    private adjustmentService = inject(StockAdjustmentService);

    // Audit trail data
    auditTrail: StockAdjustmentAudit[] = [];
    filteredAuditTrail: StockAdjustmentAudit[] = [];
    loading = false;

    // Filter properties
    searchQuery = '';
    selectedActions: AuditAction[] = [];
    dateFrom: Date | null = null;
    dateTo: Date | null = null;
    selectedUser: string | null = null;
    selectedItem: string | null = null;

    // View mode: 'table' or 'timeline'
    viewMode: 'table' | 'timeline' = 'table';

    // Action options for dropdown
    actionOptions = [
        { label: 'Created', value: AuditAction.CREATED },
        { label: 'Submitted', value: AuditAction.SUBMITTED },
        { label: 'Approved', value: AuditAction.APPROVED },
        { label: 'Rejected', value: AuditAction.REJECTED },
        { label: 'Viewed', value: AuditAction.VIEWED }
    ];

    // Table columns
    columns = [
        { field: 'performedAt', header: 'Date & Time' },
        { field: 'action', header: 'Action' },
        { field: 'performedByName', header: 'User' },
        { field: 'adjustmentId', header: 'Adjustment ID' },
        { field: 'beforeStatus', header: 'Before Status' },
        { field: 'afterStatus', header: 'After Status' },
        { field: 'comments', header: 'Comments' }
    ];

    ngOnInit(): void {
        this.loadAuditTrail();
    }

    /**
     * Load audit trail data
     * In a real implementation, this would load all audit records from the backend
     */
    private loadAuditTrail(): void {
        this.loading = true;

        // TODO: Replace with actual API call to get all audit records
        // For now, we'll use an empty array
        // this.adjustmentService.getAllAuditRecords().subscribe({
        //     next: (data) => {
        //         this.auditTrail = data;
        //         this.applyFilters();
        //         this.loading = false;
        //     },
        //     error: (error) => {
        //         console.error('Error loading audit trail:', error);
        //         this.loading = false;
        //     }
        // });

        // Mock data for demonstration
        this.auditTrail = this.generateMockAuditData();
        this.applyFilters();
        this.loading = false;
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
     * Handle action filter change
     */
    onActionChange(actions: AuditAction[]): void {
        this.selectedActions = actions;
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
     * Apply all filters to audit trail
     */
    private applyFilters(): void {
        let filtered = [...this.auditTrail];

        // Filter by action
        if (this.selectedActions.length > 0) {
            filtered = filtered.filter(audit => this.selectedActions.includes(audit.action));
        }

        // Filter by date range
        if (this.dateFrom) {
            filtered = filtered.filter(audit =>
                new Date(audit.performedAt) >= this.dateFrom!
            );
        }

        if (this.dateTo) {
            filtered = filtered.filter(audit =>
                new Date(audit.performedAt) <= this.dateTo!
            );
        }

        // Filter by user
        if (this.selectedUser) {
            filtered = filtered.filter(audit =>
                audit.performedBy === this.selectedUser
            );
        }

        // Search query (user name, adjustment ID, comments)
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(audit =>
                audit.performedByName.toLowerCase().includes(query) ||
                audit.adjustmentId.toLowerCase().includes(query) ||
                (audit.comments && audit.comments.toLowerCase().includes(query))
            );
        }

        this.filteredAuditTrail = filtered;
    }

    /**
     * Clear all filters
     */
    onClearFilters(): void {
        this.searchQuery = '';
        this.selectedActions = [];
        this.dateFrom = null;
        this.dateTo = null;
        this.selectedUser = null;
        this.selectedItem = null;
        this.applyFilters();
    }

    /**
     * Export audit trail to Excel
     */
    onExportToExcel(): void {
        this.loading = true;

        const filters: AdjustmentFilters = {
            searchQuery: this.searchQuery || undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
            submittedBy: this.selectedUser || undefined
        };

        this.adjustmentService.exportAuditTrail(filters).subscribe({
            next: (blob) => {
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `stock-adjustment-audit-${new Date().toISOString().split('T')[0]}.xlsx`;
                link.click();
                window.URL.revokeObjectURL(url);
                this.loading = false;
            },
            error: (error) => {
                console.error('Error exporting audit trail:', error);
                this.loading = false;
            }
        });
    }

    /**
     * Toggle view mode between table and timeline
     */
    toggleViewMode(): void {
        this.viewMode = this.viewMode === 'table' ? 'timeline' : 'table';
    }

    /**
     * Get audit action label
     */
    getActionLabel(action: AuditAction): string {
        return getAuditActionLabel(action);
    }

    /**
     * Get timeline icon for audit action
     */
    getTimelineIcon(action: AuditAction): string {
        switch (action) {
            case AuditAction.CREATED:
                return 'pi pi-plus-circle';
            case AuditAction.SUBMITTED:
                return 'pi pi-send';
            case AuditAction.APPROVED:
                return 'pi pi-check-circle';
            case AuditAction.REJECTED:
                return 'pi pi-times-circle';
            case AuditAction.VIEWED:
                return 'pi pi-eye';
            default:
                return 'pi pi-circle';
        }
    }

    /**
     * Get timeline color for audit action
     */
    getTimelineColor(action: AuditAction): string {
        switch (action) {
            case AuditAction.CREATED:
                return '#3b82f6';
            case AuditAction.SUBMITTED:
                return '#f59e0b';
            case AuditAction.APPROVED:
                return '#10b981';
            case AuditAction.REJECTED:
                return '#ef4444';
            case AuditAction.VIEWED:
                return '#6b7280';
            default:
                return '#6b7280';
        }
    }

    /**
     * Get status severity for tag
     */
    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
        const severity = getAdjustmentStatusSeverity(status as any);
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
     * Generate mock audit data for demonstration
     */
    private generateMockAuditData(): StockAdjustmentAudit[] {
        const now = new Date();
        return [
            {
                id: '1',
                adjustmentId: 'ADJ-2024-001',
                action: AuditAction.CREATED,
                performedBy: 'user1',
                performedByName: 'John Doe',
                performedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
                comments: 'Initial creation'
            },
            {
                id: '2',
                adjustmentId: 'ADJ-2024-001',
                action: AuditAction.SUBMITTED,
                performedBy: 'user1',
                performedByName: 'John Doe',
                performedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
                beforeStatus: 'DRAFT' as any,
                afterStatus: 'PENDING' as any,
                comments: 'Submitted for approval'
            },
            {
                id: '3',
                adjustmentId: 'ADJ-2024-001',
                action: AuditAction.APPROVED,
                performedBy: 'user2',
                performedByName: 'Jane Smith',
                performedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
                beforeStatus: 'PENDING' as any,
                afterStatus: 'APPROVED' as any,
                beforeQuantity: 100,
                afterQuantity: 150,
                comments: 'Approved after verification'
            }
        ];
    }
}
