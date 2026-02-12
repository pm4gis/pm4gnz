# ProjectHub

ProjectHub is a desktop-first project management web application scaffold targeting Microsoft Project and Planner style capabilities across waterfall and agile delivery.

## Current status

Implemented foundations:

- Step A: platform scaffold (Next.js, Tailwind, Prisma, NextAuth, Docker Postgres, seed data)
- Step B: account sign up, sign in, and organisation creation with membership assignment

## Demo accounts

- Org admin: `admin@demo.local` / `Password123!`
- Project member: `member@demo.local` / `Password123!`

## Quick start

1. Copy environment values:

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL:

   ```bash
   npm run db:up
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up database and seed:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open <http://localhost:3000>

## What you can do now

- Create an account at `/auth/signup`
- Sign in at `/auth/signin`
- Open `/app` to see your memberships
- Create a new organisation from the app page

## Tests

```bash
npm test
npm run test:e2e
```

## One-command workflows

- Dev: `npm run dev`
- Tests: `npm test`
