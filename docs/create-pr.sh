#!/bin/sh
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef -q ".defaultBranchRef.name")
echo "Default branch: $DEFAULT_BRANCH"
