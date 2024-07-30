import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv, type PluginOption } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { pwaOptions } from "./pwa.config";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., development, production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA(pwaOptions),
      visualizer({
        emitFile: false,
        filename: "stats.html"
      }) as unknown as PluginOption
    ],
    resolve: {
      alias: {
        "@": "/src"
      }
    },
    server: {
      host: "0.0.0.0",
      port: 3000
    },
    define: {},
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          entryFileNames: "js/[name].js",
          chunkFileNames: "js/[name].js",
          assetFileNames: assetInfo => {
            if (assetInfo.name && (assetInfo.name as string).endsWith(".css")) {
              return "css/[name].css";
            }
            return "assets/[name][extname]";
          },
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
            return "app";
          }
        }
      },
      chunkSizeWarningLimit: 3000,
      cssCodeSplit: true
    },
    base: env.VITE_APP_ASSET_URL // Use the loaded environment variable
  };
});
