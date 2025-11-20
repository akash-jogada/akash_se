module.exports = {
  testEnvironment: "node",
  // Discover tests in both `tests/` and `__tests__/` folders
  testMatch: ["**/tests/**/*.test.js", "**/__tests__/**/*.test.js"],
  // Ensure Jest run for backend does not try to parse client ESM files
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
  // Collect coverage from core server areas to get meaningful percentages
  collectCoverageFrom: [
    "server/controllers/**/*.js",
    "server/models/**/*.js",
    "server/middleware/**/*.js",
    "server/utils/**/*.js",
    "!server/**/__tests__/**",
    "!server/node_modules/**",
  ],
  coverageDirectory: "server/coverage",
  passWithNoTests: true,
};
