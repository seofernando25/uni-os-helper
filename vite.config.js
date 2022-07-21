import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    external: ["reflect-metadata"],
    noExternal: ["@fortawesome/fontawesome-free"],
  },
});
