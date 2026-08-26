import { mkdir, readFile, writeFile, rm, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { join, resolve, relative } from 'node:path';
import { themes } from '../fixtures/inputs.mjs';
import { generateCss } from '../src/tokens/tokens.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
const thresholds = {
  foundations: { raw: 6000, minified: 3500, gzip: 1500, killGzip: 2500 },
  recipe: { raw: 3000, minified: 1800, gzip: 800, killGzip: 1500 },
  aggregate: { raw: 14000, minified: 8000, gzip: 3000, warningGzip: 5000, killGzip: 5000 },
};

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').trim() + '\n';
}
function digest(buffer) { return createHash('sha256').update(buffer).digest('hex'); }
function verdict(entry, budget) {
  if (entry.gzipBytes > budget.killGzip) return 'kill/redesign';
  if (entry.rawBytes > budget.raw || entry.minifiedBytes > budget.minified || entry.gzipBytes > (budget.warningGzip ?? budget.gzip)) return 'warning/narrow';
  return 'success';
}
async function bytes(path) { return (await stat(path)).size; }

async function sourceManifest() {
  const files = ['src/tokens/tokens.mjs', 'src/recipes/surface.css', 'src/recipes/button.css', 'src/recipes/field.css', 'fixtures/inputs.mjs', 'scripts/size-spike.mjs'];
  const manifest = [];
  for (const file of files) manifest.push({ path: file, sha256: digest(await readFile(join(root, file))) });
  return { files: manifest, hash: digest(Buffer.from(JSON.stringify(manifest))) };
}

