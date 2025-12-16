import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPrefs } from '../types';

const STORAGE_KEY = '@hamz_fitness_user_prefs';

const DEFAULT_PREFS: UserPrefs = {
  name: '',
  dailyGoal: 3,
  joinDate: new Date().toISOString(),
  currentStreak: 0,
  longestStreak: 0,
};

interface UserContextType {
  user: UserPrefs | null;
  loading: boolean;
  isOnboarded: boolean;
  updateUser: (updates: Partial<UserPrefs>) => Promise<void>;
  resetUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setUser(JSON.parse(jsonValue));
        setIsOnboarded(true);
      } else {
        setUser(null);
        setIsOnboarded(false);
      }
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = async (updates: Partial<UserPrefs>) => {
    try {
      const newUser = { ...DEFAULT_PREFS, ...(user || {}), ...updates };
      setUser(newUser);
      setIsOnboarded(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  };

  const resetUser = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setIsOnboarded(false);
    } catch (e) {
      console.error('Failed to reset user', e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isOnboarded,
        updateUser,
        resetUser,
        refreshUser: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

