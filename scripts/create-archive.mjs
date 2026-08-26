import { lstat, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, normalize, resolve, sep } from 'node:path';
import { create } from 'tar';

const EPOCH = new Date(0);

function validatePath(file) {
  if (typeof file !== 'string' || !file || isAbsolute(file) || file.split(/[\\/]/).includes('..')) throw new Error(`unsafe archive path: ${file}`);
  const normalized = normalize(file).replaceAll(sep, '/');
  if (normalized === '..' || normalized.startsWith('../') || normalized.includes('\\')) throw new Error(`unsafe archive path: ${file}`);
  return normalized;
}

/** Create a deterministic gzip tar without invoking a system tar binary. */
export async function createDeterministicArchive({ root, output, files, prefix = '' }) {
  if (!Array.isArray(files)) throw new TypeError('archive files must be an array');
  const archiveRoot = resolve(root);
  const sortedFiles = [...new Set(files.map(validatePath))].sort();
  for (const file of sortedFiles) {
    const info = await lstat(resolve(archiveRoot, file));
    if (info.isSymbolicLink()) throw new Error(`symlink is not allowed in archive: ${file}`);
    if (!info.isFile()) throw new Error(`directory or unsupported entry is not allowed in archive: ${file}`);
  }
  const archivePath = resolve(output);
  const archivePrefix = prefix ? validatePath(prefix) : undefined;
  await mkdir(dirname(archivePath), { recursive: true });
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
  return { path: archivePath, files: sortedFiles };
}
