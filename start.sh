#!/bin/bash

# Start Go backend
./skribbl-server &

# Start Next.js frontend
cd /app
npx next start -p 3000
