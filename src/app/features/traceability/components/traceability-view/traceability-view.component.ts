import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

// Services
import { TraceabilityService } from '../../services/traceability.service';

/**
 * Traceability View Component
 * Requirements: 13.1, 13.2, 13.3, 13.6, 13.7, 13.8
 */
@Component({
    selector: 'app-traceability-view',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        TabsModule,
        TimelineModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        EnhancedButtonComponent,
        StatusBadgeComponent,
        EmptyStateComponent
    ],
    templateUrl: './traceability-view.component.html',
    styleUrls: ['./traceability-view.component.scss']
})
export class TraceabilityViewComponent implements OnInit {
    private traceabilityService = inject(TraceabilityService);

    searchItemId = '';
    searchBatchNumber = '';
    searchRFIDValue = '';
    traceResults: any[] = [];
    productionHistory: any[] = [];
    traceDirection: 'forward' | 'backward' = 'forward';
    searched = false;

    ngOnInit(): void { }

    traceForward(): void {
        if (!this.searchItemId) return;

        this.traceDirection = 'forward';
        this.searched = true;
        this.productionHistory = [];

        this.traceabilityService.traceForward(
            this.searchItemId,
            this.searchBatchNumber || undefined
        ).subscribe(results => {
            this.traceResults = results;
        });
    }

    traceBackward(): void {
        if (!this.searchItemId) return;

        this.traceDirection = 'backward';
        this.searched = true;
        this.productionHistory = [];

        this.traceabilityService.traceBackward(
            this.searchItemId,
            this.searchBatchNumber || undefined
        ).subscribe(results => {
            this.traceResults = results;
        });
    }

    searchRFID(): void {
        if (!this.searchRFIDValue) return;

        this.searched = true;
        this.productionHistory = [];

        this.traceabilityService.searchByRFID(this.searchRFIDValue).subscribe(results => {
            this.traceResults = results || [];
        });
    }

    loadProductionHistory(): void {
        if (!this.searchItemId) return;

        this.searched = true;
        this.traceResults = [];

        this.traceabilityService.getProductionHistory(this.searchItemId).subscribe(history => {
            this.productionHistory = history;
        });
    }

    getMovementSeverity(movementType: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            'INBOUND': 'success',
            'OUTBOUND': 'danger',
            'PRODUCTION_INPUT': 'warn',
            'PRODUCTION_OUTPUT': 'info',
            'TRANSFER_OUT': 'warn',
            'TRANSFER_IN': 'success',
            'ADJUSTMENT': 'secondary'
        };
        return severityMap[movementType] || 'info';
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
            'COMPLETED': 'success',
            'IN_PROGRESS': 'warn',
            'PLANNED': 'info',
            'CANCELLED': 'danger'
        };
        return severityMap[status] || 'info';
    }
}
