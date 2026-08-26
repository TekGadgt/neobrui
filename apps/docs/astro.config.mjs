import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.PUBLIC_SITE_BASE || '/';
const site = process.env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  base,
  site,
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
  })],
});
