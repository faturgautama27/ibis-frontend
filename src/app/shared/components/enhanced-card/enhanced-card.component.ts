import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

/**
 * Enhanced Card Component
 * Implements enhanced card styling with shadows, rounded corners, and hover effects
 * 
 * Requirements: 4.1-4.7 - Card and container design enhancements
 */
@Component({
    selector: 'app-enhanced-card',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
    <div [class]="computedCardClass" [attr.role]="interactive ? 'button' : null" [attr.tabindex]="interactive ? '0' : null">
      <div class="card-header" *ngIf="header || headerTemplate">
        <ng-container *ngIf="header">
          <h3 class="card-title" *ngIf="title">{{ title }}</h3>
          <p class="card-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </ng-container>
        <ng-content select="[slot=header]"></ng-content>
      </div>

      <div class="card-content">
        <ng-content></ng-content>
      </div>

      <div class="card-footer" *ngIf="footer || footerTemplate">
        <ng-content select="[slot=footer]"></ng-content>
      </div>

      <!-- Stats card accent -->
      <div class="stats-accent" *ngIf="variant === 'stats'"></div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }

    /* Base Card Styles */
    .enhanced-card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--card-shadow);
      border: 1px solid var(--gray-200);
      padding: var(--padding-lg);
      transition: all var(--duration-normal) var(--ease-out);
      position: relative;
      overflow: hidden;
    }

    /* Standard Card Variant */
    .card-standard:hover {
      box-shadow: var(--card-hover-shadow);
      transform: var(--card-hover-transform);
    }

    /* Stats Card Variant */
    .card-stats {
      border-left: var(--card-stats-border-width) solid var(--primary-500);
      background: linear-gradient(135deg, var(--primary-50), transparent);
    }

    .card-stats .stats-accent {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, var(--primary-100), transparent);
      border-radius: 0 var(--radius-lg) 0 100%;
      opacity: 0.3;
      pointer-events: none;
    }

    /* Interactive Card Variant */
    .card-interactive {
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
    }

    .card-interactive:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-interactive:active {
      transform: translateY(0);
    }

    .card-interactive:focus {
      outline: none;
      box-shadow: 0 0 0 var(--button-focus-ring-width) var(--focus-ring-primary);
    }

    /* Compact Card Variant */
    .card-compact {
      padding: var(--padding-md);
    }

    /* Elevated Card Variant */
    .card-elevated {
      box-shadow: var(--shadow-lg);
    }

    .card-elevated:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-1px);
    }

    /* Card Header */
    .card-header {
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--gray-100);
    }

    .card-header:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .card-title {
      margin: 0 0 var(--space-2) 0;
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--gray-900);
      line-height: var(--leading-tight);
    }

    .card-subtitle {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--gray-600);
      line-height: var(--leading-normal);
    }

    /* Card Content */
    .card-content {
      flex: 1;
    }

    /* Card Footer */
    .card-footer {
      margin-top: var(--space-4);
      padding-top: var(--space-3);
      border-top: 1px solid var(--gray-100);
    }

    .card-footer:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }

    /* Loading State */
    .card-loading {
      position: relative;
      pointer-events: none;
    }

    .card-loading::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--overlay-light);
      backdrop-filter: var(--backdrop-blur);
      z-index: 1;
      border-radius: var(--radius-lg);
    }

    .card-loading::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--spinner-size);
      height: var(--spinner-size);
      margin: calc(var(--spinner-size) / -2) 0 0 calc(var(--spinner-size) / -2);
      border: var(--spinner-border-width) solid var(--gray-200);
      border-top: var(--spinner-border-width) solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      z-index: 2;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Error State */
    .card-error {
      border-color: var(--error-200);
      background: var(--error-50);
    }

    /* Success State */
    .card-success {
      border-color: var(--success-200);
      background: var(--success-50);
    }

    /* Warning State */
    .card-warning {
      border-color: var(--warning-200);
      background: var(--warning-50);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .enhanced-card {
        padding: var(--padding-md);
        border-radius: var(--radius-md);
      }

      .card-compact {
        padding: var(--padding-sm);
      }

      .card-title {
        font-size: var(--text-lg);
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .enhanced-card {
        border-width: 2px;
        border-color: var(--gray-900);
      }

      .card-header {
        border-bottom-width: 2px;
        border-bottom-color: var(--gray-900);
      }

      .card-footer {
        border-top-width: 2px;
        border-top-color: var(--gray-900);
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .enhanced-card,
      .card-interactive,
      .card-standard,
      .card-elevated {
        transition: none;
        transform: none !important;
      }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnhancedCardComponent {
    /**
     * Card variant
     */
    @Input() variant: 'standard' | 'stats' | 'interactive' | 'compact' | 'elevated' = 'standard';

    /**
     * Card title
     */
    @Input() title?: string;

    /**
     * Card subtitle
     */
    @Input() subtitle?: string;

    /**
     * Show header section
     */
    @Input() header = false;

    /**
     * Show footer section
     */
    @Input() footer = false;

    /**
     * Header template flag
     */
    @Input() headerTemplate = false;

    /**
     * Footer template flag
     */
    @Input() footerTemplate = false;

    /**
     * Loading state
     */
    @Input() loading = false;

    /**
     * Interactive state (clickable)
     */
    @Input() interactive = false;

    /**
     * Card state for styling
     */
    @Input() state?: 'error' | 'success' | 'warning';

    /**
     * Custom CSS classes
     */
    @Input() customClass = '';

    /**
     * Computed card class based on variant and state
     */
    get computedCardClass(): string {
        const classes = [
            'enhanced-card',
            `card-${this.variant}`,
            this.loading ? 'card-loading' : '',
            this.state ? `card-${this.state}` : '',
            this.interactive ? 'interactive hover-lift' : 'card-animated',
            this.customClass
        ];

        return classes.filter(Boolean).join(' ');
    }
}