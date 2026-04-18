import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AuditLog, AuditAction, getAuditActionLabel } from '../../models/audit-log.model';
import { AuditLogService } from '../../services/audit-log.service';
import { MOCK_AUDIT_LOGS, getMockAuditLogs } from './audit-trail-view.mock';

/**
 * Audit Trail View Component
 * Requirements: 12.5, 12.6, 12.7
 * 
 * Development Mode:
 * - Set USE_MOCK_DATA = true to use mock data
 * - Set USE_MOCK_DATA = false to use service
 */
@Component({
    selector: 'app-audit-trail-view',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        DatePickerModule,
        InputTextModule,
        SelectModule,
        ToastModule,
        DialogModule
    ],
    providers: [MessageService],
    template: `
        <div class="main-layout">
            <!-- Page Header -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <i class="pi pi-history text-sky-600"></i>
                        Audit Trail
                    </h1>
                    <p class="text-sm text-gray-600 mt-1">Track and monitor all system changes</p>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white rounded-lg shadow-sm p-6" style="max-height: calc(100vh - 13rem); overflow-y: auto">
                <!-- Filters -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <p-datepicker 
                            [(ngModel)]="startDate"
                            dateFormat="dd/mm/yy"
                            [showIcon]="true"
                            class="w-full"
                        ></p-datepicker>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <p-datepicker 
                            [(ngModel)]="endDate"
                            dateFormat="dd/mm/yy"
                            [showIcon]="true"
                            class="w-full"
                        ></p-datepicker>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">User</label>
                        <input 
                            pInputText 
                            [(ngModel)]="userFilter"
                            placeholder="Filter by user"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Action</label>
                        <p-select 
                            [(ngModel)]="actionFilter"
                            [options]="actionOptions"
                            placeholder="All Actions"
                            [showClear]="true"
                            class="w-full"
                        ></p-select>
                    </div>
                </div>

                <div class="flex gap-3 mb-6">
                    <button 
                        pButton 
                        label="Search" 
                        icon="pi pi-search"
                        (click)="loadAuditLogs()"
                        class="p-button-primary"
                    ></button>
                    <button 
                        pButton 
                        label="Export" 
                        icon="pi pi-download"
                        (click)="exportLogs()"
                        class="p-button-secondary"
                    ></button>
                </div>

                <!-- Audit Logs Table -->
                <p-table 
                    [value]="auditLogs" 
                    [paginator]="true" 
                    [rows]="20"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Table</th>
                            <th>Record ID</th>
                            <th>Changes</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-log>
                        <tr>
                            <td>{{ log.timestamp | date:'short' }}</td>
                            <td>{{ log.user_name }}</td>
                            <td>
                                <span 
                                    class="px-2 py-1 rounded text-xs font-semibold"
                                    [class.bg-green-100]="log.action === 'INSERT'"
                                    [class.text-green-800]="log.action === 'INSERT'"
                                    [class.bg-blue-100]="log.action === 'UPDATE'"
                                    [class.text-blue-800]="log.action === 'UPDATE'"
                                    [class.bg-red-100]="log.action === 'DELETE'"
                                    [class.text-red-800]="log.action === 'DELETE'"
                                >
                                    {{ log.action }}
                                </span>
                            </td>
                            <td>{{ log.table_name }}</td>
                            <td>{{ log.record_id }}</td>
                            <td>
                                <button 
                                    pButton 
                                    icon="pi pi-eye"
                                    class="p-button-sm p-button-text"
                                    (click)="viewChanges(log)"
                                    pTooltip="View Changes"
                                ></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="6" class="text-center py-8">
                                <div class="flex flex-col items-center gap-2">
                                    <i class="pi pi-inbox text-4xl text-gray-400"></i>
                                    <p class="text-gray-500">No audit logs found</p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <!-- Changes Dialog -->
        <p-dialog 
            [(visible)]="showChangesDialog" 
            header="Audit Log Details"
            [modal]="true"
            [style]="{width: '50vw'}"
            [draggable]="false"
            [resizable]="false">
            
            <div *ngIf="selectedLog">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <p class="text-sm text-gray-900">{{ getActionLabel(selectedLog.action) }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Table</label>
                        <p class="text-sm text-gray-900">{{ selectedLog.table_name }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Record ID</label>
                        <p class="text-sm text-gray-900">{{ selectedLog.record_id }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
                        <p class="text-sm text-gray-900">{{ selectedLog.user_name }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Timestamp</label>
                        <p class="text-sm text-gray-900">{{ selectedLog.timestamp | date:'medium' }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                        <p class="text-sm text-gray-900">{{ selectedLog.ip_address || 'N/A' }}</p>
                    </div>
                </div>

                <div *ngIf="selectedLog.changed_fields && selectedLog.changed_fields.length > 0" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Changed Fields</label>
                    <div class="flex flex-wrap gap-2">
                        <span *ngFor="let field of selectedLog.changed_fields" 
                              class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {{ field }}
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div *ngIf="selectedLog.old_data">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Old Data</label>
                        <pre class="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">{{ formatJSON(selectedLog.old_data) }}</pre>
                    </div>
                    <div *ngIf="selectedLog.new_data">
                        <label class="block text-sm font-medium text-gray-700 mb-2">New Data</label>
                        <pre class="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40">{{ formatJSON(selectedLog.new_data) }}</pre>
                    </div>
                </div>
            </div>
        </p-dialog>

        <!-- Toast Notifications -->
        <p-toast></p-toast>
    `
})
export class AuditTrailViewComponent implements OnInit {
    private auditLogService = inject(AuditLogService);
    private messageService = inject(MessageService);

