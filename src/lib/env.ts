type Visibility = 'public' | 'private';

type EnvironmentDefinition = {
  name: string;
  visibility: Visibility;
  required: boolean;
  description: string;
  validate?: (value: string) => string | null;
};

export type EnvironmentIssue = {
  key: string;
  message: string;
  visibility: Visibility;
  received?: string;
};

export type PublicAppConfig = {
  appName: string;
  environment: string;
  publicUrl: string;
  timezone: string;
  location: string;
  hostingProvider: string;
  aiProvider: string;
  primaryBackend: string;
  secondaryBackend: string;
  primaryStorage: string;
};

const environmentValues = ['development', 'test', 'production'] as const;
const backendValues = ['supabase', 'firebase', 'none'] as const;
const providerValues = ['cloudflare', 'vercel', 'local'] as const;
const aiProviderValues = ['gemini', 'none'] as const;

function validateEnum(value: string, allowed: readonly string[], label: string) {
  return allowed.includes(value) ? null : `Expected ${label} to be one of: ${allowed.join(', ')}.`;
}

function validateTimezone(value: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return null;
  } catch {
    return 'Expected a valid IANA timezone name.';
  }
}

function validateUrl(value: string) {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Expected a valid absolute URL.';
  }
}

function validatePositiveInteger(value: string) {
  return /^\d+$/.test(value) && Number(value) > 0
    ? null
    : 'Expected a positive integer greater than 0.';
}

function validateSecretStrength(value: string) {
  return value.length >= 16
    ? null
    : 'Expected a non-empty secret value with at least 16 characters.';
}

const environmentDefinitions: EnvironmentDefinition[] = [
  { name: 'APP_NAME', visibility: 'public', required: true, description: 'User-facing app name.' },
  {
    name: 'APP_ENV',
    visibility: 'public',
    required: true,
    description: 'Runtime mode.',
    validate: (value) => validateEnum(value, environmentValues, 'APP_ENV'),
  },
  {
    name: 'APP_PUBLIC_URL',
    visibility: 'public',
    required: true,
    description: 'Public canonical application URL.',
    validate: validateUrl,
  },
  {
    name: 'APP_PUBLIC_TIMEZONE',
    visibility: 'public',
    required: true,
    description: 'Garden timezone.',
    validate: validateTimezone,
  },
  {
    name: 'APP_PUBLIC_LOCATION',
    visibility: 'public',
    required: true,
    description: 'Garden location label.',
  },
  {
    name: 'APP_HOSTING_PROVIDER',
    visibility: 'public',
    required: true,
    description: 'Deployment provider target.',
    validate: (value) => validateEnum(value, providerValues, 'APP_HOSTING_PROVIDER'),
  },
  {
    name: 'APP_AI_PROVIDER',
    visibility: 'public',
    required: true,
    description: 'Primary AI provider target.',
    validate: (value) => validateEnum(value, aiProviderValues, 'APP_AI_PROVIDER'),
  },
  {
    name: 'APP_PRIMARY_BACKEND',
    visibility: 'public',
    required: true,
    description: 'First production backend target.',
    validate: (value) => validateEnum(value, backendValues, 'APP_PRIMARY_BACKEND'),
  },
  {
    name: 'APP_SECONDARY_BACKEND',
    visibility: 'public',
    required: false,
    description: 'Optional secondary backend reservation.',
    validate: (value) => validateEnum(value, backendValues, 'APP_SECONDARY_BACKEND'),
  },
  {
    name: 'APP_PRIMARY_STORAGE',
    visibility: 'public',
    required: true,
    description: 'Primary asset storage target.',
  },
  {
    name: 'MAX_UPLOAD_MB',
    visibility: 'public',
    required: false,
    description: 'Upload size cap.',
    validate: validatePositiveInteger,
  },
  {
    name: 'AUTH_SECRET',
    visibility: 'private',
    required: true,
    description: 'Auth signing secret.',
    validate: validateSecretStrength,
  },
  {
    name: 'SESSION_SECRET',
    visibility: 'private',
    required: true,
    description: 'Session encryption secret.',
    validate: validateSecretStrength,
  },
  {
    name: 'ENCRYPTION_KEY',
    visibility: 'private',
    required: true,
    description: 'Application encryption key.',
    validate: validateSecretStrength,
  },
  {
    name: 'CRON_SECRET',
    visibility: 'private',
    required: true,
    description: 'Scheduler secret.',
    validate: validateSecretStrength,
  },
  {
    name: 'WEBHOOK_SECRET',
    visibility: 'private',
    required: true,
    description: 'Webhook verification secret.',
    validate: validateSecretStrength,
  },
  {
    name: 'GEMINI_API_KEY',
    visibility: 'private',
    required: true,
    description: 'Gemini API key.',
    validate: validateSecretStrength,
  },
  {
    name: 'SUPABASE_URL',
    visibility: 'private',
    required: false,
    description: 'Supabase project URL.',
    validate: validateUrl,
  },
  {
    name: 'SUPABASE_ANON_KEY',
    visibility: 'private',
    required: false,
    description: 'Supabase anon key.',
    validate: validateSecretStrength,
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    visibility: 'private',
    required: false,
    description: 'Supabase service role key.',
    validate: validateSecretStrength,
  },
  {
    name: 'FIREBASE_PRIVATE_KEY',
    visibility: 'private',
    required: false,
    description: 'Firebase private key.',
    validate: validateSecretStrength,
  },
];

