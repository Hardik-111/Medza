#!/bin/bash

# Start script for MediAssist FastAPI Backend

echo "🚀 Starting MediAssist Backend..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running locally."
    echo "📦 Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Check if database exists, create if not
echo "🔍 Checking database..."
psql -h localhost -U postgres -lqt | cut -d \| -f 1 | grep -qw mediassist 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📝 Creating database 'mediassist'..."
    docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE mediassist;" 2>/dev/null || \
    psql -U postgres -c "CREATE DATABASE mediassist;" 2>/dev/null || \
    echo "⚠️  Could not create database automatically. Please create it manually."
fi

# Run migrations
echo "🔄 Running database migrations..."
alembic upgrade head

# Start the server
echo "✨ Starting FastAPI server..."
echo "📚 API Docs: http://localhost:8000/docs"
echo "🌐 API: http://localhost:8000/api"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
