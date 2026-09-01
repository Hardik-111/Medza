# Dr. JSP — Home Clinic, Gorakhpur

Website for **Dr. JSP Singh’s Home Clinic** in Rapti Nagar, Gorakhpur: in-person doctor consultations and video consultations.

Live brand name on the site is **Dr. JSP**. The GitHub repo may still be named Medza; that does not appear in the public UI.

## Run locally

**Frontend** (http://localhost:8080)

```bash
cd frontend
npm install
cp .env.example .env.local   # optional
npm run dev
```

**Backend** (http://localhost:8000 — FastAPI, optional until booking goes live)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# copy .env and start PostgreSQL
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The public site runs without the backend (`VITE_ENABLE_BACKEND_FEATURES=false` by default).

## Project layout

```
frontend/     React + TypeScript + Vite
backend/      FastAPI + PostgreSQL
```

Doctor photo: `frontend/src/assets/doctor-new.png` (also copied to `frontend/public/og-doctor.png` for sharing).

## Deploy and SEO

1. Set the real domain in `frontend/.env.production`:

   ```
   VITE_SITE_URL=https://YOUR-DOMAIN
   ```

2. Replace `https://drjsp.in` in these files if your domain is different:

   - `frontend/index.html` (canonical, Open Graph, JSON-LD)
   - `frontend/public/sitemap.xml`
   - `frontend/public/robots.txt`

3. Build and host the frontend:

   ```bash
   cd frontend
   npm run build
   ```

   Upload the `frontend/dist` folder to any static host (Netlify, Vercel, Cloudflare Pages, Nginx).

4. **Google Search Console** — after the site is live:

   - Add the property (URL prefix).
   - Choose **HTML file** verification.
   - Drop the file Google gives you (for example `googleXXXXXXXX.html`) into `frontend/public/`.
   - Rebuild and redeploy so the file is served at `https://YOUR-DOMAIN/googleXXXXXXXX.html`.
   - Submit `https://YOUR-DOMAIN/sitemap.xml`.

5. Also create a **Google Business Profile** for the Rapti Nagar clinic. For a local doctor, Maps + GBP usually bring more patients than keywords alone.

## What ranking actually needs

Titles, descriptions, and on-page copy now include phrases people search for: *doctor consultation Gorakhpur*, *video doctor consultation*, *home clinic Rapti Nagar*, *Dr JSP*. Google largely ignores the keywords meta tag; it is kept as a hint, not a ranking trick.

A new clinic site will not sit at #1 for “doctor consultation” nationwide. What helps:

- A real domain with HTTPS
- Search Console + sitemap
- Google Business Profile with the same NAP (name, address, phone)
- Consistent **Dr. JSP** name on the site, WhatsApp, and Maps
- Reviews from real patients
- Pages that stay useful (this site already has Home, About, Plans, Appointments, Video)

## Support

Clinic phone: +91 7905152928 · WhatsApp: see the site header.
