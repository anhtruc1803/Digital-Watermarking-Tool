#!/usr/bin/env sh
set -e
echo "Starting backend..."
(cd backend && npm install && npm run dev)
