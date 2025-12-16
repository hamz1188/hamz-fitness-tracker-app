import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Backgrounds - Deep purple/black cyberpunk
  background: '#0a0a0f',
  backgroundDark: '#050508',
  cardBackground: 'rgba(20, 15, 35, 0.8)',
  glassMorphism: 'rgba(255, 255, 255, 0.03)',

  // Neon Accents
  primary: '#00ffff',        // Cyan neon
  primaryGlow: 'rgba(0, 255, 255, 0.4)',
  secondary: '#ff00ff',      // Magenta/Pink neon
  secondaryGlow: 'rgba(255, 0, 255, 0.4)',
  tertiary: '#ffff00',       // Yellow neon
  tertiaryGlow: 'rgba(255, 255, 0, 0.3)',

  // Status colors with neon feel
  success: '#00ff88',        // Neon green
  successGlow: 'rgba(0, 255, 136, 0.4)',
  warning: '#ff9500',        // Neon orange
  warningGlow: 'rgba(255, 149, 0, 0.4)',
  error: '#ff3366',          // Neon red/pink
  errorGlow: 'rgba(255, 51, 102, 0.4)',

  // Ring gradient - neon rainbow
  ringStart: '#00ffff',      // Cyan
  ringMiddle: '#ff00ff',     // Magenta
  ringEnd: '#00ff88',        // Green

  // Text
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.35)',

  // UI Elements
  border: 'rgba(255, 255, 255, 0.08)',
  borderGlow: 'rgba(0, 255, 255, 0.2)',
  tabBar: 'rgba(10, 10, 15, 0.95)',

  // Gradient presets
  gradientPurple: ['#1a0a2e', '#16082a', '#0a0a0f'],
  gradientCard: ['rgba(30, 20, 50, 0.9)', 'rgba(15, 10, 30, 0.9)'],
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  radius: 20,
  radiusSmall: 12,
  radiusLarge: 28,
  icon: 24,
  largeIcon: 32,
  fab: 60,
  screenWidth: width,
  screenHeight: height,
  cardWidth: (width - 48) / 2,
};

export const FONTS = {
  hero: {
    fontSize: 56,
    fontWeight: '800' as const,
    letterSpacing: -2,
    color: COLORS.text,
  },
  title1: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -1,
    color: COLORS.text,
  },
  title2: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    color: COLORS.text,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    color: COLORS.text,
  },
  callout: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: 0,
    color: COLORS.text,
  },
  caption1: {
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    color: COLORS.textSecondary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: COLORS.textSecondary,
  },
};

// Neon glow shadow presets
export const SHADOWS = {
  neonCyan: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  neonPink: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  neonGreen: {
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};