export const publicAppRuntimeContract = environmentDefinitions.filter(
  (definition) => definition.visibility === 'public' && definition.name.startsWith('APP_'),
);

function redactIfPrivate(definition: EnvironmentDefinition, value: string) {
  return definition.visibility === 'private' ? '[REDACTED]' : value;
}

export function validateEnvironment(
  source: Record<string, string | undefined>,
  definitions: EnvironmentDefinition[],
) {
  const issues: EnvironmentIssue[] = [];

  for (const definition of definitions) {
    const value = source[definition.name]?.trim();

    if (!value) {
      if (definition.required) {
        issues.push({
          key: definition.name,
          visibility: definition.visibility,
          message: `Missing required environment variable ${definition.name} (${definition.description}).`,
        });
      }
      continue;
    }

    const validationMessage = definition.validate?.(value) ?? null;

    if (validationMessage) {
      issues.push({
        key: definition.name,
        visibility: definition.visibility,
        received: redactIfPrivate(definition, value),
        message: `Invalid environment variable ${definition.name}. ${validationMessage}`,
      });
    }
  }

  return { issues };
}

export function getPublicAppConfig(source: Record<string, string | undefined>) {
  const { issues } = validateEnvironment(source, publicAppRuntimeContract);

  return {
    config: {
      appName: source.APP_NAME?.trim() || 'Garden Tracker',
      environment: source.APP_ENV?.trim() || 'development',
      publicUrl: source.APP_PUBLIC_URL?.trim() || 'http://localhost:3000',
      timezone: source.APP_PUBLIC_TIMEZONE?.trim() || 'America/Chicago',
      location: source.APP_PUBLIC_LOCATION?.trim() || 'Columbia, TN',
      hostingProvider: source.APP_HOSTING_PROVIDER?.trim() || 'cloudflare',
      aiProvider: source.APP_AI_PROVIDER?.trim() || 'gemini',
      primaryBackend: source.APP_PRIMARY_BACKEND?.trim() || 'supabase',
      secondaryBackend: source.APP_SECONDARY_BACKEND?.trim() || 'firebase',
      primaryStorage: source.APP_PRIMARY_STORAGE?.trim() || 'cloudflare_r2',
    } satisfies PublicAppConfig,
    issues,
  };
}

export function validateFullEnvironment(source: Record<string, string | undefined>) {
  return validateEnvironment(source, environmentDefinitions);
}
