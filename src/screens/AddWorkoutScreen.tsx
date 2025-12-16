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
  FlatList,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useWorkouts } from '../hooks/useWorkouts';
import { ExerciseType, Workout } from '../types';
import * as Haptics from 'expo-haptics';

const COMMON_EXERCISES = [
  { name: 'Push-ups', type: 'strength' },
  { name: 'Pull-ups', type: 'strength' },
  { name: 'Squats', type: 'strength' },
  { name: 'Bench Press', type: 'strength' },
  { name: 'Deadlift', type: 'strength' },
  { name: 'Running', type: 'cardio' },
  { name: 'Cycling', type: 'cardio' },
  { name: 'Swimming', type: 'cardio' },
  { name: 'Plank', type: 'time' },
  { name: 'Jump Rope', type: 'cardio' },
] as const;

export const AddWorkoutScreen = ({ navigation }: any) => {
  const { addWorkout } = useWorkouts();
  
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('strength');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    if (!exerciseName) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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

    await addWorkout(newWorkout);
    
    // Reset form
    setExerciseName('');
    setSets('');
    setReps('');
    setWeight('');
    setDistance('');
    setDuration('');
    
    navigation.navigate('Home');
  };

  const filteredExercises = COMMON_EXERCISES.filter(ex => 
    ex.name.toLowerCase().includes(exerciseName.toLowerCase())
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Log Workout</Text>

          {/* Exercise Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search or enter exercise..."
                placeholderTextColor={COLORS.textSecondary}
                value={exerciseName}
                onChangeText={(text) => {
                  setExerciseName(text);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </View>
            
            {/* Suggestions List */}
            {showSuggestions && exerciseName.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {filteredExercises.map((ex, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.suggestionItem}
                    onPress={() => handleExerciseSelect(ex.name, ex.type)}
                  >
                    <Text style={styles.suggestionText}>{ex.name}</Text>
                    <Text style={styles.suggestionType}>{ex.type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Type Selector */}
          <View style={styles.typeSelector}>
            {['strength', 'cardio'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  exerciseType === type && styles.typeButtonActive
                ]}
                onPress={() => {
                  setExerciseType(type as ExerciseType);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[
                  styles.typeButtonText,
                  exerciseType === type && styles.typeButtonTextActive
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Form Fields */}
          {exerciseType === 'strength' ? (
            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Sets</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={sets}
                  onChangeText={setSets}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={reps}
                  onChangeText={setReps}
                />
              </View>
              <View style={styles.fullInput}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
            </View>
          ) : (
            <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Distance (km)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={distance}
                  onChangeText={setDistance}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Duration (min)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.saveButton, !exerciseName && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!exerciseName}
          >
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: SPACING.xl,
    ...FONTS.bold,
  },
  inputGroup: {
    marginBottom: SPACING.l,
    zIndex: 10,
  },
  label: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
    fontSize: 14,
    ...FONTS.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 50,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    height: '100%',
    ...FONTS.regular,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  suggestionItem: {
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionText: {
    color: COLORS.text,
    fontSize: 16,
  },
  suggestionType: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.card,
    padding: 4,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SIZES.radius - 4,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  typeButtonText: {
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  typeButtonTextActive: {
    color: COLORS.background,
    ...FONTS.bold,
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
    marginBottom: SPACING.l,
  },
  fullInput: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    ...FONTS.bold,
  },
});
