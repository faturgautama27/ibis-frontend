import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { FormErrorHelper } from '../../utils/form-error.helper';

/**
 * Validation Message Display Component
 * Displays validation error messages for form controls
 * 
 * Requirements: All - Shared component for consistent validation feedback
 */
@Component({
    selector: 'app-validation-message',
    standalone: true,
    imports: [CommonModule],
    template: `
    <small
      *ngIf="shouldShowError()"
      class="p-error block mt-1">
      {{ errorMessage }}
    </small>
  `,
    styles: [`
    :host {
      display: block;
    }

    .p-error {
      color: var(--red-500);
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  `]
})
export class ValidationMessageComponent {
    /**
     * Form control to validate
     */
    @Input() control: AbstractControl | null = null;

    /**
     * Field name for error message
     */
    @Input() fieldName = 'Field';

    /**
     * Custom error message (overrides default)
     */
    @Input() customMessage?: string;

    /**
     * Whether to show error immediately (without touched check)
     */
    @Input() showImmediately = false;

    /**
     * Get error message to display
     */
    get errorMessage(): string {
        if (this.customMessage) {
            return this.customMessage;
        }

        if (!this.control) {
            return '';
        }

        return FormErrorHelper.getErrorMessage(this.control, this.fieldName);
    }

    /**
     * Check if error should be shown
     */
    shouldShowError(): boolean {
        if (!this.control) {
            return false;
        }

        if (this.showImmediately) {
            return this.control.invalid;
        }

        return FormErrorHelper.hasError(this.control);
    }
}
