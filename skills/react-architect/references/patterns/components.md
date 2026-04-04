# Components Pattern

## Purpose

Components are reusable UI units with clear inputs, predictable output, and
minimal knowledge of business or data concerns.

## Shared Rules

✅ Keep components focused on one visual responsibility  
✅ Type public props explicitly  
✅ Prefer composition and slots over giant configurable components  
✅ Keep API access and orchestration outside presentation components  
✅ Make states and accessibility part of the component contract

❌ Do not fetch data directly in components  
❌ Do not hide business rules inside render branches  
❌ Do not mix unrelated concerns into one file because the UI appears together  
❌ Do not pick styling or file organization before confirming the runtime

## Choose The Pattern By Runtime

### React Web / Next.js

Use this pattern when converting screenshots or Figma frames into reusable web
components.

#### File Shape

```text
components/
├── user-card.tsx
├── empty-state.tsx
└── dialog-content.tsx
```

#### Core Rules

- Use lowercase files with hyphens
- Use named exports only
- Use `ComponentProps<'element'>` for DOM-based components
- Use `tailwind-variants` for variants and `tailwind-merge` for `className` merging
- Add `data-slot` markers to identify component parts cleanly
- Prefer compound components when a component has meaningful subregions
- Do not use `forwardRef` by default in React 19 code

#### Example

```tsx
import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      data-slot="button"
      data-disabled={disabled ? '' : undefined}
      className={twMerge(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      {...props}
    />
  )
}
```

### React Native / Expo

Use this pattern when building reusable native components.

#### File Shape

```text
src/resources/components/
└── button/
    ├── index.tsx
    ├── styles.ts
    └── types.ts
```

#### Core Rules

- Keep component logic in `index.tsx`
- Keep styling in `styles.ts`
- Use `styled-components/native`
- Keep props narrow and explicit
- Extract stateful behavior into hooks when the component starts orchestrating

#### Example

```tsx
import { ActivityIndicator } from 'react-native'
import { ButtonContainer, ButtonText } from './styles'
import type { ButtonProps } from './types'

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
}: ButtonProps) {
  return (
    <ButtonContainer onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color="white" /> : <ButtonText>{title}</ButtonText>}
    </ButtonContainer>
  )
}
```

## Compound Components

Use compounds when the component has stable subregions that improve readability
and reuse.

Good fits:

- card with header, title, content, footer
- dialog with trigger, content, header, actions
- table with row, cell, empty state

Avoid compounds when:

- the component is used only once
- subregions have no independent meaning
- splitting would create ceremonial wrappers with no clarity gain

## When To Extract A Shared Component

Extract when:

- the same UI pattern appears in multiple places
- the component has a stable contract
- variants and states can be named clearly

Keep local when:

- the markup is screen-specific
- the abstraction would only hide simple JSX
- the design is still volatile and not reusable yet
