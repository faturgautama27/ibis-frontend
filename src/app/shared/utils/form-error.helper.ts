import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

/**
 * Form Error Helper Utility
 * Provides helper functions for displaying form validation errors
 * 
 * Requirements: All - Shared utility for consistent error handling
 */
export class FormErrorHelper {
    /**
     * Get error message for a form control
     * 
     * @param control Form control to check
     * @param fieldName Display name of the field
     * @returns Error message string or empty string if no error
     */
    static getErrorMessage(control: AbstractControl | null, fieldName: string): string {
        if (!control || !control.errors) {
            return '';
        }

        const errors = control.errors;

        // Required field
        if (errors['required']) {
            return `${fieldName} is required`;
        }

        // Min length
        if (errors['minlength']) {
            return `${fieldName} must be at least ${errors['minlength'].requiredLength} characters`;
        }

        // Max length
        if (errors['maxlength']) {
            return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters`;
        }

        // Min value
        if (errors['min']) {
            return `${fieldName} must be at least ${errors['min'].min}`;
        }

        // Max value
        if (errors['max']) {
            return `${fieldName} cannot exceed ${errors['max'].max}`;
        }

        // Email format
        if (errors['email']) {
            return `${fieldName} must be a valid email address`;
        }

        // Pattern
        if (errors['pattern']) {
            return `${fieldName} format is invalid`;
        }

        // Custom validators
        if (errors['invalidCategory']) {
            return errors['invalidCategory'].message;
        }

        if (errors['invalidHsCode']) {
            return errors['invalidHsCode'].message;
        }

        if (errors['notPositive']) {
            return errors['notPositive'].message;
        }

        if (errors['insufficientStock']) {
            return errors['insufficientStock'].message;
        }

        if (errors['recordLocked']) {
            return errors['recordLocked'].message;
        }

        if (errors['itemCategoryMismatch']) {
            return errors['itemCategoryMismatch'].message;
        }

        // Generic error
        return `${fieldName} is invalid`;
    }

    /**
     * Check if a control has an error and should display it
     * 
     * @param control Form control to check
     * @returns True if control has error and is touched/dirty
     */
    static hasError(control: AbstractControl | null): boolean {
        if (!control) {
            return false;
        }
        return control.invalid && (control.dirty || control.touched);
    }

    /**
     * Check if a control has a specific error
     * 
     * @param control Form control to check
     * @param errorKey Error key to check for
     * @returns True if control has the specified error
     */
    static hasSpecificError(control: AbstractControl | null, errorKey: string): boolean {
        if (!control || !control.errors) {
            return false;
        }
        return !!control.errors[errorKey];
    }

    /**
     * Get all error messages for a form group
     * 
     * @param formGroup Form group to check
     * @returns Array of error messages
     */
    static getAllErrors(formGroup: FormGroup): string[] {
        const errors: string[] = [];

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control && this.hasError(control)) {
                const message = this.getErrorMessage(control, this.formatFieldName(key));
                if (message) {
                    errors.push(message);
                }
            }

            // Check nested form groups
            if (control instanceof FormGroup) {
                errors.push(...this.getAllErrors(control));
            }

            // Check form arrays
            if (control instanceof FormArray) {
                control.controls.forEach((arrayControl, index) => {
                    if (arrayControl instanceof FormGroup) {
                        const arrayErrors = this.getAllErrors(arrayControl);
                        errors.push(...arrayErrors.map(err => `Item ${index + 1}: ${err}`));
                    }
                });
            }
        });

        return errors;
    }

    /**
     * Mark all controls in a form group as touched
     * Useful for showing all validation errors on submit
     * 
     * @param formGroup Form group to mark
     */
    static markAllAsTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control) {
                control.markAsTouched();

                if (control instanceof FormGroup) {
                    this.markAllAsTouched(control);
                }

                if (control instanceof FormArray) {
                    control.controls.forEach(arrayControl => {
                        if (arrayControl instanceof FormGroup) {
                            this.markAllAsTouched(arrayControl);
                        } else {
                            arrayControl.markAsTouched();
                        }
                    });
                }
            }
        });
    }

    /**
     * Check if form group is valid
     * 
     * @param formGroup Form group to check
     * @returns True if form is valid
     */
    static isValid(formGroup: FormGroup): boolean {
        return formGroup.valid;
    }

    /**
     * Get CSS class for form control based on validation state
     * 
     * @param control Form control to check
     * @returns CSS class string
     */
    static getControlClass(control: AbstractControl | null): string {
        if (!control) {
            return '';
        }

        if (this.hasError(control)) {
            return 'ng-invalid ng-dirty';
        }

        if (control.valid && control.touched) {
            return 'ng-valid ng-dirty';
        }

        return '';
    }

    /**
     * Format field name for display
     * Converts camelCase to Title Case
     * 
     * @param fieldName Field name in camelCase
     * @returns Formatted field name
     */
    private static formatFieldName(fieldName: string): string {
        return fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    /**
     * Reset form group to initial state
     * 
     * @param formGroup Form group to reset
     */
    static reset(formGroup: FormGroup): void {
        formGroup.reset();
        formGroup.markAsUntouched();
        formGroup.markAsPristine();
    }

    /**
     * Get first error message from form group
     * 
     * @param formGroup Form group to check
     * @returns First error message or empty string
     */
    static getFirstError(formGroup: FormGroup): string {
        const errors = this.getAllErrors(formGroup);
        return errors.length > 0 ? errors[0] : '';
    }

    /**
     * Check if form has any errors
     * 
     * @param formGroup Form group to check
     * @returns True if form has errors
     */
    static hasAnyErrors(formGroup: FormGroup): boolean {
        return this.getAllErrors(formGroup).length > 0;
    }
}
