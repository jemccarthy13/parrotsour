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
        "cleansnapshots.mjs",
        "src/index.tsx",
        "src/testutils/mock.tsx",
        "coverage/**",
        "dist/**",
        "build/**",
        "node_modules/**",
        "src/components/procedural/ai.js",
        "src/animation/close.ts",
        "src/canvas/test.tsx",
        "src/components/close/**",
        "src/components/procedural/ai.js",
        "src/components/test/**",
        "src/ai/**",
      ],
    },
  },
})
