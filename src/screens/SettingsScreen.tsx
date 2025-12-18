import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useUser } from '../hooks/useUser';
import { useWorkouts } from '../hooks/useWorkouts';
import * as Haptics from 'expo-haptics';

export const SettingsScreen = ({ navigation }: any) => {
  const { user, resetUser } = useUser();
  const { clearWorkouts } = useWorkouts();

  const handleResetData = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    Alert.alert(
      "Reset All Data",
      "Are you sure? This will delete all your workouts and profile data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
             await clearWorkouts(); 
             await resetUser();
             // Navigation will automatically switch to Onboarding because isOnboarded becomes false
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Section */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.row}>
             <Text style={styles.label}>Name</Text>
             <Text style={styles.value}>{user?.name}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
             <Text style={styles.label}>Daily Goal</Text>
             <Text style={styles.value}>{user?.dailyGoal} workouts</Text>
          </View>
        </GlassCard>

        {/* App Info */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
             <Text style={styles.label}>Version</Text>
             <Text style={styles.value}>1.0.0</Text>
          </View>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Danger Zone</Text>
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleResetData}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.dangerButtonText}>Reset All Data</Text>
          </TouchableOpacity>
        </GlassCard>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    paddingTop: 60, // Adjust for transparent status bar
  },
  backButton: {
    padding: SPACING.s,
    marginRight: SPACING.m,
  },
  headerTitle: {
    ...FONTS.headline,
    color: COLORS.text,
  },
  content: {
    padding: SPACING.l,
  },
  section: {
    marginBottom: SPACING.xl,
    padding: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.caption2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    ...FONTS.body,
    color: COLORS.text,
  },
  value: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: SIZES.radius,
    marginTop: SPACING.s,
  },
  dangerButtonText: {
    ...FONTS.headline,
    color: COLORS.error,
    marginLeft: SPACING.s,
  },
});
