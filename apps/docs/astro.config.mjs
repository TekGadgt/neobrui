import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  base: process.env.PUBLIC_SITE_BASE || '/',
  site: process.env.PUBLIC_SITE_URL || undefined,
  integrations: [starlight({
    title: 'Neobrui',
    description: 'A small, semantic, opt-in CSS design system.',
    customCss: ['@tekgadgt/neobrui', './src/styles/docs.css'],
    components: { Search: './src/components/Search.astro' },
    sidebar: [
      { label: 'Start', items: [{ label: 'Start', slug: 'index' }] },
      { label: 'Principles', items: [{ label: 'Principles', slug: 'principles' }] },
      { label: 'Foundations', items: [{ label: 'Foundations', slug: 'foundations' }] },
      { label: 'Layout', items: [{ label: 'Layout', slug: 'layout' }] },
      { label: 'Primitives', items: [{ label: 'Primitives', slug: 'primitives' }] },
      { label: 'Patterns', items: [{ label: 'Patterns', slug: 'patterns' }] },
      { label: 'Adoption', items: [{ label: 'Adoption', slug: 'adoption' }] },
    ],
  })],
});
