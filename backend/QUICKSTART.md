# Quick Start Guide - FastAPI Backend

## 🚀 Quick Start

### Option 1: Using Docker (Easiest)

```bash
cd backend_python

# Start PostgreSQL and FastAPI
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# Check logs
docker-compose logs -f backend
```

API will be available at: http://localhost:8000

### Option 2: Local Development

```bash
cd backend_python

# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Start PostgreSQL (if not using Docker)
# Make sure PostgreSQL is running on localhost:5432

# 5. Run migrations
alembic upgrade head

# 6. Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 First Time Setup

1. **Database Setup**
   ```bash
   # Using Docker
   docker-compose up -d postgres
   
   # Or create manually
   createdb mediassist
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Run Migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start Server**
   ```bash
   uvicorn app.main:app --reload
   ```

## 🔍 Verify Installation

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **API Documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

3. **Test Login**
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env
- Check PostgreSQL logs

### Port Already in Use
- Change port in `uvicorn` command: `--port 8001`
- Or kill process using port 8000

### Migration Errors
- Drop and recreate database (development only)
- Check Alembic version: `alembic current`
- Reset migrations: `alembic downgrade base && alembic upgrade head`

## 📚 Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for migration details
- Review API endpoints at http://localhost:8000/docs
