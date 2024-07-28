#!/bin/sh
GITHUB_OUTPUT=/dev/null
DEPENDENCY_NAME="@angular/core"

CURRENT_VERSION=$(jq -r ".packages[\"node_modules/$DEPENDENCY_NAME\"].version" package-lock.json)
echo "Current version of $DEPENDENCY_NAME: $CURRENT_VERSION"
echo "CURRENT_VERSION=$CURRENT_VERSION" >> "$GITHUB_OUTPUT"
LATEST_VERSION=$(npx --yes latest-version-cli "$DEPENDENCY_NAME")
echo "Latest version of $DEPENDENCY_NAME: $LATEST_VERSION"
echo "LATEST_VERSION=$LATEST_VERSION" >> "$GITHUB_OUTPUT"

CURRENT_MAJOR_VERSION=$(echo "$CURRENT_VERSION" | cut -d'.' -f1)
echo "Current major version of $DEPENDENCY_NAME: $CURRENT_MAJOR_VERSION"
echo "CURRENT_MAJOR_VERSION=$CURRENT_MAJOR_VERSION" >> "$GITHUB_OUTPUT"
LATEST_MAJOR_VERSION=$(echo "$LATEST_VERSION" | cut -d'.' -f1)
echo "Latest major version of $DEPENDENCY_NAME: $LATEST_MAJOR_VERSION"
echo "LATEST_MAJOR_VERSION=$LATEST_MAJOR_VERSION" >> "$GITHUB_OUTPUT"

if [ "$CURRENT_MAJOR_VERSION" != "$LATEST_MAJOR_VERSION" ]; then
  echo "There is a new version of $DEPENDENCY_NAME available!"
  echo "BRANCH_NAME=upgrade-from-angular-$CURRENT_MAJOR_VERSION-to-angular-$LATEST_MAJOR_VERSION" >> "$GITHUB_OUTPUT"
else
  echo "You are using the latest version of $DEPENDENCY_NAME."
  echo "BRANCH_NAME=na" >> "$GITHUB_OUTPUT"
fi
