import React, { useMemo, useCallback } from 'react';
import { Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useWorkouts } from '../hooks/useWorkouts';
import { useUser } from '../hooks/useUser';
import { Workout } from '../types';

const BarChart = ({ data }: { data: { day: string; count: number }[] }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1); 

  return (
    <GlassCard style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Weekly Activity</Text>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 120;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barTrack}>
                {item.count > 0 && (
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.success]}
                    style={[styles.bar, { height: Math.max(height, 8) }]} 
                  />
                )}
              </View>
              <Text style={[
                styles.barLabel, 
                item.count > 0 && { color: COLORS.text, fontWeight: '700' }
              ]}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const StatRow = ({ label, value, icon, color }: any) => (
  <GlassCard style={styles.statRowCard}>
    <View style={styles.statRowContent}>
      <View style={[styles.smallIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statRowLabel}>{label}</Text>
        <Text style={styles.statRowValue}>{value}</Text>
      </View>
    </View>
  </GlassCard>
);

const Badge = ({ title, icon, color, unlocked }: any) => (
  <GlassCard 
    style={[styles.badge, !unlocked && styles.badgeLocked]} 
    intensity={unlocked ? 30 : 5}
  >
    <View style={[styles.badgeIcon, { backgroundColor: unlocked ? `${color}20` : 'rgba(255,255,255,0.05)' }]}>
      <Ionicons name={icon} size={32} color={unlocked ? color : COLORS.textTertiary} />
    </View>
    <Text style={[styles.badgeText, !unlocked && styles.textLocked]}>{title}</Text>
  </GlassCard>
);

export const StatsScreen = ({ navigation }: any) => {
  const { workouts, refreshWorkouts } = useWorkouts();
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      refreshWorkouts();
    }, [refreshWorkouts])
  );

  const stats = useMemo(() => {
    const total = workouts.length;
    return { total };
  }, [workouts]);

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const count = workouts.filter(w => isSameDay(parseISO(w.timestamp as string), date)).length;
      days.push({
        day: format(date, 'EEE').charAt(0),
        count,
        fullDate: date,
      });
    }
    return days;
  }, [workouts]);

  const personalRecords = useMemo(() => {
    const records: Record<string, Workout> = {};
    workouts.forEach(w => {
      if (!records[w.exerciseName]) {
        records[w.exerciseName] = w;
      } else {
        const current = records[w.exerciseName];
        if (w.exerciseType === 'strength') {
          if ((w.weight || 0) > (current.weight || 0)) records[w.exerciseName] = w;
        } else if (w.exerciseType === 'cardio') {
          if ((w.distance || 0) > (current.distance || 0)) records[w.exerciseName] = w;
        }
      }
    });
    return Object.values(records).slice(0, 4); // Limit to 4 for grid layout
  }, [workouts]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Profile Section */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'Athlete'}</Text>
              <Text style={styles.memberSince}>Member since {user?.joinDate ? format(parseISO(user.joinDate as string), 'MMM yyyy') : '2025'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <BarChart data={weeklyData} />

          <Text style={styles.sectionHeader}>Personal Records</Text>
          <View style={styles.gridContainer}>
            {personalRecords.length > 0 ? (
              personalRecords.map((pr, index) => (
                <View key={index} style={styles.gridItem}>
                  <StatRow 
                    label={pr.exerciseName}
                    value={
                      pr.exerciseType === 'strength' 
                        ? `${pr.weight}kg` 
                        : `${pr.distance}km`
                    }
                    icon="trophy"
                    color="#FFD700" 
                  />
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No records yet</Text>
            )}
          </View>

          <Text style={styles.sectionHeader}>Achievements</Text>
          <View style={styles.badgesContainer}>
            <Badge 
              title="First Step" 
              icon="footsteps" 
              color={COLORS.primary} 
              unlocked={stats.total >= 1} 
            />
            <Badge 
              title="On Fire" 
              icon="flame" 
              color={COLORS.warning} 
              unlocked={stats.total >= 5} 
            />
            <Badge 
              title="Dedicated" 
              icon="fitness" 
              color={COLORS.success} 
              unlocked={stats.total >= 10} 
            />
            <Badge 
              title="Iron" 
              icon="barbell" 
              color="#E0E0E0" 
              unlocked={stats.total >= 50} 
            />
          </View>

        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'left',
  },
  memberSince: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'left',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  editButtonText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
    marginTop: 24,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'left',
  },
  chartContainer: {
    padding: 20,
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    alignItems: 'center',
    width: 30,
  },
  barTrack: {
    height: 120,
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // 2 columns
    marginBottom: 16,
  },
  statRowCard: {
    padding: 16,
  },
  statRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statRowLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textAlign: 'left',
  },
  statRowValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'left',
  },
  emptyText: {
    fontSize: 17,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: '48%',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    aspectRatio: 1, // Square cards
    justifyContent: 'center',
  },
  badgeLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  textLocked: {
    color: COLORS.textSecondary,
  },
});
