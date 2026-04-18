import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnhancedButtonComponent } from '../enhanced-button/enhanced-button.component';
import { EnhancedCardComponent } from '../enhanced-card/enhanced-card.component';
import { EnhancedFormFieldComponent } from '../enhanced-form-field/enhanced-form-field.component';
import { EnhancedTableComponent } from '../enhanced-table/enhanced-table.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { SkeletonGroupComponent } from '../skeleton-group/skeleton-group.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

/**
 * Component Showcase
 * Demonstrates the enhanced UI components working together
 * 
 * This component serves as both documentation and testing for the enhanced components
 */
@Component({
  selector: 'app-component-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EnhancedButtonComponent,
    EnhancedCardComponent,
    EnhancedFormFieldComponent,
    EnhancedTableComponent,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    SkeletonLoaderComponent,
    SkeletonGroupComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="showcase-container">
      <div class="showcase-header">
        <h1>Enhanced UI Components Showcase</h1>
        <p>Demonstration of the enhanced component library with modern styling and interactions</p>
      </div>

      <!-- Button Showcase -->
      <app-enhanced-card variant="standard" title="Enhanced Buttons" subtitle="Various button variants, sizes, and states">
        <div class="button-grid">
          <!-- Primary Buttons -->
          <div class="button-section">
            <h4>Primary Buttons</h4>
            <div class="button-row">
              <app-enhanced-button variant="primary" size="sm" label="Small" icon="pi pi-plus"></app-enhanced-button>
              <app-enhanced-button variant="primary" size="md" label="Medium" icon="pi pi-check"></app-enhanced-button>
              <app-enhanced-button variant="primary" size="lg" label="Large" icon="pi pi-save"></app-enhanced-button>
            </div>
          </div>

          <!-- Secondary Buttons -->
          <div class="button-section">
            <h4>Secondary Buttons</h4>
            <div class="button-row">
              <app-enhanced-button variant="secondary" size="sm" label="Cancel"></app-enhanced-button>
              <app-enhanced-button variant="secondary" size="md" label="Edit" icon="pi pi-pencil"></app-enhanced-button>
              <app-enhanced-button variant="secondary" size="lg" label="View Details" icon="pi pi-eye"></app-enhanced-button>
            </div>
          </div>

          <!-- Danger Buttons -->
          <div class="button-section">
            <h4>Danger Buttons</h4>
            <div class="button-row">
              <app-enhanced-button variant="danger" size="sm" label="Delete" icon="pi pi-trash"></app-enhanced-button>
              <app-enhanced-button variant="danger" size="md" label="Remove" icon="pi pi-times"></app-enhanced-button>
              <app-enhanced-button variant="danger" size="lg" [loading]="buttonLoading" label="Processing..."></app-enhanced-button>
            </div>
          </div>

          <!-- Text Buttons -->
          <div class="button-section">
            <h4>Text Buttons</h4>
            <div class="button-row">
              <app-enhanced-button variant="text" size="sm" label="Link"></app-enhanced-button>
              <app-enhanced-button variant="text" size="md" label="Learn More" icon="pi pi-arrow-right" iconPos="right"></app-enhanced-button>
              <app-enhanced-button variant="text" size="lg" [disabled]="true" label="Disabled"></app-enhanced-button>
            </div>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Card Showcase -->
      <div class="card-grid">
        <!-- Standard Card -->
        <app-enhanced-card variant="standard" title="Standard Card" subtitle="Basic card with hover effects">
          <p>This is a standard card with subtle shadows and hover effects. Perfect for displaying content with visual hierarchy.</p>
          <div slot="footer">
            <app-enhanced-button variant="primary" size="sm" label="Action" icon="pi pi-arrow-right"></app-enhanced-button>
          </div>
        </app-enhanced-card>

        <!-- Stats Card -->
        <app-enhanced-card variant="stats" title="Statistics Card" subtitle="Enhanced with accent styling">
          <div class="stats-content">
            <div class="stat-number">1,234</div>
            <div class="stat-label">Total Items</div>
            <div class="stat-change positive">+12% from last month</div>
          </div>
        </app-enhanced-card>

        <!-- Interactive Card -->
        <app-enhanced-card variant="interactive" [interactive]="true" title="Interactive Card" subtitle="Clickable with enhanced hover effects">
          <p>This card is interactive and responds to user interactions with enhanced animations and focus states.</p>
        </app-enhanced-card>

        <!-- Compact Card -->
        <app-enhanced-card variant="compact" title="Compact Card">
          <p>Reduced padding for dense layouts while maintaining visual appeal.</p>
        </app-enhanced-card>
      </div>

      <!-- Form Showcase -->
      <app-enhanced-card variant="standard" title="Enhanced Form Fields" subtitle="Various input types with validation states">
        <form [formGroup]="showcaseForm" class="form-showcase">
          <div class="form-row">
            <app-enhanced-form-field
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              [required]="true"
              formControlName="fullName"
              [hasError]="!!(showcaseForm.get('fullName')?.invalid && showcaseForm.get('fullName')?.touched)"
              errorMessage="Full name is required">
            </app-enhanced-form-field>

            <app-enhanced-form-field
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              icon="pi pi-envelope"
              formControlName="email"
              [hasError]="!!(showcaseForm.get('email')?.invalid && showcaseForm.get('email')?.touched)"
              errorMessage="Please enter a valid email address">
            </app-enhanced-form-field>
          </div>

          <div class="form-row">
            <app-enhanced-form-field
              type="dropdown"
              label="Department"
              placeholder="Select department"
              [options]="departmentOptions"
              formControlName="department">
            </app-enhanced-form-field>

            <app-enhanced-form-field
              type="date"
              label="Start Date"
              placeholder="Select date"
              formControlName="startDate">
            </app-enhanced-form-field>
          </div>

          <app-enhanced-form-field
            type="textarea"
            label="Description"
            placeholder="Enter description"
            [rows]="4"
            formControlName="description"
            helpText="Provide a detailed description of your request">
          </app-enhanced-form-field>

          <div class="form-actions">
            <app-enhanced-button variant="secondary" label="Cancel" (onClick)="onCancel()"></app-enhanced-button>
            <app-enhanced-button 
              variant="primary" 
              label="Submit" 
              icon="pi pi-check"
              [disabled]="showcaseForm.invalid"
              (onClick)="onSubmit()">
            </app-enhanced-button>
          </div>
        </form>
      </app-enhanced-card>

      <!-- Table Showcase -->
      <app-enhanced-table
        title="Enhanced Data Table"
        subtitle="Modern table with alternating rows, hover effects, and responsive design"
        [data]="tableData"
        [loading]="tableLoading"
        [paginator]="true"
        [rows]="5"
        [totalRecords]="tableData.length"
        [searchable]="true"
        [rowClickable]="true"
        (rowClick)="onTableRowClick($event)"
        (searchChange)="onTableSearch($event)">

        <!-- Table Actions -->
        <div slot="actions">
          <app-enhanced-button variant="primary" size="sm" label="Add New" icon="pi pi-plus" (onClick)="onAddNew()"></app-enhanced-button>
          <app-enhanced-button variant="secondary" size="sm" label="Export" icon="pi pi-download"></app-enhanced-button>
        </div>

        <!-- Table Header -->
        <th slot="header">ID</th>
        <th slot="header">Name</th>
        <th slot="header">Status</th>
        <th slot="header">Created</th>
        <th slot="header">Actions</th>

        <!-- Table Body -->
        <ng-container slot="body" *ngFor="let item of tableData">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>
            <app-status-badge 
              [label]="item.status" 
              [status]="item.status" 
              [autoSeverity]="true">
            </app-status-badge>
          </td>
          <td>{{ item.created | date:'short' }}</td>
          <td>
            <div class="table-actions">
              <app-enhanced-button variant="text" size="sm" icon="pi pi-pencil" (onClick)="onEdit(item)"></app-enhanced-button>
              <app-enhanced-button variant="text" size="sm" icon="pi pi-trash" (onClick)="onDelete(item)"></app-enhanced-button>
            </div>
          </td>
        </ng-container>

        <!-- Empty State Actions -->
        <div slot="empty-actions">
          <app-enhanced-button variant="primary" label="Create First Item" icon="pi pi-plus"></app-enhanced-button>
        </div>
      </app-enhanced-table>

      <!-- Status and Feedback Components Showcase -->
      <app-enhanced-card variant="standard" title="Status Badges" subtitle="Enhanced status indicators with semantic colors">
        <div class="status-showcase">
          <div class="status-section">
            <h4>Status Variants</h4>
            <div class="status-row">
              <app-status-badge label="Success" severity="success" icon="pi pi-check" [rounded]="true"></app-status-badge>
              <app-status-badge label="Warning" severity="warn" icon="pi pi-exclamation-triangle" [rounded]="true"></app-status-badge>
              <app-status-badge label="Error" severity="danger" icon="pi pi-times" [rounded]="true"></app-status-badge>
              <app-status-badge label="Info" severity="info" icon="pi pi-info-circle" [rounded]="true"></app-status-badge>
              <app-status-badge label="Secondary" severity="secondary" icon="pi pi-minus" [rounded]="true"></app-status-badge>
            </div>
          </div>

          <div class="status-section">
            <h4>Size Variants</h4>
            <div class="status-row">
              <app-status-badge label="Small" severity="info" size="sm" [rounded]="true"></app-status-badge>
              <app-status-badge label="Medium" severity="info" size="md" [rounded]="true"></app-status-badge>
              <app-status-badge label="Large" severity="info" size="lg" [rounded]="true"></app-status-badge>
            </div>
          </div>

          <div class="status-section">
            <h4>Auto Severity (Based on Status Text)</h4>
            <div class="status-row">
              <app-status-badge label="Completed" status="completed" [autoSeverity]="true" [rounded]="true"></app-status-badge>
              <app-status-badge label="Pending" status="pending" [autoSeverity]="true" [rounded]="true"></app-status-badge>
              <app-status-badge label="Failed" status="failed" [autoSeverity]="true" [rounded]="true"></app-status-badge>
              <app-status-badge label="Draft" status="draft" [autoSeverity]="true" [rounded]="true"></app-status-badge>
            </div>
          </div>

          <div class="status-section">
            <h4>Interactive Badges</h4>
            <div class="status-row">
              <app-status-badge label="Clickable" severity="info" [interactive]="true" [rounded]="true"></app-status-badge>
              <app-status-badge label="Active Filter" severity="success" [interactive]="true" icon="pi pi-filter" [rounded]="true"></app-status-badge>
            </div>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Loading States Showcase -->
      <app-enhanced-card variant="standard" title="Loading States" subtitle="Spinners, skeleton loaders, and button loading states">
        <div class="loading-showcase">
          <div class="loading-section">
            <h4>Loading Spinners</h4>
            <div class="loading-row">
              <div class="loading-item">
                <app-loading-spinner size="sm" color="primary"></app-loading-spinner>
                <span>Small</span>
              </div>
              <div class="loading-item">
                <app-loading-spinner size="md" color="success"></app-loading-spinner>
                <span>Medium</span>
              </div>
              <div class="loading-item">
                <app-loading-spinner size="lg" color="warning"></app-loading-spinner>
                <span>Large</span>
              </div>
              <div class="loading-item">
                <app-loading-spinner size="xl" color="danger"></app-loading-spinner>
                <span>Extra Large</span>
              </div>
            </div>
          </div>

          <div class="loading-section">
            <h4>Skeleton Loaders</h4>
            <div class="skeleton-grid">
              <div class="skeleton-item">
                <h5>Text Skeletons</h5>
                <app-skeleton-loader variant="title"></app-skeleton-loader>
                <app-skeleton-loader variant="subtitle"></app-skeleton-loader>
                <app-skeleton-loader variant="text"></app-skeleton-loader>
                <app-skeleton-loader variant="text"></app-skeleton-loader>
              </div>
              <div class="skeleton-item">
                <h5>Avatar & Button Skeletons</h5>
                <div class="skeleton-row">
                  <app-skeleton-loader variant="avatar" size="sm"></app-skeleton-loader>
                  <app-skeleton-loader variant="avatar" size="md"></app-skeleton-loader>
                  <app-skeleton-loader variant="avatar" size="lg"></app-skeleton-loader>
                </div>
                <div class="skeleton-row">
                  <app-skeleton-loader variant="button" size="sm"></app-skeleton-loader>
                  <app-skeleton-loader variant="button" size="md"></app-skeleton-loader>
                  <app-skeleton-loader variant="button" size="lg"></app-skeleton-loader>
                </div>
              </div>
            </div>
          </div>

          <div class="loading-section">
            <h4>Button Loading States</h4>
            <div class="button-loading-row">
              <app-enhanced-button 
                variant="primary" 
                size="sm" 
                [loading]="buttonLoading"
                label="Save Changes"
                (onClick)="toggleButtonLoading()">
              </app-enhanced-button>
              <app-enhanced-button 
                variant="secondary" 
                size="md" 
                [loading]="buttonLoading"
                label="Processing"
                (onClick)="toggleButtonLoading()">
              </app-enhanced-button>
              <app-enhanced-button 
                variant="danger" 
                size="lg" 
                [loading]="buttonLoading"
                label="Delete Item"
                (onClick)="toggleButtonLoading()">
              </app-enhanced-button>
            </div>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Skeleton Groups Showcase -->
      <app-enhanced-card variant="standard" title="Skeleton Groups" subtitle="Complex skeleton layouts for different content types">
        <div class="skeleton-groups-showcase">
          <div class="skeleton-group-section">
            <h4>Table Skeleton</h4>
            <app-skeleton-group type="table" [rows]="3"></app-skeleton-group>
          </div>

          <div class="skeleton-group-section">
            <h4>Card Skeleton</h4>
            <app-skeleton-group type="card" [lines]="4"></app-skeleton-group>
          </div>

          <div class="skeleton-group-section">
            <h4>List Skeleton</h4>
            <app-skeleton-group type="list" [items]="3" avatarSize="md"></app-skeleton-group>
          </div>
        </div>
      </app-enhanced-card>

      <!-- Empty States Showcase -->
      <app-enhanced-card variant="standard" title="Empty States" subtitle="Attractive empty state designs with guidance and actions">
        <div class="empty-states-showcase">
          <div class="empty-state-section">
            <h4>Table Empty State</h4>
            <app-empty-state
              context="table"
              icon="pi pi-inbox"
              title="No Data Available"
              description="There are no items to display. Start by adding your first item."
              primaryActionLabel="Add Item"
              primaryActionIcon="pi pi-plus"
              (primaryAction)="onAddNew()">
            </app-empty-state>
          </div>

          <div class="empty-state-section">
            <h4>Search Results Empty State</h4>
            <app-empty-state
              context="default"
              variant="info"
              icon="pi pi-search"
              title="No Results Found"
              description="We couldn't find any items matching your search criteria. Try adjusting your filters or search terms."
              primaryActionLabel="Clear Filters"
              secondaryActionLabel="Reset Search"
              (primaryAction)="onClearFilters()"
              (secondaryAction)="onResetSearch()">
            </app-empty-state>
          </div>

          <div class="empty-state-section">
            <h4>Error Empty State</h4>
            <app-empty-state
              context="card"
              variant="danger"
              size="sm"
              icon="pi pi-exclamation-triangle"
              title="Failed to Load"
              description="Something went wrong while loading the data."
              primaryActionLabel="Retry"
              primaryActionIcon="pi pi-refresh"
              (primaryAction)="onRetry()">
            </app-empty-state>
          </div>
        </div>
      </app-enhanced-card>
    </div>
  `,
  styles: [`
    .showcase-container {
      padding: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .showcase-header {
      text-align: center;
      margin-bottom: var(--space-8);
    }

    .showcase-header h1 {
      font-size: var(--text-4xl);
      font-weight: var(--font-bold);
      color: var(--gray-900);
      margin: 0 0 var(--space-4) 0;
    }

    .showcase-header p {
      font-size: var(--text-lg);
      color: var(--gray-600);
      margin: 0;
    }

    /* Button Showcase */
    .button-grid {
      display: grid;
      gap: var(--space-6);
    }

    .button-section h4 {
      margin: 0 0 var(--space-3) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    .button-row {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }

    /* Card Showcase */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-6);
    }

    .stats-content {
      text-align: center;
    }

    .stat-number {
      font-size: var(--text-4xl);
      font-weight: var(--font-bold);
      color: var(--primary-600);
      margin-bottom: var(--space-2);
    }

    .stat-label {
      font-size: var(--text-sm);
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
      margin-bottom: var(--space-2);
    }

    .stat-change {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
    }

    .stat-change.positive {
      color: var(--success-600);
    }

    .stat-change.negative {
      color: var(--error-600);
    }

    /* Form Showcase */
    .form-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--gray-200);
    }

    /* Table Actions */
    .table-actions {
      display: flex;
      gap: var(--space-1);
    }

    /* Status Showcase */
    .status-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .status-section h4 {
      margin: 0 0 var(--space-3) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    .status-row {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      align-items: center;
    }

    /* Loading Showcase */
    .loading-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .loading-section h4 {
      margin: 0 0 var(--space-4) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    .loading-row {
      display: flex;
      gap: var(--space-6);
      align-items: center;
      flex-wrap: wrap;
    }

    .loading-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .loading-item span {
      font-size: var(--text-sm);
      color: var(--gray-600);
    }

    .skeleton-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-6);
    }

    .skeleton-item h5 {
      margin: 0 0 var(--space-3) 0;
      font-size: var(--text-base);
      font-weight: var(--font-medium);
      color: var(--gray-700);
    }

    .skeleton-row {
      display: flex;
      gap: var(--space-3);
      align-items: center;
      margin-bottom: var(--space-3);
    }

    .button-loading-row {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    /* Skeleton Groups Showcase */
    .skeleton-groups-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .skeleton-group-section h4 {
      margin: 0 0 var(--space-4) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    /* Empty States Showcase */
    .empty-states-showcase {
      display: flex;
      flex-direction: column;
      gap: var(--space-8);
    }

    .empty-state-section h4 {
      margin: 0 0 var(--space-4) 0;
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--gray-800);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .showcase-container {
        padding: var(--space-4);
        gap: var(--space-6);
      }

      .showcase-header h1 {
        font-size: var(--text-3xl);
      }

      .showcase-header p {
        font-size: var(--text-base);
      }

      .card-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .button-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-actions {
        flex-direction: column;
      }

      .status-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .loading-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .skeleton-grid {
        grid-template-columns: 1fr;
      }

      .button-loading-row {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentShowcaseComponent {
  showcaseForm: FormGroup;
  buttonLoading = false;
  tableLoading = false;

  departmentOptions = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Sales', value: 'sales' },
    { label: 'Support', value: 'support' }
  ];

  tableData = [
    { id: 1, name: 'John Doe', status: 'Active', created: new Date('2024-01-15') },
    { id: 2, name: 'Jane Smith', status: 'Pending', created: new Date('2024-01-14') },
    { id: 3, name: 'Bob Johnson', status: 'Completed', created: new Date('2024-01-13') },
    { id: 4, name: 'Alice Brown', status: 'Cancelled', created: new Date('2024-01-12') },
    { id: 5, name: 'Charlie Wilson', status: 'Active', created: new Date('2024-01-11') }
  ];

  constructor(private fb: FormBuilder) {
    this.showcaseForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: [''],
      startDate: [''],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.showcaseForm.valid) {
      console.log('Form submitted:', this.showcaseForm.value);
      // Handle form submission
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.showcaseForm.controls).forEach(key => {
        this.showcaseForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.showcaseForm.reset();
  }

  onTableRowClick(event: { data: any, index: number }): void {
    console.log('Row clicked:', event);
  }

  onTableSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
    // Implement search logic
  }

  onAddNew(): void {
    console.log('Add new item');
  }

  onEdit(item: any): void {
    console.log('Edit item:', item);
  }

  onDelete(item: any): void {
    console.log('Delete item:', item);
  }

  toggleButtonLoading(): void {
    this.buttonLoading = !this.buttonLoading;
    if (this.buttonLoading) {
      setTimeout(() => {
        this.buttonLoading = false;
      }, 3000);
    }
  }

  onClearFilters(): void {
    console.log('Clear filters');
  }

  onResetSearch(): void {
    console.log('Reset search');
  }

  onRetry(): void {
    console.log('Retry loading');
  }
}