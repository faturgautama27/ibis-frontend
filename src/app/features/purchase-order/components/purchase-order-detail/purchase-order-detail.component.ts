import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

// Enhanced Components
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

import { PurchaseOrderHeader, PurchaseOrderDetail, POStatus } from '../../models/purchase-order.model';

/**
 * Status History Entry Interface
 */
interface StatusHistoryEntry {
    status: POStatus;
    timestamp: Date;
    user: string;
    notes?: string;
}

/**
 * Linked Inbound Transaction Interface
 */
interface LinkedInboundTransaction {
    id: string;
    inboundNumber: string;
    inboundDate: Date;
    receivedQuantity: number;
    status: string;
}

/**
 * PurchaseOrderDetailComponent
 * Read-only view of Purchase Order details with linked transactions and status history
 * Requirements: 2.1
 */
@Component({
    selector: 'app-purchase-order-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        TagModule,
        TimelineModule,
        CardModule,
        DividerModule,
        // Enhanced Components
        EnhancedButtonComponent,
        EnhancedCardComponent,
        PageHeaderComponent,
        StatusBadgeComponent
    ],
    templateUrl: './purchase-order-detail.component.html',
    styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit {
    @Input() purchaseOrder!: PurchaseOrderHeader;
    @Input() orderDetails: PurchaseOrderDetail[] = [];
    @Input() linkedInbounds: LinkedInboundTransaction[] = [];
    @Input() statusHistory: StatusHistoryEntry[] = [];

    ngOnInit(): void {
        // Initialize with mock data if not provided
        if (!this.statusHistory || this.statusHistory.length === 0) {
            this.statusHistory = this.generateMockStatusHistory();
        }

        if (!this.linkedInbounds || this.linkedInbounds.length === 0) {
            this.linkedInbounds = this.generateMockLinkedInbounds();
        }
    }

    /**
     * Get status badge severity
     */
    getStatusSeverity(status: POStatus): 'success' | 'warn' | 'info' | 'danger' {
        switch (status) {
            case POStatus.FULLY_RECEIVED:
                return 'success';
            case POStatus.PARTIALLY_RECEIVED:
                return 'warn';
            case POStatus.PENDING:
                return 'info';
            case POStatus.CANCELLED:
                return 'danger';
            default:
                return 'info';
        }
    }

    /**
     * Get input method badge severity
     */
    getInputMethodSeverity(): 'success' | 'info' | 'warn' {
        switch (this.purchaseOrder?.inputMethod) {
            case 'MANUAL':
                return 'info';
            case 'EXCEL':
                return 'success';
            case 'API':
                return 'warn';
            default:
                return 'info';
        }
    }

    /**
     * Get status icon for timeline
     */
    getStatusIcon(status: POStatus): string {
        switch (status) {
            case POStatus.PENDING:
                return 'pi pi-clock';
            case POStatus.PARTIALLY_RECEIVED:
                return 'pi pi-spinner';
            case POStatus.FULLY_RECEIVED:
                return 'pi pi-check-circle';
            case POStatus.CANCELLED:
                return 'pi pi-times-circle';
            default:
                return 'pi pi-circle';
        }
    }

    /**
     * Get status color for timeline
     */
    getStatusColor(status: POStatus): string {
        switch (status) {
            case POStatus.PENDING:
                return '#3b82f6';
            case POStatus.PARTIALLY_RECEIVED:
                return '#f59e0b';
            case POStatus.FULLY_RECEIVED:
                return '#10b981';
            case POStatus.CANCELLED:
                return '#ef4444';
            default:
                return '#6b7280';
        }
    }

    /**
     * Calculate fulfillment percentage
     */
    getFulfillmentPercentage(): number {
        if (!this.orderDetails || this.orderDetails.length === 0) return 0;

        const totalOrdered = this.orderDetails.reduce((sum, detail) => sum + detail.orderedQuantity, 0);
        const totalReceived = this.orderDetails.reduce((sum, detail) => sum + detail.receivedQuantity, 0);

        return totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;
    }

    /**
     * Print purchase order
     */
    printPO(): void {
        window.print();
    }

    /**
     * Export purchase order to PDF
     */
    exportToPDF(): void {
        console.log('Exporting to PDF...');
        // TODO: Implement PDF export functionality
    }

    /**
     * Export purchase order to Excel
     */
    exportToExcel(): void {
        console.log('Exporting to Excel...');
        // TODO: Implement Excel export functionality
    }

    /**
     * Generate mock status history for demonstration
     */
    private generateMockStatusHistory(): StatusHistoryEntry[] {
        if (!this.purchaseOrder) return [];

        return [
            {
                status: POStatus.PENDING,
                timestamp: this.purchaseOrder.createdAt,
                user: this.purchaseOrder.createdBy,
                notes: 'Purchase order created'
            },
            {
                status: POStatus.PARTIALLY_RECEIVED,
                timestamp: new Date(this.purchaseOrder.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
                user: 'Warehouse Staff',
                notes: 'First batch received'
            }
        ];
    }

    /**
     * Generate mock linked inbounds for demonstration
     */
    private generateMockLinkedInbounds(): LinkedInboundTransaction[] {
        if (!this.purchaseOrder) return [];

        return [
            {
                id: 'INB-001',
                inboundNumber: 'INB-2024-001',
                inboundDate: new Date(this.purchaseOrder.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000),
                receivedQuantity: 50,
                status: 'COMPLETED'
            }
        ];
    }

    /**
     * Format currency value
     */
    formatCurrency(value: number, currency: string = 'IDR'): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency
        }).format(value);
    }

    /**
     * Format date value
     */
    formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Get fulfillment CSS class based on percentage
     */
    getFulfillmentClass(): string {
        const percentage = this.getFulfillmentPercentage();
        if (percentage === 100) return 'complete';
        if (percentage > 0) return 'partial';
        return 'pending';
    }

    /**
     * Get remaining quantity CSS class
     */
    getRemainingClass(remaining: number): string {
        return remaining > 0 ? 'pending' : 'complete';
    }

    /**
     * Format datetime value
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
}
