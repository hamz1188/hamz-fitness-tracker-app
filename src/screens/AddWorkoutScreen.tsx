import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';

export const AddWorkoutScreen = () => {
  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Text style={styles.text}>Add Workout</Text>
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

