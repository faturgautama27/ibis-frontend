# Status and Feedback Components

This document describes the status and feedback components implemented for Task 3 of the UI/UX revamp project.

## Overview

The status and feedback components provide consistent visual feedback to users about system states, loading processes, and empty content scenarios. These components follow the design system tokens and provide a cohesive user experience across all modules.

## Components

### 1. StatusBadgeComponent (`app-status-badge`)

Enhanced status badge component with semantic colors and consistent styling.

#### Features
- **Semantic Colors**: Success, warning, error, info, and secondary variants
- **Auto Severity**: Automatically determines color based on status text
- **Size Variants**: Small, medium, and large sizes
- **Interactive Mode**: Clickable badges with hover effects
- **Icon Support**: Optional icons with proper alignment
- **Rounded Styling**: Fully rounded corners by default

#### Usage
```html
<!-- Basic usage -->
<app-status-badge label="Active" severity="success" [rounded]="true"></app-status-badge>

<!-- Auto severity based on status text -->
<app-status-badge 
  label="Pending Review" 
  status="pending review" 
  [autoSeverity]="true"
  [rounded]="true">
</app-status-badge>

<!-- Interactive badge -->
<app-status-badge 
  label="Filter Active" 
  severity="info" 
  [interactive]="true"
  icon="pi pi-filter"
  (click)="toggleFilter()">
</app-status-badge>
```

#### Properties
- `label: string` - Text to display
- `status?: string` - Status value for auto-severity determination
- `severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary'` - Color variant
- `icon?: string` - PrimeIcons class name
- `rounded: boolean` - Whether to use rounded corners (default: true)
- `size: 'sm' | 'md' | 'lg'` - Size variant (default: 'md')
- `interactive: boolean` - Whether badge is clickable (default: false)
- `autoSeverity: boolean` - Auto-determine severity from status text

### 2. LoadingSpinnerComponent (`app-loading-spinner`)

Consistent loading spinner with multiple size and color variants.

#### Features
- **Size Variants**: Small, medium, large, and extra-large
- **Color Variants**: Primary, success, warning, danger, and white
- **Positioning Options**: Centered and overlay modes
- **Accessibility**: Proper ARIA labels and screen reader support
- **Reduced Motion**: Respects user's motion preferences

#### Usage
```html
<!-- Basic spinner -->
<app-loading-spinner size="md" color="primary"></app-loading-spinner>

<!-- Centered spinner -->
<app-loading-spinner [centered]="true" size="lg"></app-loading-spinner>

<!-- Full overlay spinner -->
<app-loading-spinner [overlay]="true" loadingText="Loading data..."></app-loading-spinner>
```

#### Properties
- `size: 'sm' | 'md' | 'lg' | 'xl'` - Spinner size (default: 'md')
- `color: 'primary' | 'success' | 'warning' | 'danger' | 'white'` - Color variant
- `centered: boolean` - Whether to center the spinner (default: false)
- `overlay: boolean` - Whether to show as full overlay (default: false)
- `loadingText: string` - Text for screen readers (default: 'Loading...')
- `ariaLabel: string` - ARIA label for accessibility

### 3. SkeletonLoaderComponent (`app-skeleton-loader`)

Flexible skeleton loader for content placeholders.

#### Features
- **Multiple Variants**: Text, title, subtitle, avatar, button, card, table-row, image
- **Size Options**: Different sizes for avatar, button, and image variants
- **Animation Types**: Wave, pulse, or no animation
- **Custom Dimensions**: Override width and height
- **Accessibility**: Proper ARIA labels and loading text

#### Usage
```html
<!-- Text skeleton -->
<app-skeleton-loader variant="text"></app-skeleton-loader>

<!-- Avatar skeleton -->
<app-skeleton-loader variant="avatar" size="lg"></app-skeleton-loader>

<!-- Custom dimensions -->
<app-skeleton-loader 
  variant="custom" 
  width="200px" 
  height="100px"
  animation="pulse">
</app-skeleton-loader>
```

#### Properties
- `variant: 'text' | 'title' | 'subtitle' | 'avatar' | 'button' | 'card' | 'table-row' | 'image' | 'custom'`
- `size: 'sm' | 'md' | 'lg' | 'xl'` - Size for certain variants
- `animation: 'wave' | 'pulse' | 'none'` - Animation type (default: 'wave')
- `width?: string` - Custom width
- `height?: string` - Custom height
- `lines: number` - Number of lines for text variant (default: 1)

### 4. SkeletonGroupComponent (`app-skeleton-group`)

Pre-configured skeleton layouts for common content types.

#### Features
- **Layout Types**: Table, card, list, form, dashboard, and custom
- **Configurable Items**: Adjustable number of rows, items, fields, etc.
- **Responsive Design**: Adapts to different screen sizes
- **Consistent Styling**: Matches the design system

#### Usage
```html
<!-- Table skeleton -->
<app-skeleton-group type="table" [rows]="5"></app-skeleton-group>

<!-- Card skeleton -->
<app-skeleton-group type="card" [lines]="4"></app-skeleton-group>

<!-- List skeleton -->
<app-skeleton-group type="list" [items]="3" avatarSize="md"></app-skeleton-group>

<!-- Dashboard skeleton -->
<app-skeleton-group type="dashboard" [stats]="4"></app-skeleton-group>
```

#### Properties
- `type: 'table' | 'card' | 'list' | 'form' | 'dashboard' | 'custom'` - Layout type
- `rows: number` - Number of table rows (default: 5)
- `lines: number` - Number of card lines (default: 3)
- `items: number` - Number of list items (default: 5)
- `fields: number` - Number of form fields (default: 4)
- `stats: number` - Number of dashboard stats (default: 4)
- `avatarSize: 'sm' | 'md' | 'lg' | 'xl'` - Avatar size for list type

