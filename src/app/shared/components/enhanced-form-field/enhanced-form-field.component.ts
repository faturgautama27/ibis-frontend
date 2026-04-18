import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

/**
 * Enhanced Form Field Component
 * Implements enhanced form input styling with focus states, validation, labels, and error messages
 * 
 * Requirements: 6.1-6.8 - Form design enhancements
 */
@Component({
    selector: 'app-enhanced-form-field',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        SelectModule,
        DatePickerModule,
        CheckboxModule,
        RadioButtonModule,
        MultiSelectModule,
        IconFieldModule,
        InputIconModule
    ],
    template: `
    <div [class]="computedFieldClass">
      <!-- Label -->
      <label 
        *ngIf="label" 
        [for]="fieldId" 
        class="field-label"
        [class.required]="required">
        {{ label }}
        <span class="required-indicator" *ngIf="required">*</span>
      </label>

      <!-- Help Text -->
      <small class="field-help" *ngIf="helpText && !hasError">
        {{ helpText }}
      </small>

      <!-- Input Field Container -->
      <div class="field-input-container">
        <!-- Text Input -->
        <ng-container *ngIf="type === 'text' || type === 'email' || type === 'password'">
          <p-iconField *ngIf="icon; else textInput" iconPosition="left">
            <p-inputIcon [styleClass]="icon"></p-inputIcon>
            <input
              [id]="fieldId"
              [type]="type"
              [placeholder]="placeholder"
              [disabled]="disabled"
              [readonly]="readonly"
              [value]="value"
              [class]="computedInputClass"
              (input)="onInput($event)"
              (blur)="onBlur()"
              (focus)="onFocus()"
              pInputText />
          </p-iconField>
          <ng-template #textInput>
            <input
              [id]="fieldId"
              [type]="type"
              [placeholder]="placeholder"
              [disabled]="disabled"
              [readonly]="readonly"
              [value]="value"
              [class]="computedInputClass"
              (input)="onInput($event)"
              (blur)="onBlur()"
              (focus)="onFocus()"
              pInputText />
          </ng-template>
        </ng-container>

        <!-- Textarea -->
        <textarea
          *ngIf="type === 'textarea'"
          [id]="fieldId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [rows]="rows"
          [value]="value"
          [class]="computedInputClass"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          pTextarea>
        </textarea>

        <!-- Number Input -->
        <p-inputNumber
          *ngIf="type === 'number'"
          [inputId]="fieldId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [min]="min"
          [max]="max"
          [step]="step"
          [minFractionDigits]="minFractionDigits"
          [maxFractionDigits]="maxFractionDigits"
          [ngModel]="value"
          [inputStyleClass]="computedInputClass"
          (onInput)="onNumberInput($event)"
          (onBlur)="onBlur()"
          (onFocus)="onFocus()">
        </p-inputNumber>

        <!-- Dropdown -->
        <p-select
          *ngIf="type === 'dropdown'"
          [inputId]="fieldId"
          [options]="options"
          [optionLabel]="optionLabel"
          [optionValue]="optionValue"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [ngModel]="value"
          [panelStyleClass]="computedInputClass"
          (onChange)="onDropdownChange($event)"
          (onBlur)="onBlur()"
          (onFocus)="onFocus()">
        </p-select>

        <!-- Multi Select -->
        <p-multiSelect
          *ngIf="type === 'multiselect'"
          [inputId]="fieldId"
          [options]="options"
          [optionLabel]="optionLabel"
          [optionValue]="optionValue"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [ngModel]="value"
          [panelStyleClass]="computedInputClass"
          (onChange)="onMultiSelectChange($event)"
          (onBlur)="onBlur()"
          (onFocus)="onFocus()">
        </p-multiSelect>

        <!-- Calendar -->
        <p-datePicker
          *ngIf="type === 'date'"
          [inputId]="fieldId"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [showIcon]="true"
          [dateFormat]="dateFormat"
          [ngModel]="value"
          [inputStyleClass]="computedInputClass"
          (onSelect)="onDateSelect($event)"
          (onBlur)="onBlur()"
          (onFocus)="onFocus()">
        </p-datePicker>

        <!-- Checkbox -->
        <div *ngIf="type === 'checkbox'" class="checkbox-container">
          <p-checkbox
            [inputId]="fieldId"
            [disabled]="disabled"
            [readonly]="readonly"
            [binary]="true"
            [value]="value"
            (onChange)="onCheckboxChange($event)">
          </p-checkbox>
          <label [for]="fieldId" class="checkbox-label" *ngIf="checkboxLabel">
            {{ checkboxLabel }}
          </label>
        </div>

        <!-- Radio Button Group -->
        <div *ngIf="type === 'radio'" class="radio-group">
          <div *ngFor="let option of options; let i = index" class="radio-item">
            <p-radioButton
              [inputId]="fieldId + '_' + i"
              [name]="fieldId"
              [value]="getOptionValue(option)"
              [disabled]="disabled"
              [ngModel]="value"
              (onClick)="onRadioChange(getOptionValue(option))">
            </p-radioButton>
            <label [for]="fieldId + '_' + i" class="radio-label">
              {{ getOptionLabel(option) }}
            </label>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <small class="field-error" *ngIf="hasError && errorMessage">
        <i class="pi pi-exclamation-triangle"></i>
        {{ errorMessage }}
      </small>

      <!-- Success Message -->
      <small class="field-success" *ngIf="hasSuccess && successMessage">
        <i class="pi pi-check-circle"></i>
        {{ successMessage }}
      </small>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* Field Container */
    .enhanced-form-field {
      margin-bottom: var(--space-4);
    }

    .enhanced-form-field.compact {
      margin-bottom: var(--space-3);
    }

    /* Label Styles */
    .field-label {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--gray-700);
      margin-bottom: var(--form-label-spacing);
      line-height: var(--leading-normal);
    }

    .field-label.required {
      color: var(--gray-800);
    }

    .required-indicator {
      color: var(--error-500);
      margin-left: var(--space-1);
    }

    /* Help Text */
    .field-help {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
      margin-bottom: var(--form-label-spacing);
      line-height: var(--leading-normal);
    }

    /* Input Container */
    .field-input-container {
      position: relative;
    }

    /* Base Input Styles */
    :host ::ng-deep .enhanced-input {
      width: 100%;
      padding: var(--padding-sm) var(--padding-md);
      border: var(--form-border-width) solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-family: var(--font-family);
      background: white;
      color: var(--gray-900);
      transition: all var(--duration-normal) var(--ease-out);
      min-height: var(--min-touch-target);
    }

    /* Focus State */
    :host ::ng-deep .enhanced-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
    }

    /* Error State */
    :host ::ng-deep .enhanced-input.error {
      border-color: var(--error-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-error);
    }

    :host ::ng-deep .enhanced-input.error:focus {
      border-color: var(--error-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-error);
    }

    /* Success State */
    :host ::ng-deep .enhanced-input.success {
      border-color: var(--success-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-success);
    }

    :host ::ng-deep .enhanced-input.success:focus {
      border-color: var(--success-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-success);
    }

    /* Disabled State */
    :host ::ng-deep .enhanced-input:disabled {
      background: var(--gray-100);
      color: var(--gray-400);
      cursor: not-allowed;
      border-color: var(--gray-200);
    }

    /* Readonly State */
    :host ::ng-deep .enhanced-input:read-only {
      background: var(--gray-50);
      cursor: default;
    }

    /* Placeholder */
    :host ::ng-deep .enhanced-input::placeholder {
      color: var(--gray-400);
    }

    /* Checkbox Container */
    .checkbox-container {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .checkbox-label {
      font-size: var(--text-sm);
      color: var(--gray-700);
      cursor: pointer;
      margin: 0;
    }

    /* Radio Group */
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .radio-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .radio-label {
      font-size: var(--text-sm);
      color: var(--gray-700);
      cursor: pointer;
      margin: 0;
    }

    /* Error Message */
    .field-error {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--text-xs);
      color: var(--error-600);
      margin-top: var(--form-error-spacing);
      line-height: var(--leading-normal);
    }

    .field-error i {
      font-size: var(--text-xs);
    }

    /* Success Message */
    .field-success {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--text-xs);
      color: var(--success-600);
      margin-top: var(--form-error-spacing);
      line-height: var(--leading-normal);
    }

    .field-success i {
      font-size: var(--text-xs);
    }

    /* PrimeNG Component Overrides */
    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-inputtextarea,
    :host ::ng-deep .p-inputnumber-input,
    :host ::ng-deep .p-dropdown,
    :host ::ng-deep .p-multiselect,
    :host ::ng-deep .p-calendar input {
      border-radius: var(--radius-md);
      border: var(--form-border-width) solid var(--gray-200);
      font-family: var(--font-family);
      transition: all var(--duration-normal) var(--ease-out);
    }

    :host ::ng-deep .p-inputtext:focus,
    :host ::ng-deep .p-inputtextarea:focus,
    :host ::ng-deep .p-inputnumber-input:focus,
    :host ::ng-deep .p-dropdown:not(.p-disabled).p-focus,
    :host ::ng-deep .p-multiselect:not(.p-disabled).p-focus,
    :host ::ng-deep .p-calendar:not(.p-disabled).p-focus input {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 var(--form-focus-ring-width) var(--focus-ring-primary);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .enhanced-form-field {
        margin-bottom: var(--space-3);
      }

      :host ::ng-deep .enhanced-input {
        padding: var(--padding-sm);
        font-size: var(--text-base);
      }

      .radio-group {
        gap: var(--space-3);
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      :host ::ng-deep .enhanced-input {
        border-width: 2px;
      }

      .field-label {
        font-weight: var(--font-bold);
      }
    }
  `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EnhancedFormFieldComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedFormFieldComponent implements ControlValueAccessor {
    /**
     * Field type
     */
    @Input() type: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'dropdown' | 'multiselect' | 'date' | 'checkbox' | 'radio' = 'text';

    /**
     * Field label
     */
    @Input() label?: string;

    /**
     * Field placeholder
     */
    @Input() placeholder?: string;

    /**
     * Help text
     */
    @Input() helpText?: string;

    /**
     * Required field
     */
    @Input() required = false;

    /**
     * Disabled state
     */
    @Input() disabled = false;

    /**
     * Readonly state
     */
    @Input() readonly = false;

    /**
     * Field icon (for text inputs)
     */
    @Input() icon?: string;

    /**
     * Error state
     */
    @Input() hasError = false;

    /**
     * Success state
     */
    @Input() hasSuccess = false;

    /**
     * Error message
     */
    @Input() errorMessage?: string;

    /**
     * Success message
     */
    @Input() successMessage?: string;

    /**
     * Compact layout
     */
    @Input() compact = false;

    /**
     * Custom CSS classes
     */
    @Input() customClass = '';

    // Number input specific
    @Input() min?: number;
    @Input() max?: number;
    @Input() step?: number;
    @Input() minFractionDigits?: number;
    @Input() maxFractionDigits?: number;

    // Textarea specific
    @Input() rows = 3;

    // Dropdown/Select specific
    @Input() options: any[] = [];
    @Input() optionLabel = 'label';
    @Input() optionValue = 'value';

    // Date specific
    @Input() dateFormat = 'dd/mm/yy';

    // Checkbox specific
    @Input() checkboxLabel?: string;

    /**
     * Field ID for accessibility
     */
    fieldId = `field_${Math.random().toString(36).substr(2, 9)}`;

    /**
     * Internal value
     */
    value: any = null;

    /**
     * Control value accessor methods
     */
    private onChange = (value: any) => { };
    private onTouched = () => { };

    /**
     * Computed field class
     */
    get computedFieldClass(): string {
        const classes = [
            'enhanced-form-field',
            this.compact ? 'compact' : '',
            this.hasError ? 'has-error' : '',
            this.hasSuccess ? 'has-success' : '',
            this.customClass
        ];

        return classes.filter(Boolean).join(' ');
    }

    /**
     * Computed input class
     */
    get computedInputClass(): string {
        const classes = [
            'enhanced-input',
            this.hasError ? 'error' : '',
            this.hasSuccess ? 'success' : ''
        ];

        return classes.filter(Boolean).join(' ');
    }

    /**
     * Handle input events
     */
    onInput(event: any): void {
        const value = event.target.value;
        this.value = value;
        this.onChange(value);
    }

    onNumberInput(event: any): void {
        this.value = event.value;
        this.onChange(event.value);
    }

    onDropdownChange(event: any): void {
        this.value = event.value;
        this.onChange(event.value);
    }

    onMultiSelectChange(event: any): void {
        this.value = event.value;
        this.onChange(event.value);
    }

    onDateSelect(event: any): void {
        this.value = event;
        this.onChange(event);
    }

    onCheckboxChange(event: any): void {
        this.value = event.checked;
        this.onChange(event.checked);
    }

    onRadioChange(value: any): void {
        this.value = value;
        this.onChange(value);
    }

    onFocus(): void {
        // Handle focus events if needed
    }

    onBlur(): void {
        this.onTouched();
    }

    /**
     * Get option value for dropdown/radio
     */
    getOptionValue(option: any): any {
        return typeof option === 'object' ? option[this.optionValue] : option;
    }

    /**
     * Get option label for dropdown/radio
     */
    getOptionLabel(option: any): string {
        return typeof option === 'object' ? option[this.optionLabel] : option;
    }

    /**
     * ControlValueAccessor implementation
     */
    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}