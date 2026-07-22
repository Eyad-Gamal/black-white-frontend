/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#080808',
        accent: '#c8a96e',
        glass: 'rgba(22, 22, 22, 0.82)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
      },
      backdropBlur: {
        glass: '12px',
      },
      transitionTimingFunction: {
        'ease-premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '350': '350ms',
      },
    },
  },
  plugins: [
    // RTL support plugin
    function ({ addUtilities, addVariant }) {
      // Add direction utilities
      const newUtilities = {
        '.rtl': {
          direction: 'rtl',
        },
        '.ltr': {
          direction: 'ltr',
        },
      }
      addUtilities(newUtilities)

      // Add RTL-aware spacing utilities for proper margin/padding flipping
      const rtlUtilities = {
        '.ms-auto': {
          '[dir="rtl"] &': { marginRight: 'auto' },
          '[dir="ltr"] &': { marginLeft: 'auto' },
        },
        '.me-auto': {
          '[dir="rtl"] &': { marginLeft: 'auto' },
          '[dir="ltr"] &': { marginRight: 'auto' },
        },
        '.ps-4': {
          '[dir="rtl"] &': { paddingRight: '1rem' },
          '[dir="ltr"] &': { paddingLeft: '1rem' },
        },
        '.pe-4': {
          '[dir="rtl"] &': { paddingLeft: '1rem' },
          '[dir="ltr"] &': { paddingRight: '1rem' },
        },
        '.text-start': {
          '[dir="rtl"] &': { textAlign: 'right' },
          '[dir="ltr"] &': { textAlign: 'left' },
        },
        '.text-end': {
          '[dir="rtl"] &': { textAlign: 'left' },
          '[dir="ltr"] &': { textAlign: 'right' },
        },
      }
      addUtilities(rtlUtilities)

      // Add RTL variant for conditional styling
      addVariant('rtl', '[dir="rtl"] &')
      addVariant('ltr', '[dir="ltr"] &')
    },
  ],
}