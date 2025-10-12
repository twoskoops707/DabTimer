# Dab Timer

A modern, scientific timer application for dabbing sessions with precise heat-up and cool-down timing based on your material, concentrate, and heating element.

![Dab Timer](https://raw.githubusercontent.com/twoskoops707/DabTimer/main/www/img/icon.png)

## Features

- **⏱️ Timer**: Customizable heat-up and cool-down timers with visual progress
- **🔬 Science**: Detailed information about different concentrates and optimal temperatures
- **📅 Calendar**: Track your usage sessions over time
- **⚙️ Setup**: Configure your dab setup preferences (material, concentrate, heater type)
- **🧮 Scientific Formula**: Calculations based on thermal properties and material science

## Getting Started

### Quick Start - Using GitHub

**New to GitHub terminal?** Check out our [GitHub Terminal Access Guide](GITHUB_TERMINAL_GUIDE.md) to learn how to:
- Use GitHub Codespaces (recommended for beginners)
- Access terminal in your browser
- Set up local Git and terminal

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/twoskoops707/DabTimer.git
   cd DabTimer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Open the app:**
   - Open `www/index.html` in your browser
   - Or use a local server:
     ```bash
     npx http-server www
     ```

### Building for Android

This app can be built as an Android APK using Cordova:

1. **Install Cordova:**
   ```bash
   npm install -g cordova
   ```

2. **Add Android platform:**
   ```bash
   cordova platform add android
   ```

3. **Build:**
   ```bash
   cordova build android
   ```

## GitHub Actions

This repository includes automated workflows that build the APK when you push to the main branch. Check the `.github/workflows/build.yml` file for details.

## Project Structure

```
DabTimer/
├── www/                      # Main web application
│   ├── index.html           # Main HTML file
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript files
│   │   ├── app.js          # Main app logic
│   │   ├── timer-*.js      # Timer functionality
│   │   ├── calendar.js     # Calendar features
│   │   └── science.js      # Science information
│   └── img/                # Images and icons
├── DabTimerAndroid/         # Android-specific files
└── .github/workflows/       # CI/CD automation
```

## How It Works

The timer uses scientific principles to calculate optimal heating and cooling times:

1. **Heat Time Calculation**: Based on material thermal properties, heater power, and target temperature
2. **Cool Time Calculation**: Uses exponential decay formula with material-specific time constants
3. **Material Properties**: Different materials (quartz, titanium, ceramic) have unique thermal characteristics
4. **Concentrate Types**: Each concentrate has an ideal vaporization temperature range

## Documentation

- **[GitHub Terminal Guide](GITHUB_TERMINAL_GUIDE.md)** - How to access terminal in GitHub
- **[GitHub Setup Script](DabTimerAndroid/www/github-setup.sh)** - Setup instructions
- **[App README](DabTimerAndroid/www/README.md)** - Detailed app documentation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## Support

Having trouble? Check out our documentation or open an issue on GitHub.

### Common Questions

- **"How do I get to the terminal in GitHub?"** - See our [GitHub Terminal Guide](GITHUB_TERMINAL_GUIDE.md)
- **"How do I push my code?"** - Run `git add .`, `git commit -m "message"`, `git push`
- **"How do I build the APK?"** - See the "Building for Android" section above

## License

This project is open source and available for personal use.

## Acknowledgments

Built with modern web technologies and scientific principles for the dabbing community.
