import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const projectRoot = import.meta.dirname

export default defineConfig({
  root: path.resolve(projectRoot, "src"),
  publicDir: path.resolve(projectRoot, "public"),
  envDir: projectRoot,
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "./src"),
    },
  },
  build: {
    outDir: path.resolve(projectRoot, "docs"),
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
  },
})
