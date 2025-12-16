import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Backgrounds
  background: '#000000',        // Pure black
  cardBackground: 'rgba(28, 28, 30, 0.7)',  // Translucent dark
  glassMorphism: 'rgba(255, 255, 255, 0.08)', // Frosted glass effect
  
  // Accents
  primary: '#00D4FF',           // Bright cyan (WHOOP style)
  primaryGlow: 'rgba(0, 212, 255, 0.3)',
  secondary: '#FF0055',         // Energetic pink/red
  success: '#30D158',           // Apple green
  warning: '#FF9F0A',           // Apple orange
  error: '#FF453A',             // Apple red
  
  // Ring colors (gradients)
  ringStart: '#00D4FF',
  ringMiddle: '#00FF88',
  ringEnd: '#30D158',
  
  // Text
  text: '#FFFFFF',              // Primary text
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textTertiary: 'rgba(255, 255, 255, 0.4)',
  
  // UI Elements
  border: 'rgba(255, 255, 255, 0.1)',
  tabBar: 'rgba(20, 20, 20, 0.8)', // Semi-transparent for blur
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16, // Standardized to 16px as per design spec
  l: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  radius: 24, // Larger, modern radius
  icon: 24,
  largeIcon: 32,
  fab: 68,
  screenWidth: width,
  screenHeight: height,
  cardWidth: (width - 48) / 3, // For 3-column layouts
};

export const FONTS = {
  hero: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1.5,
    color: COLORS.text,
  },
  title1: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  title2: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
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
    letterSpacing: -0.1,
    color: COLORS.text,
  },
  caption1: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: COLORS.textSecondary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    color: COLORS.textSecondary,
  },
  // Legacy support maps (mapped to new system where possible)
  regular: { fontWeight: '400' as const, fontSize: 17 },
  medium: { fontWeight: '500' as const, fontSize: 15 },
  bold: { fontWeight: '700' as const, fontSize: 17 },
  heavy: { fontWeight: '800' as const, fontSize: 17 },
};
