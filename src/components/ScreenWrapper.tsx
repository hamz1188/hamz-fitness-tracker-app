import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, useSafeArea = true }) => {
  // Only apply safe area to left and right edges, not top and bottom
  const Container = useSafeArea ? SafeAreaView : View;
  const edges = useSafeArea ? ['left', 'right'] : [];

  return (
    <LinearGradient
      colors={[COLORS.gradient.backgroundStart, COLORS.gradient.backgroundEnd]}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {useSafeArea ? (
        <SafeAreaView style={styles.container} edges={edges}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          {children}
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          {children}
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
