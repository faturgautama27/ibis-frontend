import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

// Enhanced Components
import {
    EnhancedButtonComponent,
    EnhancedCardComponent,
    EnhancedTableComponent,
    PageHeaderComponent,
    StatusBadgeComponent
} from '../../../../shared/components';
import { InputMethod, SalesOrderHeader, SOStatus } from '../../models/sales-order.model';

/**
 * Sales Order Detail Component
 * 
 * Requirements:
 * - 18.3: Apply enhanced styling to Sales Order Detail page
 * - 18.4: Apply consistent styling patterns across sales order workflows
 * - 18.5: Maintain all existing functionality in the Sales Order module
 * - Read-only view of SO details
 * - Linked outbound transactions display
 * - Status history timeline using PrimeNG p-timeline
 * - Print/export functionality
 */
@Component({
    selector: 'app-sales-order-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TagModule,
        TimelineModule,
        TableModule,
        TooltipModule,
        // Enhanced Components
        EnhancedButtonComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        PageHeaderComponent,
        StatusBadgeComponent
    ],
    templateUrl: './sales-order-detail.component.html',
    styleUrls: ['./sales-order-detail.component.scss']
})
export class SalesOrderDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(Store);

    // Component state
    orderId: string | null = null;
    salesOrder: SalesOrderHeader | null = null;
    loading = false;

    // Mock data for demonstration
    mockSalesOrder: SalesOrderHeader = {
        id: '1',
        soNumber: 'SO-2024-001',
        soDate: new Date('2024-01-15'),
        customerId: 'CUST-001',
        customerCode: 'CUST-001',
        customerName: 'ABC Corporation',
        warehouseId: 'WH-001',
        warehouseCode: 'WH-001',
        warehouseName: 'Main Warehouse',
        shippingAddress: '123 Business Street, Jakarta 12345',
        shippingMethod: 'Express Delivery',
        deliveryDate: new Date('2024-01-20'),
        currency: 'IDR',
        exchangeRate: 1,
        paymentTerms: 'Net 30',
        notes: 'Urgent delivery required',
        status: SOStatus.PENDING,
        totalItems: 5,
        totalQuantity: 150,
        totalValue: 15000000,
        inputMethod: InputMethod.MANUAL,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 'admin',
        updatedBy: 'admin'
    };

    // Mock timeline events
    timelineEvents = [
        {
            status: 'Created',
            date: '2024-01-15 09:00',
            icon: 'pi pi-plus',
            color: '#3B82F6',
            description: 'Sales order created by admin'
        },
        {
            status: 'Approved',
            date: '2024-01-15 10:30',
            icon: 'pi pi-check',
            color: '#10B981',
            description: 'Sales order approved by manager'
        },
        {
            status: 'In Progress',
            date: '2024-01-16 08:00',
            icon: 'pi pi-clock',
            color: '#F59E0B',
            description: 'Order processing started'
        }
    ];

    // Mock line items
    lineItems = [
        {
            id: '1',
            itemCode: 'ITEM-001',
            itemName: 'Product A',
            quantity: 50,
            unitPrice: 100000,
            totalPrice: 5000000,
            notes: 'Standard quality'
        },
        {
            id: '2',
            itemCode: 'ITEM-002',
            itemName: 'Product B',
            quantity: 100,
            unitPrice: 100000,
            totalPrice: 10000000,
            notes: 'Premium quality'
        }
    ];

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id');
        if (this.orderId) {
            this.loadSalesOrder();
        }
    }

    /**
     * Load sales order details
     */
    private loadSalesOrder(): void {
        // TODO: Load from store
        this.salesOrder = this.mockSalesOrder;
    }

    /**
     * Navigate back to list
     */
    onBack(): void {
        this.router.navigate(['/sales-orders']);
    }

    /**
     * Navigate to edit page
     */
    onEdit(): void {
        if (this.orderId) {
            this.router.navigate(['/sales-orders', this.orderId, 'edit']);
        }
    }

    /**
     * Print sales order
     */
    onPrint(): void {
        window.print();
    }

    /**
     * Export sales order
     */
    onExport(): void {
        // TODO: Implement export functionality
        console.log('Export sales order');
    }

    /**
     * Get status badge severity
     */
    getStatusSeverity(status: SOStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
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
