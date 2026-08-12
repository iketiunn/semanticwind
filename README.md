# Semanticwind

**Semantic HTML when it’s enough. Tailwind when it isn’t.**

Semanticwind is a small semantic baseline for Tailwind CSS.

It makes ordinary HTML look intentional without turning HTML tags into a component API. Start with native elements and zero classes. When the interface needs more meaning or behavior, scale into Basecoat, Tailwind utilities, and your own product components without fighting the baseline.

```text
semantic HTML
      ↓ not enough
Basecoat component
      ↓ needs local customization
Tailwind utilities
      ↓ repeated product-specific pattern
your own component
```

## Why

Tailwind is excellent once you know what you are designing. It is less pleasant when you are still sketching a page and every heading, form control, table, and code block begins life as an unstyled browser default.

Classless CSS frameworks solve that first hour beautifully, but they can become awkward as an application grows. A global rule that assumes `article` means “card”, `nav ul` means “horizontal menu”, or a form `type` implies a visual button variant mixes HTML semantics with component semantics.

Semanticwind takes a narrower approach:

- Native HTML gets sensible, low-specificity defaults.
- Structural elements keep their HTML meaning. `article` is not automatically a card and `nav` does not choose a layout for you.
- Native controls get neutral, usable defaults rather than invented component variants.
- Basecoat can take over when you need a reusable UI component.
- Tailwind utilities remain the normal escape hatch for layout and one-off customization.
- Repeated product concepts become your own components instead of more global selectors.

The baseline lives in Tailwind's `base` layer and uses `:where(...)` selectors wherever practical. Basecoat component styles and Tailwind utilities therefore remain easy to layer on top.

## The scaling model

### 1. Start with semantic HTML

```html
<main>
  <h1>Settings</h1>
  <p>Manage your account.</p>

  <form>
    <label for="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com">

    <button type="submit">Save</button>
  </form>
</main>
```

This should already be useful. No `.prose`, `.input`, `.button`, or wrapper component is required just to get a reasonable baseline.

### 2. Graduate to Basecoat when HTML is not enough

A button variant is component meaning, not HTML meaning:

```html
<button class="btn" data-variant="destructive">
  Delete account
</button>
```

A richer field can use Basecoat's component contract while keeping native controls:

```html
<div class="field">
  <label for="name">Name</label>
  <input id="name" name="name">
  <p>Your public display name.</p>
</div>
```

### 3. Use Tailwind for context and local exceptions

```html
<button class="btn w-full sm:w-auto" data-variant="outline">
  Cancel
</button>
```

Responsive width is contextual layout. It belongs in Tailwind, not in the semantic baseline.

### 4. Promote repeated product patterns into your own components

```html
<article class="device-card">
  <header class="flex items-start justify-between gap-4">
    <div>
      <h2>Living room</h2>
      <span class="badge">Online</span>
    </div>

    <button class="btn" data-size="icon-sm" data-variant="ghost" aria-label="Device settings">
      …
    </button>
  </header>
</article>
```

`article` still means article. `.device-card` is application meaning. `.btn` and `.badge` are generic UI primitives. Tailwind composes the layout.

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

Those belong to components or utilities.

## Installation

Semanticwind is currently bootstrapping. For now, import the source directly in a Tailwind CSS v4 project:

```css
@import "tailwindcss";
@import "./src/semanticwind.css";
```

With Basecoat:

```css
@import "tailwindcss";
@import "basecoat-css/nova";
@import "./src/semanticwind.css";
```

The intended cascade is:

```text
Tailwind theme / reset
        ↓
Semanticwind base defaults
        ↓
Basecoat components
        ↓
Tailwind utilities
        ↓
product-specific components
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

The demo site lives in `docs/` and is deployed by GitHub Actions.

## Status

Early experiment. The goal is intentionally small: improve semantic HTML defaults without becoming another component framework.

## License

MIT
