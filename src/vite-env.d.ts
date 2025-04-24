/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface NotificationOptions {
  // Adding vibrate to fix TypeScript error
  vibrate?: number[];
}

// Add missing service worker types
interface ServiceWorkerRegistration {
  periodicSync?: {
    register(tag: string, options?: { minInterval: number }): Promise<void>;
    getTags(): Promise<string[]>;
  };
}
