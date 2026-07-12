import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative base so the built dist/ works from any static folder.
  base: "./",
  plugins: [react(), tailwindcss()],
});
