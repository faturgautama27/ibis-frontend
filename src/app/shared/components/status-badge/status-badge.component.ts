import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

/**
 * Status Badge Component
 * Reusable component for displaying status badges with consistent styling
 * 
 * Requirements: All - Shared component for status display
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
      [styleClass]="customClass">
    </p-tag>
  `,
    styles: [`
    :host {
      display: inline-block;
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
     * success (green), info (blue), warn (yellow), danger (red), secondary (gray)
     */
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' = 'info';

    /**
     * Icon to display
     */
    @Input() icon?: string;

    /**
     * Whether badge should be rounded
     */
    @Input() rounded = false;

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
            statusLower.includes('fully')
        ) {
            return 'success';
        }

        // Warning states
        if (
            statusLower.includes('pending') ||
            statusLower.includes('partial') ||
            statusLower.includes('warning') ||
            statusLower.includes('review')
        ) {
            return 'warn';
        }

        // Danger states
        if (
            statusLower.includes('rejected') ||
            statusLower.includes('cancelled') ||
            statusLower.includes('failed') ||
            statusLower.includes('error') ||
            statusLower.includes('expired')
        ) {
            return 'danger';
        }

        // Secondary states
        if (
            statusLower.includes('draft') ||
            statusLower.includes('inactive') ||
            statusLower.includes('archived')
        ) {
            return 'secondary';
        }

        // Default to info
        return 'info';
    }
}
