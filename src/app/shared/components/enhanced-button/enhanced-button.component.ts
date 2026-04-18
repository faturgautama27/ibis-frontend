import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Enhanced Button Component
 * Implements enhanced button styling with variants, states, and sizes
 * 
 * Requirements: 7.1-7.8 - Button styling and interaction states
 */
@Component({
  selector: 'app-enhanced-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button
      [label]="label"
      [icon]="icon"
      [iconPos]="iconPos"
      [loading]="loading"
      [disabled]="disabled"
      [type]="type"
      [styleClass]="computedStyleClass"
      (onClick)="handleClick($event)"
      (mousedown)="onMouseDown()"
      (mouseup)="onMouseUp()"
      (mouseleave)="onMouseLeave()">
      <ng-content></ng-content>
    </p-button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    /* Primary Button Variant */
    :host ::ng-deep .btn-primary {
      background: var(--primary-500);
      border: var(--button-border-width) solid var(--primary-500);
      color: white;
      transition: all var(--duration-normal) var(--ease-out);
      border-radius: var(--radius-md);
      font-weight: var(--font-medium);
    }

    :host ::ng-deep .btn-primary:hover:not(:disabled) {
      background: var(--primary-600);
      border-color: var(--primary-600);
      transform: var(--button-transform-hover);
      box-shadow: var(--shadow-md);
    }

    :host ::ng-deep .btn-primary:active:not(:disabled) {
      background: var(--primary-700);
      border-color: var(--primary-700);
      transform: var(--button-transform-active);
    }

    :host ::ng-deep .btn-primary:focus {
      outline: none;
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-primary);
    }

    /* Secondary Button Variant */
    :host ::ng-deep .btn-secondary {
      background: white;
      border: var(--button-border-width) solid var(--gray-300);
      color: var(--gray-700);
      transition: all var(--duration-normal) var(--ease-out);
      border-radius: var(--radius-md);
      font-weight: var(--font-medium);
    }

    :host ::ng-deep .btn-secondary:hover:not(:disabled) {
      background: var(--gray-50);
      border-color: var(--gray-400);
      transform: var(--button-transform-hover);
      box-shadow: var(--shadow-sm);
    }

    :host ::ng-deep .btn-secondary:active:not(:disabled) {
      background: var(--gray-100);
      border-color: var(--gray-500);
      transform: var(--button-transform-active);
    }

    :host ::ng-deep .btn-secondary:focus {
      outline: none;
      box-shadow: 0 0 0 var(--button-focus-ring-width) rgba(107, 114, 128, 0.1);
    }

    /* Danger Button Variant */
    :host ::ng-deep .btn-danger {
      background: var(--error-500);
      border: var(--button-border-width) solid var(--error-500);
      color: white;
      transition: all var(--duration-normal) var(--ease-out);
      border-radius: var(--radius-md);
      font-weight: var(--font-medium);
    }

    :host ::ng-deep .btn-danger:hover:not(:disabled) {
      background: var(--error-600);
      border-color: var(--error-600);
      transform: var(--button-transform-hover);
      box-shadow: var(--shadow-md);
    }

    :host ::ng-deep .btn-danger:active:not(:disabled) {
      background: var(--error-700);
      border-color: var(--error-700);
      transform: var(--button-transform-active);
    }

    :host ::ng-deep .btn-danger:focus {
      outline: none;
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-error);
    }

    /* Text Button Variant */
    :host ::ng-deep .btn-text {
      background: transparent;
      border: var(--button-border-width) solid transparent;
      color: var(--primary-600);
      transition: all var(--duration-normal) var(--ease-out);
      border-radius: var(--radius-md);
      font-weight: var(--font-medium);
    }

    :host ::ng-deep .btn-text:hover:not(:disabled) {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    :host ::ng-deep .btn-text:active:not(:disabled) {
      background: var(--primary-100);
      color: var(--primary-800);
    }

    :host ::ng-deep .btn-text:focus {
      outline: none;
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-primary);
    }

    /* Button Sizes */
    :host ::ng-deep .btn-sm {
      padding: var(--padding-xs) var(--padding-md);
      font-size: var(--text-sm);
      min-height: var(--min-click-target);
    }

    :host ::ng-deep .btn-md {
      padding: var(--padding-sm) var(--padding-lg);
      font-size: var(--text-base);
      min-height: var(--min-touch-target);
    }

    :host ::ng-deep .btn-lg {
      padding: var(--padding-md) var(--space-8);
      font-size: var(--text-lg);
      min-height: calc(var(--min-touch-target) + var(--space-2));
    }

    /* Disabled State */
    :host ::ng-deep .p-button:disabled {
      opacity: var(--button-disabled-opacity);
      cursor: not-allowed;
      pointer-events: none;
      transform: none !important;
    }

    /* Loading State */
    :host ::ng-deep .p-button[data-pc-section="loadingicon"] {
      cursor: wait;
    }

    /* Full Width */
    :host ::ng-deep .btn-full-width {
      width: 100%;
    }

    /* Icon Spacing */
    :host ::ng-deep .p-button .p-button-icon {
      margin-right: var(--space-2);
    }

    :host ::ng-deep .p-button .p-button-icon.p-button-icon-right {
      margin-right: 0;
      margin-left: var(--space-2);
    }

    /* Remove PrimeNG default styles that conflict */
    :host ::ng-deep .p-button {
      border-radius: var(--radius-md);
      font-family: var(--font-family);
      font-weight: var(--font-medium);
      transition: all var(--duration-normal) var(--ease-out);
    }

    :host ::ng-deep .p-button:focus {
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-primary);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedButtonComponent {
  /**
   * Button label text
   */
  @Input() label?: string;

  /**
   * Button icon (PrimeIcons class)
   */
  @Input() icon?: string;

  /**
   * Icon position
   */
  @Input() iconPos: 'left' | 'right' = 'left';

  /**
   * Button variant
   */
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'text' = 'primary';

  /**
   * Button size
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Loading state
   */
  @Input() loading = false;

  /**
   * Disabled state
   */
  @Input() disabled = false;

  /**
   * Button type
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Full width button
   */
  @Input() fullWidth = false;

  /**
   * Enable ripple effect animation
   */
  @Input() ripple = true;

  /**
   * Custom CSS classes
   */
  @Input() customClass = '';

  /**
   * Click event emitter
   */
  @Output() onClick = new EventEmitter<Event>();

  /**
   * Internal state for animations
   */
  private isPressed = false;

  /**
   * Computed style class based on variant, size, and other properties
   */
  get computedStyleClass(): string {
    const classes = [
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.fullWidth ? 'btn-full-width' : '',
      this.ripple ? 'btn-animated' : '',
      'interactive',
      this.customClass
    ];

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Handle button click
   */
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  /**
   * Handle mouse down for press animation
   */
  onMouseDown(): void {
    if (!this.disabled && !this.loading) {
      this.isPressed = true;
    }
  }

  /**
   * Handle mouse up for press animation
   */
  onMouseUp(): void {
    this.isPressed = false;
  }

  /**
   * Handle mouse leave to reset press state
   */
  onMouseLeave(): void {
    this.isPressed = false;
  }
}