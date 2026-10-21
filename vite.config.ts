import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(() => {
  return {
    base: process.env.VITE_PUBLIC_URL || "/",
    build: {
      outDir: `build${process.env.VITE_PUBLIC_URL || ""}`,
    },
    plugins: [react()],
  }
})
