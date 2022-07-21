import sveltePreprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
export default {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  kit: {
    adapter: adapter(),

    // default options are shown. On some platforms
    // these options are set automatically — see below
    // pages: 'build',
    // assets: 'build',
    // fallback: null,
    // precompress: false
    prerender: {
      // This can be false if you're using a fallback (i.e. SPA mode)
      default: true,
    },
  },
};
