#!/bin/bash

# Expected directory structure for DabTimer project
# Ignoring unused: img, sounds, js/science-fix.js
# Index at DabTimer/index.html
# Style at css/style.css (root and DabTimerAndroid/www)

EXPECTED_FILES=(
    ".github/workflows/build.yml"
    "css/style.css"
    "DabTimer/index.html"
    "DabTimerAndroid/www/css/style.css"
    "DabTimerAndroid/www/js/app.js"
    "DabTimerAndroid/www/config.xml"
    "DabTimerAndroid/www/index.html"
    "DabTimerAndroid/www/package.json"
    "DabTimerAndroid/www/README.md"
    "DabTimerAndroid/.gitignore"
    "DabTimerAndroid/config.xml"
    "js/app.js"
    "js/audio.js"
    "js/calendar-charts.js"
    "js/calendar-core.js"
    "js/calendar-fix.js"
    "js/calendar.js"
    "js/charts.js"
    "js/clock-fix.js"
    "js/config.js"
    "js/custom-times.js"
    "js/science.js"
    "js/style.css"
    "js/tab-fix.js"
    "js/timer-complete.js"
    "js/timer-fix.js"
    "js/timer-simple.js"
    "js/timer-universal.js"
    "templates/calculation-splash.html"
    "templates/science.html"
    "app.js"
    "calendar-screen.html"
    "fix_navigation.js"
    "fix-timer.html"
    "index.html"
    "index.html.clean"
    "package.json"
    "timer-screen.html"
    "verify-structure.html"
)

# Function to check if a file exists
check_file() {
    if [[ -f "$1" || -d "$1" ]]; then
        echo "✓ $1"
        return 0
    else
        echo "✗ MISSING: $1"
        return 1
    fi
}

# Run checks
echo "Verifying DabTimer project structure..."
echo "======================================"
MISSING_COUNT=0
for file in "${EXPECTED_FILES[@]}"; do
    check_file "$file"
    if [[ $? -eq 1 ]]; then
        ((MISSING_COUNT++))
    fi
done

# Check for unexpected items (excluding .git, node_modules, backups)
echo ""
echo "Checking for unexpected items (excluding .git, node_modules, backups)..."
UNEXPECTED=$(find . -maxdepth 2 -not -path "./.git*" -not -path "./node_modules*" -not -path "*backup*" -not -path "*zip" -not -path "./DabTimer_backup_*" | grep -v -E "^\./(css|js|templates|DabTimer|DabTimerAndroid|\.github|app\.js|calendar-screen\.html|fix_navigation\.js|fix-timer\.html|index\.html|index\.html\.clean|package\.json|timer-screen\.html|verify-structure\.html)$" | head -10)
if [[ -n "$UNEXPECTED" ]]; then
    echo "Unexpected files/folders found:"
    echo "$UNEXPECTED"
else
    echo "No unexpected items detected."
fi

echo ""
if [[ $MISSING_COUNT -eq 0 ]]; then
    echo "✓ All expected files and folders are present!"
else
    echo "✗ $MISSING_COUNT files/folders are missing. Please add them."
fi

# Optional: Generate a tree-like view
echo ""
echo "Current directory tree (top level):"
find . -maxdepth 2 -type f -o -type d | sort
