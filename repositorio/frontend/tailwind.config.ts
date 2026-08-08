import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary (Terra-cotta)
        primary: '#9f402d',
        'on-primary': '#ffffff',
        'primary-container': '#e2725b',
        'on-primary-container': '#5a0d02',
        'inverse-primary': '#ffb4a5',
        'primary-fixed': '#ffdad3',
        'primary-fixed-dim': '#ffb4a5',
        'on-primary-fixed': '#3e0500',
        'on-primary-fixed-variant': '#802918',
        
        // Secondary (Ocean Teal)
        secondary: '#16677a',
        'on-secondary': '#ffffff',
        'secondary-container': '#a2e7fd',
        'on-secondary-container': '#1b697c',
        'secondary-fixed': '#b1ecff',
        'secondary-fixed-dim': '#8cd1e6',
        'on-secondary-fixed': '#001f27',
        'on-secondary-fixed-variant': '#004e5e',
        
        // Tertiary
        tertiary: '#8d4f11',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#cb8241',
        'on-tertiary-container': '#462200',
        'tertiary-fixed': '#ffdcc3',
        'tertiary-fixed-dim': '#ffb77d',
        'on-tertiary-fixed': '#2f1500',
        'on-tertiary-fixed-variant': '#6e3900',
        
        // Error
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        
        // Background
        background: '#fbf9f8',
        'on-background': '#1b1c1c',
        
        // Surface
        surface: '#fbf9f8',
        'surface-dim': '#dbd9d9',
        'surface-bright': '#fbf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f3',
        'surface-container': '#efeded',
        'surface-container-high': '#eae8e7',
        'surface-container-highest': '#e4e2e2',
        
        // On Surface
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#56423e',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f2f0f0',
        
        // Outline
        outline: '#89726d',
        'outline-variant': '#ddc0ba',
        'surface-tint': '#9f402d',
        'surface-variant': '#e4e2e2',
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
export default config
