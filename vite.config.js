import { defineConfig } from 'vite';

const pages = {
  root: 'fixtures/plain/index.html',
  'personal-light': 'fixtures/personal-light/index.html',
  'personal-dark': 'fixtures/personal-dark/index.html',
  workshop: 'fixtures/workshop/index.html',
  'nested-theme': 'fixtures/nested-theme/index.html',
  neutralized: 'fixtures/neutralized/index.html',
};

const routeOutputPlugin = {
  name: 'neobrui-route-output',
  generateBundle(_options, bundle) {
    for (const [filename, asset] of Object.entries(bundle)) {
      if (!filename.endsWith('/index.html')) continue;
      const fixture = filename.split('/')[1];
      const route = fixture === 'plain' ? 'index.html' : `${fixture}/index.html`;
      if (route !== filename) {
        asset.fileName = route;
        delete bundle[filename];
        bundle[route] = asset;
      }
    }
  },
};

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: { input: pages, plugins: [routeOutputPlugin] },
  },
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
