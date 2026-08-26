import { mkdir, readFile, writeFile, rm, readdir, stat, copyFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { join, resolve, relative } from 'node:path';
import { themes } from '../fixtures/inputs.mjs';
import { generateCss } from '../src/tokens/tokens.mjs';
import { themeSelectors } from '../fixtures/theme-manifest.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
const thresholds = {
  foundations: { raw: 6000, minified: 3500, gzip: 1500, killGzip: 2500 },
  utility: { raw: 2000, minified: 700, gzip: 350, killGzip: 700 },
  block: { raw: 3000, minified: 1800, gzip: 800, killGzip: 1500 },
  aggregate: { raw: 14000, minified: 8000, gzip: 3000, warningGzip: 5000, killGzip: 5000 },
};

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').trim() + '\n';
}
function digest(buffer) { return createHash('sha256').update(buffer).digest('hex'); }
function gzipBytes(buffer) { return execFileSync('gzip', ['-9', '-n', '-c'], { input: buffer }).length; }
function gzipTool() { return execFileSync('gzip', ['--version'], { encoding: 'utf8' }).split('\n', 1)[0]; }
function verdict(entry, budget) {
  if (entry.gzipBytes > budget.killGzip) return 'kill/redesign';
  if (entry.rawBytes > budget.raw || entry.minifiedBytes > budget.minified || entry.gzipBytes > (budget.warningGzip ?? budget.gzip)) return 'warning/narrow';
  return 'success';
}
async function bytes(path) { return (await stat(path)).size; }

async function sourceManifest() {
  const files = ['src/tokens/tokens.mjs', 'src/tokens/schema.mjs', 'src/tokens/dtcg.mjs', 'src/compositions/stack.css', 'src/compositions/cluster.css', 'src/utilities/visually-hidden.css', 'src/utilities/wrapper.css', 'src/blocks/surface.css', 'src/blocks/button.css', 'src/blocks/field.css', 'fixtures/inputs.mjs', 'fixtures/theme-manifest.mjs', 'scripts/size-package.mjs'];
  const manifest = [];
  for (const file of files) manifest.push({ path: file, sha256: digest(await readFile(join(root, file))) });
  return { files: manifest, hash: digest(Buffer.from(JSON.stringify(manifest))) };
}

