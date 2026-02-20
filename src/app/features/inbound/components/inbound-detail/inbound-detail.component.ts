/**
 * Inbound Detail Component
 * 
 * Displays detailed view of an inbound transaction with PO link information.
 * Requirements: 4.8
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LucideAngularModule, PackageCheck, ArrowLeft, ExternalLink } from 'lucide-angular';
import { InboundDemoService } from '../../services/inbound-demo.service';
import { InboundHeader, InboundDetail, InboundStatus, QualityStatus } from '../../models/inbound.model';

@Component({
    selector: 'app-inbound-detail',
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
    templateUrl: './inbound-detail.component.html',
    styleUrls: ['./inbound-detail.component.scss']
})
export class InboundDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private inboundService = inject(InboundDemoService);

    // Icons
    PackageCheckIcon = PackageCheck;
    ArrowLeftIcon = ArrowLeft;
    ExternalLinkIcon = ExternalLink;

    // Data
    inbound: InboundHeader | null = null;
    details: InboundDetail[] = [];
    loading = false;
    error: string | null = null;

    // Expose enums to template
    InboundStatus = InboundStatus;
    QualityStatus = QualityStatus;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadInbound(id);
            this.loadDetails(id);
        }
    }

    loadInbound(id: string): void {
        this.loading = true;
        this.inboundService.getById(id).subscribe({
            next: (inbound) => {
                this.inbound = inbound;
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message || 'Failed to load inbound';
                this.loading = false;
            }
        });
    }

    loadDetails(id: string): void {
        this.inboundService.getDetails(id).subscribe({
            next: (details) => {
                this.details = details;
            },
            error: (error) => {
                this.error = error.message || 'Failed to load details';
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/inbound']);
    }

    viewPurchaseOrder(): void {
        if (this.inbound?.purchase_order_id) {
            this.router.navigate(['/purchase-order/view', this.inbound.purchase_order_id]);
        }
    }

    getStatusSeverity(status: InboundStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case InboundStatus.PENDING:
                return 'warn';
            case InboundStatus.RECEIVED:
                return 'info';
            case InboundStatus.QUALITY_CHECK:
                return 'warn';
            case InboundStatus.COMPLETED:
                return 'success';
            default:
                return 'secondary';
        }
    }

    getQualityStatusSeverity(status: QualityStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (status) {
            case QualityStatus.PASS:
                return 'success';
            case QualityStatus.FAIL:
                return 'danger';
            case QualityStatus.QUARANTINE:
                return 'warn';
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
