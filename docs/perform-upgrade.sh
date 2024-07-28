#!/bin/sh
git checkout -b "$BRANCH_NAME"
MAJOR_VERSION=$(echo "$LATEST_VERSION" | cut -d'.' -f1)
npm run ng -- update @angular/core@"$MAJOR_VERSION" @angular/cli@"$MAJOR_VERSION" @angular/material@"$MAJOR_VERSION" @angular-eslint/schematics@"$MAJOR_VERSION" @angular-devkit/core@"$MAJOR_VERSION"
git commit -m "Upgrade $DEPENDENCY_NAME from $CURRENT_VERSION to $LATEST_VERSION"
git push -u origin "$BRANCH_NAME"
