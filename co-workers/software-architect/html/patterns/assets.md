# Assets Pattern

## Purpose

Assets include images, icons, fonts, and favicons with predictable locations and optimized delivery.

## Folder Organization

```
assets/
├── images/
│   ├── photos/
│   ├── backgrounds/
│   └── illustrations/
├── icons/
└── fonts/
favicon/
```

## Rules

✅ **DO** use optimized formats (`.webp`, `.avif`, `.svg`)
✅ **DO** define `alt` text for informative images
✅ **DO** store icons as SVG or from icon libraries
✅ **DO** keep file names descriptive and kebab-case

❌ **DO NOT** use emoji as functional UI icons
❌ **DO NOT** upload oversized images for small render areas

## Icons

Use professional icon libraries for UI consistency:

- Lucide
- Heroicons
- Font Awesome
- Material Symbols

### Icon Accessibility

- Decorative icon: set `aria-hidden="true"`
- Functional icon button: provide accessible name (`aria-label`)

```html
<button class="icon-button" aria-label="Open settings">
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
    <!-- icon path -->
  </svg>
</button>
```

## Responsive Images

```html
<img
  src="/assets/images/photos/banner-1280.webp"
  srcset="
    /assets/images/photos/banner-640.webp 640w,
    /assets/images/photos/banner-1280.webp 1280w,
    /assets/images/photos/banner-1920.webp 1920w
  "
  sizes="(max-width: 768px) 100vw, 1280px"
  alt="Banner showing the product"
  loading="lazy"
/>
```
