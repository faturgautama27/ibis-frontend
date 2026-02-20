import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiIntegrationService } from '../../../core/services/api-integration.service';

/**
 * API Sync Result Interface
 */
export interface ApiSyncResult<T> {
    success: boolean;
    data: T[];
    errors: ApiError[];
    timestamp: Date;
}

/**
 * API Error Interface
 */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
}

/**
 * ApiIntegrationComponent
 * Reusable component for API data integration with connection status and preview
 * Requirements: 2.5, 2.6, 2.7
 */
@Component({
    selector: 'app-api-integration',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule
    ],
    templateUrl: './api-integration.component.html',
    styleUrls: ['./api-integration.component.css']
})
export class ApiIntegrationComponent {
    @Input() apiEndpoint: string = '';
    @Input() dataType: 'purchase-order' | 'sales-order' = 'purchase-order';

    @Output() dataFetched = new EventEmitter<ApiSyncResult<any>>();

    connectionStatus: 'connected' | 'disconnected' | 'checking' = 'disconnected';
    isFetching: boolean = false;
    syncResult: ApiSyncResult<any> | null = null;
    previewData: any[] = [];
    validationErrors: ApiError[] = [];

    constructor(private apiIntegrationService: ApiIntegrationService) { }

    /**
     * Check API connection status
     */
    checkConnection(): void {
        this.connectionStatus = 'checking';

        // Simulate connection check
        setTimeout(() => {
            // In real implementation, this would ping the API endpoint
            this.connectionStatus = 'connected';
        }, 1000);
    }

    /**
     * Manually trigger API data fetch
     */
    /**
         * Manually trigger API data fetch
         */
    fetchData(): void {
        this.isFetching = true;
        this.syncResult = null;
        this.previewData = [];
        this.validationErrors = [];

        const criteria = {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            dateTo: new Date()
        };

        if (this.dataType === 'purchase-order') {
            this.apiIntegrationService.fetchPurchaseOrders(criteria).subscribe({
                next: (result: ApiSyncResult<any>) => {
                    this.isFetching = false;
                    this.syncResult = result;
                    this.previewData = result.data;
                    this.validationErrors = result.errors;
                    this.dataFetched.emit(result);
                },
                error: (error: any) => {
                    this.handleFetchError(error);
                }
            });
        } else {
            this.apiIntegrationService.fetchSalesOrders(criteria).subscribe({
                next: (result: ApiSyncResult<any>) => {
                    this.isFetching = false;
                    this.syncResult = result;
                    this.previewData = result.data;
                    this.validationErrors = result.errors;
                    this.dataFetched.emit(result);
                },
                error: (error: any) => {
                    this.handleFetchError(error);
                }
            });
        }
    }

    /**
     * Get connection status badge severity
     */
    getConnectionSeverity(): 'success' | 'warn' | 'danger' {
        switch (this.connectionStatus) {
            case 'connected':
                return 'success';
            case 'checking':
                return 'warn';
            case 'disconnected':
                return 'danger';
        }
    }

    /**
     * Get connection status label
     */
    getConnectionLabel(): string {
        switch (this.connectionStatus) {
            case 'connected':
                return 'Connected';
            case 'checking':
                return 'Checking...';
            case 'disconnected':
                return 'Disconnected';
        }
    }

    /**
     * Get preview columns based on data type
     */
    getPreviewColumns(): string[] {
        if (this.dataType === 'purchase-order') {
            return ['poNumber', 'poDate', 'supplierName', 'totalValue'];
        } else {
            return ['soNumber', 'soDate', 'customerName', 'totalValue'];
        }
    }

    /**
     * Get column header label
     */
    getColumnLabel(column: string): string {
        const labels: { [key: string]: string } = {
            'poNumber': 'PO Number',
            'poDate': 'PO Date',
            'supplierName': 'Supplier',
            'soNumber': 'SO Number',
            'soDate': 'SO Date',
            'customerName': 'Customer',
            'totalValue': 'Total Value'
        };
        return labels[column] || column;
    }

    /**
     * Format cell value for display
     */
    formatCellValue(row: any, column: string): string {
        const value = row[column];

        if (!value) return '-';

        if (column.includes('Date')) {
            return new Date(value).toLocaleDateString();
        }

        if (column === 'totalValue') {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: row.currency || 'IDR'
            }).format(value);
        }

        return value.toString();
    }

    /**
     * Clear sync result and reset component
     */
    clearData(): void {
        this.syncResult = null;
        this.previewData = [];
        this.validationErrors = [];
    }

    /**
     * Handle fetch error
     */
    private handleFetchError(error: any): void {
        this.isFetching = false;
        console.error('Error fetching data from API:', error);

        // Create error result
        this.syncResult = {
            success: false,
            data: [],
            errors: [{
                code: 'API_ERROR',
                message: error.message || 'Failed to fetch data from external API'
            }],
            timestamp: new Date()
        };
        this.validationErrors = this.syncResult.errors;
    }
}
