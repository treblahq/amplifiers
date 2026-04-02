# Styling Best Practices

## Mandatory: Separate CSS From HTML

**NEVER use inline styles as a default strategy.** Keep CSS in dedicated files.

## CSS File Organization

```
assets/css/
├── base/
│   ├── reset.css
│   ├── variables.css
│   └── typography.css
├── layout/
│   ├── header.css
│   └── footer.css
├── components/
│   ├── button.css
│   └── card.css
├── pages/
│   ├── home.css
│   └── contact.css
└── main.css
```

## Rules

✅ **DO** centralize imports in `assets/css/main.css`
✅ **DO** define design tokens with CSS variables
✅ **DO** keep page-specific overrides isolated in `pages/*.css`
✅ **DO** use classes for styling (not tag selectors as a primary strategy)

❌ **DO NOT** overuse `!important`
❌ **DO NOT** duplicate component styles across page files

## Example: main.css

```css
@import url("./base/reset.css");
@import url("./base/variables.css");
@import url("./base/typography.css");

@import url("./layout/header.css");
@import url("./layout/footer.css");

@import url("./components/button.css");
@import url("./components/card.css");
```

## Example: CSS Variables

```css
:root {
  --color-primary: #1f6feb;
  --color-surface: #ffffff;
  --color-border: #d0d7de;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --radius-md: 0.5rem;
}
```
