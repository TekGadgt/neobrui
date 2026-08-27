import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.PUBLIC_SITE_BASE || '/';
const site = process.env.PUBLIC_SITE_URL || undefined;

export default defineConfig({
  base,
  site,
  integrations: [starlight({
    title: 'Neobrui',
    description: 'A small, semantic, opt-in CSS design system.',
    customCss: ['./src/styles/custom.css'],
    sidebar: [
      { label: 'Start', items: [{ label: 'Playground', slug: 'index' }] },
      { label: 'Principles', items: [{ label: 'Principles', slug: 'principles' }] },
      { label: 'Foundations', items: [{ label: 'Theming', slug: 'foundations' }] },
      { label: 'Layout', items: [{ label: 'Layout & utilities', slug: 'layout' }] },
      { label: 'Primitives', items: [{ label: 'Surface & Pressable', slug: 'primitives' }] },
      { label: 'Patterns', items: [{ label: 'Patterns', slug: 'patterns' }] },
      { label: 'Adoption', items: [{ label: 'Adoption & AI', slug: 'adoption' }] },
    ],
  })],
});
