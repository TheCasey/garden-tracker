# Secret Handling

## Local Secrets

Use `.env` for local development secrets. The repository ignores `.env` and `.env.*` while explicitly allowing `.env.example`.

Never commit API keys, service-role keys, database passwords, private keys, session secrets, webhook secrets, or local swap files.

## Expected Secret Families

- Gemini: API key and model configuration.
- Cloudflare: account, zone, Workers, R2, KV, D1, and image credentials.
- Supabase: URL, anon key, service-role key, database password, JWT secret, and storage bucket.
- Firebase: client and service account settings if used later as a secondary backend.
- Application security: auth, session, encryption, cron, and webhook secrets.
- Observability and email: Sentry and Resend credentials when enabled.

## Production Secrets

Production values should live in the chosen deployment platform or managed service secret store, not in GitHub. GitHub Actions secrets should be added only when CI or deployment workflows need them.

## Rotation

If a secret is exposed in source control, rotate it at the provider, remove it from Git history if needed, and record the incident and remediation in the active phase run log.
