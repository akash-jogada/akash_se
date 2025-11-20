import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // Use happy-dom for tests to avoid jsdom/parse5 ESM issues in this environment
    environment: "happy-dom",
    // Ensure tests under `tests` and `src/**/__tests__` are discovered by Vitest
    include: [
      "tests/**/*.test.{js,ts,jsx,tsx}",
      "src/**/__tests__/**/*.test.{js,ts,jsx,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      all: true,
      // Limit client coverage to the pages we added tests for and the services
      include: [
        "src/pages/Home.jsx",
        "src/pages/ProductDetails.jsx",
        "src/pages/Checkout.jsx",
        "src/services/**/*.{js,jsx}",
      ],
      exclude: ["node_modules", "tests"],
    },
  },
});
