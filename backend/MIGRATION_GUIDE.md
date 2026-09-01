# Migration Guide: Java Spring Boot → Python FastAPI

This guide explains the migration from Java Spring Boot (MongoDB) to Python FastAPI (PostgreSQL).

## Key Changes

### Database
- **Before**: MongoDB (NoSQL)
- **After**: PostgreSQL (SQL)
- **ORM**: SQLAlchemy instead of Spring Data MongoDB

### Framework
- **Before**: Spring Boot 3.x
- **After**: FastAPI 0.104+
- **Language**: Java → Python

### Authentication
- **Before**: Spring Security + JWT
- **After**: FastAPI Security + python-jose
- **Password Hashing**: BCrypt (same algorithm)

## API Endpoints

All endpoints remain the same:
- `/api/login` → `/api/login`
- `/api/signup` → `/api/signup`
- `/api/appointments/book` → `/api/appointments/book`
- `/api/reviews/submit` → `/api/reviews/submit`

## Data Model Changes

### User Model
- `id`: String (UUID) - Same
- `username`: String - Same
- `email`: String - Same
- `password`: String (BCrypt) - Same
- `role`: String - Same

### Patient Model
- Arrays (allergies, medical_conditions) → PostgreSQL ARRAY type
- Medical History → JSON column

### Appointment Model
- PaymentDetails → JSON column
- NotificationDetails → JSON column

### Review Model
- Same structure, stored in PostgreSQL

## Migration Steps

1. **Export data from MongoDB** (if needed)
2. **Set up PostgreSQL database**
3. **Run Alembic migrations** to create tables
4. **Import data** (if migrating existing data)
5. **Update frontend** if API responses changed

## Testing

Test all endpoints to ensure compatibility:
- Login/Signup
- Appointment booking
- Review submission
- User profile

## Notes

- JWT tokens are compatible (same algorithm)
- Password hashes are compatible (BCrypt)
- API responses maintain same structure