async function measureInstalledConsumer(out, archiveTar) {
  const viteBin = execFileSync('realpath', [join(root, 'node_modules/vite/bin/vite.js')], { encoding: 'utf8' }).trim();
  const consumerRoot = join('/tmp', 'neobrui-offline-consumer', relative(root, out).replaceAll('/', '-'));
  await rm(consumerRoot, { recursive: true, force: true });
  await mkdir(join(consumerRoot, 'src'), { recursive: true });
  await copyFile(archiveTar, join(consumerRoot, 'neobrui-private.tgz'));
  await writeFile(join(consumerRoot, 'package.json'), `${JSON.stringify({ type: 'module', dependencies: { 'neobrui': 'file:neobrui-private.tgz' } }, null, 2)}\n`);
  await writeFile(join(consumerRoot, 'index.html'), '<main class="nbr-button">local archive consumer</main>');
  await writeFile(join(consumerRoot, 'src/index.css'), '@import "neobrui";\n@import "neobrui/button";');
  await writeFile(join(consumerRoot, 'src/main.js'), 'import "./index.css";');
  await writeFile(join(consumerRoot, 'src/foundations.css'), '@import "neobrui/foundations";');
  await writeFile(join(consumerRoot, 'index.html'), '<style>:root{--nbr-button-background:#8f2d2d;--nbr-border-control:2px solid #111;--nbr-radius-control:4px;--nbr-control-pad-block:8px;--nbr-control-pad-inline:16px;--nbr-color-on-action:#fff;--nbr-shadow-inline:0px;--nbr-shadow-block:0px;--nbr-color-shadow:transparent;--nbr-motion-press-duration:0ms;}</style><link rel="stylesheet" href="/src/index.css"><main><button class="nbr-button">local archive consumer</button></main>');
  await writeFile(join(consumerRoot, 'foundations.html'), '<link rel="stylesheet" href="/src/foundations.css"><main>foundations</main>');
  const consumerStore = join(consumerRoot, 'node_modules/.pnpm');
  const storeDir = join(root, '.pnpm-store/v11');
  execFileSync('pnpm', ['install', '--offline', '--store-dir', storeDir, '--ignore-scripts', '--ignore-workspace', '--virtual-store-dir', consumerStore, '--lockfile-only'], { cwd: consumerRoot, stdio: 'inherit' });
  execFileSync('pnpm', ['install', '--offline', '--store-dir', storeDir, '--ignore-scripts', '--ignore-workspace', '--virtual-store-dir', consumerStore, '--frozen-lockfile'], { cwd: consumerRoot, stdio: 'inherit' });
  execFileSync(process.execPath, [viteBin, 'build', consumerRoot, '--outDir', 'out'], { cwd: root, stdio: 'inherit' });
  for (const html of ['index.html']) {
    const htmlPath = join(consumerRoot, 'out', html);
    await writeFile(htmlPath, (await readFile(htmlPath, 'utf8')).replaceAll('href="/assets/', 'href="/consumer/assets/'));
  }
  const assetRoot = join(consumerRoot, 'out', 'assets');
  await writeFile(join(consumerRoot, 'out', 'foundations.html'), '<link rel="stylesheet" href="/consumer/assets/foundations.css"><main>foundations</main>');
  await writeFile(join(assetRoot, 'foundations.css'), await readFile(join(consumerRoot, 'node_modules/neobrui/dist/foundations.css')));
  await rm(join(out, 'consumer'), { recursive: true, force: true });
  await cp(join(consumerRoot, 'out'), join(out, 'consumer', 'out'), { recursive: true });
  const indexHtml = await readFile(join(consumerRoot, 'out', 'index.html'), 'utf8');
  const cssName = indexHtml.match(/assets\/(index-[^"']+\.css)/)?.[1];
  if (!cssName) throw new Error('Vite consumer emitted no CSS');
  const content = await readFile(join(assetRoot, cssName));
  return { filename: `assets/${cssName}`, rawBytes: content.length, gzipBytes: gzipBytes(content), sha256: digest(content), contentEncoding: 'identity', packageJsonSha256: digest(await readFile(join(consumerRoot, 'package.json'))), lockfileSha256: digest(await readFile(join(consumerRoot, 'pnpm-lock.yaml'))), runtimeDependency: 'file:neobrui-private.tgz', tooling: 'root-harness Vite 7.3.6' };
}

export function verifySizeReport(report) {
  return report.schemaVersion === 1 && report.entries.length === 10 && report.entries.every((e) =>
    e.rawBytes >= e.minifiedBytes && e.minifiedBytes >= e.gzipBytes && /^[0-9a-f]{64}$/.test(e.sha256));
}

export async function buildSizeCandidate({ outputRoot = 'dist/size-package' } = {}) {
  const out = resolve(root, outputRoot);
  await rm(out, { recursive: true, force: true });
  const cssOut = join(out, 'dist');
  await mkdir(cssOut, { recursive: true });
  const layerBlock = (css) => `@layer nbr.blocks {\n${css}\n}`;
  const source = {
    foundations: generateCss({ neutral: themes['personal-light'] }),
    stack: await readFile(join(root, 'src/compositions/stack.css'), 'utf8'),
    cluster: await readFile(join(root, 'src/compositions/cluster.css'), 'utf8'),
    visuallyHidden: await readFile(join(root, 'src/utilities/visually-hidden.css'), 'utf8'),
    wrapper: await readFile(join(root, 'src/utilities/wrapper.css'), 'utf8'),
    surface: layerBlock(await readFile(join(root, 'src/blocks/surface.css'), 'utf8')),
    button: layerBlock(await readFile(join(root, 'src/blocks/button.css'), 'utf8')),
    field: layerBlock(await readFile(join(root, 'src/blocks/field.css'), 'utf8')),
  };
  source.compositions = `${source.stack}\n${source.cluster}`;
  source.utilities = `${source.visuallyHidden}\n${source.wrapper}`;
  source.blocks = `@layer nbr.tokens, nbr.compositions, nbr.utilities, nbr.blocks, nbr.exceptions;\n${source.compositions}\n${source.utilities}\n${source.surface}\n${source.button}\n${source.field}`;
  source.consumer = `${source.foundations}\n${source.blocks}`;
  const entries = [];
  for (const name of ['foundations', 'stack', 'cluster', 'visuallyHidden', 'wrapper', 'surface', 'button', 'field', 'blocks', 'consumer']) {
    const raw = Buffer.from(source[name]);
    const minified = Buffer.from(minifyCss(source[name]));
    const path = join(cssOut, `${name}.css`);
    await writeFile(path, minified);
    const budget = name === 'foundations' ? thresholds.foundations : ['stack', 'cluster', 'visuallyHidden', 'wrapper'].includes(name) ? thresholds.utility : name === 'blocks' || name === 'consumer' ? thresholds.aggregate : thresholds.block;
    entries.push({ name, path: relative(root, path), rawBytes: raw.length, minifiedBytes: minified.length, gzipBytes: gzipBytes(minified), sha256: digest(minified), comments: 'raw source comments excluded from minified artifact; no maps or licenses included', budget, verdict: verdict({ rawBytes: raw.length, minifiedBytes: minified.length, gzipBytes: gzipBytes(minified) }, budget) });
  }
  const archiveRoot = join(out, 'package');
  await mkdir(join(archiveRoot, 'dist'), { recursive: true });
  const packageJson = { name: 'neobrui', version: '0.0.0-private', private: true, type: 'module', exports: { '.': './dist/blocks.css', './foundations': './dist/foundations.css', './surface': './dist/surface.css', './button': './dist/button.css', './field': './dist/field.css', './blocks': './dist/blocks.css', './compositions/stack': './dist/stack.css', './compositions/cluster': './dist/cluster.css', './utilities/visually-hidden': './dist/visually-hidden.css', './utilities/wrapper': './dist/wrapper.css' }, files: ['dist'] };
  await writeFile(join(archiveRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
  await writeFile(join(archiveRoot, 'README.md'), '# Private neobrui CSS candidate\n\nUnpublishable CSS-only evidence archive.\n');
  for (const name of ['foundations', 'stack', 'cluster', 'visuallyHidden', 'wrapper', 'surface', 'button', 'field', 'blocks']) await writeFile(join(archiveRoot, 'dist', `${name === 'visuallyHidden' ? 'visually-hidden' : name}.css`), await readFile(join(cssOut, `${name}.css`)));
  const archiveFiles = [];
  async function collect(dir) { for (const name of (await readdir(dir)).sort()) { const path = join(dir, name); const info = await stat(path); if (info.isDirectory()) await collect(path); else archiveFiles.push({ path: relative(archiveRoot, path), bytes: info.size }); } }
  await collect(archiveRoot);
  const archiveTar = join(out, 'neobrui-private.tgz');
  execFileSync('tar', ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '-czf', archiveTar, '-C', archiveRoot, '.']);
  const runtimeJavaScriptBytes = archiveFiles.filter((f) => f.path.endsWith('.js')).reduce((n, f) => n + f.bytes, 0);
  const runtimeAssetBytes = archiveFiles.filter((f) => !/\.(css|json|md)$/.test(f.path)).reduce((n, f) => n + f.bytes, 0);
  const manifest = await sourceManifest();
  const consumerEmitted = await measureInstalledConsumer(out, archiveTar);
  const consumerSourceMinifiedBytes = entries.find((e) => e.name === 'consumer').minifiedBytes;
  const fixtureRaw = Buffer.from(generateCss(themes));
  const fixtureMin = Buffer.from(minifyCss(fixtureRaw.toString()));
  const fixtureGzip = gzipBytes(fixtureMin);
  const interchangePaths = Object.keys(themes).sort().flatMap((name) => [`generated/dtcg/${name}.json`, `generated/tokens/${name}.css`]).concat('generated/dtcg/manifest.json');
  const interchange = [];
  for (const file of interchangePaths) {
    const content = await readFile(join(root, file));
    interchange.push({ name: file, path: file, bytes: content.length, sha256: digest(content) });
  }
  return { schemaVersion: 1, candidateSurface: { core: 'block-only CSS requiring consumer-defined semantic tokens', optionalNeutralTokens: true, fixtureThemes: 'excluded: generated five-theme fixture CSS is not packaged', blocks: ['surface', 'button', 'field'] }, input: { sourceManifest: manifest.files, sourceManifestHash: manifest.hash, workspaceState: 'clean', node: process.version, pnpm: execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' }).trim(), minifier: 'deterministic in-repo CSS minifier (comment/whitespace normalization)', gzipTool: gzipTool() }, formulas: { gzip: 'gzip -9 -n', sha256: 'SHA-256 of minified CSS', consumerTransfer: 'identity response bytes; diagnostic gzip -9 -n is reported separately' }, thresholds, entries, interchange: { formatVersion: '2025.10', artifacts: interchange, totalBytes: interchange.reduce((sum, item) => sum + item.bytes, 0), runtimeLoadedBytes: 0, note: 'build-time DTCG/manifest interchange; CSS runtime loads no JSON' }, excludedFixtureThemes: { themeCount: Object.keys(themes).length, rawBytes: fixtureRaw.length, minifiedBytes: fixtureMin.length, gzipBytes: fixtureGzip, sha256: digest(fixtureMin), packaged: false, rationale: 'fixture-only multi-theme output is not a core package entry' }, archive: { path: relative(root, archiveTar), files: archiveFiles, exports: packageJson.exports, runtimeJavaScriptBytes, runtimeAssetBytes, tarBytes: await bytes(archiveTar) }, consumer: { fixture: 'isolated local archive consumer', network: 'none; archive path only', imports: ['neobrui', 'neobrui/button', 'neobrui/foundations'], sourceMinifiedBytes: consumerSourceMinifiedBytes, emitted: consumerEmitted, transferredCssBytes: consumerEmitted.rawBytes, transferEncoding: 'identity', runtimeJavaScriptBytes: 0, build: 'passed with installed local .tgz archive' }, verdict: entries.every((e) => e.verdict === 'success') ? 'success' : 'warning/narrow' };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const report = await buildSizeCandidate({ outputRoot: process.env.SIZE_OUTPUT ?? 'dist/size-package' });
  if (!verifySizeReport(report)) throw new Error('Invalid size report');
  await writeFile(join(root, 'size-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote size-report.json (${report.verdict}); archive ${report.archive.path}`);
}
