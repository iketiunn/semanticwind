# Semanticwind

**Start with HTML. Grow into Tailwind.**

Semanticwind is zero-build semantic CSS for projects expected to grow into Tailwind CSS v4.

Add one production-ready stylesheet today. Adopt Tailwind later without rewriting your markup or replacing your semantic baseline.

```text
semantic HTML
      │
      ├─ enough ───────────────→ stop
      ├─ local exception ───────→ Tailwind utilities
      ├─ reusable UI ───────────→ component layer
      └─ product concept ───────→ your own component
```

The boundary is deliberate: native elements receive broadly useful defaults, but HTML tags never become a component API. `article` is not a card. `nav` does not choose a layout. Button variants remain component meaning.

> Would this style make sense for almost every correct use of this element?

If yes, it may belong in Semanticwind. If not, use a utility or component.

## Who it is for

Semanticwind fits when all three are true:

- the project starts with plain or server-rendered semantic HTML;
- a frontend build pipeline would be premature;
- Tailwind is the expected design system once custom UI appears.

If Tailwind is not the expected destination, Semanticwind is probably not the right dependency.

## Why a package?

Semanticwind maintains two synchronized forms of one baseline:

- `dist/semanticwind.min.css` before Tailwind;
- `src/semanticwind.css` in Tailwind's `base` layer afterward.

Contract checks verify that the standalone artifact is complete, the Tailwind source keeps the same semantic ownership, project theme values reach native defaults, and utilities override normally. Without that maintained transition, Semanticwind would be only another stylesheet to copy.

## Start without Tailwind

Semanticwind is not published yet. For now, copy [`dist/semanticwind.min.css`](./dist/semanticwind.min.css) into a project and link it directly:

```html
<link rel="stylesheet" href="./semanticwind.min.css">
```

After the first npm release, the pinned CDN URL will be:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semanticwind@0.1.0/dist/semanticwind.min.css">
```

Then write ordinary HTML:

```html
<form>
  <label>
    Email
    <input type="email" placeholder="you@example.com">
  </label>

  <button type="submit">Subscribe</button>
</form>
```

The standalone build contains Tailwind Preflight plus Semanticwind's native defaults, but no utility classes or runtime.

### Motion

Semanticwind enables transitions, control feedback, smooth scrolling, and indeterminate progress animation by default. To opt out, set `data-sw-motion="off"` on the root element:

```html
<html data-sw-motion="off">
```

The project can then supply its own motion. Semanticwind motion also stays off when the user requests reduced motion.

## Add Tailwind when you need it

When a local design choice earns a class, replace the standalone stylesheet with a Tailwind CSS entry file:

```css
@import "tailwindcss";
@import "semanticwind";
```

During development of this repository, use `@import "./src/semanticwind.css"` instead of the unpublished package import.

Semanticwind now compiles into Tailwind's `base` layer and uses the project's `zinc`, `blue`, `red`, `emerald`, and `yellow` theme colors. Keep those names available or redefine their values with `@theme`; removing those namespaces makes the corresponding `@apply` utilities unavailable.

Add Tailwind when the choice is local:

```html
<button class="w-full rounded-full sm:w-auto">Publish</button>
```

Add a component when the meaning repeats:

```html
<button class="button" data-variant="destructive">Delete project</button>
```

Richer UI belongs in the project's Tailwind component layer. Semanticwind intentionally stops at the native baseline.

## Escape hatches

Semanticwind owns the useful default, not the exception. Tailwind utilities remain the override API.

### Framework root

The built-in page container targets direct `body` children. If React, Vue, or LiveView inserts a root wrapper, put the same layout utilities on the real page elements:

```html
<div id="app">
  <header class="mx-auto w-full max-w-5xl px-5 pt-8 sm:px-8">...</header>
  <main class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">...</main>
</div>
```

### Layout or navigation exception

Semanticwind does not turn `section` or `nav` into components. Make a direct page container full-width or choose a navigation layout locally:

```html
<main class="max-w-none px-0">...</main>
<nav class="flex flex-wrap items-center justify-between gap-4">...</nav>
```

## What it covers

- responsive document typography and direct page containers
- inline text, lists, quotations, code, media, and mobile-scrollable tables
- text and specialized form controls, search, datalists, multiselect, validation, and opinionated native buttons
- `details`, `dialog`, popover, `progress`, and `meter`
- a responsive light color scheme, focus states, and reduced motion

Semanticwind styles popover surfaces; browsers own their behavior, and applications own placement.

Semanticwind stays in Tailwind’s `base` layer and uses low-specificity selectors that override Preflight. Component styles and utilities override it normally.

It does not provide navigation layout, cards, heroes, button variants, application states, or product-specific UI.

Browser support follows [Tailwind CSS v4's compatibility baseline](https://tailwindcss.com/docs/compatibility): Chrome 111, Safari 16.4, and Firefox 128 or newer.

## Development

```bash
npm install
npm run dev
```

Run `npm run check` to build the demo and compile the documented escape-hatch recipes and Tailwind contract fixture. Open `tests/contract.html`; it must report `PASS` after representative layout, typography, link, control, and theme overrides are computed by the browser.

The contract fixture is intentionally small: it tests the reason this package exists, not every declaration in the stylesheet.

## License

MIT
