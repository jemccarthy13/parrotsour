/// <reference types="vitest" />

import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    // ...other plugins
    svgr(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["setupFiles.ts", "vitest-canvas-mock"],
    deps: {
      inline: ["vitest-canvas-mock"],
    },
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    coverage: {
      provider: "istanbul", // or 'v8'
      exclude: ["coverage/**", "dist/**", "build/**", "node_modules/**"],
    },
  },
})
