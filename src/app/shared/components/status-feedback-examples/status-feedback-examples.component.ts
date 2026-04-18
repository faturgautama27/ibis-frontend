import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { SkeletonGroupComponent } from '../skeleton-group/skeleton-group.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { EnhancedCardComponent } from '../enhanced-card/enhanced-card.component';
import { EnhancedButtonComponent } from '../enhanced-button/enhanced-button.component';

/**
 * Status and Feedback Examples Component
 * Practical examples of using status and feedback components in real scenarios
 * 
 * Requirements: 27.1-27.6, 11.1-11.6, 12.1-12.6 - Status and feedback component usage
 */
@Component({
    selector: 'app-status-feedback-examples',
    standalone: true,
    imports: [
        CommonModule,
        StatusBadgeComponent,
        LoadingSpinnerComponent,
        SkeletonGroupComponent,
        EmptyStateComponent,
        EnhancedCardComponent,
        EnhancedButtonComponent
    ],
    template: `
    <div class="examples-container">
      <h2>Status and Feedback Components - Real Usage Examples</h2>

      <!-- Order Status Example -->
      <app-enhanced-card title="Order Management" subtitle="Status badges in action">
        <div class="order-list">
          <div class="order-item" *ngFor="let order of orders">
            <div class="order-info">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-customer">{{ order.customer }}</span>
            </div>
            <app-status-badge 
              [label]="order.status" 
              [status]="order.status" 
              [autoSeverity]="true"
              [rounded]="true">
            </app-status-badge>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Loading States Example -->
      <app-enhanced-card title="Data Loading States" subtitle="Different loading scenarios">
        <div class="loading-examples">
          <!-- Loading with spinner -->
          <div class="loading-example" *ngIf="isLoading">
            <h4>Loading Data...</h4>
            <app-loading-spinner size="md" color="primary"></app-loading-spinner>
          </div>

          <!-- Skeleton loading -->
          <div class="loading-example" *ngIf="isSkeletonLoading">
            <h4>Loading Table Data</h4>
            <app-skeleton-group type="table" [rows]="3"></app-skeleton-group>
          </div>

          <!-- Loaded content -->
          <div class="loading-example" *ngIf="!isLoading && !isSkeletonLoading">
            <h4>Data Loaded Successfully</h4>
            <div class="data-grid">
              <div class="data-item" *ngFor="let item of loadedData">
                <span>{{ item.name }}</span>
                <app-status-badge 
                  [label]="item.status" 
                  [status]="item.status" 
                  [autoSeverity]="true"
                  size="sm"
                  [rounded]="true">
                </app-status-badge>
              </div>
            </div>
          </div>

          <!-- Loading controls -->
          <div class="loading-controls">
            <app-enhanced-button 
              variant="secondary" 
              size="sm" 
              label="Show Spinner Loading"
              (onClick)="showSpinnerLoading()">
            </app-enhanced-button>
            <app-enhanced-button 
              variant="secondary" 
              size="sm" 
              label="Show Skeleton Loading"
              (onClick)="showSkeletonLoading()">
            </app-enhanced-button>
            <app-enhanced-button 
              variant="primary" 
              size="sm" 
              label="Show Loaded Data"
              (onClick)="showLoadedData()">
            </app-enhanced-button>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Empty States Example -->
      <app-enhanced-card title="Empty State Scenarios" subtitle="Different empty state contexts">
        <div class="empty-examples">
          <!-- No search results -->
          <div class="empty-example" *ngIf="showNoResults">
            <app-empty-state
              icon="pi pi-search"
              title="No Search Results"
              description="We couldn't find any items matching 'advanced widgets'. Try a different search term."
              primaryActionLabel="Clear Search"
              secondaryActionLabel="Browse All"
              (primaryAction)="clearSearch()"
              (secondaryAction)="browseAll()">
            </app-empty-state>
          </div>

          <!-- No data available -->
          <div class="empty-example" *ngIf="showNoData">
            <app-empty-state
              context="table"
              icon="pi pi-inbox"
              title="No Inventory Items"
              description="Your inventory is empty. Start by adding your first item to get organized."
              primaryActionLabel="Add First Item"
              primaryActionIcon="pi pi-plus"
              (primaryAction)="addFirstItem()">
            </app-empty-state>
          </div>

          <!-- Error state -->
          <div class="empty-example" *ngIf="showError">
            <app-empty-state
              variant="danger"
              icon="pi pi-exclamation-triangle"
              title="Failed to Load Data"
              description="Something went wrong while loading your inventory. Please try again."
              primaryActionLabel="Retry"
              primaryActionIcon="pi pi-refresh"
              secondaryActionLabel="Contact Support"
              (primaryAction)="retryLoad()"
              (secondaryAction)="contactSupport()">
            </app-empty-state>
          </div>

          <!-- Empty state controls -->
          <div class="empty-controls">
            <app-enhanced-button 
              variant="secondary" 
              size="sm" 
              label="Show No Results"
              (onClick)="toggleNoResults()">
            </app-enhanced-button>
            <app-enhanced-button 
              variant="secondary" 
              size="sm" 
              label="Show No Data"
              (onClick)="toggleNoData()">
            </app-enhanced-button>
            <app-enhanced-button 
              variant="secondary" 
              size="sm" 
              label="Show Error"
              (onClick)="toggleError()">
            </app-enhanced-button>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Interactive Status Example -->
      <app-enhanced-card title="Interactive Status Management" subtitle="Clickable status badges with actions">
        <div class="interactive-status">
          <div class="status-item" *ngFor="let task of tasks">
            <div class="task-info">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-description">{{ task.description }}</span>
            </div>
            <app-status-badge 
              [label]="task.status" 
              [status]="task.status" 
              [autoSeverity]="true"
              [interactive]="true"
              [rounded]="true"
              (click)="changeTaskStatus(task)">
            </app-status-badge>
          </div>
        </div>
      </app-enhanced-card>
    </div>
  `,
    styles: [`
    .examples-container {
      padding: var(--space-6);
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .examples-container h2 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      margin: 0 0 var(--space-8) 0;
      text-align: center;
    }

    /* Order List Example */
    .order-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--padding-md);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background-color: var(--gray-50);
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .order-id {
      font-weight: var(--font-semibold);
      color: var(--gray-900);
    }

    .order-customer {
      font-size: var(--text-sm);
      color: var(--gray-600);
    }

    /* Loading Examples */
    .loading-examples {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .loading-example {
      padding: var(--padding-lg);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      background-color: white;
    }

    .loading-example h4 {
      margin: 0 0 var(--space-4) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    .data-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-3);
    }

    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--padding-sm);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      background-color: var(--gray-50);
    }

    .loading-controls {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      margin-top: var(--space-4);
    }

    /* Empty Examples */
    .empty-examples {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .empty-example {
      min-height: 300px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      background-color: white;
    }

    .empty-controls {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    /* Interactive Status */
    .interactive-status {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--padding-lg);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      background-color: white;
      transition: all var(--duration-fast) var(--ease-out);
    }

    .status-item:hover {
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }

    .task-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .task-title {
      font-weight: var(--font-semibold);
      color: var(--gray-900);
    }

    .task-description {
      font-size: var(--text-sm);
      color: var(--gray-600);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .examples-container {
        padding: var(--space-4);
        gap: var(--space-6);
      }

      .examples-container h2 {
        font-size: var(--text-2xl);
      }

      .order-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .status-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .loading-controls,
      .empty-controls {
        flex-direction: column;
      }

      .data-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatusFeedbackExamplesComponent {
    // Order data
    orders = [
        { id: '001', customer: 'John Doe', status: 'Completed' },
        { id: '002', customer: 'Jane Smith', status: 'Pending' },
        { id: '003', customer: 'Bob Johnson', status: 'Processing' },
        { id: '004', customer: 'Alice Brown', status: 'Cancelled' },
        { id: '005', customer: 'Charlie Wilson', status: 'Delivered' }
    ];

    // Loading states
    isLoading = false;
    isSkeletonLoading = false;

    // Loaded data
    loadedData = [
        { name: 'Widget A', status: 'Active' },
        { name: 'Widget B', status: 'Pending' },
        { name: 'Widget C', status: 'Completed' },
        { name: 'Widget D', status: 'Failed' }
    ];

    // Empty state flags
    showNoResults = false;
    showNoData = false;
    showError = false;

    // Task data
    tasks = [
        {
            title: 'Update inventory system',
            description: 'Implement new features for inventory tracking',
            status: 'In Progress'
        },
        {
            title: 'Review purchase orders',
            description: 'Approve pending purchase orders from suppliers',
            status: 'Pending'
        },
        {
            title: 'Generate monthly report',
            description: 'Create comprehensive monthly inventory report',
            status: 'Completed'
        },
        {
            title: 'Fix data sync issue',
            description: 'Resolve synchronization problems with external systems',
            status: 'Failed'
        }
    ];

    // Loading methods
    showSpinnerLoading(): void {
        this.isLoading = true;
        this.isSkeletonLoading = false;
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    }

    showSkeletonLoading(): void {
        this.isSkeletonLoading = true;
        this.isLoading = false;
        setTimeout(() => {
            this.isSkeletonLoading = false;
        }, 3000);
    }

    showLoadedData(): void {
        this.isLoading = false;
        this.isSkeletonLoading = false;
    }

    // Empty state methods
    toggleNoResults(): void {
        this.showNoResults = !this.showNoResults;
        this.showNoData = false;
        this.showError = false;
    }

    toggleNoData(): void {
        this.showNoData = !this.showNoData;
        this.showNoResults = false;
        this.showError = false;
    }

    toggleError(): void {
        this.showError = !this.showError;
        this.showNoResults = false;
        this.showNoData = false;
    }

    // Empty state actions
    clearSearch(): void {
        console.log('Search cleared');
        this.showNoResults = false;
    }

    browseAll(): void {
        console.log('Browse all items');
        this.showNoResults = false;
    }

    addFirstItem(): void {
        console.log('Add first item');
        this.showNoData = false;
    }

    retryLoad(): void {
        console.log('Retry loading');
        this.showError = false;
        this.showSpinnerLoading();
    }

    contactSupport(): void {
        console.log('Contact support');
    }

    // Interactive status methods
    changeTaskStatus(task: any): void {
        const statuses = ['Pending', 'In Progress', 'Completed', 'Failed'];
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        task.status = statuses[nextIndex];
        console.log(`Task "${task.title}" status changed to: ${task.status}`);
    }
}