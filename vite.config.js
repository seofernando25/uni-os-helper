import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

import path from "path";
import { fileURLToPath } from "url";
const file = fileURLToPath(import.meta.url);
const dir = path.dirname(file).replace(/\\+/, "/");

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@lib": `${path.resolve(dir, "src/lib/")}`,
      "@components": `${path.resolve(dir, "src/lib/components/")}`,
      "@assets": `${path.resolve(dir, "src/assets/")}`,
    },
  },
});
