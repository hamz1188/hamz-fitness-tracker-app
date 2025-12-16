import React, { useMemo, useCallback, useState } from 'react';
import { Text, StyleSheet, View, SectionList, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useWorkouts } from '../hooks/useWorkouts';
import { Workout } from '../types';

const FILTER_TABS = ['All', 'Strength', 'Cardio'];

export const HistoryScreen = () => {
  const { workouts, deleteWorkout, refreshWorkouts } = useWorkouts();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshWorkouts();
    }, [refreshWorkouts])
  );

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(w => {
      const matchesType = activeFilter === 'All' || 
        (activeFilter === 'Strength' && w.exerciseType === 'strength') ||
        (activeFilter === 'Cardio' && w.exerciseType === 'cardio');
      
      const matchesSearch = w.exerciseName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [workouts, activeFilter, searchQuery]);

  const sections = useMemo(() => {
    const sorted = [...filteredWorkouts].sort((a, b) => 
      new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime()
    );

    const grouped: { title: string; data: Workout[] }[] = [];
    
    sorted.forEach(workout => {
      const date = parseISO(workout.timestamp as string);
      let title = format(date, 'EEEE, MMM do');
      
      if (isToday(date)) {
        title = 'Today';
      } else if (isYesterday(date)) {
        title = 'Yesterday';
      }
      
      const lastGroup = grouped[grouped.length - 1];
      if (lastGroup && lastGroup.title === title) {
        lastGroup.data.push(workout);
      } else {
        grouped.push({ title, data: [workout] });
      }
    });
    
    return grouped;
  }, [filteredWorkouts]);

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const renderRightActions = (progress: any, dragX: any, id: string) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={() => deleteWorkout(id)} style={styles.deleteButtonContainer}>
        <Animated.View style={[styles.deleteButton, { transform: [{ scale }] }]}>
          <LinearGradient
            colors={[COLORS.error, '#D00000']}
            style={styles.deleteGradient}
          >
            <Ionicons name="trash" size={24} color="white" />
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderWorkout = ({ item }: { item: Workout }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
      >
        <GlassCard style={styles.workoutItem}>
          <View style={styles.row}>
            <View style={[styles.workoutIcon, { backgroundColor: item.exerciseType === 'cardio' ? 'rgba(255, 159, 10, 0.2)' : 'rgba(0, 212, 255, 0.2)' }]}>
              <Ionicons 
                name={item.exerciseType === 'cardio' ? 'bicycle' : 'barbell'} 
                size={24} 
                color={item.exerciseType === 'cardio' ? COLORS.warning : COLORS.primary} 
              />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{item.exerciseName}</Text>
              <Text style={styles.workoutDetails}>
                {item.exerciseType === 'strength' 
                  ? `${item.sets} sets • ${item.reps} reps • ${item.weight}kg`
                  : `${item.distance} km • ${item.duration} min`}
              </Text>
            </View>
            <Text style={styles.workoutTime}>
              {format(parseISO(item.timestamp as string), 'h:mm a')}
            </Text>
          </View>
        </GlassCard>
      </Swipeable>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <GlassCard style={styles.searchBar} intensity={10}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search history..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </GlassCard>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveFilter(tab)}
              style={[
                styles.filterPill,
                activeFilter === tab && styles.filterPillActive
              ]}
            >
              {activeFilter === tab && (
                <LinearGradient
                  colors={[COLORS.primary, COLORS.ringMiddle]}
                  start={{x:0, y:0}}
                  end={{x:1, y:0}}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={[
                styles.filterText,
                activeFilter === tab && styles.filterTextActive
              ]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {workouts.length > 0 ? (
          <SectionList
            sections={sections}
            renderItem={renderWorkout}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <GlassCard style={styles.emptyState}>
              <Ionicons name="journal-outline" size={64} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>No workouts found</Text>
            </GlassCard>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  headerTitle: {
    ...FONTS.title1,
    color: COLORS.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    height: 44,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.s,
    color: COLORS.text,
    ...FONTS.body,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.l,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.glassMorphism,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    borderWidth: 0,
  },
  filterText: {
    ...FONTS.caption1,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: SPACING.l,
  },
  workoutItem: {
    marginBottom: SPACING.m,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    ...FONTS.headline,
    fontSize: 17,
    color: COLORS.text,
  },
  workoutDetails: {
    ...FONTS.caption1,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  workoutTime: {
    ...FONTS.caption2,
    color: COLORS.textTertiary,
  },
  deleteButtonContainer: {
    width: 80,
    height: '100%', // Match item height
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: SPACING.s,
    marginBottom: SPACING.m, // Match item margin
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  deleteGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.xl,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    ...FONTS.headline,
    color: COLORS.textSecondary,
    marginTop: SPACING.m,
  },
  sectionHeader: {
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.background, // Should match background for sticky header
    marginBottom: SPACING.s,
  },
  sectionHeaderText: {
    ...FONTS.caption2,
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
});
