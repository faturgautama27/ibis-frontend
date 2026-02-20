import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

/**
 * ExcelService
 * 
 * Service for handling Excel file operations including parsing, validation,
 * template generation, and error reporting using SheetJS (xlsx) library.
 */
@Injectable({
    providedIn: 'root'
})
export class ExcelService {

    /**
     * Parse Excel file and convert to JSON with validation
     * @param file - The Excel file to parse
     * @param mapping - Column mapping configuration for validation and transformation
     * @returns Observable of ExcelParseResult containing valid rows and errors
     */
    parseExcelFile<T>(file: File, mapping: ExcelColumnMapping): Observable<ExcelParseResult<T>> {
        return new Observable(observer => {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    const result = this.validateAndTransform<T>(jsonData, mapping);
                    observer.next(result);
                    observer.complete();
                } catch (error) {
                    observer.error(error);
                }
            };

            reader.onerror = (error) => {
                observer.error(error);
            };

            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Validate and transform Excel data according to column mapping
     * @param data - Raw data from Excel sheet
     * @param mapping - Column mapping configuration
     * @returns ExcelParseResult with validated and transformed data
     */
    validateAndTransform<T>(data: any[], mapping: ExcelColumnMapping): ExcelParseResult<T> {
        const validRows: T[] = [];
        const errors: ExcelImportError[] = [];

        data.forEach((row, index) => {
            const rowNumber = index + 2; // +2 to account for header row (row 1)
            const validationResult = this.validateRow(row, mapping, rowNumber);

            if (validationResult.valid) {
                validRows.push(this.transformRow<T>(row, mapping));
            } else {
                errors.push(...validationResult.errors);
            }
        });

        return {
            success: errors.length === 0,
            validRows,
            errors,
            totalRows: data.length,
            validCount: validRows.length,
            errorCount: errors.length
        };
    }

    /**
     * Generate Excel template with headers and sample data
     * @param templateConfig - Configuration for template generation
     */
    generateTemplate(templateConfig: ExcelTemplateConfig): void {
        const worksheet = XLSX.utils.json_to_sheet(templateConfig.sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, templateConfig.sheetName);

        // Apply column widths if provided
        if (templateConfig.columnWidths) {
            worksheet['!cols'] = templateConfig.columnWidths.map(width => ({ wch: width }));
        }

        XLSX.writeFile(workbook, templateConfig.fileName);
    }

    /**
     * Export error report to Excel file
     * @param errors - Array of import errors
     * @param fileName - Name for the error report file
     */
    exportErrorReport(errors: ExcelImportError[], fileName: string): void {
        const errorData = errors.map(error => ({
            'Row': error.row,
            'Column': error.column,
            'Value': error.value,
            'Error Message': error.message
        }));

        const worksheet = XLSX.utils.json_to_sheet(errorData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

        // Set column widths for better readability
        worksheet['!cols'] = [
            { wch: 8 },  // Row
            { wch: 20 }, // Column
            { wch: 20 }, // Value
            { wch: 50 }  // Error Message
        ];

        XLSX.writeFile(workbook, fileName);
    }

    /**
     * Validate a single row of data
     * @param row - The row data to validate
     * @param mapping - Column mapping configuration
     * @param rowNumber - The row number for error reporting
     * @returns Validation result with errors if any
     */
    private validateRow(
        row: any,
        mapping: ExcelColumnMapping,
        rowNumber: number
    ): { valid: boolean; errors: ExcelImportError[] } {
        const errors: ExcelImportError[] = [];

        Object.keys(mapping).forEach(fieldName => {
            const config = mapping[fieldName];
            const value = row[config.excelColumn];

            // Check required fields
            if (config.required && (value === undefined || value === null || value === '')) {
                errors.push({
                    row: rowNumber,
                    column: config.excelColumn,
                    value: value,
                    message: `${config.excelColumn} is required`
                });
                return;
            }

            // Skip validation if value is empty and not required
            if (!config.required && (value === undefined || value === null || value === '')) {
                return;
            }

            // Type validation
            if (!this.validateType(value, config.type)) {
                errors.push({
                    row: rowNumber,
                    column: config.excelColumn,
                    value: value,
                    message: `${config.excelColumn} must be of type ${config.type}`
                });
                return;
            }

            // Custom validator
            if (config.validator && !config.validator(value)) {
                errors.push({
                    row: rowNumber,
                    column: config.excelColumn,
                    value: value,
                    message: `${config.excelColumn} failed validation`
                });
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Transform a row of data according to mapping configuration
     * @param row - The row data to transform
     * @param mapping - Column mapping configuration
     * @returns Transformed data object
     */
    private transformRow<T>(row: any, mapping: ExcelColumnMapping): T {
        const transformed: any = {};

        Object.keys(mapping).forEach(fieldName => {
            const config = mapping[fieldName];
            let value = row[config.excelColumn];

            // Apply transformer if provided
            if (config.transformer && value !== undefined && value !== null) {
                value = config.transformer(value);
            }

            transformed[fieldName] = value;
        });

        return transformed as T;
    }

    /**
     * Validate value type
     * @param value - The value to validate
     * @param type - Expected type
     * @returns True if value matches expected type
     */
    private validateType(value: any, type: 'string' | 'number' | 'date' | 'boolean'): boolean {
        switch (type) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'date':
                return value instanceof Date || !isNaN(Date.parse(value));
            case 'boolean':
                return typeof value === 'boolean';
            default:
                return false;
        }
    }
}

/**
 * Configuration for Excel column mapping
 */
export interface ExcelColumnMapping {
    [key: string]: {
        excelColumn: string;
        required: boolean;
        type: 'string' | 'number' | 'date' | 'boolean';
        validator?: (value: any) => boolean;
        transformer?: (value: any) => any;
    };
}

/**
 * Result of Excel file parsing
 */
export interface ExcelParseResult<T> {
    success: boolean;
    validRows: T[];
    errors: ExcelImportError[];
    totalRows: number;
    validCount: number;
    errorCount: number;
}

/**
 * Excel import error details
 */
export interface ExcelImportError {
    row: number;
    column: string;
    value: any;
    message: string;
}

/**
 * Configuration for Excel template generation
 */
export interface ExcelTemplateConfig {
    fileName: string;
    sheetName: string;
    sampleData: any[];
    columnWidths?: number[];
}
