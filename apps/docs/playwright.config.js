import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.PUBLIC_SITE_BASE || '/';
const port = Number(process.env.DOCS_PORT || 4321);

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath === '/' ? '' : basePath}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `astro preview --host 127.0.0.1 --port ${port}`,
    cwd: '.',
    url: `http://127.0.0.1:${port}${basePath === '/' ? '' : basePath}`,
    reuseExistingServer: false,
  },
});
