import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '../constants/theme';
import { useUser } from '../hooks/useUser';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const { updateUser } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(3);

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (step === 1 && name.trim().length > 0) {
      setStep(2);
    } else if (step === 2) {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await updateUser({
      name: name.trim(),
      dailyGoal: goal,
      joinDate: new Date().toISOString(),
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          <View style={[styles.dot, step >= 1 && styles.dotActive]} />
          <View style={[styles.dot, step >= 2 && styles.dotActive]} />
        </View>

        {step === 1 ? (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Let's get to know you!</Text>
            <Text style={styles.subtitle}>What should we call you?</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={20}
            />
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={48} color="#FFD700" />
            </View>
            <Text style={styles.title}>Set a Daily Goal</Text>
            <Text style={styles.subtitle}>How many workouts do you want to complete per day?</Text>
            
            <View style={styles.goalContainer}>
              <TouchableOpacity 
                style={styles.goalButton}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setGoal(Math.max(1, goal - 1));
                }}
              >
                <Ionicons name="remove" size={32} color={COLORS.text} />
              </TouchableOpacity>
              
              <Text style={styles.goalValue}>{goal}</Text>
              
              <TouchableOpacity 
                style={styles.goalButton}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setGoal(Math.min(10, goal + 1));
                }}
              >
                <Ionicons name="add" size={32} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.goalDescription}>
              {goal === 1 ? 'Just getting started!' : 
               goal <= 3 ? 'A solid routine.' : 
               'Beast mode activated!'}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.button, 
            (step === 1 && name.length === 0) && styles.buttonDisabled
          ]}
          onPress={handleNext}
          disabled={step === 1 && name.length === 0}
        >
          <Text style={styles.buttonText}>
            {step === 1 ? 'Next' : "Let's Go!"}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 60,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    ...FONTS.title2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.radius,
    paddingHorizontal: SPACING.l,
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: SPACING.l,
  },
  goalButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalValue: {
    ...FONTS.hero,
    color: COLORS.primary,
  },
  goalDescription: {
    ...FONTS.callout,
    color: COLORS.textSecondary,
    marginTop: SPACING.s,
  },
  button: {
    position: 'absolute',
    bottom: SPACING.xl * 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: COLORS.border,
  },
  buttonText: {
    ...FONTS.headline,
    color: COLORS.background,
    marginRight: 8,
  },
});