### 5. EmptyStateComponent (`app-empty-state`)

Attractive empty state designs with guidance and actions.

#### Features
- **Context Variants**: Default, table, card, and page contexts
- **Color Variants**: Default, primary, success, warning, danger, info
- **Size Options**: Small, medium, and large
- **Action Buttons**: Primary and secondary action support
- **Custom Content**: Slot for additional content
- **Responsive Design**: Mobile-friendly layouts

#### Usage
```html
<!-- Basic empty state -->
<app-empty-state
  icon="pi pi-inbox"
  title="No Items Found"
  description="Your inventory is empty. Add your first item to get started."
  primaryActionLabel="Add Item"
  primaryActionIcon="pi pi-plus"
  (primaryAction)="addItem()">
</app-empty-state>

<!-- Search results empty state -->
<app-empty-state
  variant="info"
  icon="pi pi-search"
  title="No Results"
  description="Try adjusting your search criteria."
  primaryActionLabel="Clear Search"
  secondaryActionLabel="Reset Filters"
  (primaryAction)="clearSearch()"
  (secondaryAction)="resetFilters()">
</app-empty-state>

<!-- Error empty state -->
<app-empty-state
  context="card"
  variant="danger"
  icon="pi pi-exclamation-triangle"
  title="Failed to Load"
  description="Something went wrong."
  primaryActionLabel="Retry"
  (primaryAction)="retry()">
</app-empty-state>
```

#### Properties
- `icon?: string` - PrimeIcons class name
- `title?: string` - Main title text
- `description?: string` - Description text
- `size: 'sm' | 'md' | 'lg'` - Size variant (default: 'md')
- `context: 'default' | 'table' | 'card' | 'page'` - Context styling
- `variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'` - Color variant
- `primaryActionLabel?: string` - Primary button text
- `primaryActionIcon?: string` - Primary button icon
- `secondaryActionLabel?: string` - Secondary button text
- `secondaryActionIcon?: string` - Secondary button icon
- Action button states: `disabled` and `loading` for both primary and secondary

#### Events
- `primaryAction: EventEmitter<void>` - Primary action click
- `secondaryAction: EventEmitter<void>` - Secondary action click

### 6. ButtonLoadingComponent (`app-button-loading`)

Loading state component for buttons.

#### Features
- **Size Variants**: Small, medium, and large
- **Color Options**: Primary, success, warning, danger, white
- **Text Options**: Show or hide loading text
- **Accessibility**: Proper ARIA labels

#### Usage
```html
<!-- Inside button template -->
<p-button [disabled]="loading">
  <app-button-loading 
    *ngIf="loading"
    size="md"
    color="white"
    loadingText="Saving..."
    [showText]="true">
  </app-button-loading>
  <span *ngIf="!loading">Save Changes</span>
</p-button>
```

## Design System Integration

All components follow the design system tokens defined in `_tokens.scss`:

- **Colors**: Use semantic color variables (`--success-*`, `--warning-*`, etc.)
- **Typography**: Follow typography scale and font weights
- **Spacing**: Use consistent spacing scale
- **Shadows**: Apply appropriate shadow levels
- **Border Radius**: Use consistent border radius values
- **Animations**: Respect motion preferences and use standard durations

## Accessibility Features

- **ARIA Labels**: All components include proper ARIA labels
- **Screen Reader Support**: Loading text and status information for screen readers
- **Keyboard Navigation**: Interactive elements support keyboard navigation
- **Focus Management**: Proper focus indicators and management
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Color Contrast**: All color combinations meet WCAG AA standards

## Usage Guidelines

### When to Use Status Badges
- Order status, task status, user status
- Filter indicators and active states
- System health and monitoring displays
- Progress indicators in workflows

### When to Use Loading States
- **Spinners**: Quick operations (< 3 seconds)
- **Skeletons**: Content loading, especially tables and cards
- **Button Loading**: Form submissions and actions
- **Overlay Loading**: Full-page operations

### When to Use Empty States
- **No Data**: First-time user experience
- **No Results**: Search and filter results
- **Error States**: Failed data loading
- **Maintenance**: System maintenance messages

## Examples

See `StatusFeedbackExamplesComponent` for practical usage examples in real scenarios:
- Order management with status badges
- Data loading with different loading states
- Empty state scenarios with appropriate actions
- Interactive status management

## Requirements Fulfilled

This implementation fulfills the following requirements:

### Status Badge Enhancement (Requirements 27.1-27.6)
- ✅ Enhanced styling to status tags
- ✅ Distinct colors for different status types
- ✅ Readable and prominent status tags
- ✅ Consistent status tag styling across all pages
- ✅ Rounded corners for status tags
- ✅ Status colors aligned with overall color palette

### Loading States (Requirements 11.1-11.6)
- ✅ Loading spinner and skeleton displays
- ✅ Skeleton loaders for table and card content
- ✅ Loading state on buttons during async operations
- ✅ Consistent loading indicator styling
- ✅ Centered and visible loading indicators
- ✅ Loading indicators matching design aesthetic

### Empty States (Requirements 12.1-12.6)
- ✅ Empty state with icon and message for tables
- ✅ Empty state with guidance for lists
- ✅ Appropriate icons for empty states
- ✅ Helpful messages in empty states
- ✅ Action buttons in empty states where applicable
- ✅ Consistent empty state styling across all pages

## Browser Support

All components are tested and supported in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Lightweight**: Minimal CSS and JavaScript footprint
- **Tree Shakable**: Components can be imported individually
- **Efficient Animations**: CSS-based animations with GPU acceleration
- **Lazy Loading**: Components support lazy loading patterns
- **Memory Efficient**: No memory leaks in animations or timers