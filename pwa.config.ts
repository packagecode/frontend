import { VitePWAOptions } from "vite-plugin-pwa";

export const pwaOptions: VitePWAOptions = {
  registerType: "autoUpdate",
  injectRegister: false,
  minify: false,
  injectManifest: undefined,
  includeManifestIcons: false,
  manifestFilename: "manifest.json",
  disable: false,
  includeAssets: [
    "favicon.ico",
    "apple-touch-icon.png",
    "mask-icon.svg",
    "icon-144x144.png",
    "screenshot-wide.png",
    "screenshot-standard.png"
  ],
  manifest: {
    name: "Sokrio DMS",
    short_name: "Sokrio",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    lang: "en",
    scope: "/",
    theme_color: "#ffffff",
    description: "Sokrio DMS - Distributed Management System",
    icons: [
      {
        src: "icons/favicon.ico",
        sizes: "240x240",
        type: "image/x-icon",
        purpose: "maskable"
      },
      {
        src: "icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any"
      }
    ],
    screenshots: [
      {
        src: "img/screenshot-wide.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide"
      },
      {
        src: "img/screenshot-standard.png",
        sizes: "842x1358",
        type: "image/png"
      }
    ]
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    sourcemap: false,
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /^https:\/\/[a-zA-Z0-9-]+\.sokrio\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "sokrio-dms-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  },
  devOptions: {
    enabled: false
  }
};
