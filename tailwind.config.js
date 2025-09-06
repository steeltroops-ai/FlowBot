/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // WORLD-CLASS PRIMARY SYSTEM (Tesla-inspired precision)
        primary: {
          50: '#f0f9ff', // Lightest tint
          100: '#e0f2fe', // Light backgrounds
          200: '#bae6fd', // Subtle accents
          300: '#7dd3fc', // Disabled states
          400: '#38bdf8', // Hover states
          500: '#0ea5e9', // Main brand color
          600: '#0284c7', // Active states
          700: '#0369a1', // Dark accents
          800: '#075985', // High contrast
          900: '#0c4a6e', // Maximum emphasis
          950: '#082f49', // Ultra dark
        },

        // SECONDARY SYSTEM (SpaceX functional minimalism)
        secondary: {
          50: '#f8fafc', // Subtle backgrounds
          100: '#f1f5f9', // Light surfaces
          200: '#e2e8f0', // Borders
          300: '#cbd5e1', // Dividers
          400: '#94a3b8', // Placeholder
          500: '#64748b', // Secondary text
          600: '#475569', // Body text
          700: '#334155', // Primary text
          800: '#1e293b', // Headings
          900: '#0f172a', // Maximum contrast
          950: '#020617', // Ultra dark
        },

        // SURFACE HIERARCHY (Apple depth principles)
        surface: {
          canvas: '#f8fafc', // Main workspace
          elevated: '#ffffff', // Cards, panels
          overlay: '#ffffff', // Modals, dropdowns
          sunken: '#f1f5f9', // Input fields
          border: '#e2e8f0', // Subtle borders
          divider: '#cbd5e1', // Clear separators
        },

        // PANEL CONTEXT SYSTEM (Google Material semantic colors)
        panel: {
          // Nodes Panel - Creation/Addition (Emerald precision)
          nodes: {
            50: '#ecfdf5', // Background tint
            100: '#d1fae5', // Elevated surface
            200: '#a7f3d0', // Subtle accent
            300: '#6ee7b7', // Border color
            400: '#34d399', // Hover state
            500: '#10b981', // Primary accent
            600: '#059669', // Active state
            700: '#047857', // High contrast
            800: '#065f46', // Maximum emphasis
            900: '#064e3b', // Ultra dark
          },
          // Settings Panel - Editing/Configuration (Amber warmth)
          settings: {
            50: '#fffbeb', // Background tint
            100: '#fef3c7', // Elevated surface
            200: '#fde68a', // Subtle accent
            300: '#fcd34d', // Border color
            400: '#fbbf24', // Hover state
            500: '#f59e0b', // Primary accent
            600: '#d97706', // Active state
            700: '#b45309', // High contrast
            800: '#92400e', // Maximum emphasis
            900: '#78350f', // Ultra dark
          },
          // Properties Panel - Flow-level (Violet sophistication)
          properties: {
            50: '#f5f3ff', // Background tint
            100: '#ede9fe', // Elevated surface
            200: '#ddd6fe', // Subtle accent
            300: '#c4b5fd', // Border color
            400: '#a78bfa', // Hover state
            500: '#8b5cf6', // Primary accent
            600: '#7c3aed', // Active state
            700: '#6d28d9', // High contrast
            800: '#5b21b6', // Maximum emphasis
            900: '#4c1d95', // Ultra dark
          },
        },

        // INTERACTIVE SYSTEM (Semantic action colors)
        interactive: {
          success: {
            50: '#f0fdf4', // Success background
            100: '#dcfce7', // Success surface
            500: '#22c55e', // Success primary
            600: '#16a34a', // Success hover
            700: '#15803d', // Success active
          },
          warning: {
            50: '#fffbeb', // Warning background
            100: '#fef3c7', // Warning surface
            500: '#f59e0b', // Warning primary
            600: '#d97706', // Warning hover
            700: '#b45309', // Warning active
          },
          danger: {
            50: '#fef2f2', // Danger background
            100: '#fecaca', // Danger surface
            500: '#ef4444', // Danger primary
            600: '#dc2626', // Danger hover
            700: '#b91c1c', // Danger active
          },
        },

        // GLASSMORPHISM SYSTEM (Apple-inspired translucency)
        glass: {
          // White translucency variants
          white: {
            10: 'rgba(255, 255, 255, 0.1)', // Subtle overlay
            20: 'rgba(255, 255, 255, 0.2)', // Light overlay
            40: 'rgba(255, 255, 255, 0.4)', // Medium overlay
            60: 'rgba(255, 255, 255, 0.6)', // Strong overlay
            80: 'rgba(255, 255, 255, 0.8)', // Heavy overlay
            90: 'rgba(255, 255, 255, 0.9)', // Maximum overlay
          },
          // Black translucency variants
          black: {
            5: 'rgba(0, 0, 0, 0.05)', // Subtle shadow
            10: 'rgba(0, 0, 0, 0.1)', // Light shadow
            15: 'rgba(0, 0, 0, 0.15)', // Medium shadow
            20: 'rgba(0, 0, 0, 0.2)', // Strong shadow
            25: 'rgba(0, 0, 0, 0.25)', // Heavy shadow
            30: 'rgba(0, 0, 0, 0.3)', // Maximum shadow
          },
          // Colored translucency for panels
          primary: {
            10: 'rgba(14, 165, 233, 0.1)', // Primary overlay
            20: 'rgba(14, 165, 233, 0.2)', // Primary medium
          },
        },

        // Legacy support (maintaining existing blue/gray for compatibility)
        blue: {
          500: '#0ea5e9', // Updated to match primary-500
          600: '#0284c7',
          700: '#0369a1',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        // ELEVATION SYSTEM (Material Design 3.0 inspired)
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-2':
          '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-3':
          '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-4':
          '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'elevation-5':
          '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'elevation-6':
          '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.08)',

        // GLASSMORPHISM SHADOWS (Apple-inspired depth)
        'glass-subtle':
          '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)',
        'glass-soft':
          '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'glass-medium':
          '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)',
        'glass-strong':
          '0 16px 64px rgba(0, 0, 0, 0.16), 0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-intense':
          '0 24px 96px rgba(0, 0, 0, 0.20), 0 12px 48px rgba(0, 0, 0, 0.10)',

        // INTERACTIVE SHADOWS (Tesla precision)
        'hover-lift':
          '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'active-press':
          '0 2px 8px rgba(0, 0, 0, 0.16), 0 1px 4px rgba(0, 0, 0, 0.12)',
        'focus-ring':
          '0 0 0 2px rgba(14, 165, 233, 0.2), 0 0 0 4px rgba(14, 165, 233, 0.1)',

        // COMPONENT-SPECIFIC SHADOWS
        'node-default':
          '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'node-hover':
          '0 8px 24px rgba(14, 165, 233, 0.15), 0 4px 12px rgba(14, 165, 233, 0.08)',
        'node-selected':
          '0 0 0 2px rgba(14, 165, 233, 0.3), 0 8px 24px rgba(14, 165, 233, 0.2)',
        'node-dragging':
          '0 16px 48px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.12)',

        'panel-float':
          '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'header-float':
          '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.03)',

        // GLASS EFFECTS
        'glass-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-border': '0 0 0 1px rgba(255, 255, 255, 0.15)',
        'glass-glow': '0 0 20px rgba(255, 255, 255, 0.08)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
