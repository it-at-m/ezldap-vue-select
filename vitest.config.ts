import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitest.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["vuetify"]
    },
    setupFiles: "tests/setup.js"
  }
});
