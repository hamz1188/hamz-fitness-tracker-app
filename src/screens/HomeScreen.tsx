import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { CircularProgress } from '../components/CircularProgress';
import { COLORS, SPACING, FONTS, SIZES } from '../constants/theme';

const StatCard = ({ icon, value, label, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WorkoutItem = ({ title, details, time }) => (
  <View style={styles.workoutItem}>
    <View style={styles.workoutIcon}>
      <Ionicons name="barbell-outline" size={24} color={COLORS.primary} />
    </View>
    <View style={styles.workoutInfo}>
      <Text style={styles.workoutTitle}>{title}</Text>
      <Text style={styles.workoutDetails}>{details}</Text>
    </View>
    <Text style={styles.workoutTime}>{time}</Text>
  </View>
);

export const HomeScreen = ({ navigation }) => {
  const [todayWorkouts, setTodayWorkouts] = useState([
    { id: '1', title: 'Push-ups', details: '3 sets x 15 reps', time: '08:30 AM' },
    { id: '2', title: 'Morning Run', details: '5.2 km in 28 mins', time: '07:00 AM' },
  ]);

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Add');
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, Hamz</Text>
            <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM do')}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
             <View style={styles.avatarPlaceholder}>
               <Text style={styles.avatarText}>H</Text>
             </View>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <CircularProgress progress={0.65} size={220} strokeWidth={18} />
          <Text style={styles.progressText}>3 of 5 workouts completed</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <StatCard 
            icon="barbell" 
            value="12" 
            label="Workouts" 
            color={COLORS.primary} 
          />
          <StatCard 
            icon="flame" 
            value="5" 
            label="Streak" 
            color="#FF9500" 
          />
          <StatCard 
            icon="fitness" 
            value="145" 
            label="Exercises" 
            color={COLORS.success} 
          />
        </View>

        {/* Today's Workouts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Workouts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {todayWorkouts.length > 0 ? (
          todayWorkouts.map(item => (
            <WorkoutItem 
              key={item.id}
              title={item.title}
              details={item.details}
              time={item.time}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts logged yet today</Text>
          </View>
        )}
        
        {/* Spacer for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={COLORS.background} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  date: {
    color: COLORS.text,
    fontSize: 24,
    marginTop: 4,
    ...FONTS.bold,
  },
  profileButton: {
    padding: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    color: COLORS.primary,
    ...FONTS.bold,
    fontSize: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.l,
    ...FONTS.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 18,
    ...FONTS.bold,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    ...FONTS.regular,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    ...FONTS.bold,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    ...FONTS.medium,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    color: COLORS.text,
    fontSize: 16,
    ...FONTS.bold,
  },
  workoutDetails: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  workoutTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
