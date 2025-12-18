import React, { useState } from 'react';
import { 
  Text, 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useWorkouts } from '../hooks/useWorkouts';
import { ExerciseType, Workout } from '../types';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '../components/GlassCard';

const COMMON_EXERCISES = [
  { name: 'Push-ups', type: 'strength', icon: '💪' },
  { name: 'Pull-ups', type: 'strength', icon: '🧗' },
  { name: 'Squats', type: 'strength', icon: '🦵' },
  { name: 'Bench Press', type: 'strength', icon: '🏋️' },
  { name: 'Deadlift', type: 'strength', icon: '🏗️' },
  { name: 'Running', type: 'cardio', icon: '🏃' },
  { name: 'Cycling', type: 'cardio', icon: '🚴' },
  { name: 'Swimming', type: 'cardio', icon: '🏊' },
  { name: 'Plank', type: 'time', icon: '🪵' },
  { name: 'Jump Rope', type: 'cardio', icon: '🪢' },
] as const;

export const AddWorkoutScreen = ({ navigation }: any) => {
  const { addWorkout } = useWorkouts();
  
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('strength');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Strength fields
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  
  // Cardio fields
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const handleExerciseSelect = (name: string, type: string) => {
    setExerciseName(name);
    setExerciseType(type as ExerciseType);
    setShowSuggestions(false);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSave = async () => {
    if (!exerciseName) return;

    setLoading(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const newWorkout: Workout = {
      id: Date.now().toString(),
      exerciseName,
      exerciseType,
      timestamp: new Date().toISOString(),
    };

    if (exerciseType === 'strength') {
      newWorkout.sets = sets ? parseInt(sets) : 0;
      newWorkout.reps = reps ? parseInt(reps) : 0;
      newWorkout.weight = weight ? parseFloat(weight) : 0;
    } else if (exerciseType === 'cardio') {
      newWorkout.distance = distance ? parseFloat(distance) : 0;
      newWorkout.duration = duration ? parseInt(duration) : 0;
    }

    // Simulate network delay for effect
    setTimeout(async () => {
      await addWorkout(newWorkout);
      setLoading(false);
      
      // Reset form
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      setDistance('');
      setDuration('');
      
      navigation.goBack();
    }, 800);
  };

  const filteredExercises = COMMON_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(exerciseName.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Log Workout</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Exercise Name Input */}
          <View style={styles.inputGroup}>
            <GlassCard style={styles.inputCard} contentStyle={styles.inputCardContent} noPadding>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search exercises..."
                placeholderTextColor={COLORS.textSecondary}
                value={exerciseName}
                onChangeText={(text) => {
                  setExerciseName(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </GlassCard>
            
            {/* Suggestions List */}
            {showSuggestions && exerciseName.length > 0 && filteredExercises.length > 0 && (
              <GlassCard style={styles.suggestionsContainer} noPadding>
                <ScrollView style={styles.suggestionsList} nestedScrollEnabled>
                  {filteredExercises.map((ex, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.suggestionItem}
                      onPress={() => handleExerciseSelect(ex.name, ex.type)}
                    >
                      <Text style={styles.suggestionIcon}>{ex.icon}</Text>
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionText}>{ex.name}</Text>
                        <Text style={styles.suggestionType}>{ex.type}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </GlassCard>
            )}
          </View>

          {/* Type Selector - Optional/Auto-detected usually, but kept for manual override */}
          {/* Hidden if selected from list to keep clean, or show small tags */}

          {/* Dynamic Form Fields */}
          {exerciseType === 'strength' ? (
            <View style={styles.formGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.label}>SETS</Text>
                <GlassCard style={styles.numberInputCard} contentStyle={styles.numberInputContent} noPadding>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    value={sets}
                    onChangeText={setSets}
                  />
                </GlassCard>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.label}>REPS</Text>
                <GlassCard style={styles.numberInputCard} contentStyle={styles.numberInputContent} noPadding>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    value={reps}
                    onChangeText={setReps}
                  />
                </GlassCard>
              </View>
              <View style={styles.gridItemFull}>
                <Text style={styles.label}>WEIGHT (KG)</Text>
                <GlassCard style={styles.numberInputCard} contentStyle={styles.numberInputContent} noPadding>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    placeholder="0.0"
                    placeholderTextColor={COLORS.textTertiary}
                    value={weight}
                    onChangeText={setWeight}
                  />
                </GlassCard>
              </View>
            </View>
          ) : (
            <View style={styles.formGrid}>
              <View style={styles.gridItemFull}>
                <Text style={styles.label}>DISTANCE (KM)</Text>
                <GlassCard style={styles.numberInputCard} contentStyle={styles.numberInputContent} noPadding>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="numeric"
                    placeholder="0.0"
                    placeholderTextColor={COLORS.textTertiary}
                    value={distance}
                    onChangeText={setDistance}
                  />
                </GlassCard>
              </View>
              <View style={styles.gridItemFull}>
                <Text style={styles.label}>DURATION (MIN)</Text>
                <GlassCard style={styles.numberInputCard} contentStyle={styles.numberInputContent} noPadding>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={COLORS.textTertiary}
                    value={duration}
                    onChangeText={setDuration}
                  />
                </GlassCard>
              </View>
            </View>
          )}

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.saveButtonContainer, !exerciseName && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={!exerciseName || loading}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.success]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.saveButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save Workout</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.glassMorphism,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONTS.title2,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
    zIndex: 10,
  },
  inputCard: {
    height: 56,
    borderRadius: 16,
  },
  inputCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    height: '100%',
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.text,
    height: '100%',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    maxHeight: 250,
    zIndex: 1000,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    fontSize: 24,
    marginRight: SPACING.m,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    ...FONTS.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  suggestionType: {
    ...FONTS.caption1,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
  },
  gridItemFull: {
    width: '100%',
  },
  label: {
    ...FONTS.caption2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
    paddingLeft: 4,
  },
  numberInputCard: {
    height: 72,
    borderRadius: 16,
  },
  numberInputContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  numberInput: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    width: '100%',
  },
  footer: {
    padding: SPACING.l,
    paddingBottom: 100, // Clear the floating tab bar
  },
  saveButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  saveButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  saveButtonText: {
    ...FONTS.headline,
    color: 'white',
  },
});