async function measureInstalledConsumer(out, archiveTar) {
  const consumerRoot = join(out, 'consumer');
  await rm(consumerRoot, { recursive: true, force: true });
  await mkdir(join(consumerRoot, 'src'), { recursive: true });
  await writeFile(join(consumerRoot, 'package.json'), `${JSON.stringify({ type: 'module', dependencies: { '@neobrui/private-spike-candidate': `file:${archiveTar}` }, devDependencies: { vite: '7.3.6' }, }, null, 2)}\n`);
  await writeFile(join(consumerRoot, 'index.html'), '<main class="_nb-spike-button">local archive consumer</main>');
  await writeFile(join(consumerRoot, 'src/index.css'), '@import "@neobrui/private-spike-candidate";\n@import "@neobrui/private-spike-candidate/button";');
  await writeFile(join(consumerRoot, 'src/main.js'), 'import "./index.css";');
  await writeFile(join(consumerRoot, 'src/foundations.css'), '@import "@neobrui/private-spike-candidate/foundations";');
  await writeFile(join(consumerRoot, 'index.html'), '<link rel="stylesheet" href="/src/index.css"><main><button class="_nb-spike-button">local archive consumer</button></main>');
  await writeFile(join(consumerRoot, 'foundations.html'), '<link rel="stylesheet" href="/src/foundations.css"><main>foundations</main>');
  execFileSync('pnpm', ['install', '--offline', '--ignore-scripts', '--no-frozen-lockfile', '--ignore-workspace'], { cwd: consumerRoot, stdio: 'inherit' });
  execFileSync('pnpm', ['exec', 'vite', 'build', '--outDir', 'out'], { cwd: consumerRoot, stdio: 'inherit' });
  for (const html of ['index.html']) {
    const htmlPath = join(consumerRoot, 'out', html);
    await writeFile(htmlPath, (await readFile(htmlPath, 'utf8')).replaceAll('href="/assets/', 'href="/consumer/assets/'));
  }
  const assetRoot = join(consumerRoot, 'out', 'assets');
  await writeFile(join(consumerRoot, 'out', 'foundations.html'), '<link rel="stylesheet" href="/consumer/assets/foundations.css"><main>foundations</main>');
  await writeFile(join(assetRoot, 'foundations.css'), await readFile(join(consumerRoot, 'node_modules/@neobrui/private-spike-candidate/dist/foundations.css')));
  const indexHtml = await readFile(join(consumerRoot, 'out', 'index.html'), 'utf8');
  const cssName = indexHtml.match(/assets\/(index-[^"']+\.css)/)?.[1];
  if (!cssName) throw new Error('Vite consumer emitted no CSS');
  const content = await readFile(join(assetRoot, cssName));
  return { filename: `assets/${cssName}`, rawBytes: content.length, gzipBytes: gzipSync(content, { level: 9, mtime: 0 }).length, sha256: digest(content), contentEncoding: 'identity' };
}

export function verifySizeReport(report) {
  return report.schemaVersion === 1 && report.entries.length === 6 && report.entries.every((e) =>
    e.rawBytes >= e.minifiedBytes && e.minifiedBytes >= e.gzipBytes && /^[0-9a-f]{64}$/.test(e.sha256));
}

export async function buildSizeCandidate({ outputRoot = 'dist/size-spike' } = {}) {
  const out = resolve(root, outputRoot);
  await rm(out, { recursive: true, force: true });
  const cssOut = join(out, 'dist');
  await mkdir(cssOut, { recursive: true });
  const source = {
    foundations: generateCss({ neutral: themes['personal-light'] }),
    surface: await readFile(join(root, 'src/recipes/surface.css'), 'utf8'),
    button: await readFile(join(root, 'src/recipes/button.css'), 'utf8'),
    field: await readFile(join(root, 'src/recipes/field.css'), 'utf8'),
  };
  source.recipes = `@layer neobrui.tokens, neobrui.recipes;\n${source.surface}\n${source.button}\n${source.field}`;
  source.consumer = `${source.foundations}\n${source.recipes}`;
  const entries = [];
  for (const name of ['foundations', 'surface', 'button', 'field', 'recipes', 'consumer']) {
    const raw = Buffer.from(source[name]);
    const minified = Buffer.from(minifyCss(source[name]));
    const path = join(cssOut, `${name}.css`);
    await writeFile(path, minified);
    const budget = name === 'foundations' ? thresholds.foundations : name === 'recipes' || name === 'consumer' ? thresholds.aggregate : thresholds.recipe;
    entries.push({ name, path: relative(root, path), rawBytes: raw.length, minifiedBytes: minified.length, gzipBytes: gzipSync(minified, { level: 9, mtime: 0 }).length, sha256: digest(minified), comments: 'raw source comments excluded from minified artifact; no maps or licenses included', budget, verdict: verdict({ rawBytes: raw.length, minifiedBytes: minified.length, gzipBytes: gzipSync(minified, { level: 9, mtime: 0 }).length }, budget) });
  }
  const archiveRoot = join(out, 'package');
  await mkdir(join(archiveRoot, 'dist'), { recursive: true });
  const packageJson = { name: '@neobrui/private-spike-candidate', version: '0.0.0-private', private: true, type: 'module', exports: { '.': './dist/recipes.css', './foundations': './dist/foundations.css', './surface': './dist/surface.css', './button': './dist/button.css', './field': './dist/field.css', './recipes': './dist/recipes.css' }, files: ['dist'] };
  await writeFile(join(archiveRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(join(archiveRoot, 'README.md'), '# Private neobrui Spike 5 candidate\n\nUnpublishable CSS-only evidence archive.\n');
  for (const name of ['foundations', 'surface', 'button', 'field', 'recipes']) await writeFile(join(archiveRoot, 'dist', `${name}.css`), await readFile(join(cssOut, `${name}.css`)));
  const archiveFiles = [];
  async function collect(dir) { for (const name of (await readdir(dir)).sort()) { const path = join(dir, name); const info = await stat(path); if (info.isDirectory()) await collect(path); else archiveFiles.push({ path: relative(archiveRoot, path), bytes: info.size }); } }
  await collect(archiveRoot);
  const archiveTar = join(out, 'neobrui-private-spike.tgz');
  execFileSync('tar', ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '-czf', archiveTar, '-C', archiveRoot, '.']);
  const runtimeJavaScriptBytes = archiveFiles.filter((f) => f.path.endsWith('.js')).reduce((n, f) => n + f.bytes, 0);
  const runtimeAssetBytes = archiveFiles.filter((f) => !/\.(css|json|md)$/.test(f.path)).reduce((n, f) => n + f.bytes, 0);
  const manifest = await sourceManifest();
  const consumerEmitted = await measureInstalledConsumer(out, archiveTar);
  const consumerSourceMinifiedBytes = entries.find((e) => e.name === 'consumer').minifiedBytes;
  const fixtureRaw = Buffer.from(generateCss(themes));
  const fixtureMin = Buffer.from(minifyCss(fixtureRaw.toString()));
  const fixtureGzip = gzipSync(fixtureMin, { level: 9, mtime: 0 });
  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim().length > 0;
  return { schemaVersion: 1, candidateSurface: { core: 'recipe-only CSS requiring consumer-defined semantic tokens', optionalNeutralTokens: true, fixtureThemes: 'excluded: generated five-theme fixture CSS is not packaged', recipes: ['surface', 'button', 'field'] }, input: { sourceManifest: manifest.files, sourceManifestHash: manifest.hash, workspaceState: dirty ? 'dirty' : 'clean', node: process.version, pnpm: execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' }).trim(), minifier: 'deterministic in-repo CSS minifier (comment/whitespace normalization)' }, formulas: { gzip: 'gzip -9 -n', sha256: 'SHA-256 of minified CSS', consumerTransfer: 'identity response bytes; diagnostic gzip -9 -n is reported separately' }, thresholds, entries, excludedFixtureThemes: { themeCount: Object.keys(themes).length, rawBytes: fixtureRaw.length, minifiedBytes: fixtureMin.length, gzipBytes: fixtureGzip.length, sha256: digest(fixtureMin), packaged: false, rationale: 'fixture-only multi-theme output is not a core package entry' }, archive: { path: relative(root, archiveTar), files: archiveFiles, exports: packageJson.exports, runtimeJavaScriptBytes, runtimeAssetBytes, dependencies: [], tarBytes: await bytes(archiveTar) }, consumer: { fixture: 'isolated local archive consumer', network: 'none; archive path only', imports: ['@neobrui/private-spike-candidate', '@neobrui/private-spike-candidate/button', '@neobrui/private-spike-candidate/foundations'], sourceMinifiedBytes: consumerSourceMinifiedBytes, emitted: consumerEmitted, transferredCssBytes: consumerEmitted.rawBytes, transferEncoding: 'identity', runtimeJavaScriptBytes: 0, build: 'passed with installed local .tgz archive' }, verdict: entries.every((e) => e.verdict === 'success') ? 'success' : 'warning/narrow' };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const report = await buildSizeCandidate({ outputRoot: process.env.SIZE_OUTPUT ?? 'dist/size-spike' });
  if (!verifySizeReport(report)) throw new Error('Invalid size report');
  await writeFile(join(root, 'size-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote size-report.json (${report.verdict}); archive ${report.archive.path}`);
}
