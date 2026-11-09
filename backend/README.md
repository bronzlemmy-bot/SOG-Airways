# SOG Airways Backend

The API runs directly from `src/server.ts`; it does not require or use a
`dist/` directory.

## Run locally

1. Install dependencies with `npm install`.
2. Configure `MONGODB_URI` and `JWT_SECRET` in the backend environment.
3. Configure `RESEND_API_KEY` and `EMAIL_FROM` to enable verification email
   delivery. `EMAIL_FROM` must be a sender address verified by Resend.
4. Start the source server with `npm run dev` or `npm start`.

The API defaults to `http://localhost:5000`. Set `PORT=5002` to use the
frontend's default backend URL, `http://localhost:5002/api/v1`. The CORS
origin defaults to `http://localhost:3000`; set `FRONTEND_URL` if the frontend
runs elsewhere.

## Validate

- `npm run typecheck` checks the TypeScript sources without emitting files.
- `npm run build` performs the same no-output TypeScript validation.
- `npm test` runs the backend unit and API integration tests.

`MONGODB_DB_NAME` is optional. In production, `JWT_SECRET` must contain at
least 32 characters. Keep credentials in an ignored environment file and do
not expose them to the frontend.

Customer registration creates a pending account and sends a six-digit email
verification code. Codes expire after 10 minutes, are single-use, and have a
five-attempt limit. Email delivery is disabled until both Resend settings are
configured; registration then returns an explicit service-unavailable error
instead of creating an account that cannot receive its code.
Existing customer accounts that have not verified an email can request a code
from the frontend’s `/verify-email` page before signing in.