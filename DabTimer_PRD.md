# Product Requirements Document: DabTimer Mobile Application

## 1. Introduction

The DabTimer mobile application is designed to assist users in achieving optimal dabbing sessions by providing precise timing for heat-up and cool-down phases. The application aims to offer a modern, intuitive user interface with customizable settings and tracking capabilities for a personalized user experience. This document outlines the key features, functional and technical requirements, and overall scope of the DabTimer application.

## 2. Goals

The primary goals of the DabTimer application are:

*   To provide accurate and customizable timing for dabbing heat-up and cool-down cycles.
*   To offer a modern, visually appealing, and user-friendly interface.
*   To allow users to personalize their experience through color themes and custom timer settings.
*   To integrate tracking features for dab sessions to help users monitor their preferences and usage patterns.
*    To be a fully functional, stable, and performant Android mobile application.

## 3. User Stories / Requirements

As a user, I want to:

*   **Modern UI**: Experience a contemporary and visually appealing interface with gradient colors, shadows, and polished styling.
*   **Clock Display**: See the current time in HH:MM format in the header, without seconds.
*   **Tab-Based Navigation**: Easily navigate between four main sections: Home, Timer, Calendar, and Settings, using a bottom navigation bar.
*   **Timer Functionality**: Have a timer that accurately calculates and displays heat-up and cool-down times based on selected material, concentrate type, and heating method.
*   **Custom Timer Inputs**: Be able to set and apply my own custom heat-up and cool-down times in the Settings tab, which should override default calculations.
*   **Color Themes**: Choose from 6 different color themes (Green, Blue, Purple, Orange, Pink, Teal) in the Settings tab to personalize the app's appearance.
*   **Concentrate Images**: See real images of 8 different concentrate types (Shatter, Wax, Resin, Rosin, Budder, Diamonds, Sauce, Crumble) within the app.
*   **Calendar Tracking**: Track my dab sessions, view statistics, and analyze my usage patterns over time.
*   **Working APK**: Receive a fully functional Android application package (APK) that can be installed and used on Android devices.

## 4. Functional Requirements

### 4.1. User Interface and Experience

*   The application shall feature a modern UI with gradient colors, shadows, and contemporary styling.
*   The header shall display the current time in HH:MM format only.
*   The application shall be optimized for mobile portrait mode with a compact layout.
*   A custom app icon shall be used.

### 4.2. Navigation

*   The application shall implement a four-tab bottom navigation structure: Home, Timer, Calendar, and Settings.
*   Clicking a tab icon shall switch to the corresponding screen, displaying its content.
*   The Settings functionality shall be accessible via its dedicated navigation tab, not a separate button or pop-up.

### 4.3. Timer Functionality

*   The timer shall calculate heat-up and cool-down times based on selected material type (e.g., Quartz, Titanium, Ceramic), concentrate type (e.g., Shatter, Wax, Resin), and heating method (e.g., Butane, Propane).
*   Users shall be able to input and save custom heat-up and cool-down times via the Settings tab.
*   Custom timer inputs shall override the calculated default times when applied.
*   The timer shall display the current mode (e.g., "HEAT UP", "COOL DOWN") and the remaining time.
*   The timer shall include controls for starting, pausing, and resetting the countdown.
*   A progress bar shall visually represent the timer's progress.
*   Completion animations or messages (e.g., "FLAME OFF", "ENJOY") shall be displayed at the end of each timer phase.

### 4.4. Color Themes

*   The application shall offer 6 distinct color themes: Green, Blue, Purple, Orange, Pink, and Teal.
*   Users shall be able to select their preferred theme from the Settings tab.
*   The selected theme shall be applied dynamically across the entire application interface.
*   The selected theme shall persist across app sessions.

### 4.5. Concentrate Images

*   The application shall display real images for 8 types of concentrates: Shatter, Wax, Resin, Rosin, Budder, Diamonds, Sauce, and Crumble.
*   These images shall be integrated into the UI where concentrate types are selected or displayed.

### 4.6. Calendar Functionality

*   The Calendar tab shall allow users to track and view their past dab sessions.
*   It shall display statistics related to dab sessions, such as total dabs, sessions today, and dab streaks.
*   It shall include charts for usage frequency, concentrate preferences, material preferences, and peak hours.
*   Users shall be able to filter calendar data by time range (e.g., week, month, year).

## 5. Technical Requirements

*   **Framework**: Capacitor.js, wrapping vanilla HTML/CSS/JavaScript.
*   **Platform**: Android mobile application.
*   **Build System**: Gradle 8.7.2, Java 17, Node.js 20.
*   **Dependencies**: Capacitor Android 5.0.6, AndroidX libraries.
*   **Repository**: `https://github.com/twoskoops707/DabTimer`.
*   **CI/CD**: GitHub Actions workflow for automated Android APK builds.
*   **Code Quality**: All deprecated elements shall be removed or updated. All versions and dependencies shall be verified for compatibility and stability.

## 6. Out-of-Scope

*   iOS application development.
*   Advanced user authentication or profile management beyond a simple username display.
*   Cloud synchronization of dab session data.
*   Push notifications.

## 7. Open Questions / Future Considerations

*   Detailed specifications for calendar data storage (e.g., local storage, database).
*   User feedback mechanism for reporting issues or suggesting features.
*   Accessibility features for users with disabilities.

## 8. Revision History

| Version | Date       | Author   | Description                               |
| :------ | :--------- | :------- | :---------------------------------------- |
| 1.0     | 2025-10-19 | Manus AI | Initial draft based on user requirements. |
