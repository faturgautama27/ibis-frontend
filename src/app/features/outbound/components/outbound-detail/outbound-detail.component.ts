/**
 * Outbound Detail Component
 * 
 * Displays detailed view of an outbound transaction with SO link information.
 * Requirements: 7.8
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LucideAngularModule, PackageOpen, ArrowLeft, ExternalLink } from 'lucide-angular';
import { OutboundDemoService } from '../../services/outbound-demo.service';
import { OutboundHeader, OutboundDetail, OutboundStatus, OutboundType } from '../../models/outbound.model';

@Component({
    selector: 'app-outbound-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule,
        DividerModule,
        LucideAngularModule
    ],
    templateUrl: './outbound-detail.component.html',
    styleUrls: ['./outbound-detail.component.scss']
})
export class OutboundDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private outboundService = inject(OutboundDemoService);

    // Icons
    PackageOpenIcon = PackageOpen;
    ArrowLeftIcon = ArrowLeft;
    ExternalLinkIcon = ExternalLink;

    // Data
    outbound: OutboundHeader | null = null;
    details: OutboundDetail[] = [];
    loading = false;
    error: string | null = null;

    // Expose enums to template
    OutboundStatus = OutboundStatus;
    OutboundType = OutboundType;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOutbound(id);
            this.loadDetails(id);
        }
    }

    loadOutbound(id: string): void {
        this.loading = true;
        this.outboundService.getById(id).subscribe({
            next: (outbound) => {
                this.outbound = outbound;
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message || 'Failed to load outbound';
                this.loading = false;
            }
        });
    }

    loadDetails(id: string): void {
        this.outboundService.getDetails(id).subscribe({
            next: (details) => {
                this.details = details;
            },
            error: (error) => {
                this.error = error.message || 'Failed to load details';
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/outbound']);
    }

    viewSalesOrder(): void {
        if (this.outbound?.sales_order_id) {
            this.router.navigate(['/sales-order/view', this.outbound.sales_order_id]);
        }
    }

    getStatusSeverity(status: OutboundStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case OutboundStatus.PENDING:
                return 'warn';
            case OutboundStatus.PREPARED:
                return 'info';
            case OutboundStatus.SHIPPED:
                return 'info';
            case OutboundStatus.DELIVERED:
                return 'success';
            default:
                return 'secondary';
        }
    }

    formatDate(date: Date | undefined): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);
    }
}
