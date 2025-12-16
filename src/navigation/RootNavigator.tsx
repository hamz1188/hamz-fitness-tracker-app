import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
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

const AddButton = ({ children, onPress }: any) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <LinearGradient
      colors={[COLORS.primary, COLORS.ringMiddle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: 88, // Standard safe area height
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView 
            tint="dark" 
            intensity={80} 
            style={StyleSheet.absoluteFill} 
          />
        ),
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={26} 
              color={color} 
              style={focused && styles.activeGlow}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddWorkoutScreen}
        options={{
          tabBarButton: (props) => (
            <AddButton {...props}>
              <Ionicons name="add" size={32} color="#FFF" />
            </AddButton>
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "time" : "time-outline"} 
              size={26} 
              color={color} 
              style={focused && styles.activeGlow}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "stats-chart" : "stats-chart-outline"} 
              size={26} 
              color={color} 
              style={focused && styles.activeGlow}
            />
          ),
        }}
      />
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
  activeGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  }
});
