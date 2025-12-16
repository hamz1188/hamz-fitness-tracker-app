import React from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useWorkouts } from '../hooks/useWorkouts';
import { Workout } from '../types';

export const HistoryScreen = () => {
  const { workouts, deleteWorkout } = useWorkouts();

  const renderWorkout = ({ item }: { item: Workout }) => {
    return (
      <View style={styles.workoutItem}>
        <View style={styles.workoutHeader}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={item.exerciseType === 'cardio' ? 'bicycle' : 'barbell'} 
                size={20} 
                color={COLORS.primary} 
              />
            </View>
            <View>
              <Text style={styles.workoutTitle}>{item.exerciseName}</Text>
              <Text style={styles.workoutDate}>
                {format(new Date(item.timestamp), 'MMM dd, h:mm a')}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => deleteWorkout(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          {item.exerciseType === 'strength' ? (
            <Text style={styles.detailsText}>
              {item.sets} sets × {item.reps} reps @ {item.weight}kg
            </Text>
          ) : (
            <Text style={styles.detailsText}>
              {item.distance} km in {item.duration} mins
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>History</Text>
        
        {workouts.length > 0 ? (
          <FlatList
            data={workouts}
            renderItem={renderWorkout}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="journal-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No workouts recorded yet.</Text>
            <Text style={styles.emptySubtext}>Go to the Add tab to log your first workout!</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.l,
  },
  headerTitle: {
    fontSize: 28,
    color: COLORS.text,
    ...FONTS.bold,
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  listContent: {
    paddingBottom: 100,
  },
  workoutItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  workoutTitle: {
    color: COLORS.text,
    fontSize: 16,
    ...FONTS.bold,
  },
  workoutDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  detailsContainer: {
    paddingLeft: 52, // Align with text start (icon width + margin)
  },
  detailsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    ...FONTS.bold,
    marginTop: SPACING.l,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.s,
    paddingHorizontal: SPACING.xl,
  },
});
