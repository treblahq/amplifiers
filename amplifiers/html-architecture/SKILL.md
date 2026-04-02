---
name: html-architecture
version: 1.0.0
source: trebla/co-workers/software-architect/html
description: |
  Architecture and implementation guidance for semantic, maintainable, and
  performant HTML projects. Covers document structure, components, forms,
  accessibility, assets, and separation of concerns.
tags: [html, css, accessibility, frontend, architecture]
---

# HTML Architecture

## Mandate

Build HTML projects with semantic structure, clear styling boundaries,
progressive enhancement, and accessibility by default.

## When to Use

- Starting or reviewing a static or server-rendered HTML project
- Structuring reusable page sections or UI components
- Building forms, content pages, or marketing pages
- Auditing markup quality, accessibility, and maintainability

---

## Architecture Layers

```text
Document Layer     -> doctype, head, metadata, favicon, page setup
Semantic Layer     -> header, nav, main, section, article, footer
Presentation Layer -> base CSS, layout CSS, component CSS
Behavior Layer     -> deferred JS and progressive enhancement
Asset Layer        -> images, icons, fonts, static media
```

Use a layered HTML architecture so structure, style, behavior, and assets can
evolve independently.

---

## Core Principles

- Semantics first: choose semantic elements before generic containers
- Separation of concerns: keep HTML, CSS, and JS in distinct files
- Reusability: create stable component markup and class contracts
- Accessibility by default: keyboard access, labeling, and contrast are mandatory
- Performance budget: optimize assets and avoid unnecessary render blockers

---

## Recommended Project Structure

```text
project/
├── index.html
├── pages/
├── assets/
│   ├── css/
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.css
│   ├── js/
│   ├── images/
│   ├── icons/
│   └── fonts/
└── favicon/
```

Keep assets organized by concern so page-specific styles do not leak into shared
components.

---

## Document and Page Rules

- Start every page with a valid document skeleton
- Include viewport, title, and description metadata
- Keep one clear `h1` per page
- Structure the body with landmarks such as `header`, `nav`, `main`, and `footer`
- Load JS with `defer` unless there is a verified reason not to

---

## Component Rules

- Keep components focused and composable
- Use dedicated CSS files in `assets/css/components/`
- Use stable class contracts and modifier classes for state
- Do not couple reusable component markup to page-specific context
- Do not use IDs for styling repeated blocks

---

## Form Rules

- Always pair `label` with `for` and matching `id`
- Use `fieldset` and `legend` for grouped inputs when relevant
- Expose helper text and validation with `aria-describedby`
- Keep submit behavior progressive when possible
- Do not use placeholders as a label replacement

---

## Accessibility Rules

- Use semantic landmarks and logical heading hierarchy
- Make every interactive element keyboard reachable
- Preserve visible focus states with `:focus-visible`
- Use descriptive `alt` text for informative images and empty `alt=""` for decorative ones
- Add `aria-label` to icon-only buttons
- Do not rely on color alone to communicate status
- Respect reduced motion preferences when animation is present

---

## Quality Rules

- Prefer semantic HTML before ARIA patches
- Prefer real buttons and links over clickable `div` or `span`
- Keep markup readable and predictable
- Lazy-load media when it improves performance without harming UX
- Avoid page-specific class leakage into global components
- Treat accessibility regressions as correctness bugs, not polish issues

---

## When Context Is Missing

Collect the minimum required inputs before implementation:

1. Is this static HTML or server-rendered HTML?
2. What is the primary user action on the page?
3. Which sections are reusable components and which are page-specific?
4. What accessibility and performance constraints matter for this page?

If the project already has a naming or folder convention, extend it instead of
creating a competing pattern.
