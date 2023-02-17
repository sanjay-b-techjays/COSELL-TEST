/* eslint-disable linebreak-style */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_SALESFORCE_REDIRECT: string;
  readonly VITE_TRACKING_ID: string;
  readonly VITE_ENVIRONMENT: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
