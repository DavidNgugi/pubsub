#!/usr/bin/env bash
set -e

# set up environment variables
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

echo "Stopping all running servers to prevent duplicates..."

pm2 -s stop all 

sleep 2

# proceed if pm2 keys are set
if [ -n "$PM2_PUBLIC_KEY" ] && [ -n "$PM2_SECRET_KEY" ]; then

    echo "Linking PM2 to PM2.io..."

    pm2 -s link $PM2_PUBLIC_KEY $PM2_SECRET_KEY

    sleep 2
fi

echo "Starting publisher and subscriber servers..."

pm2 -s start -f ./src/publisher/index.js --name publisher && pm2 -s start -f ./src/subscriber/index.js --name subscriber

# Only run the cli monitor if in development mode
if [ "$NODE_ENV" = "development" ]; then
    sleep 2

    echo "Starting development server..."
    
    pm2 -s monit
fi