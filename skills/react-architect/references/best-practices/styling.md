# Styling Best Practices

Pick the styling strategy by runtime before writing components.

## Shared Rules

✅ Use semantic theme tokens instead of hardcoded presentation values  
✅ Keep interactive states explicit  
✅ Keep style decisions consistent inside the same feature  
✅ Use one primary styling strategy per runtime area  
✅ Prefer reusable primitives over one-off class or style drift

❌ Do not mix web and native styling advice  
❌ Do not hardcode colors when the design clearly implies reusable semantics  
❌ Do not hide focus, disabled, selected, or error states  
❌ Do not add variant branches without a stable semantic reason

## React Web / Next.js

### Preferred Stack

- Tailwind CSS v4
- `@theme` and CSS variables for tokens
- semantic utility names such as `bg-surface`, `text-foreground`, and `ring-ring`
- `tailwind-variants` for variant maps
- `tailwind-merge` for class merging

### Token Direction

Prefer semantic tokens over raw palette names:

- surfaces: `bg-surface`, `bg-surface-raised`
- text: `text-foreground`, `text-foreground-subtle`, `text-muted-foreground`
- actions: `bg-primary`, `bg-secondary`, `bg-muted`
- feedback: `bg-destructive`, `border-destructive`
- focus: `ring-ring`

### State Handling

- Use `data-[state]` and `data-[disabled]` selectors for component states
- Keep `focus-visible` styles explicit on interactive elements
- Merge external `className` with `twMerge`

### Example

```tsx
className={twMerge(
  'inline-flex items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  className,
)}
```

## React Native / Expo

### Preferred Stack

- `styled-components/native`
- `styles.ts` for component styling
- shared theme object for colors, spacing, radius, and typography

### File Organization

```text
component-name/
  index.tsx
  styles.ts
  types.ts
```

### Example

```tsx
import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`
```

### Native Rules

- Keep inline styles as exceptions, not the default path
- Use props only for meaningful styling branches
- Keep theme access centralized instead of scattering magic numbers

## Final Check

- Did you match the runtime before choosing the styling strategy?
- Are theme semantics clearer than raw visual values?
- Are focus, disabled, selected, loading, and error states visible?
- Can another component reuse the same tokens and state language?
