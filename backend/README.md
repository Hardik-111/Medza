# MediAssist Backend - FastAPI + PostgreSQL

A modern healthcare practice management backend built with FastAPI and PostgreSQL.

## 🚀 Features

- **FastAPI** - Modern, fast web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - ORM for database operations
- **JWT Authentication** - Secure token-based auth
- **Alembic** - Database migrations
- **Docker** - Containerized deployment

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend_python
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database

#### Option A: Using Docker Compose (Recommended)

```bash
docker-compose up -d postgres
```

#### Option B: Local PostgreSQL

Create a database:
```sql
CREATE DATABASE mediassist;
```

Update `.env` with your database URL:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mediassist
```

### 4. Run Migrations

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run the Application

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000/api
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐳 Docker Deployment

### Build and Run

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- FastAPI backend on port 8000

### Run Migrations in Docker

```bash
docker-compose exec backend alembic upgrade head
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/patient/{phone}` - Get patient appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `PUT /api/appointments/{id}/status` - Update status
- `DELETE /api/appointments/{id}` - Cancel appointment

### Reviews
- `POST /api/reviews/submit` - Submit review
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/positive` - Get positive reviews
- `GET /api/reviews/stats` - Get statistics
- `POST /api/reviews/{id}/response` - Add doctor response
- `POST /api/reviews/{id}/verify` - Verify review

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

## 🔧 Development

### Create Migration

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Run Tests

```bash
pytest
```

## 📝 Environment Variables

See `.env.example` for all available configuration options.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## 📄 License

MIT License
