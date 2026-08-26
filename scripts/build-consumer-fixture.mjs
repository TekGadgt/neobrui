import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { themes } from '../fixtures/inputs.mjs';
import { generateCss } from '../src/tokens/tokens.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
const out = join(root, 'tmp/consumer-fixture/out');
await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets'), { recursive: true });
const button = await readFile(join(root, 'src/blocks/button.css'), 'utf8');
const foundations = generateCss({ neutral: themes['personal-light'] });
const css = `${foundations}\n@layer nbr.blocks {\n${button}\n}`;
await writeFile(join(out, 'assets/index.css'), css);
await writeFile(join(out, 'assets/foundations.css'), foundations);
await writeFile(join(out, 'index.html'), '<style>:root{--nbr-button-background:#8f2d2d;--nbr-border-control:2px solid #111;--nbr-radius-control:4px;--nbr-control-pad-block:8px;--nbr-control-pad-inline:16px;--nbr-color-on-action:#fff;--nbr-shadow-inline:0px;--nbr-shadow-block:0px;--nbr-color-shadow:transparent;--nbr-motion-press-duration:0ms;}</style><link rel="stylesheet" href="/consumer/assets/index.css"><main><button class="nbr-button">local archive consumer</button></main>');
await writeFile(join(out, 'foundations.html'), '<link rel="stylesheet" href="/consumer/assets/foundations.css"><main>foundations</main>');
console.log(`Built isolated consumer fixture at ${out}`);
