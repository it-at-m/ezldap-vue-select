import { dirname, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const currentDir = dirname(fileURLToPath(import.meta.url));

  return {
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      vuetify({
        autoImport: true,
      }),
      dts({
        tsconfigPath: "./tsconfig.app.json",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      lib: {
        entry: resolve(currentDir, "src/components/index.ts"),
        name: "LdapPersonAuswahl",
        fileName: "ezldap-vue-select",
      },
      rollupOptions: {
        external: ["vue", "vuetify", "vuetify/lib"],
        output: {
          globals: {
            vue: "Vue",
            "vuetify/lib": "Vuetify",
          },
        },
      },
    },
  };
});
