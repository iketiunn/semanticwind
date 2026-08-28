# MDN native UI research

Researched 2026-08-21 against the current `README.md` boundary and
`src/semanticwind.css`. Semanticwind already covers `details`, `dialog`,
popover surfaces, most form controls, validation, `progress`, `meter`, and
responsive media. The useful remaining work is small.

> Status: This is a dated pre-implementation audit. Current source and contract
> checks are authoritative; implemented recommendations remain below as rationale.

## Ship now

### 1. Give read-only controls a visible state

Current text inputs and textareas style `disabled`, invalid, and valid states,
but not `readonly`. MDN distinguishes read-only controls from disabled ones:
they remain focusable and their values are submitted. A quiet background is a
broadly useful cue; do not add `cursor-not-allowed` or disabled opacity.

Candidate:

```css
:is(input, textarea)[readonly] {
  @apply bg-zinc-100;
}
```

Source: [MDN: `readonly` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/readonly)

### 2. Add a minimal command-list default for `<menu>`

MDN says browsers expose `<menu>` like `<ul>`, but its intended distinction is
a list of commands or toolbar actions. Tailwind Preflight removes its list
styling, and Semanticwind does not replace that with a command layout, while
the global `li + li` rule adds vertical spacing. A wrapping, unbulleted button
row is a reasonable native default; button variants and application toolbar
semantics remain out of scope.

Candidate:

```css
:is(menu) {
  @apply mb-5 flex max-w-3xl list-none flex-wrap items-center gap-2 p-0;
}

:is(menu > li) {
  @apply m-0;
}
```

Source: [MDN: `<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/menu)

### 3. Reserve the strong backdrop for modal dialogs

The current combined `:is(dialog, [popover])::backdrop` rule dims and blurs the
page for every popover. MDN describes popovers as top-layer, light-dismissible
UI and explicitly describes a dialog used as a popover as non-modal. MDN ties
darkening/obscuring `::backdrop` to modal dialog content that is actually
inert. Keep the surface rule shared, but remove the strong generic popover
backdrop; projects can add one to the specific popover that needs it.

Candidate:

```css
:is(dialog)::backdrop {
  @apply bg-black/55 backdrop-blur-[2px];
}
```

Sources: [MDN: `<dialog>` styling and modality](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [MDN: Using the Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)

### 4. Add keyboard focus parity to the existing select enhancement

The existing guarded `appearance: base-select` block styles `option:hover` but
not `option:focus`. MDN's customizable-select example applies the same visual
highlight to both. Extending the existing selector is a small accessibility
fix and remains progressive enhancement.

Candidate:

```css
select:not([multiple], [size]) option:is(:hover, :focus) {
  @apply bg-zinc-100;
}
```

Source: [MDN: Customizable select elements](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)

## Watch

- **`title`: document it, but add no CSS.** The global attribute provides a
  browser-owned native tooltip for advisory information. It is widely
  supported and useful for optional hints, but its appearance cannot be styled
  and access is inconsistent for touch, keyboard, and assistive technology.
  Keep important information visible in the page.
  [MDN: `title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/title)
- **`details[name]`: use it, but add no CSS.** MDN documents native exclusive
  disclosure groups without scripting. The current `details` styling already
  works for the group; this is a gallery/documentation tip, not a stylesheet
  feature. [MDN: `<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
- **`::details-content`: wait.** It provides a clean hook for disclosure-body
  styling and transitions, but MDN marks it Baseline 2025, newer than the
  documented Tailwind v4 floor. The current child markup works without it.
  [MDN: `::details-content`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content)
- **Richer customizable selects: keep the current guarded subset.**
  `<selectedcontent>`, `::checkmark`, `:open`, picker animation, and implicit
  anchor positioning are useful, but MDN marks the feature limited and warns
  about framework hydration failures. They also require authored inner markup,
  which is beyond a universal tag default.
  [MDN guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select),
  [MDN: `<selectedcontent>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/selectedcontent)
- **`field-sizing: content`: wait and probably keep local.** MDN marks it
  Baseline 2026. Auto-growing controls are useful, but their minimum and maximum
  sizes are layout decisions; the current fixed-size baseline is safer.
  [MDN: `field-sizing`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/field-sizing)
- **Popover/dialog entry and exit animation: wait.** MDN's recipe needs
  `@starting-style`, discrete `display`/`overlay` transitions, and careful
  top-layer timing. It is newer than the package floor and is optional motion,
  not essential state feedback.
  [MDN: Animating popovers](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#animating_popovers),
  [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- **`closedby`, invoker commands, `popover="hint"`, and CSS anchor positioning:
  watch as native behavior, not base styling.** They can reduce application JS,
  but support is newer or limited and placement/dismissal semantics belong to
  each component.

## Skip

- **Ruby defaults.** `<ruby>`/`<rt>` are already widely rendered by browsers,
  and annotation position is language and writing-mode dependent. MDN shows
  `ruby-align` has the browser-appropriate `space-around` initial value; a
  package override would add opinion without fixing a defect.
  [MDN: `<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby),
  [MDN: `<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/rt),
  [MDN: `ruby-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/ruby-align)
- **Native audio/video controls and browser picker internals.** MDN describes
  many form widgets as partly OS-rendered and difficult to style consistently.
  Avoid vendor pseudo-elements and preserve familiar platform behavior.
  [MDN: Advanced form styling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Advanced_form_styling)
- **Global caption theming.** `video::cue` is widely available and is the one
  standard media styling hook worth knowing, but browsers and users already
  provide caption preferences. Add a local `video::cue` rule only after a real
  contrast defect is demonstrated; do not brand captions by default.
  [MDN: `::cue`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::cue)
- **`<datalist>` popups, date/color pickers, and range internals.** There is no
  portable complete styling surface across the documented floor. Keep the
  current outer-control treatment and native internals.
- **ARIA-role skins.** Tooltips, tabs, menus, alerts, toasts, comboboxes, and
  similar roles imply behavior and product composition, so they belong in the
  component layer.

## Recommended order

1. Read-only state.
2. `<menu>` reset and wrapping command row.
3. Split modal dialog and popover backdrops.
4. Add `option:focus` beside the existing `option:hover` rule.

Then stop until a gallery specimen exposes another native rendering problem.
