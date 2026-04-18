import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import {
    StockAdjustmentHeader,
    StockAdjustmentDetail,
    StockAdjustmentAudit,
    AdjustmentStatus,
    getAdjustmentStatusLabel,
    getAdjustmentStatusSeverity,
    getAdjustmentTypeLabel,
    getAuditActionLabel
} from '../../models/stock-adjustment.model';
import {
    loadAdjustmentById,
    loadAdjustmentDetails,
    loadAuditTrail
} from '../../store/stock-adjustment.actions';
import {
    selectSelectedAdjustment,
    selectAdjustmentDetailsById,
    selectAuditTrailById,
    selectLoading
} from '../../store/stock-adjustment.selectors';

/**
 * Stock Adjustment Detail Component
 * Read-only view of stock adjustment details with approval history and audit trail
 * 
 * Requirements: 8.1, 9.7
 * - Implement read-only view of adjustment details
 * - Add approval history timeline using PrimeNG p-timeline
 * - Display before/after quantity
 * - Show audit trail information
 */
@Component({
    selector: 'app-stock-adjustment-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        TagModule,
        TimelineModule,
        CardModule,
        DividerModule
    ],
    templateUrl: './stock-adjustment-detail.component.html',
    styleUrls: ['./stock-adjustment-detail.component.scss']
})
export class StockAdjustmentDetailComponent implements OnInit {
    private store = inject(Store);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    adjustmentId: string | null = null;
    adjustment$ = this.store.select(selectSelectedAdjustment);
    details$ = this.store.select(selectAdjustmentDetailsById(this.adjustmentId || ''));
    auditTrail$ = this.store.select(selectAuditTrailById(this.adjustmentId || ''));
    loading$ = this.store.select(selectLoading);

    ngOnInit(): void {
        // Get adjustment ID from route
        this.route.paramMap.subscribe(params => {
            this.adjustmentId = params.get('id');

            if (this.adjustmentId) {
                // Load adjustment data
                this.store.dispatch(loadAdjustmentById({ id: this.adjustmentId }));
                this.store.dispatch(loadAdjustmentDetails({ adjustmentId: this.adjustmentId }));
                this.store.dispatch(loadAuditTrail({ adjustmentId: this.adjustmentId }));

                // Update selectors with correct ID
                this.details$ = this.store.select(selectAdjustmentDetailsById(this.adjustmentId));
                this.auditTrail$ = this.store.select(selectAuditTrailById(this.adjustmentId));
            }
        });
    }

    /**
     * Navigate back to list
     */
    onBack(): void {
        this.router.navigate(['/stock-adjustment']);
    }

    /**
     * Print adjustment details
     */
    onPrint(): void {
        window.print();
    }

    /**
     * Export to PDF
     */
    onExportPDF(): void {
        console.log('Exporting to PDF...');
        // TODO: Implement PDF export
    }

    /**
     * Get status badge label
     */
    getStatusLabel(status: AdjustmentStatus): string {
        return getAdjustmentStatusLabel(status);
    }

    /**
     * Get status badge severity
     */
    getStatusSeverity(status: AdjustmentStatus): 'success' | 'warn' | 'danger' {
        const severity = getAdjustmentStatusSeverity(status);
        return severity === 'warning' ? 'warn' : severity;
    }

    /**
     * Get adjustment type label
     */
    getTypeLabel(type: string): string {
        return getAdjustmentTypeLabel(type as any);
    }

    /**
     * Get audit action label
     */
    getAuditActionLabel(action: string): string {
        return getAuditActionLabel(action as any);
    }

    /**
     * Get timeline icon for audit action
     */
    getTimelineIcon(action: string): string {
        switch (action) {
            case 'CREATED':
                return 'pi pi-plus-circle';
            case 'SUBMITTED':
                return 'pi pi-send';
            case 'APPROVED':
                return 'pi pi-check-circle';
            case 'REJECTED':
                return 'pi pi-times-circle';
            case 'VIEWED':
                return 'pi pi-eye';
            default:
                return 'pi pi-circle';
        }
    }

    /**
     * Get timeline color for audit action
     */
    getTimelineColor(action: string): string {
        switch (action) {
            case 'CREATED':
                return '#3b82f6';
            case 'SUBMITTED':
                return '#f59e0b';
            case 'APPROVED':
                return '#10b981';
            case 'REJECTED':
                return '#ef4444';
            case 'VIEWED':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    }

    /**
     * Format date
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Format datetime
     */
    formatDateTime(date: Date): string {
        return new Date(date).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Calculate total quantity change
     */
    getTotalQuantityChange(details: StockAdjustmentDetail[]): number {
        return details.reduce((sum, detail) => {
            const change = detail.adjustmentType === 'INCREASE' ? detail.quantity : -detail.quantity;
            return sum + change;
        }, 0);
    }

    /**
     * Calculate after quantity for a detail
     */
    getAfterQuantity(detail: StockAdjustmentDetail): number {
        if (detail.afterQuantity !== undefined && detail.afterQuantity !== null) {
            return detail.afterQuantity;
        }
        return detail.adjustmentType === 'INCREASE'
            ? detail.beforeQuantity + detail.quantity
            : detail.beforeQuantity - detail.quantity;
    }
}
