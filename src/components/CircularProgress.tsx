import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useDerivedValue,
  withRepeat,
  withSequence,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = SIZES.screenHeight * 0.35,
  strokeWidth = 20,
  showText = true,
}) => {
  const glowExtra = 8; // Extra width for glow stroke
  const totalStrokeWidth = strokeWidth + glowExtra;
  const radius = (size - totalStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });

    if (progress >= 1) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.4, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progressValue.value),
    };
  });

  const AnimatedView = Animated.View;
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow effect behind the ring */}
      <AnimatedView style={[styles.glowContainer, { width: size, height: size }, glowStyle]}>
        <View style={[styles.glow, {
          width: size * 0.85,
          height: size * 0.85,
          borderRadius: size * 0.425,
          shadowRadius: 40,
        }]} />
      </AnimatedView>

      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.ringStart} stopOpacity="1" />
            <Stop offset="0.5" stopColor={COLORS.ringMiddle} stopOpacity="1" />
            <Stop offset="1" stopColor={COLORS.ringEnd} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.ringStart} stopOpacity="0.5" />
            <Stop offset="0.5" stopColor={COLORS.ringMiddle} stopOpacity="0.5" />
            <Stop offset="1" stopColor={COLORS.ringEnd} stopOpacity="0.5" />
          </LinearGradient>
        </Defs>

        {/* Background Track */}
        <Circle
          stroke="rgba(255, 255, 255, 0.05)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Glow ring behind main progress */}
        <AnimatedCircle
          stroke="url(#glowGrad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={totalStrokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />

        {/* Main Progress Ring */}
        <AnimatedCircle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.percentageText}>
            {Math.round(progress * 100)}%
          </Text>
          <Text style={styles.subText}>Daily Goal</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    backgroundColor: 'transparent',
    shadowColor: COLORS.ringMiddle,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subText: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
