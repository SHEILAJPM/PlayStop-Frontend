/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 500: '#2563eb', 600: '#1d4ed8', 700: '#1e40af' },
        secondary: { 500: '#6366f1', 600: '#4f46e5' },
        dark: { bg: '#0f172a', card: '#1e293b', border: '#334155' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'floatY 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.6s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        floatY: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59,130,246,.45), 0 0 24px 2px rgba(59,130,246,.45)' },
          '50%': { boxShadow: '0 0 0 6px rgba(59,130,246,0), 0 0 36px 6px rgba(59,130,246,.45)' },
        },
        gradientShift: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
    },
  },
  plugins: [],
}
