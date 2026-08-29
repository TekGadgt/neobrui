#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { compareReports } from './release-rehearsal.mjs';

const [leftPath, rightPath] = process.argv.slice(2);
if (!leftPath || !rightPath) throw new Error('usage: compare-release-rehearsal.mjs <ubuntu-report> <macos-report>');
const [left, right] = await Promise.all([leftPath, rightPath].map(path => readFile(path, 'utf8').then(JSON.parse)));
compareReports(left, right);
console.log(`release rehearsal reports match: ${left.archive.sha256}`);
