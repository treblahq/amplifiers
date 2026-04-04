# Design To Component Conversion

Use this pattern when the input is a screenshot, mockup, or Figma frame and the
output must be production-ready React code.

## Workflow

### 1. Read The Design Before Choosing Code

Extract:

- the component or screen goal
- the primary action
- the major regions of the UI
- reusable versus one-off pieces
- visible states and likely missing states
- responsive behavior implied by spacing and alignment

If the design is ambiguous, state the assumption instead of silently inventing behavior.

### 2. Split The UI By Responsibility

Break the design into:

- primitives
- reusable compounds
- page or screen composition

Do not turn a complex screen into one giant component file.

### 3. Map Visual Semantics To Tokens

Translate the design into semantic roles:

- surface
- foreground
- muted
- primary
- secondary
- destructive
- focus ring

Avoid hardcoding palette decisions when the same meaning will recur.

### 4. Cover Real States

Define at least the states needed for implementation:

- default
- hover when relevant
- focus-visible
- active or pressed
- disabled
- loading
- selected or open
- error when the design implies validation or destructive actions

### 5. Choose The Right Primitive

- Use native semantic elements on the web before reaching for wrappers
- Use headless primitives such as Base UI when interaction complexity is non-trivial
- Keep platform primitives obvious in React Native

## Output Standard

A strong conversion includes:

1. the component map
2. runtime-aware file structure
3. semantic tokens instead of ad-hoc styling
4. explicit state handling
5. accessibility coverage
6. assumptions called out when the design omits behavior

## Common Failure Modes

- coding directly from pixels without naming reusable parts
- ignoring empty, loading, and disabled states because they are not in the screenshot
- inventing a styling stack before confirming the runtime
- hiding accessibility behind “to be added later”
