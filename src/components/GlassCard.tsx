import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  intensity?: number;
  onPress?: () => void;
  noPadding?: boolean;
  glowColor?: 'cyan' | 'pink' | 'green' | 'none';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const glowColors = {
  cyan: COLORS.primary,
  pink: COLORS.secondary,
  green: COLORS.success,
  none: 'transparent',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  contentStyle,
  intensity = 25,
  onPress,
  noPadding = false,
  glowColor = 'none'
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const Container = onPress ? AnimatedPressable : View;
  const pressProps = onPress ? { onPress, onPressIn: handlePressIn, onPressOut: handlePressOut } : {};

  const shadowColor = glowColors[glowColor] || COLORS.primary;
  const hasGlow = glowColor !== 'none';

  return (
    <Container
      style={[
        styles.containerWrapper,
        hasGlow && { shadowColor, shadowOpacity: 0.3 },
        style,
        onPress && animatedStyle
      ]}
      {...pressProps}
    >
      <View style={styles.shadowContainer}>
        {Platform.OS === 'web' ? (
          // Use CSS backdrop-filter for web
          <View style={[StyleSheet.absoluteFill, styles.webBlur]} />
        ) : (
          // Use BlurView for native platforms
          <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        />
        <View style={[styles.content, noPadding && { padding: 0 }, contentStyle]}>
          {children}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'web' ? 'rgba(26, 26, 46, 0.7)' : COLORS.cardBackground,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  shadowContainer: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  webBlur: {
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    // @ts-ignore - web-only CSS properties
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  },
  gradientBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
});
