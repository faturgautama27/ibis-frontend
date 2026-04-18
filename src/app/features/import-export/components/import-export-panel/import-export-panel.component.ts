import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { MessageModule } from 'primeng/message';
import { ImportExportService, ImportResult, ExportHistory } from '../../services/import-export.service';

// Enhanced Components
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EnhancedCardComponent } from '../../../../shared/components/enhanced-card/enhanced-card.component';
import { EnhancedTableComponent } from '../../../../shared/components/enhanced-table/enhanced-table.component';
import { EnhancedButtonComponent } from '../../../../shared/components/enhanced-button/enhanced-button.component';

/**
 * Import/Export Panel Component
 * Requirements: 21.1-21.7
 */
@Component({
    selector: 'app-import-export-panel',
    standalone: true,
    imports: [
        CommonModule,
        FileUploadModule,
        ButtonModule,
        CardModule,
        TableModule,
        TabsModule,
        MessageModule,
        PageHeaderComponent,
        EnhancedCardComponent,
        EnhancedTableComponent,
        EnhancedButtonComponent
    ],
    templateUrl: './import-export-panel.component.html',
    styleUrls: ['./import-export-panel.component.scss']
})
export class ImportExportPanelComponent implements OnInit {
    private importExportService = inject(ImportExportService);

    importResult: ImportResult | null = null;
    exportHistory: ExportHistory[] = [];

    ngOnInit(): void {
        this.loadExportHistory();
    }

    loadExportHistory(): void {
        this.importExportService.getExportHistory().subscribe(history => {
            this.exportHistory = history;
        });
    }

    onImportItems(event: any): void {
        const file = event.files[0];
        this.importExportService.importItems(file).subscribe({
            next: (result) => {
                this.importResult = result;
            },
            error: (err) => {
                console.error('Import failed:', err);
                alert('Import failed: ' + err.error?.message);
            }
        });
    }

    onImportSuppliers(event: any): void {
        const file = event.files[0];
        this.importExportService.importSuppliers(file).subscribe({
            next: (result) => {
                this.importResult = result;
            },
            error: (err) => console.error('Import failed:', err)
        });
    }

    onImportCustomers(event: any): void {
        const file = event.files[0];
        this.importExportService.importCustomers(file).subscribe({
            next: (result) => {
                this.importResult = result;
            },
            error: (err) => console.error('Import failed:', err)
        });
    }

    exportData(type: string): void {
        let observable;
        let filename;

        switch (type) {
            case 'items':
                observable = this.importExportService.exportItems();
                filename = 'items_export.csv';
                break;
            case 'stock_balance':
                observable = this.importExportService.exportStockBalance();
                filename = 'stock_balance.csv';
                break;
            case 'inbound':
                observable = this.importExportService.exportTransactions('inbound');
                filename = 'inbound_export.csv';
                break;
            case 'outbound':
                observable = this.importExportService.exportTransactions('outbound');
                filename = 'outbound_export.csv';
                break;
            case 'production':
                observable = this.importExportService.exportTransactions('production');
                filename = 'production_export.csv';
                break;
            default:
                return;
        }

        observable.subscribe(blob => {
            this.importExportService.downloadFile(blob, filename);
            this.loadExportHistory();
        });
    }

    downloadTemplate(type: string): void {
        let csv = '';
        let filename = '';

        switch (type) {
            case 'items':
                csv = 'code,name,type,unit,hs_code,description\nITEM-001,Sample Item,RAW,KG,1234.56.78,Sample description';
                filename = 'items_template.csv';
                break;
            case 'suppliers':
                csv = 'code,name,npwp,address,phone,email\nSUP-001,Sample Supplier,01.234.567.8-901.000,Jakarta,+62-21-1234567,supplier@example.com';
                filename = 'suppliers_template.csv';
                break;
            case 'customers':
                csv = 'code,name,npwp,address,phone,email\nCUST-001,Sample Customer,01.234.567.8-901.000,Jakarta,+62-21-1234567,customer@example.com';
                filename = 'customers_template.csv';
                break;
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        this.importExportService.downloadFile(blob, filename);
    }

    getImportMessage(result: ImportResult): string {
        return `Imported ${result.imported_records} of ${result.total_records} records. ${result.failed_records} failed.`;
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}
