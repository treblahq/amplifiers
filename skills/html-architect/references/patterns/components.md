# Components Pattern

## Purpose

Components are reusable HTML blocks with stable markup and predictable class names.

## Rules

✅ **DO** keep components focused and composable
✅ **DO** create dedicated CSS in `assets/css/components/`
✅ **DO** use modifier classes for state (`is-active`, `is-disabled`)

❌ **DO NOT** couple component markup to page-specific context
❌ **DO NOT** use IDs for styling repeated blocks

## File Organization

```
assets/css/components/
├── button.css
├── card.css
└── alert.css
```

## Example: Card Component

```html
<article class="card card--featured">
  <img class="card__image" src="/assets/images/photos/sample.webp" alt="Product preview" loading="lazy" />
  <div class="card__content">
    <h2 class="card__title">Product Name</h2>
    <p class="card__description">Short description for the item.</p>
    <a class="card__action" href="/pages/details.html">View details</a>
  </div>
</article>
```

```css
.card {
  display: grid;
  gap: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-surface);
}

.card--featured {
  border-color: var(--color-primary);
}

.card__title {
  font-size: 1.125rem;
}
```
