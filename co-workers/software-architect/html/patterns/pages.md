# Pages Pattern

## Purpose

Pages are top-level HTML documents that:

- Define document metadata (`title`, `description`, canonical URL)
- Compose semantic sections (`header`, `main`, `footer`)
- Connect page-scoped CSS and JS

## Rules

✅ **DO** keep one purpose per page
✅ **DO** use semantic landmarks
✅ **DO** load JS with `defer`
✅ **DO** keep page-specific CSS inside `assets/css/pages/`

❌ **DO NOT** write inline CSS as a default strategy
❌ **DO NOT** use inline JS handlers (`onclick`, `onchange`)
❌ **DO NOT** skip heading hierarchy

## File Organization

```
pages/
└── contact.html

assets/css/pages/
└── contact.css

assets/js/modules/
└── contact-form.js
```

## Page Skeleton

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact</title>
    <meta name="description" content="Contact page" />

    <link rel="stylesheet" href="/assets/css/main.css" />
    <link rel="stylesheet" href="/assets/css/pages/contact.css" />

    <script src="/assets/js/modules/contact-form.js" defer></script>
  </head>
  <body>
    <header class="site-header"></header>

    <main id="main-content">
      <section class="contact-hero">
        <h1>Contact</h1>
        <p>Send your request.</p>
      </section>

      <section class="contact-form-section"></section>
    </main>

    <footer class="site-footer"></footer>
  </body>
</html>
```
