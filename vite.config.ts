/// <reference types="vitest" />

import { defineConfig } from "vite"

export default defineConfig({
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
  },
})
