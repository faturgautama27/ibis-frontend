import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ReportService, ReportParameters } from '../../services/report.service';

// Enhanced Components
import {
    PageHeaderComponent,
    EnhancedCardComponent,
    EnhancedTableComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusBadgeComponent
} from '../../../../shared/components';

/**
 * Report Generator Component
 * Requirements: 17.1-17.10
 */
@Component({
    selector: 'app-report-generator',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
        SkeletonModule,
        TagModule,
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        LoadingSpinnerComponent,
        EmptyStateComponent,
        StatusBadgeComponent
    ],
    template: `
        <div class="min-h-screen bg-gray-50">
            <!-- Enhanced Page Header -->
            <app-page-header
                [title]="getPageTitle()"
                [subtitle]="getPageSubtitle()"
                icon="pi pi-chart-bar"
                [showStats]="true"
                [stats]="headerStats">
                
                <div slot="actions" class="flex gap-3">
                    <p-button 
                        label="Export Excel" 
                        icon="pi pi-file-excel"
                        severity="success"
                        [outlined]="true"
                        [disabled]="reportData.length === 0"
                        styleClass="hover:shadow-lg hover:scale-105 transition-all duration-200"
                        (onClick)="exportToExcel()">
                    </p-button>
                    <p-button 
                        label="Export PDF" 
                        icon="pi pi-file-pdf"
                        severity="danger"
                        [outlined]="true"
                        [disabled]="reportData.length === 0"
                        styleClass="hover:shadow-lg hover:scale-105 transition-all duration-200"
                        (onClick)="exportToPDF()">
                    </p-button>
                </div>
            </app-page-header>

            <!-- Main Content -->
            <div class="p-6 space-y-6">
                <!-- Report Configuration Card -->
                <app-enhanced-card 
                    variant="standard"
                    title="Report Configuration"
                    subtitle="Configure your report parameters and generate reports"
                    [header]="true">
                    
                    <div class="space-y-6">
                        <!-- Report Type Selection -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">
                                    Report Type <span class="text-red-500">*</span>
                                </label>
                                <p-select 
                                    [(ngModel)]="selectedReportType"
                                    [options]="reportTypes"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Select Report Type"
                                    class="w-full"
                                    styleClass="enhanced-select"
                                    (onChange)="onReportTypeChange()">
                                </p-select>
                            </div>
                            
                            <div class="space-y-2" *ngIf="showWarehouseFilter">
                                <label class="block text-sm font-semibold text-gray-700">Warehouse</label>
                                <p-select 
                                    [(ngModel)]="parameters.warehouse_id"
                                    [options]="warehouses"
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="All Warehouses"
                                    [showClear]="true"
                                    class="w-full"
                                    styleClass="enhanced-select">
                                </p-select>
                            </div>
                        </div>

                        <!-- Date Range Selection -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">Start Date</label>
                                <p-datepicker 
                                    [(ngModel)]="parameters.start_date"
                                    dateFormat="dd/mm/yy"
                                    [showIcon]="true"
                                    class="w-full"
                                    styleClass="enhanced-datepicker"
                                    appendTo="body">
                                </p-datepicker>
                            </div>
                            <div class="space-y-2">
                                <label class="block text-sm font-semibold text-gray-700">End Date</label>
                                <p-datepicker 
                                    [(ngModel)]="parameters.end_date"
                                    dateFormat="dd/mm/yy"
                                    [showIcon]="true"
                                    class="w-full"
                                    styleClass="enhanced-datepicker"
                                    appendTo="body">
                                </p-datepicker>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                            <p-button 
                                label="Generate Report" 
                                icon="pi pi-play"
                                severity="primary"
                                [loading]="loading"
                                [disabled]="!selectedReportType"
                                styleClass="font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                                (onClick)="generateReport()">
                            </p-button>
                            <p-button 
                                label="Clear Filters" 
                                icon="pi pi-refresh"
                                severity="secondary"
                                [outlined]="true"
                                [disabled]="loading"
                                styleClass="hover:shadow-md hover:scale-105 transition-all duration-200"
                                (onClick)="clearFilters()">
                            </p-button>
                        </div>
                    </div>
                </app-enhanced-card>

                <!-- Loading State -->
                <app-loading-spinner 
                    *ngIf="loading" 
                    loadingText="Generating report..."
                    size="lg">
                </app-loading-spinner>

                <!-- Report Results -->
                <app-enhanced-card 
                    *ngIf="!loading && reportData.length > 0"
                    variant="standard"
                    [title]="getReportTitle()"
                    [subtitle]="getReportSummary()"
                    [header]="true">
                    
                    <!-- Report Status Badge -->
                    <div class="mb-4">
                        <app-status-badge 
                            [status]="'success'"
                            [label]="'Report Generated'"
                            [icon]="'pi pi-check'"
                            [autoSeverity]="false"
                            severity="success">
                        </app-status-badge>
                        <span class="ml-3 text-sm text-gray-600">
                            Generated on {{ getCurrentDate() | date:'medium' }}
                        </span>
                    </div>

                    <!-- Enhanced Table -->
                    <app-enhanced-table
                        [data]="reportData"
                        [loading]="loading"
                        [paginator]="true"
                        [rows]="20"
                        [searchable]="true"
                        [variant]="'striped'"
                        [emptyTitle]="'No Report Data'"
                        [emptyMessage]="'No data found for the selected criteria. Try adjusting your filters.'"
                        [emptyIcon]="'pi pi-chart-bar'"
                        searchPlaceholder="Search report data..."
                        (searchChange)="onSearchChange($event)">
                        
                        <!-- Dynamic Table Headers -->
                        <ng-container slot="header">
                            <th *ngFor="let col of getTableColumns()" 
                                class="text-left font-semibold text-gray-700 uppercase tracking-wide">
                                {{ formatColumnHeader(col) }}
                            </th>
                        </ng-container>

                        <!-- Dynamic Table Body -->
                        <ng-container slot="body">
                            <td *ngFor="let col of getTableColumns()" 
                                class="text-gray-600">
                                <span [innerHTML]="formatCellValue(col, reportData[0])"></span>
                            </td>
                        </ng-container>
                    </app-enhanced-table>
                </app-enhanced-card>

                <!-- Empty State -->
                <app-empty-state
                    *ngIf="!loading && generated && reportData.length === 0"
                    title="No Data Found"
                    description="No data found for the selected criteria. Try adjusting your date range or filters."
                    icon="pi pi-chart-bar"
                    primaryActionLabel="Reset Filters"
                    (primaryAction)="clearFilters()">
                </app-empty-state>

                <!-- Initial State -->
                <app-enhanced-card 
                    *ngIf="!loading && !generated"
                    variant="interactive"
                    title="Welcome to Report Generator"
                    subtitle="Select a report type and configure your parameters to get started"
                    [header]="true">
                    
                    <div class="text-center py-8">
                        <div class="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="pi pi-chart-bar text-2xl text-primary-600"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Reports</h3>
                        <p class="text-gray-600 mb-6 max-w-md mx-auto">
                            Choose from various report types including inventory balance, stock movements, 
                            inbound/outbound transactions, and more.
                        </p>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            <div *ngFor="let type of reportTypes" 
                                 class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                 (click)="selectReportType(type.value)">
                                <div class="text-center">
                                    <i class="pi pi-file text-xl text-gray-600 mb-2"></i>
                                    <p class="text-sm font-medium text-gray-700">{{ type.label }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </app-enhanced-card>
        </div>
    `
})
export class ReportGeneratorComponent implements OnInit {
    private reportService = inject(ReportService);
    private route = inject(ActivatedRoute);

