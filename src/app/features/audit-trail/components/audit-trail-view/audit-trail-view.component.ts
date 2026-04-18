import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { AuditLogService } from '../../services/audit-log.service';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

/**
 * Audit Trail View Component
 * Requirements: 12.5, 12.6, 12.7
 */
@Component({
    selector: 'app-audit-trail-view',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DatePickerModule,
        InputTextModule,
        SelectModule,
        TooltipModule,
        // Enhanced Components
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        EnhancedButtonComponent,
        StatusBadgeComponent
    ],
    templateUrl: './audit-trail-view.component.html',
    styleUrls: ['./audit-trail-view.component.scss']
})
export class AuditTrailViewComponent implements OnInit {
    private auditLogService = inject(AuditLogService);

    auditLogs: any[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    userFilter = '';
    actionFilter = '';

    actionOptions = [
        { label: 'Insert', value: 'INSERT' },
        { label: 'Update', value: 'UPDATE' },
        { label: 'Delete', value: 'DELETE' }
    ];

    ngOnInit(): void {
        this.loadAuditLogs();
    }

    loadAuditLogs(): void {
        this.auditLogService.queryLogs({
            start_date: this.startDate || undefined,
            end_date: this.endDate || undefined,
            user_name: this.userFilter || undefined,
            action: this.actionFilter || undefined
        }).subscribe(logs => {
            this.auditLogs = logs;
        });
    }

    viewChanges(log: any): void {
        alert(`Old Data: ${log.old_data}\n\nNew Data: ${log.new_data}`);
    }

    exportLogs(): void {
        this.auditLogService.exportLogs({
            start_date: this.startDate || undefined,
            end_date: this.endDate || undefined
        }).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'audit_trail.csv';
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    getActionSeverity(action: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (action) {
            case 'INSERT': return 'success';
            case 'UPDATE': return 'info';
            case 'DELETE': return 'danger';
            default: return 'secondary';
        }
    }
}
