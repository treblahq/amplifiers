# Web Component Generation

Use this reference for React web and Next.js tasks where a design needs to
become a reusable component quickly and safely.

## Preferred Stack

- React 19
- TypeScript strict mode
- Tailwind CSS v4 with `@theme` and CSS variables
- `@base-ui/react` for headless primitives when needed
- `tailwind-variants` for variants
- `tailwind-merge` for merging `className`
- Lucide React or Phosphor Icons for icons

## Core Rules

- Do not reach for `forwardRef` by default in React 19
- Use named exports only
- Keep file names lowercase with hyphens
- Do not create barrel files in internal component folders
- Extend `ComponentProps<'element'>` for DOM components
- Add `VariantProps<typeof variants>` when the component exposes visual variants
- Use `data-slot` for meaningful component regions
- Use `data-[state]` and `data-[disabled]` selectors for styling states
- Keep focus treatment visible with `focus-visible`
- Require `aria-label` for icon-only buttons
- Spread `...props` at the end of the rendered element

## Component Skeleton

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
      ghost: 'bg-transparent text-muted-foreground hover:text-foreground',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
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

## Compound Components

Use compound components when subregions matter semantically:

- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `DialogTrigger`, `DialogContent`, `DialogFooter`
- `TabsList`, `TabsTrigger`, `TabsPanel`

## Headless Primitives

Reach for Base UI React when the interaction is not just visual sugar:

- dialogs
- menus
- tabs
- selects
- popovers

Use native elements alone when behavior is simple and semantic HTML already fits.

## Final Checklist

- file name in lowercase with hyphens
- named export only
- `ComponentProps` plus `VariantProps` when relevant
- `tv()` plus `twMerge()`
- `data-slot` for important regions
- state selectors with `data-[state]` or `data-[disabled]`
- semantic theme tokens instead of hardcoded colors
- visible focus treatment
- `aria-label` on icon-only actions
- `...props` spread last
