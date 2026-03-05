/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0C0F17',
          card: '#13161F',
          sidebar: '#0E1119',
          hover: '#1A1E2C',
          elevated: '#1C2030',
        },
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
        },
        primary: {
          DEFAULT: '#4285F4',
          dim: '#3A76DB',
          muted: '#2B5BAF',
          glow: 'rgba(66,133,244,0.15)',
          soft: 'rgba(66,133,244,0.08)',
        },
        text: {
          primary: '#E4E7EE',
          secondary: '#8791A8',
          muted: '#464F65',
        },
        success: '#34A853',
        danger: '#EA4335',
        warning: '#FBBC05',
        border: {
          DEFAULT: '#1C2033',
          bright: '#282D42',
        },
      },
      fontFamily: {
        heading: ['Urbanist', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'primary-glow': '0 0 20px rgba(66,133,244,0.2)',
        'primary-glow-lg': '0 0 40px rgba(66,133,244,0.15), 0 0 80px rgba(66,133,244,0.05)',
        modal: '0 25px 60px rgba(0,0,0,0.7), 0 0 1px rgba(255,255,255,0.05)',
        'input-focus': '0 0 0 3px rgba(66,133,244,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-up-mobile': 'slideUpMobile 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        'stagger-in': 'staggerIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'check-pop': 'checkPop 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUpMobile: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        staggerIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        checkPop: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
