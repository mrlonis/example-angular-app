#!/bin/sh
git fetch --all
if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
  echo "Branch '$BRANCH_NAME' already exists."
  echo "BRANCH_EXISTS=true" >> "$GITHUB_OUTPUT"
else
  echo "Branch '$BRANCH_NAME' does not exist."
  echo "BRANCH_EXISTS=false" >> "$GITHUB_OUTPUT"
fi
