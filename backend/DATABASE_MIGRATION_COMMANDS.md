# Database Migration Commands

## Quick Reference

### Check Current Migration Version
```bash
cd backend
alembic current
```

### Apply All Pending Migrations
```bash
cd backend
alembic upgrade head
```

### Apply Specific Migration
```bash
cd backend
alembic upgrade <revision_id>
```

### Rollback Last Migration
```bash
cd backend
alembic downgrade -1
```

### Rollback to Specific Version
```bash
cd backend
alembic downgrade <revision_id>
```

### View Migration History
```bash
cd backend
alembic history
```

### Create New Migration
```bash
cd backend
alembic revision -m "description_of_changes"
```

## Direct SQL Commands (Alternative)

If you prefer to run SQL directly instead of using Alembic:

### Add calendar_event_id Column to Appointments Table

```sql
-- Connect to PostgreSQL
psql -U postgres -d mediassist

-- Add the column
ALTER TABLE appointments 
ADD COLUMN calendar_event_id VARCHAR NULL;

-- Verify it was added
\d appointments
```

### Remove Column (if needed)
```sql
ALTER TABLE appointments 
DROP COLUMN calendar_event_id;
```

## Common Issues

### Issue: Column doesn't exist error
**Solution**: Run migrations
```bash
cd backend
alembic upgrade head
```

### Issue: Migration conflicts
**Solution**: Check current version and apply missing migrations
```bash
cd backend
alembic current
alembic upgrade head
```

### Issue: Need to reset database
**Warning**: This will delete all data!
```bash
cd backend
# Drop and recreate database
dropdb mediassist
createdb mediassist
# Run all migrations from scratch
alembic upgrade head
```

## Current Migration Status

The latest migration adds `calendar_event_id` to the `appointments` table:
- **Migration ID**: `4803e951ab6d`
- **Description**: `add_calendar_event_id_to_appointments`
- **Action**: Adds nullable `calendar_event_id` VARCHAR column

## Troubleshooting

### Check if column exists (PostgreSQL)
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
AND column_name = 'calendar_event_id';
```

### Check table structure
```sql
\d appointments
```

### List all migrations
```bash
cd backend
alembic history --verbose
```
