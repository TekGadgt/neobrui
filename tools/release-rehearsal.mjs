#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, lstat, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const EXPECTED_FILES = [
  'LICENSE', 'README.md', 'package.json',
  'src/foundations.css', 'src/index.css', 'src/layout.css', 'src/primitives.css', 'src/utilities.css',
  'skills/neobrui/SKILL.md', 'skills/neobrui/references/api.md', 'skills/neobrui/references/examples.md',
  'skills/neobrui/templates/verification.md',
];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function classifyTag(tag, version) {
  if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag) || tag.slice(1) !== version) {
    throw new Error(`tag ${tag} does not match version ${version}`);
  }
  const prerelease = version.includes('-');
  return { tag, version, channel: prerelease ? 'next' : 'latest', prerelease };
}

export function validateManifest(manifest) {
  const expectedExports = {
    '.': { style: './src/index.css', default: './src/index.css' },
    './foundations.css': './src/foundations.css', './layout.css': './src/layout.css',
    './primitives.css': './src/primitives.css', './utilities.css': './src/utilities.css', './package.json': './package.json',
  };
  if (manifest.name !== '@tekgadgt/neobrui' || manifest.version !== '0.1.0-alpha.0') throw new Error('package identity/version mismatch');
  if (manifest.private !== true) throw new Error('private safety guard must be true');
  if (manifest.license !== 'MIT') throw new Error('license must be MIT');
  if (JSON.stringify(manifest.sideEffects) !== JSON.stringify(['*.css'])) throw new Error('sideEffects contract mismatch');
  if (JSON.stringify(manifest.publishConfig) !== JSON.stringify({ registry: 'https://registry.npmjs.org/', access: 'public' })) throw new Error('publishConfig contract mismatch');
  if (JSON.stringify(manifest.exports) !== JSON.stringify(expectedExports)) throw new Error('exports contract mismatch');
  if (JSON.stringify(manifest.files) !== JSON.stringify(['src', 'README.md', 'LICENSE', 'skills/neobrui'])) throw new Error('files contract mismatch');
  for (const key of ['dependencies', 'optionalDependencies', 'peerDependencies']) if (manifest[key]) throw new Error(`${key} must be absent`);
  for (const key of Object.keys(manifest.scripts ?? {})) if (/publish|release|stage|tag/i.test(key)) throw new Error(`unsafe lifecycle script: ${key}`);
  return true;
}

function run(command, args, options = {}) { return execFileSync(command, args, { cwd: ROOT, encoding: 'utf8', ...options }).trim(); }
function stable(value) { return JSON.stringify(value, Object.keys(value).sort(), 2); }
function digest(file, algorithm) { return createHash(algorithm).update(file).digest('hex'); }

export function compareReports(left, right) {
  if (left.archive?.sha256 !== right.archive?.sha256) throw new Error('archive sha256 differs');
  if (left.archive?.sri !== right.archive?.sri) throw new Error('archive SRI differs');
  const semantic = report => ({ schema: report.schema, sourceSha: report.sourceSha, package: report.package, files: report.files, archive: report.archive, consumer: report.consumer });
  if (stable(semantic(left)) !== stable(semantic(right))) throw new Error('semantic report fields differ');
  return true;
}

async function main() {
  const args = process.argv.slice(2); const tag = args[args.indexOf('--tag') + 1]; const out = path.resolve(args[args.indexOf('--out') + 1] || '.release-rehearsal');
  if (!tag) throw new Error('usage: release-rehearsal.mjs --tag v0.1.0-alpha.0 --out <directory>');
  const manifest = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8')); validateManifest(manifest); const release = classifyTag(tag, manifest.version);
  await mkdir(out, { recursive: true });
  const temp = await mkdtemp(path.join(ROOT, '.release-rehearsal-tmp-')); let archivePath;
  try {
    const packed = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', out])); const info = packed[0];
    archivePath = path.join(out, info.filename); const archive = await readFile(archivePath);
    const files = info.files.map(({ path: filePath, size, mode }) => ({ path: filePath.replaceAll('\\', '/'), size, ...(mode === undefined ? {} : { mode }) })).sort((a, b) => a.path.localeCompare(b.path));
    const actualPaths = files.map(file => file.path);
    if (actualPaths.length !== EXPECTED_FILES.length || actualPaths.some(filePath => !EXPECTED_FILES.includes(filePath))) throw new Error(`archive file allowlist mismatch: ${actualPaths.join(', ')}`);
    for (const file of files) { const source = await lstat(path.join(ROOT, file.path)); if (source.isSymbolicLink()) throw new Error(`symlink rejected: ${file.path}`); if (/\.js$|(^|\/)(assets|internal)(\/|$)/i.test(file.path)) throw new Error(`unexpected public file: ${file.path}`); }
    await writeFile(path.join(temp, 'package.json'), JSON.stringify({ name: 'rehearsal-consumer', version: '1.0.0' }));
    run('npm', ['install', '--ignore-scripts', '--offline', '--no-audit', '--no-fund', archivePath], { cwd: temp });
    const installedRoot = path.join(temp, 'node_modules/@tekgadgt/neobrui'); const installed = JSON.parse(await readFile(path.join(installedRoot, 'package.json'), 'utf8'));
    validateManifest(installed);
    for (const css of ['src/index.css', 'src/foundations.css', 'src/layout.css', 'src/primitives.css', 'src/utilities.css']) if (!(await readFile(path.join(installedRoot, css), 'utf8')).trim()) throw new Error(`empty CSS: ${css}`);
    for (const file of ['skills/neobrui/SKILL.md', 'skills/neobrui/references/api.md', 'skills/neobrui/references/examples.md', 'skills/neobrui/templates/verification.md']) if (!(await readFile(path.join(installedRoot, file), 'utf8')).trim()) throw new Error(`missing skill payload: ${file}`);
    const report = { schema: 'neobrui-release-rehearsal/v1', sourceSha: run('git', ['rev-parse', 'HEAD']), platform: process.platform, arch: process.arch, runner: { uname: run('uname', ['-a'], { cwd: temp }) }, tools: { node: run(process.execPath, ['--version'], { cwd: temp }), npm: run('npm', ['--version'], { cwd: temp }), pnpm: run('pnpm', ['--version'], { cwd: temp }) }, package: { name: manifest.name, version: manifest.version, private: manifest.private, publishConfig: manifest.publishConfig, license: manifest.license, exports: manifest.exports, files: manifest.files }, expected: release, files, archive: { filename: info.filename, size: archive.byteLength, sha256: digest(archive, 'sha256'), sri: `sha512-${createHash('sha512').update(archive).digest('base64')}` }, consumer: { installed: true, scriptsIgnored: true, networkFree: true, cssReadable: true, skillsReadable: true } };
    await writeFile(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify({ archive: archivePath, report: path.join(out, 'report.json'), sha256: report.archive.sha256, sri: report.archive.sri }, null, 2));
  } finally { await rm(temp, { recursive: true, force: true }); }
}
if (import.meta.url === `file://${process.argv[1]}`) main().catch(error => { console.error(error.message); process.exitCode = 1; });
