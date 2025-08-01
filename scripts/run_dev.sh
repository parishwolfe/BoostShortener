#!/bin/bash
set -e

# Start the Postgres container with equivalent settings to the docker-compose file.
echo "Starting Postgres container..."

docker run -d --name boostshortener-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=boostshortener \
  --env-file ./db/.env \
  -p 5432:5432 \
  -v boostshortener_db:/var/lib/postgresql/data \
  -v "$(pwd)/db/ddl.sql":/docker-entrypoint-initdb.d/ddl.sql \
  postgres:16

# Wait for a few seconds to allow the database to initialize.
echo "Waiting for Postgres to start..."
sleep 10

# Install Node dependencies.
echo "Installing dependencies..."
npm install

# Start the Next.js development server.
echo "Starting development server..."
npm run dev