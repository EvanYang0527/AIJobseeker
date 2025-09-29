/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      colors: {
        // Neumorphism color system
        'neuro': {
          'bg': '#f0f0f3',
          'bg-light': '#ffffff',
          'bg-dark': '#d1d9e6',
          'shadow-light': '#ffffff',
          'shadow-dark': '#babecc',
          'text': '#2d3748',
          'text-light': '#718096',
          'text-muted': '#a0aec0',
          'primary': '#667eea',
          'primary-light': '#764ba2',
          'secondary': '#f093fb',
          'success': '#48bb78',
          'warning': '#ed8936',
          'error': '#f56565',
        },
        // Legacy color support
        'oxford-blue': '#002244',
        'electric-blue': '#009FDA',
        'enterprise-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'enterprise-success': '#10b981',
        'enterprise-warning': '#f59e0b',
        'enterprise-error': '#ef4444',
      },
      boxShadow: {
        // Neumorphism shadows
        'neuro': '8px 8px 16px #babecc, -8px -8px 16px #ffffff',
        'neuro-inset': 'inset 8px 8px 16px #babecc, inset -8px -8px 16px #ffffff',
        'neuro-hover': '12px 12px 24px #babecc, -12px -12px 24px #ffffff',
        'neuro-pressed': 'inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff',
        'neuro-small': '4px 4px 8px #babecc, -4px -4px 8px #ffffff',
        'neuro-large': '16px 16px 32px #babecc, -16px -16px 32px #ffffff',
        
        // Colored shadows for accent elements
        'neuro-primary': '8px 8px 16px rgba(102, 126, 234, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neuro-success': '8px 8px 16px rgba(72, 187, 120, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neuro-warning': '8px 8px 16px rgba(237, 137, 54, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neuro-error': '8px 8px 16px rgba(245, 101, 101, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.8)',
      },
      borderRadius: {
        'neuro': '20px',
        'neuro-sm': '12px',
        'neuro-lg': '28px',
        'neuro-xl': '36px',
      },
      animation: {
        'neuro-pulse': 'neuro-pulse 2s ease-in-out infinite',
        'neuro-float': 'neuro-float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        'neuro-pulse': {
          '0%, 100%': { 
            boxShadow: '8px 8px 16px #babecc, -8px -8px 16px #ffffff' 
          },
          '50%': { 
            boxShadow: '12px 12px 24px #babecc, -12px -12px 24px #ffffff' 
          },
        },
        'neuro-float': {
          '0%, 100%': { 
            transform: 'translateY(0px)',
            boxShadow: '8px 8px 16px #babecc, -8px -8px 16px #ffffff'
          },
          '50%': { 
            transform: 'translateY(-8px)',
            boxShadow: '12px 12px 24px #babecc, -12px -12px 24px #ffffff'
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};