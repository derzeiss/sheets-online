import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.ts', './app/**/*.tsx', './app/app.css'],
  theme: {
    container: {
      center: true,
      padding: 'clamp(16px, 5vw, 64px)',
    },
  },
  plugins: [],
} satisfies Config;
