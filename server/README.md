# Zentora API

Local Express API for the Zentora frontend. It uses MongoDB when available and falls back to `data/db.json` for development.

## Run

```bash
npm install
npm run dev
```

The API listens on `http://localhost:9000`.

Admin login: `pandeyaman5283@gmail.com` / `Pandey@123`.

For production, set `ADMIN_PASSWORD` in `.env` and configure SMTP plus payment
provider credentials from `.env.example`. OTP delivery and live payments cannot
work until those provider credentials are supplied.

## MongoDB

Make sure the local MongoDB service is running, then seed realistic demo data:

```bash
npm run seed
```

Use `MONGODB_URI` and `MONGODB_DB` in `.env` to select another MongoDB instance/database.
