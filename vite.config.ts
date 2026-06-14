import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"

const API_HEALTH_URL = process.env.VITE_API_HEALTH_URL ?? "http://localhost:8000/api/languages"

function apiHealthPlugin(): Plugin {
  return {
    name: "api-health-check",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        void fetch(API_HEALTH_URL)
          .then((response) => {
            if (!response.ok) {
              console.warn(
                `\n[vite] Backend ответил ${response.status} на ${API_HEALTH_URL}. Проверьте make dev.\n`,
              )
            }
          })
          .catch(() => {
            console.warn(
              "\n[vite] Backend недоступен на http://localhost:8000\n" +
                "       Запустите в другом терминале: cd fixed && make dev && make seed-dev\n" +
                "       Или всё сразу: cd fixed && make dev-all\n",
            )
          })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiHealthPlugin()],
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@monaco-editor")) {
            return "monaco"
          }
          if (id.includes("@xyflow/react")) {
            return "xyflow"
          }
          if (id.includes("node_modules")) {
            return "vendor"
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
})
