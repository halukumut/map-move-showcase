import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// `lovable-tagger` removed from frontend config
import svgr from "vite-plugin-svgr";
import dotenv from "dotenv";

// Load .env files
dotenv.config();

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: isDev
      ? {
          host: "127.0.0.1",
          port: 8080,
          proxy: {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    plugins: [
      react(),
      svgr(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist", // Publish directory
    },
    define: {
      // Prod ortamda backend URL .env'den çekilir
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    },
  };
});
