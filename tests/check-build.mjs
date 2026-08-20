import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const [manifestSource, semanticwindSource, landing, gallery, standalone, recipes, contract, semanticwindMigration, picoMigration, semanticwindMigrationSource, picoMigrationSource] = await Promise.all([
  readFile('package.json', 'utf8'),
  readFile('src/semanticwind.css', 'utf8'),
  readFile('docs/index.html', 'utf8'),
  readFile('docs/gallery.html', 'utf8'),
  readFile('dist/semanticwind.min.css', 'utf8'),
  readFile('tests/recipes.out.css', 'utf8'),
  readFile('tests/contract.out.css', 'utf8'),
  readFile('tests/migration/semanticwind.out.css', 'utf8'),
  readFile('tests/migration/pico.out.css', 'utf8'),
  readFile('tests/migration/semanticwind.css', 'utf8'),
  readFile('tests/migration/pico.css', 'utf8'),
]);

const manifest = JSON.parse(manifestSource);
const publishedFiles = new Set(manifest.files);

for (const exportPath of Object.values(manifest.exports)) {
  assert.ok(publishedFiles.has(exportPath.replace(/^\.\//, '')), `${exportPath} must be included in the npm package`);
}

assert.equal(`./${manifest.style}`, manifest.exports['.'], 'the style field and default Tailwind import must resolve to the same source');
assert.equal(manifest.peerDependenciesMeta?.tailwindcss?.optional, true, 'standalone installs must not require Tailwind');
assert.match(semanticwindSource, /@layer base\s*{/, 'the default package export must remain in Tailwind’s base layer');
assert.match(semanticwindSource, /@media \(max-width: 39\.999rem\)[\s\S]*overflow-x-auto/, 'wide tables must remain usable on small screens');
assert.match(semanticwindSource, /input\[type='file'\][\s\S]*::file-selector-button[\s\S]*min-h-11/, 'the file picker button must keep the common control target height');
assert.match(semanticwindSource, /@supports \(appearance: base-select\)\s*{\s*@media \(hover: hover\) and \(pointer: fine\)/, 'custom select styling must preserve native touch and unsupported-browser pickers');
assert.match(semanticwindSource, /form:not\(\[class\]\) > label > :is\(input:not\(\[type='checkbox'\], \[type='radio'\]\), textarea, select\)/, 'classless form flow must not stack checkbox labels or inline label text');
assert.match(semanticwindSource, /:is\(meter\)\s*{\s*appearance: none;[\s\S]*h-1\.5[\s\S]*rounded-\[3px\]/, 'meter must use a thin precision track distinct from progress');
assert.match(semanticwindSource, /::-webkit-meter-bar\s*{\s*background-image: none;/, 'meter must remove the native WebKit track gradient');
assert.match(semanticwindSource, /border-inline-end: 2px solid var\(--color-zinc-50\);[\s\S]*border-start-end-radius: 0;[\s\S]*border-end-end-radius: 0;/, 'meter must use a neutral cutout endpoint marker');
assert.doesNotMatch(semanticwindSource, /border-inline-end:[^;]*currentColor/, 'meter endpoint marker must not inherit high-contrast body text color');
assert.match(semanticwindSource, /::-webkit-meter-optimum-value[\s\S]*var\(--color-emerald-500\)/, 'meter must preserve semantic optimum coloring');
assert.match(semanticwindSource, /::-webkit-meter-suboptimum-value[\s\S]*var\(--color-yellow-500\)/, 'meter must preserve semantic warning coloring');
assert.match(semanticwindSource, /::-webkit-meter-even-less-good-value[\s\S]*var\(--color-red-500\)/, 'meter must preserve semantic poor coloring');
assert.match(semanticwindSource, /color-scheme:\s*light;/, 'Semanticwind must remain light-only');
assert.doesNotMatch(semanticwindSource, /\bdark:|light-dark\(/, 'Semanticwind must not ship dark-theme styling');
assert.match(landing, /cdn\.jsdelivr\.net\/npm\/semanticwind@0\.1\.0\/dist\/semanticwind\.min\.css/, 'the landing page must show the planned pinned CDN path');
assert.equal(landing.match(/class="copy-block"/g)?.length, 2, 'both install snippets must have copy controls');
assert.equal(landing.match(/class="copy-label"/g)?.length, 2, 'both install snippets must use native copy buttons');
assert.equal(landing.match(/aria-live="polite"/g)?.length, 2, 'both copy controls must announce feedback');
assert.match(landing, /class="wrap-code/, 'the standalone link snippet must wrap');
assert.equal(landing.match(/navigator\.clipboard\s*\.writeText/g)?.length, 2, 'both install snippets must copy their adjacent code');
assert.equal(landing.match(/'Copy failed'/g)?.length, 2, 'both copy buttons must report clipboard failures');
assert.equal(landing.match(/setTimeout\(/g)?.length, 2, 'both copy labels must reset');
assert.doesNotMatch(landing, /copy\.js|data-copy|role="button"/, 'copy controls must not depend on an external script or simulated buttons');
assert.doesNotMatch(landing, /data-theme-toggle/, 'the landing page must remain light-only');
assert.doesNotMatch(gallery, /data-theme-toggle/, 'the gallery must remain light-only');
assert.doesNotMatch(standalone, /@(?:apply|import)\b/, 'standalone CSS must be fully compiled');
assert.match(standalone, /\[popover\]/, 'the standalone build must cover native popovers');
assert.match(standalone, /select:is\(\[multiple\],\[size\]\)/, 'the standalone build must cover multiselect controls');
assert.match(standalone, /:is\(search\)\{/, 'the standalone build must cover the search landmark');
assert.doesNotMatch(recipes, /prefers-color-scheme:dark|\[data-theme=dark\]/, 'recipes must remain light-only');

for (const utility of ['max-w-none', 'rounded-none', 'bg-blue-600', 'bg-red-500', 'no-underline', 'shadow-none']) {
  assert.match(contract, new RegExp(`\\.${utility.replaceAll('-', '\\-')}[,{]`), `${utility} must be present in the contract build`);
}

assert.match(contract, /--color-blue-600:#7c3aed/, 'the custom theme must reach the contract build');
assert.ok(contract.indexOf('@layer base{') < contract.indexOf('@layer utilities{'), 'utilities must follow the base layer');
assert.doesNotMatch(semanticwindMigration, /--pico-/, 'the Semanticwind migration must leave no Pico token vocabulary');
assert.match(picoMigration, /--pico-font-size:100%/, 'the Pico migration must preserve Tailwind rem token sizing');
assert.match(picoMigration, /--pico-primary-background:var\(--color-blue-600\)/, 'the Pico migration must bridge its primary token');

for (const css of [semanticwindMigration, picoMigration]) {
  for (const utility of ['grid', 'rounded-xl', 'bg-blue-600', 'bg-red-500', 'p-5']) {
    assert.match(css, new RegExp(`\\.${utility.replaceAll('-', '\\-')}[,{]`), `${utility} must compile in both migrations`);
  }
}

console.log('Build contracts pass.');
const sourceLines = (css) => css.split('\n').filter((line) => line.trim()).length;
console.log(`Migration source: Semanticwind ${sourceLines(semanticwindMigrationSource)} lines; Pico ${sourceLines(picoMigrationSource)} lines.`);
console.log(`Migration CSS gzip: Semanticwind ${gzipSync(semanticwindMigration).length} B; Pico ${gzipSync(picoMigration).length} B.`);
