/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BRAPI_API_KEY: string;
    readonly VITE_BRAPI_API_CONSULT_ROUTE: string;
    readonly VITE_CACHE_KEY: string;
    readonly VITE_CACHE_TIMESTAMP_KEY: string;
    readonly VITE_CACHE_DURATION: number; // in milliseconds
    readonly VITE_API_URL_WALLET: string;
    readonly VITE_WALLET_COMPLETE_ENDPOINT: string;
    readonly VITE_DIVIDENDS_COMPLETE_ENDPOINT: string;
    readonly VITE_ALL_TRANSACTIONS_ENDPOINT: string;
}