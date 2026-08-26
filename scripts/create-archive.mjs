import { lstat, mkdir, realpath, rm } from 'node:fs/promises';
import { dirname, isAbsolute, posix, resolve } from 'node:path';
import { create } from 'tar';

const EPOCH = new Date(0);

function validatePath(file) {
  if (typeof file !== 'string' || !file || file.includes('\0') || file.includes('\\') || isAbsolute(file)
    || file.startsWith('//') || /^[A-Za-z]:[\\/]/.test(file)) {
    throw new Error(`unsafe archive path: ${file}`);
  }
  const parts = file.split('/');
  if (parts.some(part => !part || part === '.' || part === '..')) throw new Error(`unsafe archive path: ${file}`);
  const normalized = posix.normalize(file);
  if (!normalized || normalized === '.' || normalized.startsWith('../') || normalized.includes('\\')) {
    throw new Error(`unsafe archive path: ${file}`);
  }
  return normalized;
}

function assertContained(root, candidate, member) {
  const relative = posix.relative(root, candidate);
  if (relative === '..' || relative.startsWith('../') || posix.isAbsolute(relative)) {
    throw new Error(`archive path escapes root at ${member}`);
  }
}

async function validateMember(archiveRoot, member) {
  const components = member.split('/');
  let current = archiveRoot;
  for (let index = 0; index < components.length; index += 1) {
    const component = components[index];
    current = posix.join(current, component);
    const info = await lstat(current);
    if (info.isSymbolicLink()) throw new Error(`symlink is not allowed in archive: ${member} (component ${component})`);
    if (index < components.length - 1 && !info.isDirectory()) {
      throw new Error(`directory required for archive path component: ${member} (component ${component})`);
    }
    const canonical = await realpath(current);
    assertContained(archiveRoot, canonical, `${member} (component ${component})`);
    if (index === components.length - 1 && !info.isFile()) {
      throw new Error(`directory or unsupported entry is not allowed in archive: ${member}`);
    }
  }
}

function asciiCaseFold(file) {
  // Archive duplicate checks use deterministic ASCII folding; Unicode is not normalized.
  return file.replace(/[A-Z]/g, character => character.toLowerCase());
}

export function validateArchiveMembers(files) {
  if (!Array.isArray(files)) throw new TypeError('archive files must be an array');
  const normalized = files.map(validatePath);
  const exact = new Set();
  const folded = new Set();
  for (const file of normalized) {
    const key = asciiCaseFold(file);
    if (exact.has(file) || folded.has(key)) throw new Error(`duplicate archive path is not allowed: ${file}`);
    exact.add(file);
    folded.add(key);
  }
  return normalized.sort();
}

/** Create a deterministic gzip tar without invoking a system tar binary. */
export async function createDeterministicArchive({ root, output, files, prefix = '' }) {
  if (!Array.isArray(files)) throw new TypeError('archive files must be an array');
  const sortedFiles = validateArchiveMembers(files);
  const archivePrefix = prefix ? validatePath(prefix) : undefined;
  const archiveRoot = await realpath(resolve(root));
  for (const file of sortedFiles) await validateMember(archiveRoot, file);
  const archivePath = resolve(output);
  await mkdir(dirname(archivePath), { recursive: true });
  try {
    await create({
      cwd: archiveRoot,
      file: archivePath,
      gzip: { portable: true, level: 9 },
      portable: true,
      mtime: EPOCH,
      noPax: false,
      prefix: archivePrefix,
      strict: true,
      onWriteEntry(entry) {
        entry.uid = 0;
        entry.gid = 0;
        entry.uname = '';
        entry.gname = '';
        entry.mtime = EPOCH;
        entry.mode = entry.type === 'Directory' ? 0o755 : 0o644;
      },
    }, sortedFiles);
  } catch (error) {
    await rm(archivePath, { force: true });
    throw error;
  }
  return { path: archivePath, files: sortedFiles };
}
