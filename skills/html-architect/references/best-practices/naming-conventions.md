# Naming Conventions

## General Rules

- Use English for code artifacts (classes, files, IDs, attributes).
- Keep names descriptive and consistent.
- Prefer lowercase + hyphen for paths and assets.

## Files and Folders

### Folders

**Pattern**: `kebab-case`

Examples:

- `assets/`
- `best-practices/`
- `contact-page/`

### Files

**Pattern**: `kebab-case.ext`

Examples:

- `contact.html`
- `main.css`
- `contact-form.js`
- `hero-banner.webp`
- `settings-icon.svg`

## CSS Class Names

Use one consistent strategy across the whole project. BEM is recommended.

```text
block
block__element
block--modifier
```

Examples:

- `card`
- `card__title`
- `card--featured`
- `form-field`
- `form-field--error`

## IDs

- Use IDs only for unique document anchors, form associations, or ARIA relationships.
- Never use IDs as the default styling strategy.
