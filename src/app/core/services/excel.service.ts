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
     * Validate and transform Excel data with business rule validation
     * Supports additional validation for item categories and other business rules
     * Requirements: 10.5, 12.1, 12.2, 12.3
     * 
     * @param data - Raw data from Excel sheet
     * @param mapping - Column mapping configuration
     * @param businessRuleValidator - Optional function for additional business rule validation
     * @returns ExcelParseResult with validated and transformed data
     */
    validateAndTransformWithBusinessRules<T>(
        data: any[],
        mapping: ExcelColumnMapping,
        businessRuleValidator?: (row: T, rowNumber: number) => ExcelImportError[]
    ): ExcelParseResult<T> {
        const validRows: T[] = [];
        const errors: ExcelImportError[] = [];

        data.forEach((row, index) => {
            const rowNumber = index + 2; // +2 to account for header row (row 1)
            const validationResult = this.validateRow(row, mapping, rowNumber);

            if (validationResult.valid) {
                const transformedRow = this.transformRow<T>(row, mapping);

                // Apply business rule validation if provided
                if (businessRuleValidator) {
                    const businessRuleErrors = businessRuleValidator(transformedRow, rowNumber);
                    if (businessRuleErrors.length > 0) {
                        errors.push(...businessRuleErrors);
                    } else {
                        validRows.push(transformedRow);
                    }
                } else {
                    validRows.push(transformedRow);
                }
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
     * Enhanced with detailed error information including row, column, value, and message
     * Requirements: 12.1, 12.2, 12.3, 12.4
     * 
     * @param errors - Array of import errors
     * @param fileName - Name for the error report file
     */
    exportErrorReport(errors: ExcelImportError[], fileName: string): void {
        const errorData = errors.map(error => ({
            'Row': error.row,
            'Column': error.column,
            'Value': error.value !== null && error.value !== undefined ? String(error.value) : '(empty)',
            'Error Message': error.message
        }));

        const worksheet = XLSX.utils.json_to_sheet(errorData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

        // Set column widths for better readability
        worksheet['!cols'] = [
            { wch: 8 },  // Row
            { wch: 25 }, // Column
            { wch: 25 }, // Value
            { wch: 60 }  // Error Message
        ];

        // Add header styling (if supported by the library version)
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: 'FFFF00' } }
            };
        }

        XLSX.writeFile(workbook, fileName);
    }

    /**
     * Generate detailed error summary
     * Requirements: 12.2, 12.3, 12.4
     * 
     * @param errors - Array of import errors
     * @returns Error summary with counts by type and column
     */
    generateErrorSummary(errors: ExcelImportError[]): ExcelErrorSummary {
        const errorsByColumn: { [column: string]: number } = {};
        const errorsByRow: { [row: number]: number } = {};

        errors.forEach(error => {
            // Count by column
            if (!errorsByColumn[error.column]) {
                errorsByColumn[error.column] = 0;
            }
            errorsByColumn[error.column]++;

            // Count by row
            if (!errorsByRow[error.row]) {
                errorsByRow[error.row] = 0;
            }
            errorsByRow[error.row]++;
        });

        return {
            totalErrors: errors.length,
            errorsByColumn,
            errorsByRow,
            affectedRows: Object.keys(errorsByRow).length,
            affectedColumns: Object.keys(errorsByColumn).length
        };
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

/**
 * Excel error summary
 * Requirements: 12.2, 12.3, 12.4
 */
export interface ExcelErrorSummary {
    totalErrors: number;
    errorsByColumn: { [column: string]: number };
    errorsByRow: { [row: number]: number };
    affectedRows: number;
    affectedColumns: number;
}