    // Development mode toggle
    private readonly USE_MOCK_DATA = true; // Set to false to use service

    // Mock data properties
    private mockLogs: AuditLog[] = MOCK_AUDIT_LOGS;
    private filteredMockLogs: AuditLog[] = [...this.mockLogs];

    // Public observables
    auditLogs$: Observable<AuditLog[]> = of([]);
    loading$: Observable<boolean> = of(false);

    auditLogs: AuditLog[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    userFilter = '';
    actionFilter = '';

    // Dialog properties
    showChangesDialog = false;
    selectedLog: AuditLog | null = null;

    actionOptions = [
        { label: 'Insert', value: 'INSERT' },
        { label: 'Update', value: 'UPDATE' },
        { label: 'Delete', value: 'DELETE' }
    ];

    ngOnInit(): void {
        if (this.USE_MOCK_DATA) {
            this.initializeMockData();
        } else {
            this.loadAuditLogs();
        }
    }

    private initializeMockData(): void {
        this.filteredMockLogs = [...this.mockLogs];
        this.auditLogs = this.filteredMockLogs;
        this.auditLogs$ = of(this.filteredMockLogs);
        this.loading$ = of(false);
    }

    private applyMockFilters(): void {
        const filters: any = {};

        if (this.startDate) filters.start_date = this.startDate;
        if (this.endDate) filters.end_date = this.endDate;
        if (this.userFilter) filters.user_name = this.userFilter;
        if (this.actionFilter) filters.action = this.actionFilter as AuditAction;

        this.filteredMockLogs = getMockAuditLogs(filters);
        this.auditLogs = this.filteredMockLogs;
        this.auditLogs$ = of(this.filteredMockLogs);

        this.messageService.add({
            severity: 'success',
            summary: 'Search Complete',
            detail: `Found ${this.filteredMockLogs.length} audit log entries`
        });
    }

    loadAuditLogs(): void {
        if (this.USE_MOCK_DATA) {
            this.applyMockFilters();
        } else {
            this.loading$ = of(true);
            this.auditLogService.queryLogs({
                start_date: this.startDate || undefined,
                end_date: this.endDate || undefined,
                user_name: this.userFilter || undefined,
                action: this.actionFilter || undefined
            }).subscribe(logs => {
                this.auditLogs = logs;
                this.auditLogs$ = of(logs);
                this.loading$ = of(false);
            });
        }
    }

    viewChanges(log: AuditLog): void {
        this.selectedLog = log;
        this.showChangesDialog = true;
    }

    exportLogs(): void {
        if (this.USE_MOCK_DATA) {
            // Mock export functionality
            const csvContent = this.generateCSV(this.filteredMockLogs);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);

            this.messageService.add({
                severity: 'success',
                summary: 'Export Complete',
                detail: 'Audit trail exported successfully'
            });
        } else {
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
    }

    private generateCSV(logs: AuditLog[]): string {
        const headers = ['Timestamp', 'User', 'Action', 'Table', 'Record ID', 'Changed Fields', 'IP Address'];
        const rows = logs.map(log => [
            log.timestamp.toISOString(),
            log.user_name,
            log.action,
            log.table_name,
            log.record_id,
            log.changed_fields?.join(';') || '',
            log.ip_address || ''
        ]);

        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }

    getActionLabel(action: AuditAction): string {
        return getAuditActionLabel(action);
    }

    formatJSON(data: any): string {
        return JSON.stringify(data, null, 2);
    }
}
