import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";

export default {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  kit: {
    adapter: adapter(),

    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
    },
  },
};
