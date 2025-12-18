import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { HomeScreen } from '../screens/HomeScreen';
import { AddWorkoutScreen } from '../screens/AddWorkoutScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS, SPACING } from '../constants/theme';
import { useUser } from '../hooks/useUser';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom floating tab bar component
const FloatingTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={[styles.floatingContainer, { bottom: 8 }]}>
      {/* Main tabs container */}
      <View style={styles.mainTabsWrapper}>
        {Platform.OS === 'web' ? (
          <View style={[StyleSheet.absoluteFill, styles.webBlur]} />
        ) : (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.mainTabsContent}>
          {state.routes.map((route: any, index: number) => {
            // Skip the Add screen in the main tabs
            if (route.name === 'Add') return null;

            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName: any;
            if (route.name === 'Home') {
              iconName = isFocused ? 'home' : 'home-outline';
            } else if (route.name === 'History') {
              iconName = isFocused ? 'time' : 'time-outline';
            } else if (route.name === 'Progress') {
              iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={isFocused ? COLORS.primary : 'rgba(255,255,255,0.4)'}
                  style={isFocused ? styles.activeGlow : undefined}
                />
                <View style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  <View style={[
                    styles.tabIndicator,
                    isFocused && { backgroundColor: COLORS.primary }
                  ]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating Add button - separate on right */}
      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => navigation.navigate('Add')}
      >
        <View style={styles.addButtonShadow}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={28} color="#FFF" />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddWorkoutScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Progress" component={StatsScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { isOnboarded, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade', // Smooth fade for all screen transitions
          contentStyle: { backgroundColor: COLORS.background }
        }}
      >
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ 
                presentation: 'modal', // Standard iOS-like presentation
                animation: 'slide_from_bottom' 
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mainTabsWrapper: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'web' ? 'rgba(26, 26, 46, 0.7)' : COLORS.cardBackground,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  webBlur: {
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    // @ts-ignore - web-only CSS properties
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  },
  mainTabsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    marginTop: 4,
    height: 4,
    width: 4,
    borderRadius: 2,
  },
  tabLabelActive: {},
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  addButtonContainer: {
    width: 56,
    height: 56,
  },
  addButtonShadow: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});
