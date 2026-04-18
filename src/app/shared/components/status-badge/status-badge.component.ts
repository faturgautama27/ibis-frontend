import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

/**
 * Enhanced Status Badge Component
 * Reusable component for displaying status badges with consistent styling
 * 
 * Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6 - Enhanced status badge styling
 */
@Component({
    selector: 'app-status-badge',
    standalone: true,
    imports: [CommonModule, TagModule],
    template: `
    <p-tag
      [value]="label"
      [severity]="severity"
      [icon]="icon"
      [rounded]="rounded"
      [class]="getTagClasses()">
    </p-tag>
  `,
    styles: [`
    :host {
      display: inline-flex;
      align-items: center;
    }

    /* Enhanced status tag styling following design system */
    ::ng-deep .p-tag {
      font-size: var(--status-tag-font-size);
      font-weight: var(--font-medium);
      padding: var(--status-tag-padding);
      border: var(--status-tag-border-width) solid transparent;
      letter-spacing: var(--status-tag-letter-spacing);
      text-transform: uppercase;
      transition: all var(--duration-fast) var(--ease-out);
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    /* Success variant */
    ::ng-deep .p-tag.p-tag-success {
      background-color: var(--success-50);
      color: var(--success-700);
      border-color: var(--success-200);
    }

    /* Info variant */
    ::ng-deep .p-tag.p-tag-info {
      background-color: var(--info-50);
      color: var(--info-700);
      border-color: var(--info-200);
    }

    /* Warning variant */
    ::ng-deep .p-tag.p-tag-warn {
      background-color: var(--warning-50);
      color: var(--warning-700);
      border-color: var(--warning-200);
    }

    /* Danger variant */
    ::ng-deep .p-tag.p-tag-danger {
      background-color: var(--error-50);
      color: var(--error-700);
      border-color: var(--error-200);
    }

    /* Secondary variant */
    ::ng-deep .p-tag.p-tag-secondary {
      background-color: var(--gray-50);
      color: var(--gray-700);
      border-color: var(--gray-200);
    }

    /* Rounded styling */
    ::ng-deep .p-tag.p-tag-rounded {
      border-radius: var(--radius-full);
    }

    /* Icon styling */
    ::ng-deep .p-tag .p-tag-icon {
      font-size: var(--text-xs);
      width: 12px;
      height: 12px;
    }

    /* Size variants */
    ::ng-deep .p-tag.status-tag-sm {
      font-size: 0.625rem;
      padding: calc(var(--space-1) * 0.5) var(--space-2);
    }

    ::ng-deep .p-tag.status-tag-lg {
      font-size: var(--text-sm);
      padding: var(--space-2) var(--space-4);
    }

    /* Interactive variant for clickable badges */
    ::ng-deep .p-tag.status-tag-interactive {
      cursor: pointer;
      transition: all var(--duration-fast) var(--ease-out);
    }

    ::ng-deep .p-tag.status-tag-interactive:hover {
      transform: var(--button-transform-hover);
      box-shadow: var(--shadow-sm);
    }

    ::ng-deep .p-tag.status-tag-interactive:active {
      transform: var(--button-transform-active);
    }
  `]
})
export class StatusBadgeComponent {
    /**
     * Status label to display
     */
    @Input() label = '';

    /**
     * Status value (used to determine severity if not explicitly set)
     */
    @Input() status?: string;

    /**
     * Badge severity (color)
     * success (green), info (blue), warning (yellow), danger (red), secondary (gray)
     */
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' = 'info';

    /**
     * Icon to display
     */
    @Input() icon?: string;

    /**
     * Whether badge should be rounded
     */
    @Input() rounded = true;

    /**
     * Size variant
     */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /**
     * Whether badge is interactive (clickable)
     */
    @Input() interactive = false;

    /**
     * Custom CSS class
     */
    @Input() customClass = '';

    /**
     * Auto-determine severity from common status values
     */
    @Input() set autoSeverity(value: boolean) {
        if (value && this.status) {
            this.severity = this.determineSeverity(this.status);
        }
    }

    /**
     * Get combined CSS classes for the tag
     */
    getTagClasses(): string {
        const classes = [];

        if (this.size !== 'md') {
            classes.push(`status-tag-${this.size}`);
        }

        if (this.interactive) {
            classes.push('status-tag-interactive');
        }

        if (this.customClass) {
            classes.push(this.customClass);
        }

        return classes.join(' ');
    }

    /**
     * Determine severity based on status value
     */
    private determineSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const statusLower = status.toLowerCase();

        // Success states
        if (
            statusLower.includes('approved') ||
            statusLower.includes('completed') ||
            statusLower.includes('active') ||
            statusLower.includes('success') ||
            statusLower.includes('fully') ||
            statusLower.includes('confirmed') ||
            statusLower.includes('delivered') ||
            statusLower.includes('paid')
        ) {
            return 'success';
        }

        // Warning states
        if (
            statusLower.includes('pending') ||
            statusLower.includes('partial') ||
            statusLower.includes('warning') ||
            statusLower.includes('review') ||
            statusLower.includes('processing') ||
            statusLower.includes('in progress') ||
            statusLower.includes('scheduled')
        ) {
            return 'warn';
        }

        // Danger states
        if (
            statusLower.includes('rejected') ||
            statusLower.includes('cancelled') ||
            statusLower.includes('failed') ||
            statusLower.includes('error') ||
            statusLower.includes('expired') ||
            statusLower.includes('overdue') ||
            statusLower.includes('blocked')
        ) {
            return 'danger';
        }

        // Secondary states
        if (
            statusLower.includes('draft') ||
            statusLower.includes('inactive') ||
            statusLower.includes('archived') ||
            statusLower.includes('disabled') ||
            statusLower.includes('paused')
        ) {
            return 'secondary';
        }

        // Default to info
        return 'info';
    }
}
