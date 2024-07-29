/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_API_ENDPOINT: string;
  readonly VITE_APP_ASSET_URL: string;
  readonly VITE_APP_LANDLORD_API_ENDPOINT: string;
  // Add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
