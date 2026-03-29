# Accessibility Best Practices

## Semantic Structure

- Use semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Keep heading hierarchy logical (`h1` -> `h2` -> `h3`).
- Use only one main `h1` per page.

## Keyboard and Focus

- All interactive elements must be keyboard reachable.
- Preserve visible focus states (`:focus-visible`).
- Avoid `div`/`span` click handlers when `button` or `a` is correct.

## Forms

- Always associate `label` and form controls.
- Describe errors and helper text with `aria-describedby`.
- Keep error messages clear and actionable.

## Images and Icons

- Informative images require descriptive `alt`.
- Decorative images should use empty `alt=""`.
- Decorative icons should be hidden with `aria-hidden="true"`.
- Icon-only buttons must include `aria-label`.

## Color and Motion

- Ensure minimum contrast for text and UI controls.
- Do not rely only on color to communicate status.
- Respect reduced motion preferences when using animation.
