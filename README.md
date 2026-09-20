# Zentora

Zentora is a full-stack freelance marketplace connecting clients with freelancers.

Zentora is a React marketplace frontend connecting clients with freelancers.

## Requirements

- Node.js 20 or newer
- Zentora API running on `http://localhost:9000`

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run the API and frontend together, use `npm run dev:all`.

## Available Commands

```bash
npm run dev     # Start the development server
npm run lint    # Check the source code
npm run build   # Create a production build
npm run preview # Preview the production build
```

## Application Roles

- **Client:** posts projects, reviews bids and manages their profile.
- **Freelancer:** browses projects, places bids, purchases plans and tracks bids.
- **Admin:** manages users, clients, plans, projects and bids.

The logged-in user record and seven-day JWT are stored in `localStorage` under the `info` and `token` keys. Role-specific routes require a matching logged-in role, and API routes require the bearer token.

## API

The frontend currently calls the backend at `http://localhost:9000`. Copy `server/.env.example` to `server/.env` and set a strong `JWT_SECRET` before deployment. Development data is persisted in `server/data/db.json`; `MONGODB_URI` is documented as the future production database setting and is not required for local development.
