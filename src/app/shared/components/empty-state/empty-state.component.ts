import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Empty State Component
 * Reusable component for displaying empty states with icons, messages, and actions
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6 - Empty state designs
 */
@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    template: `
    <div class="empty-state" [class]="getEmptyStateClasses()">
      <!-- Icon -->
      <div class="empty-state-icon" *ngIf="icon">
        <i [class]="icon" [attr.aria-hidden]="true"></i>
      </div>

      <!-- Title -->
      <h3 class="empty-state-title" *ngIf="title">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="empty-state-description" *ngIf="description">
        {{ description }}
      </p>

      <!-- Actions -->
      <div class="empty-state-actions" *ngIf="hasActions()">
        <!-- Primary action -->
        <p-button 
          *ngIf="primaryActionLabel"
          [label]="primaryActionLabel"
          [icon]="primaryActionIcon"
          [disabled]="primaryActionDisabled"
          [loading]="primaryActionLoading"
          (onClick)="onPrimaryAction()"
          styleClass="p-button-raised">
        </p-button>

        <!-- Secondary action -->
        <p-button 
          *ngIf="secondaryActionLabel"
          [label]="secondaryActionLabel"
          [icon]="secondaryActionIcon"
          [disabled]="secondaryActionDisabled"
          [loading]="secondaryActionLoading"
          (onClick)="onSecondaryAction()"
          styleClass="p-button-outlined">
        </p-button>
      </div>

      <!-- Custom content -->
      <div class="empty-state-content" *ngIf="hasCustomContent">
        <ng-content></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--padding-xl);
      min-height: 200px;
    }

    .empty-state-icon {
      margin-bottom: var(--space-6);
    }

    .empty-state-icon i {
      font-size: 4rem;
      color: var(--gray-300);
      transition: color var(--duration-fast) var(--ease-out);
    }

    .empty-state-title {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-700);
      margin: 0 0 var(--space-2) 0;
      line-height: var(--leading-tight);
    }

    .empty-state-description {
      font-size: var(--text-base);
      color: var(--gray-500);
      margin: 0 0 var(--space-6) 0;
      line-height: var(--leading-normal);
      max-width: 400px;
    }

    .empty-state-actions {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      justify-content: center;
    }

    .empty-state-content {
      margin-top: var(--space-6);
      width: 100%;
    }

    /* Size variants */
    .empty-state.empty-state-sm {
      padding: var(--padding-lg);
      min-height: 150px;
    }

    .empty-state.empty-state-sm .empty-state-icon i {
      font-size: 3rem;
    }

    .empty-state.empty-state-sm .empty-state-title {
      font-size: var(--text-lg);
    }

    .empty-state.empty-state-sm .empty-state-description {
      font-size: var(--text-sm);
    }

    .empty-state.empty-state-lg {
      padding: var(--space-20);
      min-height: 300px;
    }

    .empty-state.empty-state-lg .empty-state-icon i {
      font-size: 5rem;
    }

    .empty-state.empty-state-lg .empty-state-title {
      font-size: var(--text-2xl);
    }

    .empty-state.empty-state-lg .empty-state-description {
      font-size: var(--text-lg);
    }

    /* Context variants */
    .empty-state.empty-state-table {
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      background-color: white;
      margin: var(--space-4) 0;
    }

    .empty-state.empty-state-card {
      background-color: var(--gray-50);
      border-radius: var(--radius-lg);
      border: 2px dashed var(--gray-200);
    }

    .empty-state.empty-state-page {
      min-height: 60vh;
      background-color: var(--background-primary);
    }

    /* Icon color variants */
    .empty-state.empty-state-primary .empty-state-icon i {
      color: var(--primary-300);
    }

    .empty-state.empty-state-success .empty-state-icon i {
      color: var(--success-300);
    }

    .empty-state.empty-state-warning .empty-state-icon i {
      color: var(--warning-300);
    }

    .empty-state.empty-state-danger .empty-state-icon i {
      color: var(--error-300);
    }

    .empty-state.empty-state-info .empty-state-icon i {
      color: var(--info-300);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .empty-state {
        padding: var(--padding-lg);
      }

      .empty-state-actions {
        flex-direction: column;
        width: 100%;
      }

      .empty-state-actions ::ng-deep .p-button {
        width: 100%;
        justify-content: center;
      }

      .empty-state-description {
        max-width: none;
      }
    }

    /* Animation for icon */
    .empty-state-icon i {
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .empty-state-icon i {
        animation: none;
      }
    }

    /* Focus styles for accessibility */
    .empty-state:focus-within .empty-state-icon i {
      color: var(--primary-400);
    }
  `]
})
export class EmptyStateComponent {
    /**
     * Icon to display (PrimeIcons class)
     */
    @Input() icon?: string;

    /**
     * Title text
     */
    @Input() title?: string;

    /**
     * Description text
     */
    @Input() description?: string;

    /**
     * Size variant
     */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /**
     * Context variant for styling
     */
    @Input() context: 'default' | 'table' | 'card' | 'page' = 'default';

    /**
     * Color variant for icon
     */
    @Input() variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'default';

    /**
     * Primary action button label
     */
    @Input() primaryActionLabel?: string;

    /**
     * Primary action button icon
     */
    @Input() primaryActionIcon?: string;

    /**
     * Primary action button disabled state
     */
    @Input() primaryActionDisabled = false;

    /**
     * Primary action button loading state
     */
    @Input() primaryActionLoading = false;

    /**
     * Secondary action button label
     */
    @Input() secondaryActionLabel?: string;

    /**
     * Secondary action button icon
     */
    @Input() secondaryActionIcon?: string;

    /**
     * Secondary action button disabled state
     */
    @Input() secondaryActionDisabled = false;

    /**
     * Secondary action button loading state
     */
    @Input() secondaryActionLoading = false;

    /**
     * Whether custom content is provided
     */
    @Input() hasCustomContent = false;

    /**
     * Primary action click event
     */
    @Output() primaryAction = new EventEmitter<void>();

    /**
     * Secondary action click event
     */
    @Output() secondaryAction = new EventEmitter<void>();

    /**
     * Get combined CSS classes for the empty state
     */
    getEmptyStateClasses(): string {
        const classes = [];

        if (this.size !== 'md') {
            classes.push(`empty-state-${this.size}`);
        }

        if (this.context !== 'default') {
            classes.push(`empty-state-${this.context}`);
        }

        if (this.variant !== 'default') {
            classes.push(`empty-state-${this.variant}`);
        }

        return classes.join(' ');
    }

    /**
     * Check if any actions are available
     */
    hasActions(): boolean {
        return !!(this.primaryActionLabel || this.secondaryActionLabel);
    }

    /**
     * Handle primary action click
     */
    onPrimaryAction(): void {
        if (!this.primaryActionDisabled && !this.primaryActionLoading) {
            this.primaryAction.emit();
        }
    }

    /**
     * Handle secondary action click
     */
    onSecondaryAction(): void {
        if (!this.secondaryActionDisabled && !this.secondaryActionLoading) {
            this.secondaryAction.emit();
        }
    }
}