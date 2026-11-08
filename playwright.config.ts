import { defineConfig, devices } from "@playwright/test";

/** End-to-end tests run against the production build, with Formspree replaced by a local mock. */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3101", channel: "chrome", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: [
    { command: "node scripts/mock-formspree.mjs 3199", port: 3199, reuseExistingServer: false },
    {
      command: "npx next start -p 3101",
      port: 3101,
      reuseExistingServer: false,
      env: { FORMSPREE_FORM_ID: "e2e", FORMSPREE_ENDPOINT: "http://localhost:3199/f/e2e" },
    },
  ],
});
