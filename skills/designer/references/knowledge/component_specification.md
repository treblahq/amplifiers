# Component Specification

> **Objective:** Define component boundaries and behavior clearly before code generation or frontend implementation starts.

## Core Principle

A component spec should explain what the component does, what can change, and what must stay consistent.

## What To Specify

### Purpose

- why the component exists
- which user action or information it supports
- whether it is a primitive, a reusable compound, or a page-specific section

### Slots And Content Areas

Name the regions that may receive different content:

- leading visual
- title
- supporting text
- actions
- footer
- badges or metadata

If a region is optional, say so explicitly.

### Variants

Define the meaningful branches of the component:

- emphasis: primary, secondary, ghost, destructive
- density: compact, default, spacious
- size: small, medium, large
- layout: horizontal, vertical, inline

Only include variants that materially change usage or hierarchy.

### States

Call out state changes that affect interaction or communication:

- default
- hover
- focus-visible
- active or pressed
- disabled
- loading
- selected or expanded
- success, warning, or error

### Responsive Behavior

Specify what changes across widths:

- stacks into a column
- hides secondary metadata
- moves actions below content
- reduces spacing or typography scale
- preserves tap targets even when density changes

### Relationship To Other Components

Be explicit when a component is:

- a reusable primitive
- a compound built from smaller primitives
- a one-off section that should not be extracted globally yet

## Split Or Keep Together

Split into multiple components when:

- the same structure appears in multiple places
- one region needs independent states or variants
- the component has clear slots that other screens will reuse

Keep together when:

- the markup is tightly tied to one screen
- the component only exists to render one simple one-off arrangement

## Example Spec Shape

```text
Component: Filter Chip
Purpose: Toggle a list filter quickly without leaving the current view.
Slots: label, optional count, optional leading icon.
Variants: default, selected, destructive.
States: default, hover, focus-visible, disabled.
Responsive behavior: keep one-line height; count hides before the label truncates.
Notes: selected state must remain obvious without relying on color alone.
```
