# AdNova AI

Next.js app for AI-powered video ads (Clerk, Convex, HeyGen, Remotion).

## Development

```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev                  # Next.js
# in another terminal:
npm run dev:convex           # Convex backend
# or both:
npm run dev:all
```

See `.env.example` for required environment variables.

## Deploy

Build with `npm run build`, start with `npm run start`. Configure production secrets in your host and in the Convex dashboard (never commit `.env` or `.env.local`).
