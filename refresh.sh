#!/bin/bash
# Force refresh by modifying file timestamps
touch index.html
touch css/style.css
touch js/app.js
echo "Files touched - refresh browser with Ctrl+F5"
