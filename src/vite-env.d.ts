/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_NAME?: string;
  readonly APP_ENV?: string;
  readonly APP_PUBLIC_URL?: string;
  readonly APP_PUBLIC_TIMEZONE?: string;
  readonly APP_PUBLIC_LOCATION?: string;
  readonly APP_HOSTING_PROVIDER?: string;
  readonly APP_AI_PROVIDER?: string;
  readonly APP_PRIMARY_BACKEND?: string;
  readonly APP_SECONDARY_BACKEND?: string;
  readonly APP_PRIMARY_STORAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
