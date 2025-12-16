import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  useDerivedValue,
  withRepeat,
  withSequence,
  Easing,
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
  size = SIZES.screenHeight * 0.35, // Bigger default size (~40% height requested but adjusted for safe areas)
  strokeWidth = 24,
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
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

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={COLORS.ringStart} stopOpacity="1" />
            <Stop offset="0.5" stopColor={COLORS.ringMiddle} stopOpacity="1" />
            <Stop offset="1" stopColor={COLORS.ringEnd} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background Track */}
        <Circle
          stroke={COLORS.glassMorphism}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* Animated Progress Ring */}
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
          // Add shadow/glow effect directly to the stroke if possible, otherwise use a separate blurred circle behind
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
    // Outer glow for the whole component if desired, but specificity asked for ring glow
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: COLORS.text,
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
});
