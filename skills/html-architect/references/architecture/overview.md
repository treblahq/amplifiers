# Architecture Overview

## Project Architecture

Use a layered HTML architecture so structure, style, behavior, and assets evolve independently.

```
┌─────────────────────────────────────────┐
│          Document Layer                 │
│  - <!doctype html>, <html>, <head>      │
│  - SEO metadata, favicon, social tags   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Semantic Layer                 │
│  - header, nav, main, section, article  │
│  - footer and landmarks                 │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Presentation Layer              │
│  - base CSS (reset, tokens, typography) │
│  - layout CSS and component CSS          │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│           Behavior Layer                │
│  - deferred JS modules                   │
│  - event handling and progressive UX     │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│            Asset Layer                  │
│  - optimized images and SVG icons        │
│  - fonts and static media                │
└─────────────────────────────────────────┘
```

## Core Principles

1. **Semantics First**: choose semantic tags before using generic containers.
2. **Separation of Concerns**: keep HTML, CSS, and JS in separate files.
3. **Reusability**: create reusable components with stable class contracts.
4. **Accessibility by Default**: keyboard navigation, proper labels, and contrast are non-negotiable.
5. **Performance Budget**: optimize assets and avoid render-blocking resources.

## Folder Structure

```
project/
├── index.html
├── pages/
│   ├── about.html
│   └── contact.html
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.css
│   │   │   ├── variables.css
│   │   │   └── typography.css
│   │   ├── layout/
│   │   │   ├── header.css
│   │   │   └── footer.css
│   │   ├── components/
│   │   │   ├── button.css
│   │   │   └── card.css
│   │   ├── pages/
│   │   │   ├── home.css
│   │   │   └── contact.css
│   │   └── main.css
│   ├── js/
│   │   ├── modules/
│   │   └── main.js
│   ├── images/
│   │   ├── photos/
│   │   ├── backgrounds/
│   │   └── illustrations/
│   ├── icons/
│   └── fonts/
└── favicon/
```

## Rendering Flow

```
Browser → Parse HTML → Build DOM → Load CSS → CSSOM → Render Tree → Paint
                               ↓
                         Load deferred JS
```

## Page Structure Baseline

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>
    <meta name="description" content="Short page description" />
    <link rel="icon" href="/favicon/favicon.ico" />
    <link rel="stylesheet" href="/assets/css/main.css" />
    <script src="/assets/js/main.js" defer></script>
  </head>
  <body>
    <header></header>
    <nav></nav>
    <main></main>
    <footer></footer>
  </body>
</html>
```
