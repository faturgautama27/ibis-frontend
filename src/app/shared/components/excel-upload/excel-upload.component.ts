import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ExcelService, ExcelParseResult } from '../../../core/services/excel.service';

/**
 * ExcelUploadComponent
 * Reusable component for Excel file upload with drag-and-drop, validation, and error reporting
 * Requirements: 2.2, 2.3, 2.4, 12.1, 12.2, 12.3, 12.4, 12.5
 */
@Component({
    selector: 'app-excel-upload',
    standalone: true,
    imports: [
        CommonModule,
        FileUploadModule,
        ButtonModule,
        ProgressBarModule,
        TableModule,
        TagModule
    ],
    templateUrl: './excel-upload.component.html',
    styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent {
    @Input() templateFileName: string = 'template.xlsx';
    @Input() acceptedFileTypes: string = '.xlsx,.xls';
    @Input() maxFileSize: number = 5000000; // 5MB

    @Output() fileUploaded = new EventEmitter<ExcelParseResult<any>>();
    @Output() templateDownload = new EventEmitter<void>();

    uploadProgress: number = 0;
    isUploading: boolean = false;
    importResult: ExcelParseResult<any> | null = null;
    showErrorReport: boolean = false;

    constructor(private excelService: ExcelService) { }

    /**
     * Handle file selection from file upload component
     */
    onFileSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    /**
     * Process uploaded Excel file
     */
    private processFile(file: File): void {
        this.isUploading = true;
        this.uploadProgress = 0;
        this.importResult = null;
        this.showErrorReport = false;

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            this.uploadProgress += 10;
            if (this.uploadProgress >= 90) {
                clearInterval(progressInterval);
            }
        }, 100);

        // Parse Excel file
        this.excelService.parseExcelFile(file, this.getColumnMapping()).subscribe({
            next: (result) => {
                clearInterval(progressInterval);
                this.uploadProgress = 100;
                this.isUploading = false;
                this.importResult = result;

                if (result.errorCount > 0) {
                    this.showErrorReport = true;
                }

                this.fileUploaded.emit(result);
            },
            error: (error) => {
                clearInterval(progressInterval);
                this.isUploading = false;
                this.uploadProgress = 0;
                console.error('Error parsing Excel file:', error);

                // Create error result
                this.importResult = {
                    success: false,
                    validRows: [],
                    errors: [{
                        row: 0,
                        column: 'File',
                        value: file.name,
                        message: 'Failed to parse Excel file. Please check the file format.'
                    }],
                    totalRows: 0,
                    validCount: 0,
                    errorCount: 1
                };
                this.showErrorReport = true;
            }
        });
    }

    /**
     * Get column mapping configuration
     * Override this method in parent component if needed
     */
    private getColumnMapping(): any {
        // Default mapping - should be customized based on template type
        return {
            'PO Number': { required: true, type: 'string' },
            'Item Code': { required: true, type: 'string' },
            'Quantity': { required: true, type: 'number' },
            'Unit Price': { required: true, type: 'number' }
        };
    }

    /**
     * Handle template download button click
     */
    onDownloadTemplate(): void {
        this.templateDownload.emit();
    }

    /**
     * Download error report as Excel file
     */
    downloadErrorReport(): void {
        if (this.importResult && this.importResult.errors.length > 0) {
            this.excelService.exportErrorReport(
                this.importResult.errors,
                `import-errors-${Date.now()}.xlsx`
            );
        }
    }

    /**
     * Clear upload state and reset component
     */
    clearUpload(): void {
        this.uploadProgress = 0;
        this.isUploading = false;
        this.importResult = null;
        this.showErrorReport = false;
    }

    /**
     * Get severity for error count badge
     */
    getErrorSeverity(): 'success' | 'warn' | 'danger' {
        if (!this.importResult) return 'success';
        if (this.importResult.errorCount === 0) return 'success';
        if (this.importResult.errorCount < this.importResult.totalRows / 2) return 'warn';
        return 'danger';
    }
}
