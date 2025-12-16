# Hamz Fitness Tracker App

A premium, professional fitness tracking mobile application built with React Native, Expo, and TypeScript. Designed with a dark, minimalist aesthetic and smooth 60fps animations.

## 📱 Features Implemented

### **Core Architecture**
- **Tech Stack:** React Native (Expo), TypeScript, Reanimated 3, React Navigation.
- **Navigation:** Custom Bottom Tab Navigator with blur effects, floating FAB, and smooth transitions.
- **Theme System:** Centralized `theme.ts` managing the "Deep Black" (#0A0A0A) & "Electric Blue" (#00D4FF) palette, typography (SF Pro style), and spacing.
- **Project Structure:** Clean, scalable architecture (`src/components`, `screens`, `hooks`, `types`).

### **Home Screen (Dashboard)**
- **Hero Feature:** Animated Circular Progress Ring showing daily goal completion with gradient fill and spring physics.
- **Quick Stats:** At-a-glance cards for Workouts, Streak, and Total Exercises.
- **Interactions:** 
  - Haptic feedback on button presses.
  - Smooth fade-in animations.
  - "Today's Workouts" list placeholder.

### **Data Layer**
- **Type Definitions:** TypeScript interfaces for `Workout`, `ExerciseType`, and `UserPrefs`.
- **Storage Hook:** `useWorkouts` hook implemented for managing workout data (Create, Read, Delete) using `AsyncStorage`.

## 🚧 Remaining Roadmap

### **Phase 1: Workout Logging (Next Priority)**
- [ ] **Add Workout Screen:**
    - [ ] Exercise selector with search.
    - [ ] Dynamic form fields based on exercise type (Strength vs. Cardio).
    - [ ] Date/Time picker.
    - [ ] "Save" functionality connected to `useWorkouts`.
- [ ] **Data Persistence:**
    - [ ] fully integrate `AsyncStorage` to persist workouts between app restarts.

### **Phase 2: History & Management**
- [ ] **History Screen:**
    - [ ] Group workouts by date.
    - [ ] Swipe-to-delete animations.
    - [ ] "Pull to refresh" interaction.
- [ ] **Home Screen Integration:**
    - [ ] Replace dummy data with real live data from `useWorkouts`.

### **Phase 3: Progress & Gamification**
- [ ] **Stats Screen:**
    - [ ] Charts/Graphs for weekly frequency (Victory Native or similar).
    - [ ] Personal Records tracking.
- [ ] **Gamification:**
    - [ ] Achievement badges (Streak milestones, Total workouts).

### **Phase 4: Polish & Refinement**
- [ ] **Onboarding Flow:** User name setup and initial goal setting.
- [ ] **Settings:** Theme toggles (optional), data export/reset.
- [ ] **Testing:** Comprehensive testing on both iOS and Android simulators.

## 🛠 Setup & Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the App:**
    ```bash
    npx expo start
    ```

3.  **Run on Device:**
    - Scan the QR code with **Expo Go** (Android/iOS).
    - Or press `i` for iOS Simulator / `a` for Android Emulator.

