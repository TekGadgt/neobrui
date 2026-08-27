import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { accessSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const generatedRoot = fileURLToPath(new URL('./.generated/neobrui', import.meta.url));
const cacheRoot = fileURLToPath(new URL('./.cache', import.meta.url));
const tokensCss = `${generatedRoot}/dist/tokens.css`;
const blocksCss = `${generatedRoot}/dist/blocks.css`;
try {
  accessSync(tokensCss);
  accessSync(blocksCss);
} catch {
  throw new Error('Docs package is not prepared; run `pnpm release:local && pnpm prepare:docs` first');
}

const base = process.env.PUBLIC_SITE_BASE || '/';
const site = process.env.PUBLIC_SITE_URL || undefined;

// Expressive Code renders code blocks at build time. Keep keyboard focusability in
// that same pipeline rather than mutating every page at runtime.
function keyboardAccessibleCodeBlocks() {
  return {
    name: 'docs-keyboard-accessible-code-blocks',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const visit = (directory) => {
          for (const entry of readdirSync(directory, { withFileTypes: true })) {
            const path = `${directory}/${entry.name}`;
            if (entry.isDirectory()) visit(path);
            else if (entry.isFile() && entry.name.endsWith('.html')) {
              const html = readFileSync(path, 'utf8');
              const accessible = html.replace(/<pre data-language=/g, '<pre tabindex="0" data-language=');
              if (accessible !== html) writeFileSync(path, accessible);
            }
          }
        };
        visit(fileURLToPath(dir));
      },
    },
  };
}

export default defineConfig({
  base,
  site,
  cacheDir: `${cacheRoot}/astro`,
  vite: { cacheDir: `${cacheRoot}/vite`, resolve: { alias: { 'neobrui/tokens': tokensCss, 'neobrui/blocks': blocksCss } } },
  integrations: [starlight({
    title: 'Neobrui',
    description: 'A small, semantic, CSS-only personal-alpha kit.',
    // Pagefind 1.5.2 gives its generated input only a title. Keep the
    // supported default Search implementation and add a scoped label fix.
    components: { Search: './src/components/Search.astro' },
    customCss: ['./src/styles/custom.css'],
    sidebar: [
      { label: 'Overview', items: [{ label: 'Home', slug: 'index' }] },
      { label: 'Start', items: [{ label: 'Getting started', slug: 'getting-started' }] },
      { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
      { label: 'Compositions', items: [{ autogenerate: { directory: 'compositions' } }] },
      { label: 'Utilities', items: [{ autogenerate: { directory: 'utilities' } }] },
      { label: 'Blocks', items: [{ autogenerate: { directory: 'blocks' } }] },
      { label: 'Examples', items: [{ autogenerate: { directory: 'examples' } }] },
      { label: 'Project boundaries', items: [
        { label: 'Accessibility', slug: 'accessibility' },
        { label: 'Release & rollback', slug: 'release' },
        { label: 'Future path', slug: 'future' },
      ] },
    ],
  }), keyboardAccessibleCodeBlocks()],
});
