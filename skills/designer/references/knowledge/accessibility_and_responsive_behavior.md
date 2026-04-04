# Accessibility And Responsive Behavior

> **Objective:** Make interaction, readability, and layout behavior explicit before implementation starts.

## Accessibility Review

### Action Clarity

- The primary action should be visually dominant without overwhelming the rest of the layout.
- Secondary actions should remain available but clearly subordinate.

### Readability

- Preserve strong contrast for core text and critical controls.
- Avoid tiny supporting text that only works in static mockups.
- Do not rely on color alone to indicate destructive, selected, or error states.

### Focus And Keyboard Behavior

- Interactive elements need a visible focus treatment.
- Focus order should follow the reading and action order of the screen.
- Hidden actions that only appear on hover need a keyboard-accessible equivalent.

### Labels And Iconography

- Icon-only actions must have an obvious textual meaning in the handoff.
- Repeated icons should map to consistent meanings across the interface.

## Responsive Review

### Layout Compression

- Say what collapses first when space gets tighter.
- Prefer reflow rules over vague breakpoint notes.
- Protect the primary CTA and essential text before decorative content.

### Content Growth

- Explain how the layout behaves with long titles, long labels, and large numbers.
- Define whether text wraps, truncates, or pushes neighboring elements.

### State Coverage

- Responsive rules must still hold for loading, empty, error, and selected states.
- Dense mobile layouts still need readable spacing and reliable tap targets.

## Handoff Language

Prefer concrete wording such as:

- "Metadata wraps under the title before the CTA moves."
- "The icon remains fixed while the label truncates to one line."
- "On narrow screens, secondary actions move into the overflow menu."
- "Focus-visible must remain obvious on ghost actions over tinted surfaces."

Avoid vague wording such as:

- "Make it responsive."
- "Should work on mobile."
- "Keep it accessible."
