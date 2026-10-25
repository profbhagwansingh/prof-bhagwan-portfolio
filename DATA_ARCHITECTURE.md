# Data Storage Architecture & Safety Rules

This document outlines the authoritative data boundaries, storage locations, and safety rules for the Prof. (Dr.) Bhagwan Singh academic portfolio site (`profbhagwansingh.com`).

---

## 1. Storage Boundaries Matrix

| Data Classification | Storage Location | Service Provider | Persistence & Lifecycle | Access & Management |
| :--- | :--- | :--- | :--- | :--- |
| **Media & User Uploads** | Cloudinary Cloud Storage (`profbhagwan/*`) | Cloudinary (CDN-backed) | **Permanent**. Survives all server restarts, code redeploys, and container teardowns. | Uploaded via `MediaService` using in-memory streams; referenced in DB via secure HTTPS URLs and `public_id`. |
| **Structured Records** | PostgreSQL Database | Supabase (Tokyo region: `aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres`) | **Permanent**. Managed cloud database independent of the web server. | Accessed via Prisma ORM (`backend/prisma/schema.prisma`). |
| **Code, Migrations & CI/CD** | Git Repository | GitHub (`profbhagwansingh/prof-bhagwan-portfolio`) | **Permanent & Versioned**. | Version-controlled codebase, additive Prisma migration files, GitHub Actions workflows. |
| **Server Container Disk** | Ephemeral Local Filesystem | Render (Backend) / Vercel (Frontend) | **Ephemeral / Stateless**. Erased on every container restart, sleep, or redeployment. | **Strictly NO persistent user uploads or database dumps permitted.** |

---

## 2. Storage Rules Enforced in the Codebase

1. **Zero User Content on Local Disk**:
   - `backend/src/ecrrb/ecrrb.service.ts`: ECRRB certification applications (protocols, ICFs, CVs, tools) upload directly to Cloudinary under folder `profbhagwan/ecrrb-certifications` using in-memory multer buffers.
   - `backend/src/submissions/submissions.controller.ts`: Alumni registration photos upload directly to Cloudinary under folder `profbhagwan/alumni`.
   - `backend/src/gallery/gallery.service.ts`: Gallery uploads stream directly to Cloudinary under folder `profbhagwan/gallery`.
   - All `fs.writeFileSync`, `fs.mkdirSync`, `fs.writeFile`, and `multer.diskStorage` calls for user uploads have been removed.

2. **No Ephemeral In-Container Backups**:
   - The startup script `backup-db.js` and the in-process `BackupModule` (which previously dumped JSON files into `process.cwd()/backups` on the server disk) have been eliminated.
   - Database backups are handled externally via automated `pg_dump` to offsite cloud storage.

3. **No Local Static Upload Directories**:
   - `uploads/` has been removed from `ServeStaticModule` in `app.module.ts`. The backend does not serve static user uploads from its local disk.

---

## 3. Database Environment Verification (Supabase vs. Render)

To verify which database the live Render backend communicates with:

1. Log in to the [Render Dashboard](https://dashboard.render.com).
2. Click on the backend Web Service for `profbhagwan-portfolio`.
3. In the left navigation, click **Environment**.
4. Locate the `DATABASE_URL` environment variable:
   - Click the reveal eye icon to inspect **only the host portion** (between `@` and `:`).
   - If the host is `aws-0-ap-northeast-1.pooler.supabase.com` (or `*.supabase.co`), Render is pointing directly to your Supabase PostgreSQL database.
   - If the host is `dpg-xxxx.oregon-postgres.render.com` (or similar), Render is using an internal Render PostgreSQL instance.
   > **Note**: Never copy or share the password portion of the connection string.

---

## 4. Disaster Recovery & Next Steps

* **Step 2**: Automated offsite encrypted nightly `pg_dump` via GitHub Actions with retention rules (7 daily, 4 weekly, 6 monthly).
* **Step 3**: Automated Cloudinary asset manifests and weekly offsite sync, plus soft-deletion safeguards.
* **Step 4**: Production migration safety guards (`prisma migrate deploy` only) and pre-deploy dump workflows.
* **Step 5**: Verified restore runbook (`RESTORE.md`) with schema and row-count verification.
* **Step 6**: Credential rotation and `.env` security hygiene.
