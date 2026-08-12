# Semanticwind

**Semantic HTML when it’s enough. Tailwind when it isn’t.**

Semanticwind is a small semantic base layer authored for Tailwind CSS v4.

Tailwind Preflight gives every design the same neutral foundation. Semanticwind makes that foundation useful before every heading, form control, table, and code block needs a class.

```text
semantic HTML
      │
      ├─ local exception ───────→ Tailwind utilities
      ├─ reusable UI ───────────→ component layer or Basecoat
      └─ product concept ───────→ your own component
```

The boundary is deliberate: native elements receive broadly useful defaults, but HTML tags never become a component API. `article` is not a card. `nav` does not choose a layout. Button variants remain component meaning.

> Would this style make sense for almost every correct use of this element?

If yes, it may belong in Semanticwind. If not, use a utility or component.

## Usage

Semanticwind is not published yet. During development, import the source after Tailwind:

```css
@import "tailwindcss";
@import "./src/semanticwind.css";
```

The intended package import is:

```css
@import "tailwindcss";
@import "semanticwind";
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

Add Tailwind when the choice is local:

```html
<button class="w-full rounded-full sm:w-auto">Publish</button>
```

Add a component when the meaning repeats:

```html
<button class="button" data-variant="destructive">Delete project</button>
```

For ready-made variants and richer UI such as dropdowns, tabs, and tooltips, [Basecoat](https://basecoatui.com/) is the recommended next layer. It remains optional; Semanticwind does not depend on it.

## What it covers

- responsive document typography and direct page containers
- inline text, lists, quotations, code, media, and tables
- text and specialized form controls, validation, and opinionated native buttons
- `details`, `dialog`, `progress`, and `meter`
- light and dark color schemes, focus states, and reduced motion

Semanticwind stays in Tailwind’s `base` layer and uses low-specificity selectors that override Preflight. Component styles and utilities override it normally.

It does not provide navigation layout, cards, heroes, button variants, application states, or product-specific UI.

## Development

```bash
npm install
npm run dev
```

Build the demo with `npm run build`.

Semanticwind is an early experiment.

## License

MIT
