/**
 * @flexi/react-ui Tailwind Plugin
 * Injects design tokens and theme CSS variables
 */

import plugin from 'tailwindcss/plugin';
import { colors, radius, shadows, animation } from './theme/tokens';

export const flexiUIPlugin = plugin(
  function ({ addBase, addUtilities }) {
    // Add CSS variables for theming
    addBase({
      ':root': {
        '--flexi-bg': colors.neutral[50],
        '--flexi-bg-subtle': colors.neutral[100],
        '--flexi-bg-muted': colors.neutral[200],
        '--flexi-fg': colors.neutral[900],
        '--flexi-fg-subtle': colors.neutral[600],
        '--flexi-fg-muted': colors.neutral[400],
        '--flexi-border': colors.neutral[200],
        '--flexi-border-subtle': colors.neutral[100],
        '--flexi-primary': colors.primary[500],
        '--flexi-primary-fg': colors.neutral[900],
        '--flexi-ring': colors.primary[500],
      },
      '.dark': {
        '--flexi-bg': colors.neutral[950],
        '--flexi-bg-subtle': colors.neutral[900],
        '--flexi-bg-muted': colors.neutral[800],
        '--flexi-fg': colors.neutral[50],
        '--flexi-fg-subtle': colors.neutral[400],
        '--flexi-fg-muted': colors.neutral[500],
        '--flexi-border': colors.neutral[800],
        '--flexi-border-subtle': colors.neutral[900],
        '--flexi-primary': colors.primary[500],
        '--flexi-primary-fg': colors.neutral[900],
        '--flexi-ring': colors.primary[500],
      },
    });

    // Add glow utilities
    addUtilities({
      '.shadow-glow': {
        boxShadow: shadows.glow,
      },
      '.shadow-glow-lg': {
        boxShadow: shadows['glow-lg'],
      },
      '.text-glow': {
        textShadow: '0 0 20px rgba(0, 255, 156, 0.5)',
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          primary: colors.primary,
          neutral: colors.neutral,
        },
        borderRadius: radius,
        boxShadow: shadows,
        transitionDuration: animation.duration,
        transitionTimingFunction: animation.easing,
        keyframes: {
          'fade-in': {
            from: { opacity: '0' },
            to: { opacity: '1' },
          },
          'fade-out': {
            from: { opacity: '1' },
            to: { opacity: '0' },
          },
          'slide-in-from-top': {
            from: { transform: 'translateY(-100%)' },
            to: { transform: 'translateY(0)' },
          },
          'slide-in-from-bottom': {
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0)' },
          },
          'slide-in-from-left': {
            from: { transform: 'translateX(-100%)' },
            to: { transform: 'translateX(0)' },
          },
          'slide-in-from-right': {
            from: { transform: 'translateX(100%)' },
            to: { transform: 'translateX(0)' },
          },
          'zoom-in': {
            from: { transform: 'scale(0.95)', opacity: '0' },
            to: { transform: 'scale(1)', opacity: '1' },
          },
          'zoom-out': {
            from: { transform: 'scale(1)', opacity: '1' },
            to: { transform: 'scale(0.95)', opacity: '0' },
          },
        },
        animation: {
          'fade-in': 'fade-in 200ms ease-out',
          'fade-out': 'fade-out 200ms ease-out',
          'slide-in-from-top': 'slide-in-from-top 200ms ease-out',
          'slide-in-from-bottom': 'slide-in-from-bottom 200ms ease-out',
          'slide-in-from-left': 'slide-in-from-left 200ms ease-out',
          'slide-in-from-right': 'slide-in-from-right 200ms ease-out',
          'zoom-in': 'zoom-in 200ms ease-out',
          'zoom-out': 'zoom-out 200ms ease-out',
        },
      },
    },
  }
);

export default flexiUIPlugin;
