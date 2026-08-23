import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const [
  manifestSource,
  semanticwindSource,
  documentationSource,
  landing,
  gallery,
  standalone,
  recipes,
  contract,
  semanticwindMigration,
  picoMigration,
  semanticwindMigrationSource,
  picoMigrationSource,
] = await Promise.all([
  readFile('package.json', 'utf8'),
  readFile('src/semanticwind.css', 'utf8'),
  readFile('docs/app.css', 'utf8'),
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
assert.match(semanticwindSource, /option:is\(:hover, :focus\)/, 'custom select options must keep pointer and keyboard highlights in parity');
assert.match(semanticwindSource, /form:not\(\[class\]\) > label > :is\(input:not\(\[type='checkbox'\], \[type='radio'\]\), textarea, select\)/, 'classless form flow must not stack checkbox labels or inline label text');
assert.match(semanticwindSource, /:is\(input, textarea\)\[readonly\][\s\S]*bg-zinc-100/, 'read-only controls must remain distinct without disabled styling');
assert.match(semanticwindSource, /:is\(menu\)[\s\S]*flex[\s\S]*flex-wrap[\s\S]*gap-2/, 'command menus must receive a minimal wrapping toolbar layout');
assert.doesNotMatch(semanticwindSource, /\[role='tooltip'\]/, 'tooltip roles must remain application-owned behavior and styling');
assert.match(semanticwindSource, /:is\(\[popover\]\)\s*{\s*margin: initial;\s*position-area: block-end span-all;\s*position-try-fallbacks: flip-block;/, 'popovers must reset viewport centering, use the declarative invoker anchor, and flip before overflowing');
assert.match(semanticwindSource, /:is\(dialog\)::backdrop/, 'modal dialogs must retain the strong backdrop');
assert.doesNotMatch(semanticwindSource, /\[popover\]\)::backdrop|\[popover\]::backdrop/, 'non-modal popovers must not receive the modal dialog backdrop');
assert.match(semanticwindSource, /:is\(meter\)\s*{\s*appearance: none;[\s\S]*h-1\.5[\s\S]*rounded-\[3px\]/, 'meter must use a thin precision track distinct from progress');
assert.match(semanticwindSource, /::-webkit-meter-bar\s*{\s*background-image: none;/, 'meter must remove the native WebKit track gradient');
assert.match(semanticwindSource, /border-inline-end: 2px solid var\(--color-zinc-50\);[\s\S]*border-start-end-radius: 0;[\s\S]*border-end-end-radius: 0;/, 'meter must use a neutral cutout endpoint marker');
assert.doesNotMatch(semanticwindSource, /border-inline-end:[^;]*currentColor/, 'meter endpoint marker must not inherit high-contrast body text color');
assert.match(semanticwindSource, /::-webkit-meter-optimum-value[\s\S]*var\(--color-emerald-500\)/, 'meter must preserve semantic optimum coloring');
assert.match(semanticwindSource, /::-webkit-meter-suboptimum-value[\s\S]*var\(--color-yellow-500\)/, 'meter must preserve semantic warning coloring');
assert.match(semanticwindSource, /::-webkit-meter-even-less-good-value[\s\S]*var\(--color-red-500\)/, 'meter must preserve semantic poor coloring');
assert.match(semanticwindSource, /color-scheme:\s*light;/, 'Semanticwind must remain light-only');
assert.doesNotMatch(semanticwindSource, /\bdark:|light-dark\(/, 'Semanticwind must not ship dark-theme styling');
assert.match(semanticwindSource, /@media \(prefers-reduced-motion: no-preference\)[\s\S]*:where\(html:not\(\[data-sw-motion='off'\]\)\)[\s\S]*scroll-behavior: smooth;/, 'Semanticwind motion must run by default unless the root opts out or requests reduced motion');
assert.match(semanticwindSource, /data-sw-motion='off'[\s\S]*input\[type='checkbox'\][\s\S]*input\[type='radio'\][\s\S]*active:scale-90/, 'default motion must cover native choice control presses');
assert.match(semanticwindSource, /data-sw-motion='off'[\s\S]*input\[type='file'\][\s\S]*::file-selector-button[\s\S]*transition-colors/, 'default motion must cover the file picker button');
assert.match(semanticwindSource, /progress:indeterminate[\s\S]*animation: semanticwind-progress 1\.5s linear infinite;/, 'default motion must animate indeterminate progress at the restrained pace');
assert.doesNotMatch(semanticwindSource, /prefers-reduced-motion: reduce|animation-duration: 0\.01ms/, 'Semanticwind must not globally override application-owned motion');
assert.match(landing, /<html lang="en">/, 'the landing page must demonstrate default motion');
assert.match(gallery, /<html lang="en">[\s\S]*<progress id="gallery-progress-indeterminate">/, 'the gallery must demonstrate default motion and indeterminate progress');
assert.match(documentationSource, /:where\(:root:not\(\[data-sw-motion='off'\]\)\) \.copy-label/, 'documentation-only motion must use the same opt-out');
assert.match(documentationSource, /\.reference-layout[\s\S]*\.reference-desktop-outline[\s\S]*position: sticky/, 'the reference must style its sticky desktop outline');
assert.match(documentationSource, /\.reference-mobile-outline/, 'the reference must provide compact mobile contents');
assert.match(documentationSource, /\.reference-entry[\s\S]*grid-template-columns/, 'reference entries must become flat two-column rows when space allows');
assert.doesNotMatch(documentationSource, /\.gallery-|\.reference-card/, 'the reference must not restore the old gallery wrappers or cards');
assert.equal(gallery.match(/data-reference-outline>/g)?.length, 2, 'desktop and mobile must each expose the reference outline');
assert.equal(gallery.match(/aria-current="location"/g)?.length, 2, 'both outlines must identify their initial section');
for (const topic of ['styled-elements', 'best-practice-patterns', 'native-before-custom']) {
  assert.equal(gallery.match(new RegExp(`href="#${topic}"`, 'g'))?.length, 2, `both outlines must link to ${topic}`);
  assert.match(gallery, new RegExp(`<section id="${topic}"`), `the reference must contain the ${topic} topic`);
}
for (const group of ['text-and-structure', 'tables', 'forms', 'interactive-elements']) {
  assert.equal(gallery.match(new RegExp(`href="#${group}"`, 'g'))?.length, 2, `both outlines must link to ${group}`);
  assert.match(gallery, new RegExp(`<section id="${group}"`), `Element reference must contain ${group}`);
}
assert.match(gallery, /data-active[\s\S]*aria-current[\s\S]*IntersectionObserver/, 'the outline must track the topic and child currently in view');
assert.doesNotMatch(gallery, /<(?:img|picture|audio|video|canvas|svg|iframe|embed|object)\b|sample-(?:tone|video)|<input type="image"/, 'media-only specimens and fixtures must remain out of the reference');
assert.match(gallery, /<td>3 passed<\/td>\s*<td>1\.568 s<\/td>/, 'the gallery table total must match its three checks');
assert.match(gallery, /<input id="styled-confidence"[^>]*>[\s\S]*<output id="styled-confidence-output" for="styled-confidence">/, 'the range output must explicitly name its input');
assert.match(gallery, /<dl>\s*<div>/, 'the gallery must cover grouped description rows');
assert.match(gallery, /<input value="Default text behavior">/, 'the gallery must cover untyped inputs');
assert.match(gallery, /<input value="Focusable and submitted" readonly>/, 'the gallery must cover read-only controls');
assert.match(gallery, /<menu aria-label="Editor actions">[\s\S]*<button type="button">Copy<\/button>/, 'the gallery must cover native command menus');
assert.match(gallery, /<input id="release-name" aria-describedby="release-name-help"[^>]*>[\s\S]*<small id="release-name-help">/, 'the gallery must prefer visible, programmatically related help over a title tooltip');
assert.equal(gallery.match(/<details name="reference-faq"/g)?.length, 2, 'the reference must teach native exclusive disclosure groups');
for (const pattern of ['standalone-content', 'caption-content', 'describe-values', 'group-controls', 'field-states', 'progress-or-meter']) {
  assert.match(gallery, new RegExp(`id="${pattern}"[\\s\\S]*class="reference-source"`), `Element-choice examples must teach ${pattern}`);
}
for (const tip of ['inline-help', 'exclusive-disclosure', 'native-popover', 'native-dialog', 'specialized-inputs', 'native-suggestions']) {
  assert.match(gallery, new RegExp(`id="${tip}"[\\s\\S]*class="reference-source"`), `Native-first examples must teach ${tip}`);
}
assert.ok(gallery.indexOf('class="reference-source"') > gallery.indexOf('id="best-practice-patterns"'), 'Element reference must not repeat source-code disclosures');
assert.ok((gallery.match(/https:\/\/caniuse\.com\//g)?.length ?? 0) >= 8, 'browser-owned tips must link to current Can I Use references');
assert.doesNotMatch(gallery, /interestfor|interesttarget/, 'Chromium-only interest invokers must stay out of the recommendation guide');
assert.doesNotMatch(gallery, /popover="hint"/, 'the recommendation guide must use the Baseline automatic popover instead of limited hint behavior');
assert.match(gallery, /<h3>Optional help<\/h3>[\s\S]*<button type="button" popovertarget="shortcut-help">Keyboard shortcut<\/button>[\s\S]*<div id="shortcut-help" popover>/, 'optional help must use an ordinary user-invoked popover');
assert.match(gallery, /commandfor="native-command-dialog"[\s\S]*command="show-modal"/, 'the reference must teach native dialog commands');
assert.equal(gallery.match(/<meter\b/g)?.length, 4, 'the reference must demonstrate meter states and the progress comparison');
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
assert.match(landing, /href="\.\/gallery\.html">Reference<\/a>/, 'the landing page must keep the static reference destination');
assert.match(gallery, /<html lang="en">/, 'the gallery must retain its document language');
assert.doesNotMatch(gallery, /data-theme-toggle/, 'the gallery must remain light-only');
assert.doesNotMatch(gallery, /role="tooltip"/, 'the gallery must not imply that Semanticwind provides tooltip behavior');
assert.doesNotMatch(standalone, /@(?:apply|import)\b/, 'standalone CSS must be fully compiled');
assert.match(standalone, /data-sw-motion=off/, 'the standalone build must preserve the motion opt-out');
assert.match(standalone, /@keyframes semanticwind-progress/, 'the standalone build must include indeterminate progress motion');
assert.match(standalone, /\[popover\]/, 'the standalone build must cover native popovers');
assert.match(standalone, /margin:initial;position-area:block-end span-all/, 'the standalone build must reset popover viewport centering before anchor placement');
assert.match(standalone, /position-area:block-end span-all/, 'the standalone build must anchor invoked popovers below their controls');
assert.match(standalone, /position-try-fallbacks:flip-block/, 'the standalone build must flip anchored popovers before overflowing');
assert.doesNotMatch(standalone, /\[role=tooltip\]/, 'the standalone build must leave tooltip components to applications');
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
