import { describe, expect, it } from 'vitest';
import { validateFullEnvironment } from './env';

describe('validateFullEnvironment', () => {
  it('reports missing required values clearly', () => {
    const result = validateFullEnvironment({
      APP_ENV: 'development',
      APP_PUBLIC_TIMEZONE: 'America/Chicago',
      APP_PUBLIC_LOCATION: 'Columbia, TN',
      APP_HOSTING_PROVIDER: 'cloudflare',
      APP_AI_PROVIDER: 'gemini',
      APP_PRIMARY_BACKEND: 'supabase',
      APP_PRIMARY_STORAGE: 'cloudflare_r2',
    });

    const appNameIssue = result.issues.find((issue) => issue.key === 'APP_NAME');
    const publicUrlIssue = result.issues.find((issue) => issue.key === 'APP_PUBLIC_URL');

    expect(appNameIssue?.message).toContain('Missing required environment variable APP_NAME');
    expect(publicUrlIssue?.message).toContain(
      'Missing required environment variable APP_PUBLIC_URL',
    );
  });

  it('redacts private secret values from validation output', () => {
    const secretValue = 'short-secret';
    const result = validateFullEnvironment({
      APP_NAME: 'Garden Tracker',
      APP_ENV: 'development',
      APP_PUBLIC_URL: 'https://garden.example.com',
      APP_PUBLIC_TIMEZONE: 'America/Chicago',
      APP_PUBLIC_LOCATION: 'Columbia, TN',
      APP_HOSTING_PROVIDER: 'cloudflare',
      APP_AI_PROVIDER: 'gemini',
      APP_PRIMARY_BACKEND: 'supabase',
      APP_PRIMARY_STORAGE: 'cloudflare_r2',
      AUTH_SECRET: secretValue,
      SESSION_SECRET: 'another-short',
      ENCRYPTION_KEY: 'third-short',
      CRON_SECRET: 'fourth-short',
      WEBHOOK_SECRET: 'fifth-short',
      GEMINI_API_KEY: 'sixth-short',
    });

    const serialized = JSON.stringify(result.issues);
    const authSecretIssue = result.issues.find((issue) => issue.key === 'AUTH_SECRET');

    expect(serialized).not.toContain(secretValue);
    expect(authSecretIssue?.received).toBe('[REDACTED]');
    expect(authSecretIssue?.message).toContain('Invalid environment variable AUTH_SECRET');
  });
});
