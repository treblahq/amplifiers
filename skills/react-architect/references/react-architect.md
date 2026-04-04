# React Ecosystem Skill - Knowledge Base

Architecture and implementation guidance for React-based stacks, including React
web, Next.js, React Native, and Expo.

## Directory Structure

```text
react-architect/
├── architecture/       # Layering, state boundaries, runtime structure
├── patterns/           # Components, hooks, services, screens, navigation
└── best-practices/     # Styling, naming, performance, code-generation rules
```

## Runtime First

Pick references by runtime before applying patterns:

- **React web / Next.js:** start with `architecture/overview.md`, `patterns/components.md`,
  `patterns/design-to-component-conversion.md`, `best-practices/web-component-generation.md`,
  `best-practices/styling.md`, and `best-practices/naming-conventions.md`
- **React Native / Expo:** start with `architecture/overview.md`, `patterns/components.md`,
  `patterns/screens.md`, `patterns/hooks.md`, `best-practices/styling.md`,
  and `best-practices/naming-conventions.md`

## Quick Reference

### Architecture

- [Overview](architecture/overview.md) - Shared React architecture across web and native runtimes
- [State Management](architecture/state-management.md) - Contexts, server state, and local persistence patterns

### Patterns

- [Screens](patterns/screens.md) - Screen and page organization
- [Components](patterns/components.md) - Cross-runtime component boundaries and structure
- [Design To Component Conversion](patterns/design-to-component-conversion.md) - Turning screenshots and Figma frames into React components
- [Hooks](patterns/hooks.md) - Custom hooks and logic extraction
- [Helpers](patterns/helpers.md) - Pure utility functions
- [Services](patterns/services.md) - API integrations and data fetching patterns
- [Contexts](patterns/contexts.md) - Shared and global state boundaries
- [Navigation](patterns/navigation.md) - Routing and navigation patterns

### Best Practices

- [Performance](best-practices/performance.md) - Rendering, data, and bundle optimization
- [Styling](best-practices/styling.md) - Runtime-aware styling strategies for web and native
- [Web Component Generation](best-practices/web-component-generation.md) - React web design-to-code guardrails
- [Naming Conventions](best-practices/naming-conventions.md) - Consistent naming across runtimes and layers

---

**Usage**: Load only the files that fit the runtime and the task. Do not apply
React Native styling rules to React web tasks, and do not force web-specific
libraries into native work.
