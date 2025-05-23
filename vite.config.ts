import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
    dts(),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/components/index.ts"),
      name: "LdapPersonAuswahl",
      // the proper extensions will be added
      fileName: "ezldap-vue-select",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "vuetify", "vuetify/lib"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          "vuetify/lib": "Vuetify",
        },
      },
    },
  },
});
