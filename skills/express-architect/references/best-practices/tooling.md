# Tooling

Express works best with minimal tooling and explicit choices.

## Recommended Defaults

- Express for the HTTP framework
- TypeScript for application code
- a query builder or lightweight database layer when that matches the project
- structured logging instead of scattered `console.log`
- containerization when the deployment model benefits from it

## Rules

- prefer promise-based APIs over callbacks
- pin dependency versions when stability matters
- favor native Node APIs before adding a library for trivial tasks
- keep framework and tooling choices understandable by the whole team

## Configuration And Logging

- validate config at startup
- expose config through one module
- use a structured logger with request correlation when possible

## Anti-Patterns

- callback-heavy filesystem or network code in new code paths
- overbuilt dependency-injection containers
- abstract frameworks on top of Express before the app has earned them
