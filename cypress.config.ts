import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
