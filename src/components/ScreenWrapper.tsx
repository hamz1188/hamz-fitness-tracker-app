import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  useSafeArea?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, useSafeArea = true }) => {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <View style={styles.background}>
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        {children}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
