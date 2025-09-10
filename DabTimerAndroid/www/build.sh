#!/bin/bash
echo "Packaging Dab Timer app..."
zip -r DabTimer.zip . -x ".*" -x "__MACOSX" -x "build.sh"
echo "Done! Created DabTimer.zip"
