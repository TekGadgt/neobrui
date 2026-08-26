import { defineConfig } from 'vite';

export default defineConfig({
  root: 'fixtures/plain',
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
