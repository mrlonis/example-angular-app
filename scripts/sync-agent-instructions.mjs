#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourcePath = resolve(root, 'agent-instructions/source.md');
const markdownTargets = [
  'AGENTS.md',
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
  const raw = (process.env.CURSOR_EOL ?? 'preserve').toLowerCase();

  if (raw === 'lf') {
    return '\n';
  }

  if (raw === 'crlf') {
    return '\r\n';
  }

  return 'preserve';
}

function detectEol(content) {
  return content.includes('\r\n') ? '\r\n' : '\n';
}

function normalizeEol(content, eol) {
  return content.replace(/\r?\n/g, eol);
}

function ensureTrailingNewline(content) {
  return content.endsWith('\n') ? content : `${content}\n`;
}

function readExisting(path) {
  if (!existsSync(path)) {
    return { exists: false, content: '', eol: '\n' };
  }

  const content = readFileSync(path, 'utf8');
  return { exists: true, content, eol: detectEol(content) };
}

function maybeWrite(path, nextContent) {
  const existing = readExisting(path);
  const changed = existing.content !== nextContent;

  if (options.check) {
    return { changed, wrote: false };
  }

  if (changed) {
    writeFileSync(path, nextContent, 'utf8');
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

main();
