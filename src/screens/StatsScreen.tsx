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
    <GlassCard style={styles.chartContainer} glowColor="cyan">
      <Text style={styles.sectionTitle}>Weekly Activity</Text>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 120;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barTrack}>
                {item.count > 0 && (
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.bar, { height: Math.max(height, 8) }]}
                  />
                )}
              </View>
              <Text style={[
                styles.barLabel,
                item.count > 0 && { color: COLORS.primary, fontWeight: '700' }
              ]}>{item.day}</Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const StatRow = ({ label, value, icon, color }: any) => (
  <GlassCard style={styles.statRowCard} noPadding>
    <View style={styles.statRowContent}>
      <View style={[styles.smallIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.statRowInfo}>
        <Text style={styles.statRowLabel} numberOfLines={1}>{label}</Text>
        <Text style={styles.statRowValue}>{value}</Text>
      </View>
    </View>
  </GlassCard>
);

const getGlowFromColor = (color: string): 'cyan' | 'pink' | 'green' | 'none' => {
  if (color === COLORS.primary) return 'cyan';
  if (color === COLORS.secondary) return 'pink';
  if (color === COLORS.success) return 'green';
  return 'none';
};

const Badge = ({ title, icon, color, unlocked }: any) => (
  <GlassCard
    style={[styles.badge, !unlocked && styles.badgeLocked]}
    intensity={unlocked ? 30 : 5}
    noPadding
    glowColor={unlocked ? getGlowFromColor(color) : 'none'}
  >
    <View style={styles.badgeContent}>
      <View style={[styles.badgeIcon, { backgroundColor: unlocked ? `${color}20` : 'rgba(255,255,255,0.05)' }]}>
        <Ionicons name={icon} size={32} color={unlocked ? color : COLORS.textTertiary} />
      </View>
      <Text style={[styles.badgeText, !unlocked && styles.textLocked, unlocked && { color }]}>{title}</Text>
    </View>
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: SPACING.l,
    paddingTop: 60,
    paddingBottom: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
    marginRight: SPACING.m,
  },
  avatarText: {
    ...FONTS.title1,
    color: COLORS.secondary,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...FONTS.title2,
    color: COLORS.text,
  },
  memberSince: {
    ...FONTS.caption1,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: `${COLORS.secondary}15`,
    borderWidth: 1,
    borderColor: `${COLORS.secondary}40`,
  },
  editButtonText: {
    ...FONTS.caption2,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  sectionHeader: {
    ...FONTS.headline,
    color: COLORS.text,
    marginBottom: SPACING.m,
    marginTop: SPACING.l,
  },
  sectionTitle: {
    ...FONTS.headline,
    color: COLORS.text,
    marginBottom: SPACING.l,
  },
  chartContainer: {
    padding: SPACING.l,
    marginBottom: SPACING.l,
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
    ...FONTS.caption2,
    color: COLORS.textTertiary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%', // 2 columns
    marginBottom: SPACING.m,
  },
  statRowCard: {
    height: 80,
  },
  statRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  statRowInfo: {
    flex: 1,
  },
  statRowLabel: {
    ...FONTS.caption1,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statRowValue: {
    ...FONTS.headline,
    fontSize: 18,
    color: COLORS.text,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: '48%',
    marginBottom: SPACING.m,
    aspectRatio: 1,
  },
  badgeLocked: {
    opacity: 0.6,
  },
  badgeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  badgeText: {
    ...FONTS.callout,
    color: COLORS.text,
    textAlign: 'center',
  },
  textLocked: {
    color: COLORS.textSecondary,
  },
});
