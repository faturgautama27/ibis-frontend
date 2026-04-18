import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { CustomsIntegrationService } from '../../services/customs-integration.service';
import { SyncQueue, CEISAStatus, SyncStatus } from '../../models/customs-integration.model';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Customs Sync Dashboard Component
 * Requirements: 14.8, 14.9, 15.2, 15.6
 */
@Component({
    selector: 'app-customs-sync-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        CardModule,
        TagModule,
        TabsModule,
        TooltipModule,
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        EnhancedButtonComponent,
        StatusBadgeComponent
    ],
    templateUrl: './customs-sync-dashboard.component.html',
    styleUrls: ['./customs-sync-dashboard.component.scss']
})
export class CustomsSyncDashboardComponent implements OnInit {
    private customsService = inject(CustomsIntegrationService);

    syncQueue: SyncQueue[] = [];
    ceisaStatuses: CEISAStatus[] = [];

    pendingCount = 0;
    completedCount = 0;
    failedCount = 0;
    inProgressCount = 0;

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.customsService.getSyncQueue().subscribe(queue => {
            this.syncQueue = queue;
            this.updateCounts();
        });

        this.customsService.getAllCEISAStatuses().subscribe(statuses => {
            this.ceisaStatuses = statuses;
        });
    }

    updateCounts(): void {
        this.pendingCount = this.syncQueue.filter(q => q.status === SyncStatus.PENDING).length;
        this.completedCount = this.syncQueue.filter(q => q.status === SyncStatus.COMPLETED).length;
        this.failedCount = this.syncQueue.filter(q => q.status === SyncStatus.FAILED).length;
        this.inProgressCount = this.syncQueue.filter(q => q.status === SyncStatus.IN_PROGRESS).length;
    }

    processQueue(): void {
        this.customsService.processSyncQueue().subscribe(result => {
            console.log(`Processed: ${result.processed}, Failed: ${result.failed}`);
            this.loadData();
        });
    }

    retrySync(queueItemId: string): void {
        this.customsService.retryFailedSync(queueItemId).subscribe({
            next: () => {
                console.log('Retry successful');
                this.loadData();
            },
            error: (err) => {
                console.error('Retry failed:', err);
                this.loadData();
            }
        });
    }

    checkStatus(ceisaReference: string): void {
        this.customsService.checkCEISAStatus(ceisaReference).subscribe(status => {
            if (status) {
                const index = this.ceisaStatuses.findIndex(s => s.ceisa_reference === ceisaReference);
                if (index !== -1) {
                    this.ceisaStatuses[index] = status;
                }
            }
        });
    }

    clearCompleted(): void {
        this.customsService.clearCompletedQueue().subscribe(() => {
            this.loadData();
        });
    }

    getPrioritySeverity(priority: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger'> = {
            'CRITICAL': 'danger',
            'HIGH': 'warn',
            'NORMAL': 'info',
            'LOW': 'secondary'
        };
        return map[priority] || 'info';
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger'> = {
            'COMPLETED': 'success',
            'IN_PROGRESS': 'warn',
            'PENDING': 'info',
            'FAILED': 'danger',
            'CANCELLED': 'secondary'
        };
        return map[status] || 'info';
    }

    getCEISAStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger'> = {
            'APPROVED': 'success',
            'SUBMITTED': 'info',
            'PROCESSING': 'warn',
            'REJECTED': 'danger',
            'FAILED': 'danger',
            'PENDING': 'secondary'
        };
        return map[status] || 'info';
    }
}
