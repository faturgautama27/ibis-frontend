// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            // Custom color palette using CSS custom properties
            colors: {
                primary: {
                    50: 'var(--primary-50)',
                    100: 'var(--primary-100)',
                    200: 'var(--primary-200)',
                    300: 'var(--primary-300)',
                    400: 'var(--primary-400)',
                    500: 'var(--primary-500)',
                    600: 'var(--primary-600)',
                    700: 'var(--primary-700)',
                    800: 'var(--primary-800)',
                    900: 'var(--primary-900)',
                },
                success: {
                    50: 'var(--success-50)',
                    100: 'var(--success-100)',
                    200: 'var(--success-200)',
                    300: 'var(--success-300)',
                    400: 'var(--success-400)',
                    500: 'var(--success-500)',
                    600: 'var(--success-600)',
                    700: 'var(--success-700)',
                    800: 'var(--success-800)',
                    900: 'var(--success-900)',
                },
                warning: {
                    50: 'var(--warning-50)',
                    100: 'var(--warning-100)',
                    200: 'var(--warning-200)',
                    300: 'var(--warning-300)',
                    400: 'var(--warning-400)',
                    500: 'var(--warning-500)',
                    600: 'var(--warning-600)',
                    700: 'var(--warning-700)',
                    800: 'var(--warning-800)',
                    900: 'var(--warning-900)',
                },
                error: {
                    50: 'var(--error-50)',
                    100: 'var(--error-100)',
                    200: 'var(--error-200)',
                    300: 'var(--error-300)',
                    400: 'var(--error-400)',
                    500: 'var(--error-500)',
                    600: 'var(--error-600)',
                    700: 'var(--error-700)',
                    800: 'var(--error-800)',
                    900: 'var(--error-900)',
                },
                info: {
                    50: 'var(--info-50)',
                    100: 'var(--info-100)',
                    200: 'var(--info-200)',
                    300: 'var(--info-300)',
                    400: 'var(--info-400)',
                    500: 'var(--info-500)',
                    600: 'var(--info-600)',
                    700: 'var(--info-700)',
                    800: 'var(--info-800)',
                    900: 'var(--info-900)',
                },
                gray: {
                    50: 'var(--gray-50)',
                    100: 'var(--gray-100)',
                    200: 'var(--gray-200)',
                    300: 'var(--gray-300)',
                    400: 'var(--gray-400)',
                    500: 'var(--gray-500)',
                    600: 'var(--gray-600)',
                    700: 'var(--gray-700)',
                    800: 'var(--gray-800)',
                    900: 'var(--gray-900)',
                },
            },
            // Custom font family
            fontFamily: {
                sans: 'var(--font-family)',
            },
            // Custom font sizes
            fontSize: {
                xs: 'var(--text-xs)',
                sm: 'var(--text-sm)',
                base: 'var(--text-base)',
                lg: 'var(--text-lg)',
                xl: 'var(--text-xl)',
                '2xl': 'var(--text-2xl)',
                '3xl': 'var(--text-3xl)',
                '4xl': 'var(--text-4xl)',
                '5xl': 'var(--text-5xl)',
            },
            // Custom font weights
            fontWeight: {
                normal: 'var(--font-normal)',
                medium: 'var(--font-medium)',
                semibold: 'var(--font-semibold)',
                bold: 'var(--font-bold)',
            },
            // Custom line heights
            lineHeight: {
                tight: 'var(--leading-tight)',
                snug: 'var(--leading-snug)',
                normal: 'var(--leading-normal)',
                relaxed: 'var(--leading-relaxed)',
            },
            // Custom letter spacing
            letterSpacing: {
                tight: 'var(--tracking-tight)',
                normal: 'var(--tracking-normal)',
                wide: 'var(--tracking-wide)',
            },
            // Custom spacing scale
            spacing: {
                1: 'var(--space-1)',
                2: 'var(--space-2)',
                3: 'var(--space-3)',
                4: 'var(--space-4)',
                5: 'var(--space-5)',
                6: 'var(--space-6)',
                8: 'var(--space-8)',
                10: 'var(--space-10)',
                12: 'var(--space-12)',
                16: 'var(--space-16)',
                20: 'var(--space-20)',
                // Component spacing presets
                'xs': 'var(--padding-xs)',
                'sm': 'var(--padding-sm)',
                'md': 'var(--padding-md)',
                'lg': 'var(--padding-lg)',
                'xl': 'var(--padding-xl)',
            },
            // Custom border radius
            borderRadius: {
                none: 'var(--radius-none)',
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
                full: 'var(--radius-full)',
            },
            // Custom box shadows
            boxShadow: {
                xs: 'var(--shadow-xs)',
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow-md)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
                card: 'var(--card-shadow)',
                'card-hover': 'var(--card-hover-shadow)',
                modal: 'var(--modal-shadow)',
                dropdown: 'var(--dropdown-shadow)',
            },
            // Custom animation durations
            transitionDuration: {
                fast: 'var(--duration-fast)',
                normal: 'var(--duration-normal)',
                slow: 'var(--duration-slow)',
                slower: 'var(--duration-slower)',
            },
            // Custom animation timing functions
            transitionTimingFunction: {
                'ease-in': 'var(--ease-in)',
                'ease-out': 'var(--ease-out)',
                'ease-in-out': 'var(--ease-in-out)',
            },
            // Custom z-index scale
            zIndex: {
                dropdown: 'var(--z-dropdown)',
                sticky: 'var(--z-sticky)',
                fixed: 'var(--z-fixed)',
                'modal-backdrop': 'var(--z-modal-backdrop)',
                modal: 'var(--z-modal)',
                popover: 'var(--z-popover)',
                tooltip: 'var(--z-tooltip)',
                toast: 'var(--z-toast)',
            },
            // Background patterns
            backgroundImage: {
                'grid-dark': `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
                'gradient-primary': 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                'gradient-success': 'linear-gradient(135deg, var(--success-500), var(--success-600))',
                'gradient-warning': 'linear-gradient(135deg, var(--warning-500), var(--warning-600))',
                'gradient-error': 'linear-gradient(135deg, var(--error-500), var(--error-600))',
            },
            backgroundSize: {
                grid: '40px 40px',
            },
            // Component-specific extensions
            minWidth: {
                'touch-target': 'var(--min-touch-target)',
                'click-target': 'var(--min-click-target)',
            },
            minHeight: {
                'touch-target': 'var(--min-touch-target)',
                'click-target': 'var(--min-click-target)',
            },
            maxWidth: {
                'content': 'var(--content-max-width)',
            },
            width: {
                'sidebar': 'var(--sidebar-width)',
                'sidebar-collapsed': 'var(--sidebar-collapsed-width)',
            },
            // Animation and transform utilities
            scale: {
                'hover': 'var(--hover-scale)',
                'active': 'var(--active-scale)',
                'focus': 'var(--focus-scale)',
            },
            // Additional border widths for components
            borderWidth: {
                '3': '3px',
            },
            // Backdrop blur utilities
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
            },
            // Animation keyframes
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in': {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                'loading': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
            },
            // Animation utilities
            animation: {
                'fade-in': 'fade-in var(--duration-normal) var(--ease-out)',
                'slide-in': 'slide-in var(--duration-slow) var(--ease-out)',
                'slide-up': 'slide-up var(--duration-normal) var(--ease-out)',
                'scale-in': 'scale-in var(--duration-fast) var(--ease-out)',
                'spin': 'spin 1s linear infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'loading': 'loading 1.5s infinite',
            },
        },
    },
    plugins: [
        // Add any additional Tailwind plugins here
    ],
};
