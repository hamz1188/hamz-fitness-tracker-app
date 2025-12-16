import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withSpring,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';
import { COLORS, FONTS } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 200,
  strokeWidth = 15,
  showText = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1500,
      easing: Easing.out(Easing.exp),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progressValue.value),
    };
  });

  // Calculate percentage text
  // Note: For complex text animation in Reanimated, we often use ReText or runOnJS,
  // but for simplicity I'll just show the static or passed prop, or a simple text.
  // To keep it smooth, I'll just render the target percentage for now or use a separate reanimated text component if needed.
  // For this MVP, I'll display the target progress formatted as %.

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={COLORS.success} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          stroke={COLORS.card}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground Circle */}
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
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: COLORS.text,
    fontSize: 42,
    ...FONTS.bold,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    ...FONTS.medium,
  },
});

