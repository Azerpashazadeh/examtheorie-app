#!/usr/bin/env node
/**
 * inject-seo.js — Delegates to build-seo.js so GitHub Actions (.github/workflows/inject-seo.yml)
 * keeps all multilingual homepages (/nl/, /tr/, /ar/), public chapters, free tests,
 * JSON-LD schemas, noindex guards, and sitemap.xml 100% synchronized.
 */
const path = require('path');
const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
if (dirIdx !== -1 && args[dirIdx + 1]) {
  process.chdir(path.resolve(args[dirIdx + 1]));
}
require(path.join(process.cwd(), 'build-seo.js'));
