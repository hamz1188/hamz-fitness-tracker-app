import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/constants/theme';
import { UserProvider } from './src/context/UserContext';
import { DeviceFrame } from './src/components/DeviceFrame';

export default function App() {
  return (
    <DeviceFrame>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <SafeAreaProvider>
            <StatusBar style="light" backgroundColor={COLORS.background} />
            <RootNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </DeviceFrame>
  );
}
