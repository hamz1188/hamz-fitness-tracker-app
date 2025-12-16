import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';

const STORAGE_KEY = '@hamz_fitness_workouts';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkouts = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const parsedWorkouts = JSON.parse(jsonValue);
        // Convert date strings back to Date objects if needed, 
        // but keeping as strings/ISO is often safer for display formatting until needed.
        // For now, let's keep as is or parse if we strictly typed Date.
        setWorkouts(parsedWorkouts);
      }
    } catch (e) {
      console.error('Failed to load workouts', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const addWorkout = async (workout: Workout) => {
    try {
      const newWorkouts = [workout, ...workouts];
      setWorkouts(newWorkouts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (e) {
      console.error('Failed to save workout', e);
      // Rollback state if needed
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const newWorkouts = workouts.filter(w => w.id !== id);
      setWorkouts(newWorkouts);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (e) {
      console.error('Failed to delete workout', e);
    }
  };

  return {
    workouts,
    loading,
    addWorkout,
    deleteWorkout,
    refreshWorkouts: loadWorkouts,
  };
};

