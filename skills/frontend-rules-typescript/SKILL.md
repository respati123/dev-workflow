---
name: frontend-rules-typescript
description: TypeScript/React frontend coding conventions for this workflow's coder role — types, component structure, props, state management, imports, comments, linting, testing. Auto-loaded for frontend-labelled TypeScript sub-issues; use when implementing or reviewing React/TypeScript UI code. Distinct from impeccable, which covers visual/design consistency, not code structure.
---

# Frontend Rules (TypeScript/React)

Conventions the `coder` role follows on any `frontend`-labelled TypeScript
sub-issue. Load this before writing or editing frontend code. This is about
**code structure**, not visual design — `impeccable` (DESIGN.md, visual
language) still applies on top of this, the two aren't a substitute for
each other.

## Types

No `any` — use a real type/interface, generics, or `unknown` with
narrowing. Shared types/interfaces live in their own files (e.g.
`types/user.ts`), not inlined next to every component that uses them;
a type used by exactly one component can stay colocated with it.

## Component structure

One component per file, named export, PascalCase filename matching the
component name. A component handling multiple unrelated concerns (data
fetching + form logic + layout, all in one file) is a split candidate —
extract sub-components or hooks rather than growing one file indefinitely.
Logic inside a component still follows `coding-principles`' general rules
(0-2 params, max 3 nesting levels) — this skill doesn't relax those.

## Props

Always a named, typed interface — `<ComponentName>Props` — not an inline
object type, except for a component with one or two trivial primitive
props. Optional props get a default, not a runtime `undefined` check
scattered through the body.

## State management

Prefer the simplest tool that covers the need: `useState`/`useReducer` for
component-local state, lifted only as far as the components that actually
need it. For state shared across many components, or for server data,
follow whatever this project already uses (check the scout report) — don't
introduce a second state-management library alongside an existing one.
Server/remote data specifically should go through a dedicated data-fetching
layer (e.g. a query library) rather than hand-rolled `fetch` + `useEffect` +
`useState`, so loading/error/caching aren't reimplemented per component.

## No deep prop drilling

Passing the same prop through more than 2-3 levels of components that don't
use it themselves is a signal to use Context or the project's state
management tool instead of threading it manually.

## Imports

Absolute imports via the `@/*` alias — no `../../../` chains.

## Comments

None. If a name or structure needs a comment to be understood, rename or
restructure instead of explaining it.

## Linting & formatting

Biome for lint + format. Run it before handing off; fix everything it
flags.

## Testing

Component tests via Testing Library (React Testing Library), asserting on
rendered output and user-facing behavior — not implementation details
(internal state, private methods). Mock network calls at the boundary
(e.g. MSW) rather than mocking the data-fetching hook itself.

## No redundant components/hooks

Before writing a new component or hook, grep for one that already does
this — reuse or extend it instead of reimplementing.
