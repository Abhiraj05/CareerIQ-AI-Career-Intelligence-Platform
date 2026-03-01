/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#09090f',
        surface: '#111118',
        surface2: '#1a1a24',
        border: 'rgba(255,255,255,0.07)',
        accent: '#7c6dfa',
        accent2: '#38e2c7',
        accent3: '#f97aad',
        muted: '#6b6b80',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 2s ease infinite',
        'float': 'float 3s ease infinite',
        'glow': 'glow 3s ease infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'border-pulse': 'borderPulse 3s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,109,250,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,109,250,0.6)' },
        },
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(124,109,250,0.3)' },
          '50%': { borderColor: 'rgba(124,109,250,0.8)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,109,250,0.3), transparent)',
      },
      boxShadow: {
        'accent': '0 0 30px rgba(124,109,250,0.15)',
        'accent-lg': '0 8px 32px rgba(124,109,250,0.3)',
        'card': '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}