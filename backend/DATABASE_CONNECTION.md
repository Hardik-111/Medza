# PostgreSQL Database Connection Guide

## 📊 Connection Details

**Database Name:** `mediassist`  
**Username:** `postgres`  
**Password:** `postgres`  
**Host:** `localhost`  
**Port:** `5432`

---

## 🔧 Command Line (psql)

### Connect to PostgreSQL

```bash
# Option 1: Connect directly to the database
psql -h localhost -U postgres -d mediassist

# Option 2: Connect to PostgreSQL server first, then switch database
psql -h localhost -U postgres
# Then run: \c mediassist

# Option 3: Using Docker (if running in Docker)
docker-compose exec postgres psql -U postgres -d mediassist
```

### Useful psql Commands

Once connected, use these commands:

```sql
-- List all databases
\l

-- Connect to a database
\c mediassist

-- List all tables
\dt

-- Describe a table structure
\d users
\d patients
\d appointments
\d reviews

-- List all tables with details
\dt+

-- View table data
SELECT * FROM users;
SELECT * FROM patients;
SELECT * FROM appointments;
SELECT * FROM reviews;

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM appointments;
SELECT COUNT(*) FROM reviews;

-- View table schema
\d+ users

-- Exit psql
\q
```

### Quick View Commands

```sql
-- View all users
SELECT id, name, email, role, active, created_at FROM users;

-- View all patients
SELECT id, name, phone, email, total_visits, created_at FROM patients;

-- View all appointments
SELECT id, patient_name, appointment_date, appointment_status, consultation_fee 
FROM appointments 
ORDER BY appointment_date DESC;

-- View all reviews
SELECT id, patient_name, rating, category, verified, created_at 
FROM reviews 
ORDER BY created_at DESC;
```

---

## 🦫 DBeaver Connection Setup

### Step 1: Download DBeaver
- Download from: https://dbeaver.io/download/
- Install the application

### Step 2: Create New Connection

1. **Open DBeaver** and click **"New Database Connection"** (plug icon) or `File > New > Database Connection`

2. **Select PostgreSQL** from the database list

3. **Enter Connection Details:**
   ```
   Host: localhost
   Port: 5432
   Database: mediassist
   Username: postgres
   Password: postgres
   ```

4. **Test Connection:**
   - Click **"Test Connection"** button
   - If prompted, download PostgreSQL driver (DBeaver will do this automatically)
   - You should see "Connected" message

5. **Save and Connect:**
   - Click **"Finish"** or **"OK"**
   - The connection will appear in the Database Navigator panel

### Step 3: View Tables

1. **Expand the connection** in the Database Navigator
2. **Navigate to:** `mediassist > Schemas > public > Tables`
3. **You'll see:**
   - `users`
   - `patients`
   - `appointments`
   - `reviews`

4. **View Table Data:**
   - Right-click on any table → **"View Data"**
   - Or double-click the table

5. **View Table Structure:**
   - Right-click on any table → **"Properties"** → **"Columns"** tab

---

## 🐳 Docker Connection

If PostgreSQL is running in Docker:

### Check if PostgreSQL is running
```bash
cd backend_python
docker-compose ps postgres
```

### Connect via Docker
```bash
# Connect to PostgreSQL container
docker-compose exec postgres psql -U postgres -d mediassist

# Or connect to PostgreSQL server
docker-compose exec postgres psql -U postgres
```

### View Docker Logs
```bash
docker-compose logs postgres
```

---

## 📝 Common SQL Queries

### View All Tables and Row Counts
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### View Table Row Counts
```sql
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;
```

### View Recent Users
```sql
SELECT id, name, email, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Recent Appointments
```sql
SELECT 
    a.id,
    a.patient_name,
    a.appointment_date,
    a.appointment_status,
    a.consultation_fee,
    a.created_at
FROM appointments a
ORDER BY a.appointment_date DESC
LIMIT 20;
```

### View Reviews Statistics
```sql
SELECT 
    category,
    COUNT(*) as total_reviews,
    AVG(rating) as avg_rating,
    COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews
FROM reviews
GROUP BY category;
```

---

## 🔐 Password Prompt

If you're prompted for a password:
- **Password:** `postgres`
- Or set `PGPASSWORD` environment variable:
  ```bash
  export PGPASSWORD=postgres
  psql -h localhost -U postgres -d mediassist
  ```

---

## 🛠️ Troubleshooting

### Connection Refused
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Or check Docker
docker-compose ps postgres
```

### Database Doesn't Exist
```bash
# Create database
psql -h localhost -U postgres -c "CREATE DATABASE mediassist;"

# Or via Docker
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE mediassist;"
```

### Permission Denied
- Make sure you're using the correct username: `postgres`
- Check if PostgreSQL is configured to allow local connections

---

## 📚 Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- DBeaver Documentation: https://dbeaver.io/docs/
- psql Command Reference: https://www.postgresql.org/docs/current/app-psql.html
