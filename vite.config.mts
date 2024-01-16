/// <reference types="vitest" />

import { defineConfig } from "vite"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["setupFiles.ts", "vitest-canvas-mock"],
    server: {
      deps: {
        inline: ["vitest-canvas-mock"],
      },
    },
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    coverage: {
      provider: "istanbul", // or 'v8'
      exclude: [
        "coverage/**",
        "dist/**",
        "build/**",
        "node_modules/**",
        "components/procedural/ai.js",
        "components/procedural/aiprocess.js",
        "ai/**",
      ],
    },
  },
})
