import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SIZES } from '../constants/theme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const Container = onPress ? AnimatedPressable : View;
  const pressProps = onPress ? { onPress, onPressIn: handlePressIn, onPressOut: handlePressOut } : {};

  return (
    <Container style={[styles.containerWrapper, style, onPress && animatedStyle]} {...pressProps}>
      <View style={styles.shadowContainer}>
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.borderOverlay} />
        <View style={styles.content}>
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
    backgroundColor: COLORS.cardBackground,
    // Soft shadow/glow matching content
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  shadowContainer: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  borderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
});
