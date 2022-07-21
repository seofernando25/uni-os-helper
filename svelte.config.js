import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

// Check if environment variables contains GITHUB_ACTION
let pathBase = "";
if (process.env.GITHUB_ACTION) {
  console.log("GITHUB_ACTION detected");
  pathBase = "/uni-os-helper";
}

export default {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  kit: {
    adapter: adapter(),

    paths: {
      base: pathBase,
    },

    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
    },
  },
};
