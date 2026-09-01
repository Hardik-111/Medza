# DBeaver Guide - Viewing Table Data

## 📊 How to View Table Data in DBeaver

### Method 1: Right-Click Menu (Easiest)

1. **Navigate to your table:**
   - Expand: `mediassist` → `Schemas` → `public` → `Tables`
   - Find your table (e.g., `users`, `patients`, `appointments`, `reviews`)

2. **Right-click on the table name**

3. **Select one of these options:**
   - **"View Data"** - Opens data in read-only mode
   - **"Open Data"** - Opens data in editable mode
   - **"Read Data in SQL"** - Opens SQL editor with SELECT query

4. **Data will appear in a new tab** at the bottom

---

### Method 2: Double-Click (Quickest)

1. **Navigate to:** `mediassist` → `Schemas` → `public` → `Tables`
2. **Double-click** on any table name (e.g., `users`)
3. **Data view opens automatically**

---

### Method 3: SQL Editor

1. **Open SQL Editor:**
   - Right-click on `mediassist` connection → **"SQL Editor"** → **"New SQL Script"**
   - Or press `Ctrl+Alt+S` (Windows/Linux) or `Cmd+Option+S` (Mac)

2. **Type your query:**
   ```sql
   SELECT * FROM users;
   SELECT * FROM patients;
   SELECT * FROM appointments;
   SELECT * FROM reviews;
   ```

3. **Execute:**
   - Press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
   - Or click the **"Execute SQL Statement"** button (▶️)

4. **Results appear** in the "Data" tab below

---

### Method 4: Drag and Drop

1. **Open SQL Editor** (Method 3, Step 1)
2. **Drag the table** from Database Navigator into the SQL Editor
3. **DBeaver auto-generates:** `SELECT * FROM table_name;`
4. **Execute** the query

---

## 🎯 Useful Features When Viewing Data

### Filter/Search Data
- **Search bar** at the top: Type to filter rows
- **Right-click column header** → "Filter" → Enter filter criteria
- **Right-click column header** → "Sort" → Ascending/Descending

### Edit Data
- **Right-click table** → "Open Data" (not "View Data")
- **Double-click a cell** to edit
- **Right-click row** → "Delete" to delete
- **Click "+" button** to add new row
- **Save changes:** Click "Save" button or `Ctrl+S`

### Refresh Data
- Click **"Refresh"** button (🔄) in toolbar
- Or press `F5`

### View Table Structure
- **Switch tabs:** Click "Structure" tab (next to "Data" tab)
- Or right-click table → "Properties" → "Columns" tab

### Export Data
- **Right-click data view** → "Export Data"
- Choose format: CSV, Excel, JSON, SQL, etc.

---

## 📋 Quick Reference

| Action | Shortcut |
|--------|----------|
| Open SQL Editor | `Ctrl+Alt+S` / `Cmd+Option+S` |
| Execute Query | `Ctrl+Enter` / `Cmd+Enter` |
| Refresh Data | `F5` |
| Save Changes | `Ctrl+S` / `Cmd+S` |
| New SQL Script | `Ctrl+Alt+N` / `Cmd+Option+N` |

---

## 🔍 Example Queries

### View All Users
```sql
SELECT * FROM users;
```

### View Users with Details
```sql
SELECT id, name, email, role, active, created_at 
FROM users 
ORDER BY created_at DESC;
```

### View All Appointments
```sql
SELECT 
    id,
    patient_name,
    appointment_date,
    appointment_status,
    consultation_fee
FROM appointments
ORDER BY appointment_date DESC;
```

### View Reviews with Statistics
```sql
SELECT 
    id,
    patient_name,
    rating,
    category,
    comment,
    verified,
    created_at
FROM reviews
ORDER BY created_at DESC;
```

### Count Records
```sql
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM patients) as total_patients,
    (SELECT COUNT(*) FROM appointments) as total_appointments,
    (SELECT COUNT(*) FROM reviews) as total_reviews;
```

---

## 🎨 Customizing Data View

### Change Column Width
- **Drag column borders** to resize
- **Double-click border** to auto-fit

### Hide/Show Columns
- **Right-click column header** → "Hide Column"
- **Right-click table** → "Properties" → "Columns" → Uncheck columns

### Change Row Height
- **Right-click data view** → "Format" → "Row Height"

### Color Coding
- **Right-click column** → "Format" → Set background/foreground colors

---

## 🐛 Troubleshooting

### "No data" or Empty Table
- Check if table has data: `SELECT COUNT(*) FROM table_name;`
- Verify you're connected to the correct database
- Check if filters are applied (clear search bar)

### Can't Edit Data
- Make sure you opened with "Open Data" not "View Data"
- Check table permissions
- Some tables may be read-only

### Connection Issues
- Right-click connection → "Edit Connection" → "Test Connection"
- Verify credentials: `postgres` / `postgres`
- Check if PostgreSQL is running: `docker-compose ps postgres`

---

## 💡 Pro Tips

1. **Use SQL Editor** for complex queries and joins
2. **Save frequently used queries** as SQL scripts
3. **Use "Read Data in SQL"** to see the generated SQL query
4. **Enable "Auto-refresh"** for real-time data updates
5. **Use "Compare Data"** to compare two tables or queries

---

## 📚 Additional Resources

- DBeaver Documentation: https://dbeaver.com/docs/
- SQL Tutorial: https://www.w3schools.com/sql/
- PostgreSQL Docs: https://www.postgresql.org/docs/
