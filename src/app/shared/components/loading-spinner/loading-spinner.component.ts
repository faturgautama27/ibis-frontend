import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Loading Spinner Component
 * Reusable loading spinner with consistent styling
 * 
 * Requirements: 11.1, 11.4, 11.5, 11.6 - Loading spinner styling and behavior
 */
@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="loading-spinner"
      [class]="getSpinnerClasses()"
      [attr.aria-label]="ariaLabel"
      role="status">
      <div class="spinner-circle"></div>
      <span class="visually-hidden">{{ loadingText }}</span>
    </div>
  `,
    styles: [`
    .loading-spinner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner-circle {
      width: var(--spinner-size);
      height: var(--spinner-size);
      border: var(--spinner-border-width) solid var(--gray-200);
      border-top: var(--spinner-border-width) solid var(--primary-500);
      border-radius: var(--radius-full);
      animation: spin 1s linear infinite;
    }

    /* Size variants */
    .loading-spinner.spinner-sm .spinner-circle {
      width: 16px;
      height: 16px;
      border-width: 1.5px;
    }

    .loading-spinner.spinner-lg .spinner-circle {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .loading-spinner.spinner-xl .spinner-circle {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    /* Color variants */
    .loading-spinner.spinner-primary .spinner-circle {
      border-top-color: var(--primary-500);
    }

    .loading-spinner.spinner-success .spinner-circle {
      border-top-color: var(--success-500);
    }

    .loading-spinner.spinner-warning .spinner-circle {
      border-top-color: var(--warning-500);
    }

    .loading-spinner.spinner-danger .spinner-circle {
      border-top-color: var(--error-500);
    }

    .loading-spinner.spinner-white .spinner-circle {
      border-color: rgba(255, 255, 255, 0.3);
      border-top-color: white;
    }

    /* Centered variant */
    .loading-spinner.spinner-centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Full overlay variant */
    .loading-spinner.spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--overlay-light);
      backdrop-filter: var(--backdrop-blur);
      z-index: var(--z-modal);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .spinner-circle {
        animation: none;
        border-top-color: var(--gray-400);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
    /**
     * Size of the spinner
     */
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    /**
     * Color variant of the spinner
     */
    @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'white' = 'primary';

    /**
     * Whether to center the spinner
     */
    @Input() centered = false;

    /**
     * Whether to show as full overlay
     */
    @Input() overlay = false;

    /**
     * Loading text for screen readers
     */
    @Input() loadingText = 'Loading...';

    /**
     * ARIA label for accessibility
     */
    @Input() ariaLabel = 'Loading content';

    /**
     * Get combined CSS classes for the spinner
     */
    getSpinnerClasses(): string {
        const classes = [];

        if (this.size !== 'md') {
            classes.push(`spinner-${this.size}`);
        }

        if (this.color !== 'primary') {
            classes.push(`spinner-${this.color}`);
        }

        if (this.centered) {
            classes.push('spinner-centered');
        }

        if (this.overlay) {
            classes.push('spinner-overlay');
        }

        return classes.join(' ');
    }
}