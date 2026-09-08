/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'me-bg': '#0a0806',
        'me-parchment': '#1a1510',
        'me-border': '#3d3425',
        'me-gold': '#c9a84c',
        'me-gold-dim': '#6b5a3e',
        'me-text': '#b8a88e',
        'me-muted': '#5a4e3a',
        'me-shire': '#4a6741',
        'me-path': '#6b8f3c',
        'me-teal': '#5aaa8a',
        'me-danger': '#c94c4c',
        'me-warning': '#c97a5a',
        'me-river': '#4a9aaa',
      },
      fontFamily: {
        'display': ['"Cinzel Decorative"', 'Georgia', 'serif'],
        'heading': ['Cinzel', 'Georgia', 'serif'],
        'body': ['"Crimson Text"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
