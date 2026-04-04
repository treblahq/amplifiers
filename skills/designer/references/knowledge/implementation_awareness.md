# Implementation Awareness

> **Objective:** Keep design decisions compatible with real frontend constraints and responsive behavior.

A complete designer understands enough technology to avoid creating unrealistic interfaces.

## Core Areas Of Awareness

- HTML and CSS basics
- responsive layout behavior
- frontend implementation constraints
- component-based UI logic
- state variations and edge cases

## Why It Matters

Implementation awareness helps the designer:

- avoid impossible layouts
- define scalable components
- anticipate responsive issues
- communicate more clearly with engineers
- reduce rework during handoff

## Practical Rules

- Think in components, not only in static frames
- Consider hover, active, disabled, empty, loading, and error states
- Check how spacing, wrapping, and content length behave on smaller screens
- Define the semantic role of surfaces, actions, and feedback instead of relying on hardcoded colors alone
- If the output will be converted to React, specify variants, slots, and reusable boundaries explicitly
- Avoid visual ideas that depend on brittle implementation tricks unless they are clearly justified

## Design Standard

A strong design should be ambitious where useful, but still grounded in how modern frontend systems actually work.
