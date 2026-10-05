#!/bin/bash

files=(
  "client/src/constants/status.js:/** Task and Project Status Definitions */"
  "client/src/constants/navigation.js:/** Main Navigation Configuration */"
  "client/src/utils/index.js:/** Common Utility Functions */"
  "client/src/context/ThemeContext.jsx:/** Theme Management Context */"
  "client/src/context/SocketContext.jsx:/** WebSocket Connection Context */"
  "client/src/components/layout/TopNavbar.jsx:/** Top Navigation Bar Component */"
  "client/src/components/layout/Sidebar.jsx:/** Application Sidebar Component */"
  "client/src/components/project/ProjectCard.jsx:/** Project Display Card Component */"
  "client/src/components/project/CreateProjectModal.jsx:/** Modal Component for Project Creation */"
  "client/src/components/dashboard/ActivityFeed.jsx:/** User Activity Feed Component */"
)

for item in "${files[@]}"; do
  file="${item%%:*}"
  comment="${item##*:}"
  
  tmp_file=$(mktemp)
  echo "$comment" > "$tmp_file"
  cat "$file" >> "$tmp_file"
  mv "$tmp_file" "$file"
  
  filename=$(basename -- "$file")
  msg="docs: Add module documentation to $filename"
  
  git add "$file"
  git commit -m "$msg"
done
