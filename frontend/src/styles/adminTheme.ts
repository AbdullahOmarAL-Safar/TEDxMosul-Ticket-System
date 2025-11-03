/**
 * TEDx Admin Panel Design System
 * Clean, modern, and professional design tokens
 */

export const AdminTheme = {
    // Color Palette
    colors: {
        // Primary
        primary: '#e62b1e',
        primaryHover: '#c51000',
        primaryLight: '#ff4b2b',
        primaryGradient: 'linear-gradient(135deg, #e62b1e 0%, #ff4b2b 100%)',

        // Neutrals
        black: '#000000',
        textDark: '#222222',
        textMedium: '#444444',
        textMuted: '#888888',
        textLight: '#aaaaaa',

        // Backgrounds
        bgPrimary: '#ffffff',
        bgSecondary: '#f8f8f8',
        bgTertiary: '#fafafa',
        bgHover: '#fff3f3',
        bgActive: '#ffe8e6',

        // Borders & Dividers
        borderLight: '#e0e0e0',
        borderMedium: '#d0d0d0',
        borderDark: '#999999',

        // Status Colors
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545',
        info: '#0066cc',

        // Semantic
        white: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Typography
    typography: {
        fontFamily: {
            primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
            mono: 'Consolas, Monaco, "Courier New", monospace',
        },
        fontSize: {
            xs: '12px',
            sm: '13px',
            base: '15px',
            md: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '28px',
            '4xl': '32px',
            '5xl': '36px',
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            black: 900,
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },

    // Spacing (based on 8px grid)
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px',
        '7xl': '64px',
    },

    // Border Radius
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        base: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },

    // Layout
    layout: {
        sidebarWidth: '280px',
        sidebarWidthMobile: '240px',
        headerHeight: '64px',
        maxContentWidth: '1400px',
        containerPadding: '32px',
        containerPaddingMobile: '20px',
    },

    // Transitions
    transitions: {
        fast: '0.15s ease-in-out',
        base: '0.2s ease-in-out',
        slow: '0.3s ease-in-out',
    },

    // Z-Index
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },

    // Breakpoints
    breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
} as const;

export type AdminThemeType = typeof AdminTheme;
