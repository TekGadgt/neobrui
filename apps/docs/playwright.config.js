import { defineConfig, devices } from '@playwright/test';
const basePath = process.env.PUBLIC_SITE_BASE || '/';
const port = Number(process.env.DOCS_PORT || 4321);
const prefix = basePath === '/' ? '' : basePath.replace(/\/$/, '');
const pages = basePath !== '/';
const buildScript = pages ? 'build:pages' : 'build:root';
const previewScript = pages ? 'preview:pages' : 'preview:root';
const capture = process.env.CAPTURE_EVIDENCE === '1';
export default defineConfig({ testDir: './tests', timeout: 30000, reporter: 'list', use: { baseURL: `http://127.0.0.1:${port}${prefix}`, trace: 'retain-on-failure' }, projects: [
  { name: 'chromium', testIgnore: /capture\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', testIgnore: /capture\.spec\.js/, use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', testIgnore: /capture\.spec\.js/, use: { ...devices['Desktop Safari'] } },
  ...(capture ? [{ name: 'capture-chromium', testMatch: /capture\.spec\.js/, use: { ...devices['Desktop Chrome'] } }] : []),
], webServer: { command: `DOCS_PORT=${port} pnpm run ${buildScript} && DOCS_PORT=${port} pnpm run ${previewScript}`, url: `http://127.0.0.1:${port}`, reuseExistingServer: false } });
