/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#F3F7F6',
        ink: { 900: '#0D1117', 800: '#151B23', 700: '#202832', 600: '#2C3642' },
        brand: { DEFAULT: '#0F766E', light: '#2DD4BF', dark: '#0B5A54' },
        saffron: { DEFAULT: '#F5A524', dark: '#D98A0B' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-18px) rotate(6deg)' } },
        pop: { '0%': { transform: 'scale(.4)' }, '60%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'none' } },
        drop: { from: { opacity: 0, transform: 'translateY(-8px) scale(.97)' }, to: { opacity: 1, transform: 'none' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        pop: 'pop .35s ease-out',
        slideIn: 'slideIn .6s ease-out both',
        drop: 'drop .2s ease-out both',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};
