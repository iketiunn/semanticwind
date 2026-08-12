# Semanticwind

**Semantic HTML when it’s enough. Tailwind when it isn’t.**

Semanticwind is a small semantic baseline **authored for Tailwind CSS v4**.

It makes ordinary HTML useful before you have decided that every element deserves a class, component, variant system, and committee meeting.

```text
semantic HTML
      │
      ├─ local layout / visual exception ──→ Tailwind utilities
      │
      ├─ reusable generic UI ──────────────→ component layer / library
      │
      └─ repeated product concept ─────────→ your own component
```

There is no required component library. Basecoat, shadcn-style ports, your own CSS classes, Web Components, React/Vue/Svelte components, or server-side templates can all sit above the same baseline.

## Why

Tailwind is excellent once you know what you are designing. It is less pleasant during the first sketch of a page, when every heading, form control, table, and code block begins life as Tailwind Preflight's intentionally neutral baseline.

Classless CSS frameworks solve that first hour beautifully, but they often turn HTML semantics into an accidental component API. Rules such as `article = card`, `nav ul = horizontal menu`, or `input[type="reset"] = destructive button` become liabilities as an application grows.

Semanticwind takes a narrower approach:

- Native HTML gets sensible, low-specificity defaults.
- Structural elements keep their HTML meaning. `article` is not automatically a card and `nav` does not choose a layout for you.
- Native controls get neutral, usable defaults rather than invented component variants.
- Tailwind utilities remain the normal escape hatch for layout, responsive behavior, and one-off changes.
- Generic reusable UI belongs in a component layer or whichever component library you choose.
- Repeated product concepts become your own components instead of more global selectors.

## How is this related to Tailwind?

Semanticwind is **not standalone CSS that merely happens to work next to Tailwind**.

The source is written as Tailwind v4 CSS:

```css
@layer base {
  :where(h1) {
    @apply text-4xl font-bold tracking-tight;
  }

  :where(input) {
    @apply rounded-lg border border-zinc-300 px-3 py-2;
  }
}
```

That gives Semanticwind three useful properties:

1. **It uses Tailwind's design system.** Spacing, typography, colors, radii, dark variants, and other values come from Tailwind utilities rather than a second framework-specific token system.
2. **It participates in Tailwind's cascade.** Semanticwind lives in `@layer base`, normal component styles can live in `@layer components`, and Tailwind utilities remain the most explicit local override.
3. **It needs Tailwind to build.** The browser does not understand `@apply`; Tailwind compiles Semanticwind together with your application CSS into ordinary CSS.

So the intended input is:

```css
@import "tailwindcss";
@import "semanticwind";
```

During development in this repository:

```css
@import "tailwindcss";
@import "./src/semanticwind.css";
```

## The scaling model

### 1. Start with semantic HTML

```html
<main>
  <h1>Settings</h1>
  <p>Manage your account.</p>

  <form>
    <label>
      Email
      <input type="email" placeholder="you@example.com">
    </label>

    <button type="submit">Save</button>
  </form>
</main>
```

This should already be useful. No `.prose`, `.input`, `.button`, or wrapper component is required just to get a reasonable baseline.

A completely classless `<form>` gets a simple vertical flow for prototyping. Add a class when you want Tailwind or a component layer to own the layout.

### 2. Use Tailwind when the need is contextual

```html
<button class="w-full rounded-full sm:w-auto">
  Publish
</button>
```

Responsive width and a one-off shape are local design choices. They should stay visible in the markup instead of becoming new global semantic rules.

### 3. Add a component layer when UI meaning becomes reusable

```html
<button class="button" data-variant="destructive">
  Delete project
</button>
```

`destructive` is component meaning, not HTML meaning.

That component can be your own Tailwind class:

```css
@layer components {
  .button {
    @apply inline-flex items-center rounded-lg bg-zinc-950 px-3 py-2 text-white;
  }

  .button[data-variant="destructive"] {
    @apply bg-red-600;
  }
}
```

Or it can come from a component library. Semanticwind does not care which one.

### 4. Promote repeated product concepts into your own components

```html
<article class="device-card">
  <header class="flex items-start justify-between gap-4">
    <h2>Living room</h2>
    <span class="status-badge">Online</span>
  </header>
</article>
```

`article` still means article. `.device-card` is product meaning. Tailwind composes the local layout.

## What belongs in Semanticwind?

A useful test is:

> Would this style still make sense for almost every correct semantic use of this element?

Usually yes:

- headings and text
- links and emphasis
- lists and description lists
- code, `pre`, `kbd`, and blockquotes
- figures and captions
- readable tables
- labels and neutral native form controls
- neutral buttons
- `details` / `summary`
- `dialog`
- progress and meter elements

Usually no:

- `article` = card
- `nav` = horizontal navigation
- `header` = hero
- `footer` = page footer layout
- `section` = spacing primitive
- `input[type="reset"]` = destructive button
- custom ARIA roles or accessibility states used as styling APIs

Those belong to utilities or components.

## Cascade

Semanticwind intentionally occupies only Tailwind's base layer:

```text
Tailwind theme / Preflight
        ↓
Semanticwind semantic defaults
        ↓
component layer / component library
        ↓
Tailwind utilities
```

The project tries to make the lowest layer useful without making the higher layers difficult.

## Installation

Semanticwind is currently bootstrapping. For now, use the repository source in a Tailwind CSS v4 build:

```css
@import "tailwindcss";
@import "./src/semanticwind.css";
```

Once published, the intended usage is:

```css
@import "tailwindcss";
@import "semanticwind";
```

## Development

```bash
npm install
npm run dev
```

Build the GitHub Pages demo:

```bash
npm run build
```

The demo site lives in `docs/` and is deployed by GitHub Actions when Pages is enabled.

## Status

Early experiment. The goal is intentionally small: make semantic HTML useful inside Tailwind without becoming another component framework.

## License

MIT
