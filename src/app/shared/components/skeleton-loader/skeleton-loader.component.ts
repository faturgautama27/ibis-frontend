import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Loader Component
 * Reusable skeleton loader for content placeholders
 * 
 * Requirements: 11.2, 11.4, 11.5, 11.6 - Skeleton loaders for tables and cards
 */
@Component({
    selector: 'app-skeleton-loader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="skeleton-loader"
      [class]="getSkeletonClasses()"
      [style.width]="width"
      [style.height]="height"
      [attr.aria-label]="ariaLabel"
      role="status">
      <span class="visually-hidden">{{ loadingText }}</span>
    </div>
  `,
    styles: [`
    .skeleton-loader {
      background: linear-gradient(
        90deg,
        var(--gray-200) 25%,
        var(--gray-100) 50%,
        var(--gray-200) 75%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-md);
      animation: loading 1.5s infinite;
      display: block;
    }

    /* Skeleton variants */
    .skeleton-text {
      height: 1rem;
      margin-bottom: var(--space-2);
    }

    .skeleton-text:last-child {
      margin-bottom: 0;
    }

    .skeleton-title {
      height: 1.5rem;
      width: 60%;
      margin-bottom: var(--space-4);
    }

    .skeleton-subtitle {
      height: 1.25rem;
      width: 40%;
      margin-bottom: var(--space-3);
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
    }

    .skeleton-avatar.avatar-sm {
      width: 32px;
      height: 32px;
    }

    .skeleton-avatar.avatar-lg {
      width: 56px;
      height: 56px;
    }

    .skeleton-avatar.avatar-xl {
      width: 80px;
      height: 80px;
    }

    .skeleton-button {
      height: 2.5rem;
      width: 6rem;
      border-radius: var(--radius-md);
    }

    .skeleton-button.button-sm {
      height: 2rem;
      width: 4rem;
    }

    .skeleton-button.button-lg {
      height: 3rem;
      width: 8rem;
    }

    .skeleton-card {
      height: 8rem;
      border-radius: var(--radius-lg);
    }

    .skeleton-table-row {
      height: 3rem;
      margin-bottom: var(--space-1);
    }

    .skeleton-table-row:last-child {
      margin-bottom: 0;
    }

    .skeleton-image {
      width: 100%;
      height: 12rem;
      border-radius: var(--radius-md);
    }

    .skeleton-image.image-sm {
      height: 6rem;
    }

    .skeleton-image.image-lg {
      height: 16rem;
    }

    /* Animation variants */
    .skeleton-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-wave {
      animation: loading 1.5s infinite;
    }

    .skeleton-none {
      animation: none;
      background: var(--gray-200);
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .skeleton-loader {
        animation: none;
        background: var(--gray-200);
      }
    }
  `]
})
export class SkeletonLoaderComponent {
    /**
     * Skeleton variant type
     */
    @Input() variant: 'text' | 'title' | 'subtitle' | 'avatar' | 'button' | 'card' | 'table-row' | 'image' | 'custom' = 'text';

    /**
     * Size variant for certain types
     */
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    /**
     * Animation type
     */
    @Input() animation: 'wave' | 'pulse' | 'none' = 'wave';

    /**
     * Custom width (overrides variant defaults)
     */
    @Input() width?: string;

    /**
     * Custom height (overrides variant defaults)
     */
    @Input() height?: string;

    /**
     * Number of skeleton lines (for text variant)
     */
    @Input() lines = 1;

    /**
     * Loading text for screen readers
     */
    @Input() loadingText = 'Loading content...';

    /**
     * ARIA label for accessibility
     */
    @Input() ariaLabel = 'Loading placeholder';

    /**
     * Get combined CSS classes for the skeleton
     */
    getSkeletonClasses(): string {
        const classes = [`skeleton-${this.variant}`];

        if (this.variant === 'avatar' || this.variant === 'button' || this.variant === 'image') {
            if (this.size !== 'md') {
                classes.push(`${this.variant.replace('-', '')}-${this.size}`);
            }
        }

        if (this.animation !== 'wave') {
            classes.push(`skeleton-${this.animation}`);
        }

        return classes.join(' ');
    }
}