import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

/**
 * Button Loading Component
 * Reusable loading state for buttons
 * 
 * Requirements: 11.3, 11.4, 11.5, 11.6 - Button loading states
 */
@Component({
    selector: 'app-button-loading',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent],
    template: `
    <span class="button-loading" [class]="getLoadingClasses()">
      <app-loading-spinner 
        [size]="spinnerSize"
        [color]="spinnerColor"
        [loadingText]="loadingText"
        [ariaLabel]="ariaLabel">
      </app-loading-spinner>
      <span class="button-loading-text" *ngIf="showText">
        {{ loadingText }}
      </span>
    </span>
  `,
    styles: [`
    .button-loading {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }

    .button-loading-text {
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
    }

    /* Size variants */
    .button-loading.loading-sm {
      gap: var(--space-1);
    }

    .button-loading.loading-lg {
      gap: var(--space-3);
    }

    /* Text-only variant */
    .button-loading.loading-text-only .button-loading-text {
      margin-left: 0;
    }

    /* Spinner-only variant */
    .button-loading.loading-spinner-only {
      gap: 0;
    }
  `]
})
export class ButtonLoadingComponent {
    /**
     * Size of the loading indicator
     */
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    /**
     * Color of the spinner
     */
    @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'white' = 'white';

    /**
     * Loading text to display
     */
    @Input() loadingText = 'Loading...';

    /**
     * Whether to show the loading text
     */
    @Input() showText = true;

    /**
     * ARIA label for accessibility
     */
    @Input() ariaLabel = 'Button is loading';

    /**
     * Get spinner size based on button size
     */
    get spinnerSize(): 'sm' | 'md' | 'lg' | 'xl' {
        switch (this.size) {
            case 'sm':
                return 'sm';
            case 'lg':
                return 'md';
            default:
                return 'sm';
        }
    }

    /**
     * Get spinner color
     */
    get spinnerColor(): 'primary' | 'success' | 'warning' | 'danger' | 'white' {
        return this.color;
    }

    /**
     * Get combined CSS classes for the loading state
     */
    getLoadingClasses(): string {
        const classes = [];

        if (this.size !== 'md') {
            classes.push(`loading-${this.size}`);
        }

        if (!this.showText) {
            classes.push('loading-spinner-only');
        }

        return classes.join(' ');
    }
}