    reportTypes = [
        { label: 'Inventory Balance', value: 'inventory_balance' },
        { label: 'Stock Movement', value: 'stock_movement' },
        { label: 'Inbound/Outbound', value: 'inbound_outbound' },
        { label: 'Production', value: 'production' },
        { label: 'Traceability', value: 'traceability' },
        { label: 'Customs Documents', value: 'customs_documents' },
        { label: 'Audit Trail', value: 'audit_trail' }
    ];

    warehouses: any[] = [];
    selectedReportType = '';
    parameters: ReportParameters = {};
    reportData: any[] = [];
    generated = false;
    loading = false;
    showWarehouseFilter = false;

    // Enhanced UI properties
    headerStats: any[] = [];

    ngOnInit(): void {
        // Load warehouses for filter
        this.warehouses = [
            { id: '1', name: 'Raw Material Warehouse' },
            { id: '2', name: 'WIP Warehouse' },
            { id: '3', name: 'Finished Goods Warehouse' }
        ];

        // Check if report type is specified in route data
        const routeReportType = this.route.snapshot.data['reportType'];
        if (routeReportType) {
            this.selectedReportType = this.mapRouteToReportType(routeReportType);
            this.onReportTypeChange();
        }

        // Initialize header stats
        this.updateHeaderStats();
    }

    private mapRouteToReportType(routeType: string): string {
        const mapping: { [key: string]: string } = {
            'inbound': 'inbound_outbound',
            'outbound': 'inbound_outbound',
            'purchase-orders': 'inbound_outbound',
            'sales-orders': 'inbound_outbound',
            'stock-opname': 'inventory_balance',
            'stock-adjustment': 'stock_movement'
        };
        return mapping[routeType] || routeType;
    }

