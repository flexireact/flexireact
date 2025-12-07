import type { Config } from 'tailwindcss';
import { flexiUIPlugin } from './src/tailwind';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [flexiUIPlugin],
};

export default config;
