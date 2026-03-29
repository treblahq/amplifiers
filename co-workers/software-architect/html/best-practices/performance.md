# Performance Best Practices

## Critical Rendering Path

- Keep initial HTML small and semantic.
- Load CSS early; load JS with `defer`.
- Avoid render-blocking third-party scripts.

## Images and Media

- Use modern formats (`.webp`, `.avif`) when possible.
- Serve responsive images with `srcset` and `sizes`.
- Use `loading="lazy"` for below-the-fold media.
- Set explicit `width`/`height` to reduce layout shifts.

## CSS Performance

- Remove unused CSS.
- Prefer class selectors over deep and expensive selectors.
- Avoid very large monolithic CSS files; split by responsibility.

## JavaScript Delivery

- Use modular scripts.
- Defer non-critical JS.
- Avoid heavy DOM operations during initial render.

## Fonts

- Self-host fonts when feasible.
- Use `font-display: swap`.
- Limit font variants and weights to what is used.
