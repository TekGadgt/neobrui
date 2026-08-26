import { execFileSync } from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

export const SEEDS = ['missing-label', 'clipping-320', 'shadow-only-focus'];
export const OUTPUT = '.qa-rehearsal';
const base = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QA rehearsal</title><style>*{box-sizing:border-box}body{margin:0;padding:16px;font:16px sans-serif;color:#111;background:#fff}.panel{max-width:288px;border:1px solid #333;padding:12px}.qa-focus:focus-visible{outline:3px solid #005fcc;outline-offset:2px}@media(forced-colors:active){.qa-focus:focus-visible{outline:3px solid CanvasText;outline-offset:2px}}</style></head><body data-qa-seed="BASELINE"><main class="panel"><h1>QA rehearsal</h1><label for="qa-email">Email</label><input id="qa-email" type="email"><button class="qa-focus" type="button">Continue</button></main></body></html>`;

export function generateVariant(seed = 'baseline') {
  let html = base.replace('data-qa-seed="BASELINE"', `data-qa-seed="${seed}"`);
  if (seed === 'missing-label' || seed === 'combined') html = html.replace('<label for="qa-email">Email</label>', '<label>Email</label>');
  if (seed === 'clipping-320' || seed === 'combined') html = html.replace('</style>', '.qa-clip{max-width:none;width:480px}</style>').replace('<main class="panel">', '<main class="panel qa-clip">');
  if (seed === 'shadow-only-focus' || seed === 'combined') html = html.replace('</style>', '.qa-focus:focus-visible{outline:none;box-shadow:none}</style>');
  return html;
}

function run(command, args, env) { execFileSync(command, args, { stdio: 'inherit', env: { ...process.env, ...env } }); }
async function timed(name, fn) { const start = performance.now(); const value = await fn(); return { name, durationMs: Number((performance.now() - start).toFixed(3)), value }; }

if (process.argv[1] === fileURLToPath(import.meta.url)) {
const mode = process.argv[2] ?? 'rehearsal';
const browsers = ['chromium', 'firefox', 'webkit'];
const variants = mode === 'baseline' ? ['baseline'] : mode === 'seeded' ? [...SEEDS, 'combined'] : ['baseline', ...SEEDS, 'combined'];
const root = process.cwd();
const timings = [];
async function stage(name, fn) { const start = performance.now(); const value = await fn(); timings.push({ name, durationMs: Number((performance.now() - start).toFixed(3)) }); return value; }
await stage('clean-setup', () => rm(path.join(root, OUTPUT), { recursive: true, force: true }));
await stage('token-unit-size-checks', () => { run('pnpm', ['build:tokens']); run('pnpm', ['validate:tokens']); run('node', ['--test', 'tests/size-package.test.mjs']); });
await mkdir(path.join(root, OUTPUT, 'variants'), { recursive: true });
await stage('seed-generation', async () => { for (const variant of variants) await writeFile(path.join(root, OUTPUT, 'variants', `${variant}.html`), generateVariant(variant)); });
const runs = [];
for (const browser of browsers) {
  for (const variant of variants) {
    const report = path.join(root, OUTPUT, `${browser}-${variant}.json`);
    const start = performance.now();
    run('pnpm', ['exec', 'playwright', 'test', 'qa/qa-rehearsal.spec.js', `--project=${browser}`, '--config=qa/playwright.config.js'], { QA_VARIANT: variant, QA_HTML: path.join(root, OUTPUT, 'variants', `${variant}.html`), QA_REPORT: report });
    const durationMs = Number((performance.now() - start).toFixed(3));
    runs.push({ browser, variant, durationMs, report });
    timings.push({ name: 'automated-runtime', browser, variant, durationMs });
  }
}
await stage('cleanup-retest', async () => { await rm(path.join(root, OUTPUT, 'variants'), { recursive: true, force: true }); await mkdir(path.join(root, OUTPUT, 'variants')); for (const variant of variants) await writeFile(path.join(root, OUTPUT, 'variants', `${variant}.html`), generateVariant(variant)); });
const output = { schema: 'neobrui.qa-rehearsal/v1', mode, generatedAt: new Date().toISOString(), timings, detectors: { missingLabel: 'native association + supplemental axe label violation', clipping320: '320 CSS px overflow/clipping', shadowOnlyFocus: 'focus-visible outline/box-shadow loss under test-controlled no-shadow fallback + screenshot' }, runs, limitations: ['Linux harness does not claim Windows High Contrast, NVDA, VoiceOver, physical keyboard/touch, or true browser UI zoom at 200%.'] };
await writeFile(path.join(root, OUTPUT, 'report.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ schema: output.schema, mode, browsers, variants, report: path.join(OUTPUT, 'report.json') }, null, 2));
}
