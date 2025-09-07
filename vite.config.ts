import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: "inline",
    rollupOptions: {
      input: {
        // HTML entry for popup or options page
        main: resolve(__dirname, "index.html"),
        // JS entries for Chrome extension parts
        background: resolve(__dirname, "src/background.ts"),
        contentScript: resolve(__dirname, "src/contentScript.ts"),
      },
      output: {
        entryFileNames: (assetInfo) => {
          return `${assetInfo.name}.js`;
          // return `src/${assetInfo.name}.js`;
        },
      },
    },
    emptyOutDir: true,
    target: "esnext",
  },
});
// npm install --save-dev @types/node
