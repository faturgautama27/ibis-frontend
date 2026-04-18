# IBIS Design System Foundation

## Overview

The IBIS Inventory Management System design system provides a comprehensive foundation for building consistent, accessible, and visually appealing user interfaces. This design system is built on CSS custom properties and integrates seamlessly with Tailwind CSS and PrimeNG components.

## Architecture

### Foundation Layer
- **Design Tokens** (`_tokens.scss`): CSS custom properties for colors, typography, spacing, shadows, and borders
- **Theme System** (`_theme.scss`): Centralized theme management with light mode support and dark mode extensibility
- **Configuration** (`_config.scss`): Utility mixins, responsive breakpoints, and component configuration maps

### Component Layer
- **Typography System** (`_typography.scss`): Consistent text styling with responsive adjustments
- **Spacing Utilities** (`_spacing.scss`): Margin, padding, and gap utilities using the design token scale
- **Core Components** (`_components.scss`): Enhanced styling for buttons, cards, forms, tables, and status components
- **Navigation Components** (`_navigation.scss`): Sidebar, page headers, modals, breadcrumbs, and pagination

## Key Features

### Color System
- **Primary Colors**: Sky blue variants (50-900) for professional appearance
- **Semantic Colors**: Success (green), Warning (amber), Error (red), Info (blue)
- **Neutral Colors**: Gray scale (50-900) for backgrounds, borders, and text
- **WCAG AA Compliant**: All color combinations meet accessibility standards

### Typography Scale
- **Font Family**: Inter with system font fallbacks
- **Font Sizes**: 12px to 48px scale (xs to 5xl)
- **Font Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)
- **Line Heights**: Tight (1.25), Snug (1.375), Normal (1.5), Relaxed (1.625)

### Spacing System
- **Base Scale**: 4px increments (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px)
- **Component Presets**: xs (8px), sm (12px), md (16px), lg (24px), xl (32px)
- **Responsive**: Mobile-optimized spacing adjustments

### Component Tokens
- **Buttons**: Border widths, focus rings, hover transforms, disabled states
- **Cards**: Shadows, hover effects, border configurations
- **Forms**: Focus states, validation styling, error messaging
- **Tables**: Row hover effects, header styling, responsive behavior
- **Navigation**: Icon sizes, spacing, active states, transitions

### Animation System
- **Durations**: Fast (150ms), Normal (200ms), Slow (300ms), Slower (400ms)
- **Easing Functions**: Ease-in, Ease-out, Ease-in-out
- **Keyframes**: Fade-in, Slide-in, Slide-up, Scale-in, Spin, Pulse, Loading
- **Hover Effects**: Subtle transforms and shadow changes

### Accessibility Features
- **Focus Management**: Consistent focus rings and keyboard navigation
- **Screen Reader Support**: Visually hidden utilities and semantic markup
- **High Contrast**: Support for high contrast mode preferences
- **Reduced Motion**: Respects user motion preferences
- **Touch Targets**: Minimum 44px touch targets for mobile accessibility

## Tailwind CSS Integration

The design system is fully integrated with Tailwind CSS through custom configuration:

```javascript
// All design tokens are available as Tailwind utilities
bg-primary-500     // Background color
text-gray-700      // Text color
p-md              // Padding medium (16px)
rounded-lg        // Border radius large
shadow-card       // Card shadow
transition-normal // Normal duration transition
```

### Custom Utilities
- **Component Spacing**: `spacing-xs`, `spacing-sm`, `spacing-md`, `spacing-lg`, `spacing-xl`
- **Animation Classes**: `animate-fade-in`, `animate-slide-in`, `animate-scale-in`
- **Gradient Backgrounds**: `bg-gradient-primary`, `bg-gradient-success`
- **Accessibility**: `min-h-touch-target`, `min-w-click-target`

## Usage Examples

### Button Component
```html
<button class="btn btn-primary btn-md">
  Primary Button
</button>

<button class="btn btn-secondary btn-sm">
  Secondary Button
</button>
```

### Card Component
```html
<div class="card card-hover">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-subtitle">Card subtitle</p>
  </div>
  <div class="card-body">
    Card content goes here
  </div>
</div>
```

### Form Components
```html
<div class="form-group">
  <label class="form-label required">Email Address</label>
  <input type="email" class="form-input" placeholder="Enter email">
  <small class="form-error">Please enter a valid email</small>
</div>
```

### Status Tags
```html
<span class="status-tag status-success">Active</span>
<span class="status-tag status-warning">Pending</span>
<span class="status-tag status-error">Failed</span>
```

## Responsive Design

The design system includes comprehensive responsive utilities:

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Mobile Optimizations
- Reduced padding and margins
- Stacked layouts for complex components
- Touch-friendly button sizes (44px minimum)
- Simplified navigation patterns

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Custom Properties**: Full support required
- **CSS Grid & Flexbox**: Full support required
- **CSS Animations**: Full support with reduced motion fallbacks

## Performance

- **CSS Bundle Size**: Optimized for minimal impact
- **Animation Performance**: 60fps target with GPU acceleration
- **Loading Strategy**: Critical CSS inlined, non-critical deferred
- **Caching**: Long-term caching with content hashing

## Development Guidelines

### Adding New Components
1. Define component tokens in `_tokens.scss`
2. Create component styles in `_components.scss`
3. Add Tailwind utilities in `tailwind.config.js`
4. Document usage patterns and examples

### Color Usage
- Use semantic colors for status and feedback
- Use primary colors for interactive elements
- Use neutral colors for text and backgrounds
- Ensure WCAG AA contrast ratios

### Animation Guidelines
- Keep animations subtle and purposeful
- Use consistent durations and easing
- Respect reduced motion preferences
- Test performance on lower-end devices

## Future Enhancements

### Planned Features
- **Dark Mode**: Complete dark theme implementation
- **Additional Components**: Data visualization, advanced forms
- **Micro-interactions**: Enhanced hover and focus states
- **Performance Monitoring**: Bundle size and runtime metrics

### Extensibility
The design system is built for extensibility:
- CSS custom properties allow runtime theming
- Modular SCSS architecture supports selective imports
- Tailwind configuration enables custom utility generation
- Component tokens provide granular customization

## Support

For questions, issues, or contributions to the design system:
- Review existing components in the `design-system/` directory
- Follow established patterns for consistency
- Test across all supported browsers and devices
- Ensure accessibility compliance with WCAG AA standards

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Compatibility**: Angular 20.3.0, PrimeNG 20.4.0, Tailwind CSS 4.x