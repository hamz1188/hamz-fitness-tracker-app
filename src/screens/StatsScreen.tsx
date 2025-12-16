import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';

export const StatsScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Text style={styles.text}>Progress & Stats</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.text,
    ...FONTS.bold,
    fontSize: 20,
  },
});

