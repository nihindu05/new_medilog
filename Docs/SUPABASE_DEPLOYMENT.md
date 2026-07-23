# Deploying the MedLogs database to Supabase

Supabase hosts a PostgreSQL database and adds authentication, storage, APIs,
backups, and Row Level Security (RLS). This project keeps medical application
profiles in `public.user_account` and links them to Supabase Auth through
`user_account.auth_user_id`.

## 1. Create the Supabase project

1. Sign in at `https://supabase.com/dashboard`.
2. Select **New project**.
3. Choose a strong database password and the nearest region.
4. Wait until the database is ready.

Do not put the database password or the `service_role` key in frontend code.

## 2. Create the schema

Open **SQL Editor** in the Supabase dashboard and run these files in order:

1. `Backend/sql/tables.sql`
2. `Backend/sql/supabase_security.sql`
3. Optionally, for development only: `Backend/sql/samples.sql`

The first script creates the tables, foreign keys, checks, indexes, triggers,
and initial roles. The second script connects profiles to Supabase Auth and
enables RLS.

## 3. Create the first administrator

1. In **Authentication > Users**, create the administrator by email.
2. Copy the new user's UUID.
3. In the SQL editor, identify the JMO office and administrator role:

```sql
select jmo_office_id, office_name from public.jmo_office;
select role_id, role_name from public.roles
where role_name = 'System Administrator';
```

4. Create the corresponding application profile, replacing the sample values:

```sql
insert into public.user_account (
    auth_user_id,
    username,
    password_hash,
    full_name,
    email,
    account_status,
    doctor_id,
    jmo_office_id
) values (
    'SUPABASE-AUTH-USER-UUID',
    'admin',
    null,
    'System Administrator',
    'admin@example.com',
    'Active',
    null,
    1
)
returning user_id;
```

5. Assign the role using the returned `user_id`:

```sql
insert into public.user_role (user_id, role_id)
select 1, role_id
from public.roles
where role_name = 'System Administrator';
```

Replace `1` with the actual returned user ID.

## 4. Connect the Flask backend

In Supabase, open **Project Settings > Database** and copy the connection
information. Create `Backend/.env` locally:

```dotenv
DB_HOST=your-pooler-host.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=your-pooler-user
DB_PASSWORD=your-database-password
DB_SSLMODE=require
SUPABASE_URL=https://your-project-reference.supabase.co
SUPABASE_ANON_KEY=your-publishable-anon-key
CORS_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
FLASK_DEBUG=false
```

Find the project URL and publishable key in **Project Settings > API**. The
publishable/anon key is designed for client identification; authorization is
still enforced by Supabase Auth and the backend role checks. Never use the
secret/service-role key in browser code.

Use the Supabase transaction pooler for a hosted Flask service. Never commit
this `.env` file.

The database connector should require TLS:

```python
psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    sslmode=os.getenv("DB_SSLMODE", "require"),
)
```

## 5. Frontend authentication

Use the Supabase anonymous key in the browser only for Supabase Auth and
requests protected by RLS. Sign in with `supabase.auth.signInWithPassword`.
Do not query `password_hash`, implement password comparison in JavaScript, or
expose a service-role key.

## 6. Verify the deployment

Run:

```sql
select count(*) as table_count
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE';

select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

select conrelid::regclass as table_name, conname
from pg_constraint
where contype = 'f'
  and connamespace = 'public'::regnamespace
order by conrelid::regclass::text, conname;
```

Test with an authenticated non-administrator account as well as the
administrator. Anonymous requests must not be able to read patient, case,
examination, evidence, laboratory, document, or report data.

## Production notes

- Store uploaded files in a private Supabase Storage bucket.
- Store only the private object path in `case_document.storage_location`.
- Create signed URLs on demand after checking case access.
- Enable MFA for administrators and report approvers.
- Configure point-in-time recovery or scheduled backups.
- Keep audit logs append-only.
- Use synthetic data rather than real patient data during development.
