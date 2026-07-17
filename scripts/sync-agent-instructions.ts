#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const sourcePath = resolve(root, 'AGENTS.md');
const markdownTargets = [
  '.claude/CLAUDE.md',
  '.gemini/GEMINI.md',
  '.github/copilot-instructions.md',
  '.junie/guidelines.md',
  '.windsurf/rules/guidelines.md',
];
const cursorTarget = '.cursor/rules/cursor.mdc';
const cursorHeader = ['---', 'context: true', 'priority: high', 'scope: project', '---'].join('\n');

const options = {
  check: process.argv.includes('--check'),
  cursorEol: getCursorEol(),
};

function getCursorEol() {
  const raw = (process.env['CURSOR_EOL'] ?? 'preserve').toLowerCase();

  if (raw === 'lf') {
    return '\n';
  }

  if (raw === 'crlf') {
    return '\r\n';
  }

  return 'preserve';
}

export function detectEol(content: string): '\r\n' | '\n' {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

export function normalizeEol(content: string, eol: string): string {
  return content.replace(/\r?\n/g, eol);
}

export function ensureTrailingNewline(content: string): string {
  return content.endsWith('\n') ? content : `${content}\n`;
}

export function readExisting(filePath: string): {
  exists: boolean;
  content: string;
  eol: '\r\n' | '\n';
} {
  if (!existsSync(filePath)) {
    return { exists: false, content: '', eol: '\n' };
  }

  const content = readFileSync(filePath, 'utf8');
  return { exists: true, content, eol: detectEol(content) };
}

export function maybeWrite(
  filePath: string,
  nextContent: string,
): { changed: boolean; wrote: boolean } {
  const existing = readExisting(filePath);
  const changed = existing.content !== nextContent;

  if (options.check) {
    return { changed, wrote: false };
  }

  if (changed) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, nextContent, 'utf8');
  }

  return { changed, wrote: changed };
}

function main() {
  const sourceRaw = readFileSync(sourcePath, 'utf8');
  const sourceBody = ensureTrailingNewline(sourceRaw.trimEnd());
  const results = [];

  for (const relativeTarget of markdownTargets) {
    const targetPath = resolve(root, relativeTarget);
    const { eol } = readExisting(targetPath);
    const targetContent = normalizeEol(sourceBody, eol);

    results.push({
      file: relativeTarget,
      ...maybeWrite(targetPath, targetContent),
    });
  }

  const cursorPath = resolve(root, cursorTarget);
  const cursorExisting = readExisting(cursorPath);
  const cursorEol = options.cursorEol === 'preserve' ? cursorExisting.eol : options.cursorEol;
  const cursorContentRaw = `${cursorHeader}\n\n${sourceBody}`;
  const cursorContent = normalizeEol(cursorContentRaw, cursorEol);

  results.push({
    file: cursorTarget,
    ...maybeWrite(cursorPath, cursorContent),
  });

  const changedCount = results.filter((result) => result.changed).length;

  for (const result of results) {
    const status = result.changed ? (options.check ? 'OUTDATED' : 'UPDATED') : 'UNCHANGED';
    console.log(`${status} ${result.file}`);
  }

  if (options.check && changedCount > 0) {
    console.error(
      `\n${changedCount} file(s) are out of sync. Run: npm run sync:agent-instructions`,
    );
    process.exit(1);
  }

  console.log(`\nDone. ${changedCount} file(s) ${options.check ? 'out of sync' : 'updated'}.`);
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
