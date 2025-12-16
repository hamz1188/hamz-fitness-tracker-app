import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';

interface DeviceFrameProps {
  children: React.ReactNode;
}

const IPHONE_WIDTH = 393; // iPhone 15 Pro width
const IPHONE_HEIGHT = 852; // iPhone 15 Pro height
const FRAME_PADDING = 12;
const CORNER_RADIUS = 55;

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  // Only show device frame on web
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGlow} />
      
      {/* iPhone Frame */}
      <View style={styles.deviceWrapper}>
        {/* Outer bezel */}
        <View style={styles.deviceBezel}>
          {/* Inner screen area */}
          <View style={styles.screen}>
            {/* Dynamic Island */}
            <View style={styles.dynamicIsland} />
            
            {/* App content */}
            <View style={styles.appContent}>
              {children}
            </View>
            
            {/* Home indicator */}
            <View style={styles.homeIndicator} />
          </View>
        </View>
        
        {/* Side buttons */}
        <View style={styles.volumeUp} />
        <View style={styles.volumeDown} />
        <View style={styles.powerButton} />
      </View>
      
      {/* Branding below device */}
      <View style={styles.branding}>
        <View style={styles.appIcon}>
          <View style={styles.appIconInner} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh' as any,
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(0, 255, 255, 0.03)',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -300 }],
  },
  deviceWrapper: {
    position: 'relative',
    width: IPHONE_WIDTH + FRAME_PADDING * 2,
    height: IPHONE_HEIGHT + FRAME_PADDING * 2,
  },
  deviceBezel: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: CORNER_RADIUS,
    padding: FRAME_PADDING,
    // Bezel shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    // Bezel border highlight
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    borderRadius: CORNER_RADIUS - FRAME_PADDING,
    overflow: 'hidden',
    position: 'relative',
  },
  dynamicIsland: {
    position: 'absolute',
    top: 12,
    left: '50%',
    width: 126,
    height: 37,
    backgroundColor: '#000',
    borderRadius: 20,
    transform: [{ translateX: -63 }],
    zIndex: 100,
  },
  appContent: {
    flex: 1,
    overflow: 'hidden',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    transform: [{ translateX: -67 }],
    zIndex: 100,
  },
  // Side buttons
  volumeUp: {
    position: 'absolute',
    left: -3,
    top: 180,
    width: 4,
    height: 35,
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  volumeDown: {
    position: 'absolute',
    left: -3,
    top: 230,
    width: 4,
    height: 35,
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  powerButton: {
    position: 'absolute',
    right: -3,
    top: 200,
    width: 4,
    height: 100,
    backgroundColor: '#2a2a2a',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  branding: {
    marginTop: 32,
    alignItems: 'center',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00ffff',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

