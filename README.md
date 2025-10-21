# 🔥 DabTimer

A modern, dark-themed timer application for dabbing sessions with scientific heat-up and cool-down calculations based on your material, concentrate, and heating element.

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-blue)
![Capacitor](https://img.shields.io/badge/capacitor-6.1.2-brightgreen)

## ✨ Features

### 🏠 Home Screen
- **Material Selection**: Choose between Quartz, Titanium, or Ceramic
- **Concentrate Types**: 8 different concentrate options (Shatter, Wax, Resin, Rosin, Budder, Diamonds, Sauce, Crumble)
- **Heater Options**: Butane or Propane torch
- Quick start timer with one tap

### ⏱️ Timer Screen
- **Automatic Calculations**: Scientific formula calculates optimal heat-up and cool-down times
- **Two-Phase Timer**: Heat-up phase followed by cool-down phase
- **Live Formula Display**: See the calculations based on your selections
- **Progress Bar**: Visual countdown indicator
- **Controls**: Start/Pause/Resume/Reset functionality

### 📊 Calendar Screen
- **Session Tracking**: Automatically logs every dab session
- **Quick Stats**: Total sessions, daily count, and streak tracking
- **Analytics Charts**: 
  - Session activity over time
  - Favorite concentrates
  - Material preferences
  - Peak usage hours
- **Recent History**: Detailed list of past sessions

### ⚙️ Settings Screen
- **12 Color Themes**: Choose from beautiful dark themes
  - Green (Default), Blue, Purple, Orange, Pink, Teal
  - Cyberpunk (neon), Earth (natural), Sunset (warm)
  - Forest (nature), Ocean (deep), Midnight (minimal)
- **Custom Timer Override**: Set your own heat and cool times

## 🧪 The Science

The app uses a scientific formula to calculate optimal temperatures:

```
t = (m × c × ΔT) / P
```

Where:
- **m** = Material thermal properties
- **c** = Concentrate vaporization point
- **ΔT** = Temperature differential
- **P** = Heat source power

### Material Properties
- **Quartz**: 30s heat / 45s cool (1.0x modifier)
- **Titanium**: 25s heat / 35s cool (1.0x modifier)
- **Ceramic**: 35s heat / 50s cool (1.0x modifier)

### Heater Modifiers
- **Butane Torch**: Standard timing (1.0x)
- **Propane Torch**: Faster heating (0.8x)

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Android SDK (for Android builds)
- JDK 17 (for Android builds)
- Xcode (for iOS builds - macOS only)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/twoskoops707/DabTimer.git
cd DabTimer
```

2. **Install dependencies**
```bash
npm install
```

3. **Sync Capacitor**
```bash
npm run sync
```

### Building

#### Android Debug Build
```bash
cd android
./gradlew assembleDebug
```

The APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Android Release Build
```bash
cd android
./gradlew assembleRelease
```

#### iOS Build
```bash
npx cap open ios
```
Then build from Xcode.

## 🤖 CI/CD

This repository includes automated GitHub Actions workflows:

### Android Workflow
- **Triggers**: Push to `main` or `develop`, Pull Requests
- **Actions**:
  - Builds debug APK on every push
  - Builds signed release APK/AAB on `main` branch (when keystore configured)
  - Uploads artifacts for easy download
- **Requirements**: 
  - Node.js 20
  - JDK 17
  - Android SDK

### Artifacts
After each successful build:
- **debug-apk**: Ready to install on any Android device (30 day retention)
- **release-apk**: Signed release APK (90 day retention, requires keystore)
- **release-aab**: Android App Bundle for Google Play Store (90 day retention, requires keystore)

## 📱 Installation on Device

### Android
1. Go to [Actions](https://github.com/twoskoops707/DabTimer/actions)
2. Click the latest successful workflow run
3. Download the `debug-apk` artifact
4. Unzip and transfer `app-debug.apk` to your device
5. Enable "Install from Unknown Sources" in Settings
6. Install the APK

### iOS
1. Open the project in Xcode
2. Connect your iOS device
3. Select your device as the build target
4. Click Run

## 📂 Project Structure

```
DabTimer/
├── .github/
│   └── workflows/
│       └── android.yml          # CI/CD workflow
├── android/                     # Native Android project
│   ├── app/
│   │   └── build.gradle        # App-level build config
│   ├── build.gradle            # Project-level build config
│   └── variables.gradle        # Shared version variables
├── www/                        # Web application
│   ├── css/
│   │   ├── style.css          # Main styles (dark theme)
│   │   ├── completion-animations.css
│   │   └── calendar-redesign.css
│   ├── js/
│   │   ├── app.js             # Main application logic
│   │   ├── calendar-core.js   # Calendar functionality
│   │   └── calendar-charts.js # Chart.js integration
│   ├── images/                # App icons and assets
│   └── index.html             # Main HTML structure
├── capacitor.config.json       # Capacitor configuration
├── package.json               # Node dependencies
└── README.md                  # This file
```

## 🛠️ Tech Stack

- **Framework**: [Capacitor](https://capacitorjs.com/) 6.1.2
- **UI**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Icons**: [Font Awesome](https://fontawesome.com/) 6.4.0
- **Fonts**: Montserrat, Open Sans
- **Storage**: localStorage API
- **Build**: Gradle 8.7.2

## 🎨 Theming

All themes feature a dark interface to prevent eye strain. Each theme changes:
- Primary gradient colors
- Background shades
- Accent colors
- Button highlights

Themes are stored in localStorage and persist across sessions.

## 💾 Data Storage

The app stores data locally using the browser's localStorage API:
- **User Settings**: Material, concentrate, heater, theme preferences
- **Custom Times**: User-defined heat and cool durations
- **Session History**: Complete log of all dab sessions with timestamps

Data is stored on-device and never transmitted.

## 🔐 Release Signing (Optional)

To build signed release APKs, add these secrets to your GitHub repository:

1. Generate a keystore:
```bash
keytool -genkey -v -keystore release-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias dabtimer-key
```

2. Add GitHub Secrets (Settings → Secrets → Actions):
   - `ANDROID_KEYSTORE_BASE64` - Base64-encoded .jks file
   - `ANDROID_KEYSTORE_PASSWORD` - Keystore password
   - `ANDROID_KEY_ALIAS` - Key alias (e.g., "dabtimer-key")
   - `ANDROID_KEY_PASSWORD` - Key password

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Capacitor](https://capacitorjs.com/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Icons from [Font Awesome](https://fontawesome.com/)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/twoskoops707/DabTimer/issues)
- Check existing issues before creating new ones

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Working timer with automatic calculations
- ✅ 12 beautiful dark themes
- ✅ Session tracking and analytics
- ✅ Custom timer overrides
- ✅ CI/CD with GitHub Actions
- ✅ Android APK builds
- ✅ Modern dark UI with smooth animations

---

**Perfect dabs, every time.** 🔥