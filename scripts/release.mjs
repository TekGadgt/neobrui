import { mkdir, readFile, writeFile, rm, readdir, stat, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, relative } from 'node:path';
import { buildSizeReport } from './size-package.mjs';
import { createDeterministicArchive } from './create-archive.mjs';

const root = resolve(new URL('..', import.meta.url).pathname);
export const RELEASE_VERSION = '0.1.0-alpha.0';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const tokensDtcgExport = './tokens' + '.dtcg' + '.json';

const exportsMap = {
  '.': './dist/index.css',
  './tokens': './dist/tokens.css',
  [tokensDtcgExport]: tokensDtcgExport,
  './compositions/stack': './dist/compositions/stack.css',
  './compositions/cluster': './dist/compositions/cluster.css',
  './utilities/visually-hidden': './dist/utilities/visually-hidden.css',
  './utilities/wrapper': './dist/utilities/wrapper.css',
  './blocks/surface': './dist/blocks/surface.css',
  './blocks/button': './dist/blocks/button.css',
  './blocks/field': './dist/blocks/field.css',
  './blocks': './dist/blocks.css',
  './README.md': './README.md',
  './LICENSE': './LICENSE',
};

async function collect(dir, base = dir) {
  const result = [];
  for (const name of (await readdir(dir)).sort()) {
    const path = join(dir, name);
    if ((await stat(path)).isDirectory()) result.push(...await collect(path, base));
    else result.push({ path: relative(base, path), bytes: (await stat(path)).size });
  }
  return result;
}

export async function buildRelease({ outputRoot = 'dist/release' } = {}) {
  const out = resolve(root, outputRoot);
  await rm(out, { recursive: true, force: true });
  const staging = join(out, 'staging');
  await buildSizeReport({ outputRoot: relative(root, join(out, 'size')) });
  const sourcePackage = join(root, relative(root, join(out, 'size')), 'package');
  const pkgRoot = join(staging, 'package');
  await mkdir(join(pkgRoot, 'dist/compositions'), { recursive: true });
  await mkdir(join(pkgRoot, 'dist/utilities'), { recursive: true });
  await mkdir(join(pkgRoot, 'dist/blocks'), { recursive: true });
  const cssCopies = {
    'dist/index.css': 'blocks.css', 'dist/blocks.css': 'blocks.css', 'dist/tokens.css': 'foundations.css',
    'dist/compositions/stack.css': 'stack.css', 'dist/compositions/cluster.css': 'cluster.css',
    'dist/utilities/visually-hidden.css': 'visually-hidden.css', 'dist/utilities/wrapper.css': 'wrapper.css',
    'dist/blocks/surface.css': 'surface.css', 'dist/blocks/button.css': 'button.css', 'dist/blocks/field.css': 'field.css',
  };
  for (const [destination, source] of Object.entries(cssCopies)) await cp(join(sourcePackage, 'dist', source), join(pkgRoot, destination));
  const dtcg = {};
  for (const theme of ['personal-light', 'personal-dark', 'workshop', 'nested-theme', 'neutralized']) {
    dtcg[theme] = JSON.parse(await readFile(join(root, `generated/dtcg/${theme}.json`), 'utf8'));
  }
  await writeFile(join(pkgRoot, 'tokens.dtcg.json'), `${JSON.stringify({ formatVersion: '2025.10', themes: dtcg }, null, 2)}\n`);
  const license = await readFile(join(root, 'LICENSE'), 'utf8');
  const readme = `# neobrui ${RELEASE_VERSION}\n\nPrivate personal-alpha CSS release for controlled local use. This archive is not published to npm and makes no public support or 1.0 stability claim.\n\nInstall the exact archive offline with your package manager using a local file dependency. Runtime output is CSS-only: no JavaScript, network requests, or non-CSS runtime assets.\n`;
  await writeFile(join(pkgRoot, 'README.md'), readme);
  await writeFile(join(pkgRoot, 'LICENSE'), license);
  const packageJson = { name: 'neobrui', version: RELEASE_VERSION, private: true, description: 'Private CSS-only personal-alpha release', license: 'MIT', type: 'module', exports: exportsMap, files: ['dist', 'tokens.dtcg.json', 'README.md', 'LICENSE'] };
  await writeFile(join(pkgRoot, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`);
  const packageFiles = await collect(pkgRoot);
  const archiveName = `neobrui-${RELEASE_VERSION}.tgz`;
  const archive = join(out, archiveName);
  await createDeterministicArchive({ root: pkgRoot, output: archive, files: packageFiles.map(({ path }) => path), prefix: 'package' });
  const archiveBytes = await readFile(archive);
  const checksum = sha256(archiveBytes);
  await writeFile(join(out, 'SHA256SUMS'), `${checksum}  ${archiveName}\n`);
  await writeFile(join(out, 'RELEASE_NOTES.md'), `# neobrui ${RELEASE_VERSION}\n\nPersonal-alpha local release. This is a pre-1.0 artifact: minor releases may add or change contracts; patch releases correct output without intended API changes.\n\nNot published, pushed, tagged, or supported publicly. Roll back by selecting the prior retained archive; never rewrite history.\n`);
  await writeFile(join(out, 'PROVENANCE.json'), `${JSON.stringify({ version: RELEASE_VERSION, formatVersion: '2025.10', package: 'neobrui', source: 'canonical JS token maps and CSS sources', generator: 'scripts/release.mjs', archive: archiveName, files: packageFiles }, null, 2)}\n`);
  const runtimeFiles = packageFiles.filter(({ path }) => path.startsWith('dist/') && !path.endsWith('.css'));
  return { version: RELEASE_VERSION, package: packageJson, archive: { path: relative(root, archive), sha256: checksum, files: packageFiles, runtimeJavaScriptBytes: runtimeFiles.filter(({ path }) => path.endsWith('.js')).reduce((sum, item) => sum + item.bytes, 0), runtimeAssetBytes: runtimeFiles.filter(({ path }) => !path.endsWith('.js')).reduce((sum, item) => sum + item.bytes, 0) }, files: packageFiles };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const release = await buildRelease({ outputRoot: process.env.RELEASE_OUTPUT ?? 'dist/release' });
  console.log(`Wrote ${release.archive.path} (${release.archive.sha256})`);
}
