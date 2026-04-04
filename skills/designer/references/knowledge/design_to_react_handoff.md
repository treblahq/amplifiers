# Design To React Handoff

> **Objective:** Turn a screenshot, frame, or finished UI into a design brief that a React engineer or code generation prompt can implement without guessing.

## When To Use

Use this reference when the design work will continue directly into React or Next.js implementation.

Typical triggers:

- a screenshot or Figma frame needs to become code
- the user wants a component or page prompt, not only visual critique
- the current design is visually strong but underspecified for implementation

## What The Handoff Must Capture

### 1. Intent

- the purpose of the screen or component
- the primary user action
- the main supporting actions
- the failure, empty, or loading moments that matter

### 2. Component Map

Break the design into implementable pieces:

- page or screen shell
- major sections
- reusable compounds
- atomic controls
- content regions that should stay flexible

Do not describe a whole screen as one giant component if it clearly contains smaller reusable units.

### 3. Layout Behavior

Describe layout as behavior, not as a frozen image:

- stack, row, grid, or split layout
- spacing rhythm between sections
- alignment rules
- width constraints
- what wraps, compresses, truncates, or stacks on smaller screens

### 4. Visual Semantics

Translate visual direction into reusable semantics:

- primary, secondary, muted, destructive, and success roles
- surface levels such as base, raised, and overlay
- typography hierarchy by role, not by arbitrary pixel values alone
- border, radius, shadow, and density rules

### 5. Variants And States

Every interactive element should have the states that implementation needs:

- default
- hover
- focus-visible
- active or pressed
- disabled
- loading
- selected, checked, or open where relevant
- error or destructive when relevant

### 6. Accessibility Signals

Call out the cues that must survive implementation:

- visual priority of the main action
- contrast-sensitive elements
- icon-only actions that need textual meaning
- visible focus treatment
- text that must never be hidden behind decoration

## Output Format

When writing a handoff, prefer this structure:

1. Goal and primary action
2. Component breakdown
3. Layout and responsive behavior
4. Visual semantics and token direction
5. Variants and states
6. Accessibility notes
7. Assumptions and open questions

## Common Failure Modes

- describing style without defining structure
- handing off exact pixels without behavioral rules
- forgetting loading, empty, disabled, and error states
- using purely decorative labels like "nice card" instead of naming reusable roles
- hiding responsive behavior behind "adapt for mobile" with no specifics
