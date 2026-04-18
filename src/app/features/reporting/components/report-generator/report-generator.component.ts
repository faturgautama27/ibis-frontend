import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReportService, ReportParameters } from '../../services/report.service';
import { getMockReportData, getReportColumns } from './report-generator.mock';

/**
 * Report Generator Component
 * Requirements: 17.1-17.10
 * 
 * Development Mode:
 * - Set USE_MOCK_DATA = true to use mock data
 * - Set USE_MOCK_DATA = false to use service
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
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="main-layout">
            <!-- Page Header -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <i class="pi pi-chart-bar text-sky-600"></i>
                        Report Generator
                    </h1>
                    <p class="text-sm text-gray-600 mt-1">Generate and export various inventory reports</p>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <!-- Report Type Selection -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <p-select 
                            [(ngModel)]="selectedReportType"
                            [options]="reportTypes"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Report Type"
                            class="w-full"
                            (onChange)="onReportTypeChange()"
                        ></p-select>
                    </div>
                </div>

                <!-- Report Parameters -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <p-datepicker 
                            [(ngModel)]="parameters.start_date"
                            dateFormat="dd/mm/yy"
                            [showIcon]="true"
                            class="w-full"
                            appendTo="body"
                        ></p-datepicker>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <p-datepicker 
                            [(ngModel)]="parameters.end_date"
                            dateFormat="dd/mm/yy"
                            [showIcon]="true"
                            class="w-full"
                            appendTo="body"
                        ></p-datepicker>
                    </div>
                    <div *ngIf="showWarehouseFilter">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Warehouse</label>
                        <p-select 
                            [(ngModel)]="parameters.warehouse_id"
                            [options]="warehouses"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="All Warehouses"
                            [showClear]="true"
                            class="w-full"
                            appendTo="body"
                        ></p-select>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button 
                        pButton 
                        label="Generate Report" 
                        icon="pi pi-file"
                        (click)="generateReport()"
                        class="p-button-primary"
                        [disabled]="!selectedReportType"
                    ></button>
                    <button 
                        pButton 
                        label="Export to Excel" 
                        icon="pi pi-file-excel"
                        (click)="exportToExcel()"
                        class="p-button-success"
                        [disabled]="reportData.length === 0"
                    ></button>
                    <button 
                        pButton 
                        label="Export to PDF" 
                        icon="pi pi-file-pdf"
                        (click)="exportToPDF()"
                        class="p-button-danger"
                        [disabled]="reportData.length === 0"
                    ></button>
                </div>
            </div>

            <!-- Report Results -->
            <div *ngIf="reportData.length > 0" class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                    {{ getReportTitle() }}
                </h3>

                <!-- Generic Table for all reports -->
                <p-table 
                    [value]="reportData" 
                    [paginator]="true" 
                    [rows]="20"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    [scrollable]="true"
                    scrollHeight="500px"
                >
                    <ng-template pTemplate="header">
                        <tr>
                            <th *ngFor="let col of getDisplayColumns()" [style.min-width]="getColumnWidth(col)">
                                {{ getColumnLabel(col) }}
                            </th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-row>
                        <tr>
                            <td *ngFor="let col of getDisplayColumns()">
                                {{ formatCellValue(row[col], col) }}
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <!-- No Results -->
            <div *ngIf="generated && reportData.length === 0" 
                 class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div class="flex flex-col items-center gap-2">
                    <i class="pi pi-inbox text-4xl text-yellow-400"></i>
                    <p class="text-yellow-800">No data found for the selected criteria.</p>
                    <p class="text-sm text-yellow-600">Try adjusting your date range or filters.</p>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <p-toast></p-toast>
    `
})
export class ReportGeneratorComponent implements OnInit {
    private reportService = inject(ReportService);
    private messageService = inject(MessageService);

    // Development mode toggle
    private readonly USE_MOCK_DATA = true; // Set to false to use service

    reportTypes = [
        { label: 'Inbound Report', value: 'inbound' },
        { label: 'Outbound Report', value: 'outbound' },
        { label: 'Purchase Order Report', value: 'purchase_order' },
        { label: 'Sales Order Report', value: 'sales_order' },
        { label: 'Stock Opname Report', value: 'stock_opname' },
        { label: 'Stock Adjustment Report', value: 'stock_adjustment' }
    ];

    warehouses: any[] = [];
    selectedReportType = '';
    parameters: ReportParameters = {};
    reportData: any[] = [];
    generated = false;
    showWarehouseFilter = false;

    ngOnInit(): void {
        // Load warehouses for filter
        this.warehouses = [
            { id: 'wh-001', name: 'Warehouse Jakarta' },
            { id: 'wh-002', name: 'Warehouse Surabaya' },
            { id: 'wh-003', name: 'Warehouse Bandung' }
        ];
    }

    onReportTypeChange(): void {
        this.reportData = [];
        this.generated = false;
        this.showWarehouseFilter = ['inbound', 'outbound', 'stock_opname', 'stock_adjustment'].includes(this.selectedReportType);
    }

    generateReport(): void {
        this.generated = true;

        if (this.USE_MOCK_DATA) {
            // Use mock data
            this.reportData = getMockReportData(this.selectedReportType, this.parameters);

            this.messageService.add({
                severity: 'success',
                summary: 'Report Generated',
                detail: `Found ${this.reportData.length} records for ${this.getReportTitle()}`
            });
        } else {
            // Use service
            switch (this.selectedReportType) {
                case 'inbound':
                    this.reportService.generateInventoryBalanceReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
                case 'outbound':
                    this.reportService.generateStockMovementReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
                case 'purchase_order':
                    this.reportService.generateInboundOutboundReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
                case 'sales_order':
                    this.reportService.generateProductionReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
                case 'stock_opname':
                    this.reportService.generateCustomsDocumentReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
                case 'stock_adjustment':
                    this.reportService.generateAuditTrailReport(this.parameters).subscribe(data => {
                        this.reportData = data;
                    });
                    break;
            }
        }
    }

    exportToExcel(): void {
        if (this.USE_MOCK_DATA) {
            // Mock export functionality
            const csvContent = this.generateCSV(this.reportData);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            this.downloadFile(blob, `${this.getReportTitle().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);

            this.messageService.add({
                severity: 'success',
                summary: 'Export Complete',
                detail: 'Report exported to CSV successfully'
            });
        } else {
            this.reportService.exportToExcel(this.reportData, this.getReportTitle()).subscribe(blob => {
                this.downloadFile(blob, `${this.getReportTitle()}.csv`);
            });
        }
    }

    exportToPDF(): void {
        if (this.USE_MOCK_DATA) {
            this.messageService.add({
                severity: 'info',
                summary: 'PDF Export',
                detail: 'PDF export functionality is available in production mode'
            });
        } else {
            this.reportService.exportToPDF(this.reportData, this.getReportTitle()).subscribe(blob => {
                this.downloadFile(blob, `${this.getReportTitle()}.pdf`);
            });
        }
    }

    private generateCSV(data: any[]): string {
        if (data.length === 0) return '';

        const columns = this.getDisplayColumns();
        const headers = columns.map(col => this.getColumnLabel(col));
        const rows = data.map(row => columns.map(col => `"${row[col] || ''}"`));

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
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

    getDisplayColumns(): string[] {
        return getReportColumns(this.selectedReportType);
    }

    getColumnLabel(column: string): string {
        const labels: Record<string, string> = {
            // Inbound Report
            'inbound_number': 'Inbound Number',
            'inbound_date': 'Inbound Date',
            'po_number': 'PO Number',
            'supplier_name': 'Supplier',
            'warehouse_name': 'Warehouse',
            'item_code': 'Item Code',
            'item_name': 'Item Name',
            'quantity_received': 'Qty Received',
            'unit': 'Unit',
            'unit_price': 'Unit Price',
            'total_value': 'Total Value',
            'batch_number': 'Batch Number',
            'expiry_date': 'Expiry Date',
            'status': 'Status',

            // Outbound Report
            'outbound_number': 'Outbound Number',
            'outbound_date': 'Outbound Date',
            'so_number': 'SO Number',
            'customer_name': 'Customer',
            'quantity_shipped': 'Qty Shipped',
            'shipping_method': 'Shipping Method',

            // Purchase Order Report
            'po_date': 'PO Date',
            'total_items': 'Total Items',
            'total_quantity': 'Total Quantity',
            'currency': 'Currency',
            'delivery_date': 'Delivery Date',
            'payment_terms': 'Payment Terms',
            'input_method': 'Input Method',
            'created_by': 'Created By',
            'created_date': 'Created Date',

            // Sales Order Report
            'so_date': 'SO Date',

            // Stock Opname Report
            'opname_number': 'Opname Number',
            'opname_date': 'Opname Date',
            'opname_type': 'Opname Type',
            'system_quantity': 'System Qty',
            'physical_quantity': 'Physical Qty',
            'difference': 'Difference',
            'adjustment_reason': 'Adjustment Reason',
            'approved_by': 'Approved By',

            // Stock Adjustment Report
            'adjustment_number': 'Adjustment Number',
            'adjustment_date': 'Adjustment Date',
            'adjustment_type': 'Adjustment Type',
            'quantity': 'Quantity',
            'before_quantity': 'Before Qty',
            'after_quantity': 'After Qty',
            'reason': 'Reason',
            'reason_category': 'Reason Category',
            'submitted_by': 'Submitted By',
            'approved_date': 'Approved Date'
        };

        return labels[column] || column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    getColumnWidth(column: string): string {
        const widths: Record<string, string> = {
            'inbound_number': '140px',
            'outbound_number': '140px',
            'po_number': '120px',
            'so_number': '120px',
            'opname_number': '140px',
            'adjustment_number': '150px',
            'item_code': '100px',
            'item_name': '200px',
            'supplier_name': '180px',
            'customer_name': '180px',
            'warehouse_name': '150px',
            'quantity_received': '120px',
            'quantity_shipped': '120px',
            'system_quantity': '120px',
            'physical_quantity': '120px',
            'before_quantity': '120px',
            'after_quantity': '120px',
            'total_value': '130px',
            'unit_price': '120px',
            'status': '120px',
            'date': '120px',
            'created_by': '150px',
            'approved_by': '150px'
        };

        // Check for date columns
        if (column.includes('_date')) {
            return '120px';
        }

        return widths[column] || '120px';
    }

    formatCellValue(value: any, column: string): string {
        if (value === null || value === undefined) {
            return '-';
        }

        // Format dates
        if (column.includes('_date') && value instanceof Date) {
            return value.toLocaleDateString('id-ID');
        }

        // Format currency values
        if (column.includes('value') || column.includes('price')) {
            return this.formatCurrency(Number(value));
        }

        // Format quantities
        if (column.includes('quantity') || column === 'difference') {
            return Number(value).toLocaleString('id-ID');
        }

        // Format status with proper casing
        if (column === 'status') {
            return String(value).replace(/_/g, ' ').toLowerCase()
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        // Format adjustment type
        if (column === 'adjustment_type') {
            return String(value).toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }

        // Format opname type
        if (column === 'opname_type') {
            return String(value).replace(/_/g, ' ').toLowerCase()
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        return String(value);
    }
}
