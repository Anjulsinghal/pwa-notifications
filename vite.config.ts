import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { promises as fs } from "fs";

// Get current directory since __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copy service worker to build directory
function copyServiceWorker() {
  return {
    name: "copy-sw",
    async closeBundle() {
      try {
        const swSrc = resolve(__dirname, "./public/sw.js");
        const swDest = resolve(__dirname, "./dist/sw.js");
        await fs.copyFile(swSrc, swDest);
        // Using console is fine in Vite plugins - this works in Node environment
      } catch (error) {
        // Using console is fine in Node.js environment
        process.stderr.write(`Failed to copy service worker: ${error}\n`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: "pwa-notifications",
        short_name: "nothing",
        description: "pwa-notifications",
        theme_color: "#ffffff",
        display: "fullscreen",
        orientation: "portrait",
        categories: ["productivity"],
        prefer_related_applications: false,
      },
      workbox: {
        // importWorkbox: true,
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
    copyServiceWorker(),
  ],
});
