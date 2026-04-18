import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

/**
 * Skeleton Group Component
 * Renders multiple skeleton loaders for complex layouts
 * 
 * Requirements: 11.2, 11.4, 11.5, 11.6 - Skeleton loaders for tables and cards
 */
@Component({
    selector: 'app-skeleton-group',
    standalone: true,
    imports: [CommonModule, SkeletonLoaderComponent],
    template: `
    <div class="skeleton-group" [class]="getGroupClasses()">
      <!-- Table skeleton -->
      <ng-container *ngIf="type === 'table'">
        <div class="skeleton-table-header">
          <app-skeleton-loader 
            variant="text" 
            width="100%" 
            height="2.5rem">
          </app-skeleton-loader>
        </div>
        <div class="skeleton-table-body">
          <app-skeleton-loader 
            *ngFor="let row of getRowArray()" 
            variant="table-row">
          </app-skeleton-loader>
        </div>
      </ng-container>

      <!-- Card skeleton -->
      <ng-container *ngIf="type === 'card'">
        <div class="skeleton-card-header">
          <app-skeleton-loader variant="title"></app-skeleton-loader>
          <app-skeleton-loader variant="subtitle"></app-skeleton-loader>
        </div>
        <div class="skeleton-card-body">
          <app-skeleton-loader 
            *ngFor="let line of getLineArray()" 
            variant="text">
          </app-skeleton-loader>
        </div>
      </ng-container>

      <!-- List skeleton -->
      <ng-container *ngIf="type === 'list'">
        <div 
          *ngFor="let item of getItemArray()" 
          class="skeleton-list-item">
          <app-skeleton-loader 
            variant="avatar" 
            [size]="avatarSize">
          </app-skeleton-loader>
          <div class="skeleton-list-content">
            <app-skeleton-loader variant="text" width="70%"></app-skeleton-loader>
            <app-skeleton-loader variant="text" width="50%"></app-skeleton-loader>
          </div>
        </div>
      </ng-container>

      <!-- Form skeleton -->
      <ng-container *ngIf="type === 'form'">
        <div 
          *ngFor="let field of getFieldArray()" 
          class="skeleton-form-field">
          <app-skeleton-loader variant="text" width="30%" height="1rem"></app-skeleton-loader>
          <app-skeleton-loader variant="button" width="100%" height="2.5rem"></app-skeleton-loader>
        </div>
        <div class="skeleton-form-actions">
          <app-skeleton-loader variant="button" size="sm"></app-skeleton-loader>
          <app-skeleton-loader variant="button"></app-skeleton-loader>
        </div>
      </ng-container>

      <!-- Dashboard skeleton -->
      <ng-container *ngIf="type === 'dashboard'">
        <div class="skeleton-dashboard-stats">
          <app-skeleton-loader 
            *ngFor="let stat of getStatArray()" 
            variant="card">
          </app-skeleton-loader>
        </div>
        <div class="skeleton-dashboard-chart">
          <app-skeleton-loader variant="image" height="20rem"></app-skeleton-loader>
        </div>
      </ng-container>

      <!-- Custom skeleton -->
      <ng-container *ngIf="type === 'custom'">
        <ng-content></ng-content>
      </ng-container>
    </div>
  `,
    styles: [`
    .skeleton-group {
      width: 100%;
    }

    /* Table skeleton styles */
    .skeleton-table-header {
      margin-bottom: var(--space-4);
      padding: var(--padding-md);
      background-color: var(--gray-50);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    .skeleton-table-body {
      padding: var(--padding-md);
      background-color: white;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      border: 1px solid var(--gray-200);
      border-top: none;
    }

    /* Card skeleton styles */
    .skeleton-card-header {
      margin-bottom: var(--space-6);
    }

    .skeleton-card-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    /* List skeleton styles */
    .skeleton-list-item {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--padding-md);
      border-bottom: 1px solid var(--gray-100);
    }

    .skeleton-list-item:last-child {
      border-bottom: none;
    }

    .skeleton-list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* Form skeleton styles */
    .skeleton-form-field {
      margin-bottom: var(--space-6);
    }

    .skeleton-form-field app-skeleton-loader:first-child {
      margin-bottom: var(--space-2);
    }

    .skeleton-form-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: flex-end;
      margin-top: var(--space-8);
    }

    /* Dashboard skeleton styles */
    .skeleton-dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .skeleton-dashboard-chart {
      margin-top: var(--space-6);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .skeleton-dashboard-stats {
        grid-template-columns: 1fr;
      }

      .skeleton-list-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .skeleton-form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SkeletonGroupComponent {
    /**
     * Type of skeleton group to render
     */
    @Input() type: 'table' | 'card' | 'list' | 'form' | 'dashboard' | 'custom' = 'card';

    /**
     * Number of rows for table skeleton
     */
    @Input() rows = 5;

    /**
     * Number of lines for card skeleton
     */
    @Input() lines = 3;

    /**
     * Number of items for list skeleton
     */
    @Input() items = 5;

    /**
     * Number of form fields for form skeleton
     */
    @Input() fields = 4;

    /**
     * Number of stats for dashboard skeleton
     */
    @Input() stats = 4;

    /**
     * Avatar size for list skeleton
     */
    @Input() avatarSize: 'sm' | 'md' | 'lg' | 'xl' = 'md';

    /**
     * Animation type for all skeletons
     */
    @Input() animation: 'wave' | 'pulse' | 'none' = 'wave';

    /**
     * Get combined CSS classes for the group
     */
    getGroupClasses(): string {
        return `skeleton-group-${this.type}`;
    }

    /**
     * Get array for ngFor loops
     */
    getRowArray(): number[] {
        return Array(this.rows).fill(0);
    }

    getLineArray(): number[] {
        return Array(this.lines).fill(0);
    }

    getItemArray(): number[] {
        return Array(this.items).fill(0);
    }

    getFieldArray(): number[] {
        return Array(this.fields).fill(0);
    }

    getStatArray(): number[] {
        return Array(this.stats).fill(0);
    }
}