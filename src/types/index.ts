export type ExerciseType = 'strength' | 'cardio' | 'time';

export interface Workout {
  id: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  distance?: number; // in km
  notes?: string;
  timestamp: Date | string; // serialized as string in storage
}

export interface UserPrefs {
  name: string;
  dailyGoal: number; // number of workouts per day
  joinDate: Date | string;
  currentStreak: number;
  longestStreak: number;
}

