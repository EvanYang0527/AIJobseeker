/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAGFLOW_BACKEND_URL?: string;
  readonly VITE_RAGFLOW_BACKEND_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
