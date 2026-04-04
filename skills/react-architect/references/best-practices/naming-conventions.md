# Naming Conventions

Match the existing codebase first. When the repository does not have a strong
convention, use the defaults below.

## General Rules

- Keep code identifiers and comments in English
- Keep UI copy in the product language
- Use named exports by default
- Avoid barrel files inside internal feature folders

## Files And Folders

### Shared Defaults

- Folders: `kebab-case`
- Services: `entity.service.ts`
- Helpers: `entity.helper.ts`
- Enums: `entity.enum.ts`

### React Web / Next.js Defaults

- Components: `user-card.tsx`, `dialog-content.tsx`, `pricing-table.tsx`
- Hooks: `use-modal.ts`, `use-user-profile.ts`
- Utilities: `format-currency.ts`, `map-plan-badge.ts`

### React Native / Expo Defaults

```text
user-card/
  index.tsx
  styles.ts
  types.ts
```

- Hooks: `auth.hook.ts`, `user-profile.hook.ts`
- Screens: `screens/home/index.tsx`

## Component Names

- Components: `PascalCase`
- Hooks: `use` + `PascalCase`
- Contexts: `PascalCase` + `Context`
- Types and interfaces: singular, descriptive names

## Import Rules

- Prefer direct imports over internal barrels
- Use path aliases when the project already relies on them
- Do not introduce a new alias strategy mid-feature without a project-level decision

## Quick Checks

- Does the file name reflect the runtime convention?
- Will another engineer know what the module exports from the file name alone?
- Are internal folders avoiding unnecessary `index.ts` re-exports?