    getPageTitle(): string {
        const routeReportType = this.route.snapshot.data['reportType'];
        if (routeReportType) {
            const titleMapping: { [key: string]: string } = {
                'inbound': 'Inbound Reports',
                'outbound': 'Outbound Reports',
                'purchase-orders': 'Purchase Order Reports',
                'sales-orders': 'Sales Order Reports',
                'stock-opname': 'Stock Opname Reports',
                'stock-adjustment': 'Stock Adjustment Reports'
            };
            return titleMapping[routeReportType] || 'Report Generator';
        }
        return 'Report Generator';
    }

    getPageSubtitle(): string {
        const routeReportType = this.route.snapshot.data['reportType'];
        if (routeReportType) {
            return `Generate and export ${this.getPageTitle().toLowerCase()}`;
        }
        return 'Generate and export various inventory reports';
    }

    updateHeaderStats(): void {
        this.headerStats = [
            {
                label: 'Total Reports',
                value: this.reportTypes.length.toString(),
                icon: 'pi pi-chart-bar',
                changeType: 'neutral'
            },
            {
                label: 'Generated Today',
                value: '0',
                icon: 'pi pi-calendar',
                changeType: 'neutral'
            },
            {
                label: 'Data Records',
                value: this.reportData.length.toString(),
                icon: 'pi pi-database',
                changeType: this.reportData.length > 0 ? 'positive' : 'neutral'
            },
            {
                label: 'Export Formats',
                value: '2',
                icon: 'pi pi-download',
                changeType: 'neutral'
            }
        ];
    }

    onReportTypeChange(): void {
        this.reportData = [];
        this.generated = false;
        this.showWarehouseFilter = ['inventory_balance', 'stock_movement'].includes(this.selectedReportType);
    }

    generateReport(): void {
        this.loading = true;
        this.generated = true;

        switch (this.selectedReportType) {
            case 'inventory_balance':
                this.reportService.generateInventoryBalanceReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
            case 'stock_movement':
                this.reportService.generateStockMovementReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
            case 'inbound_outbound':
                this.reportService.generateInboundOutboundReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
            case 'production':
                this.reportService.generateProductionReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
            case 'customs_documents':
                this.reportService.generateCustomsDocumentReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
            case 'audit_trail':
                this.reportService.generateAuditTrailReport(this.parameters).subscribe({
                    next: (data) => {
                        this.reportData = data;
                        this.loading = false;
                        this.updateHeaderStats();
                    },
                    error: () => {
                        this.loading = false;
                    }
                });
                break;
        }
    }

    exportToExcel(): void {
        this.reportService.exportToExcel(this.reportData, this.getReportTitle()).subscribe(blob => {
            this.downloadFile(blob, `${this.getReportTitle()}.csv`);
        });
    }

    exportToPDF(): void {
        this.reportService.exportToPDF(this.reportData, this.getReportTitle()).subscribe(blob => {
            this.downloadFile(blob, `${this.getReportTitle()}.pdf`);
        });
    }

    downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    getReportTitle(): string {
        const type = this.reportTypes.find(t => t.value === this.selectedReportType);
        return type ? type.label : 'Report';
    }

    getColumns(): string[] {
        if (this.reportData.length === 0) return [];
        return Object.keys(this.reportData[0]);
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    }

    // New methods for enhanced UI
    getReportSummary(): string {
        if (this.reportData.length === 0) {
            return 'No data available';
        }
        return `${this.reportData.length} records found`;
    }

    getTableColumns(): string[] {
        if (this.reportData.length === 0) return [];
        return Object.keys(this.reportData[0]);
    }

    formatColumnHeader(column: string): string {
        return column
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    formatCellValue(column: string, row: any): string {
        const value = row[column];

        if (value === null || value === undefined) {
            return '-';
        }

        // Format currency fields
        if (column.includes('cost') || column.includes('value') || column.includes('price')) {
            return this.formatCurrency(Number(value));
        }

        // Format date fields
        if (column.includes('date') && value) {
            return new Date(value).toLocaleDateString();
        }

        // Format percentage fields
        if (column.includes('percentage') || column.includes('yield')) {
            return `${value}%`;
        }

        return value.toString();
    }

    onSearchChange(searchTerm: string): void {
        // Implement search functionality if needed
        console.log('Search term:', searchTerm);
    }

    clearFilters(): void {
        this.selectedReportType = '';
        this.parameters = {};
        this.reportData = [];
        this.generated = false;
        this.showWarehouseFilter = false;
        this.updateHeaderStats();
    }

    selectReportType(reportType: string): void {
        this.selectedReportType = reportType;
        this.onReportTypeChange();
    }

    getCurrentDate(): Date {
        return new Date();
    }
}
