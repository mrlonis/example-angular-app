You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

Single-page Angular v22 demo app. Angular Material + CDK v22, TypeScript 6 (strict), npm (Node version pinned in `.nvmrc`). Two lazy-loaded routes defined in `src/app/app.routes.ts`; providers in `src/app/app.config.ts`; root component `src/app/app.ts` renders `<router-outlet />`.

- `''` → `MatTabs` (`pages/mat-tabs`): tabs hosting `MatTable` (periodic-elements Material table: sort, filter, paginate, expandable rows, column picker) and `ExampleIframe` (`iframe-resizer` demo).
- `'toolbar'` → `MatToolbar` (`pages/mat-toolbar`): toolbar with a `mat-drawer` sidenav.

## Repository Map

- `src/app/pages/<name>/` — route-level ("page") components loaded lazily from `app.routes.ts`.
- `src/app/components/<name>/` — reusable components used across pages. Components are standalone, laid out as `<name>.{ts,html,scss,spec.ts}`.
- `src/app/services/` — signal-based singletons (`selected-page`, `url-cache`), `providedIn: 'root'`.
- `src/app/directives/` — `iframe-resizer` attribute directive (`[appIframeResizer]`).
- `src/app/interfaces/` — types and periodic-element data (`data.ts`).
- `tests/` — Playwright end-to-end specs and config.
- `scripts/sync-agent-instructions.ts` — syncs `AGENTS.md` to all other AI instruction files.

## Conventions

- Put route-level components (one per route) in `src/app/pages/`; put components reused across pages in `src/app/components/`.
- File names have no `.component`/`.service`/`.directive` suffix (Angular v20+ style): e.g. `mat-table.ts`, `url-cache.ts`.
- New components default to SCSS and external templates/styles.
- The generated instruction files (`.claude/CLAUDE.md`, `.gemini/GEMINI.md`, etc.) are copies of `AGENTS.md` — to change guidance, edit `AGENTS.md` and re-sync (see below), never edit the copies.

## Common Commands

- Dev server: `npm run start` (http://localhost:4200/). Build: `npm run build` (prod) / `npm run build:dev`.
- Scoped unit test: `npm run test:unit -- --include src/app/app.spec.ts`. Full unit run: `npm run test:unit`.
- E2E: `npm run test:e2e`. Interactive UI mode: `npx playwright test --ui --config=./tests/playwright.config.ts`.
- Lint: `npm run lint` (auto-fix: `npm run lint:fix`). SCSS only: `npm run lint:style`. Format: `npm run prettier` (check: `npm run prettier:test`).
- CI (`.github/workflows/actions.yml`) runs, in order: sync check, lint, `npm run test`, Codacy coverage upload, build. Match this locally before pushing.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## AI Instruction Source of Truth

- Do not manually edit generated AI instruction files such as `.claude/CLAUDE.md`, `.gemini/GEMINI.md`, `.github/copilot-instructions.md`, `.junie/guidelines.md`, `.windsurf/rules/guidelines.md`, or `.cursor/rules/cursor.mdc`.
- Edit only `AGENTS.md`.
- After editing, run:
  - `npm run sync:agent-instructions`
  - `npm run sync:agent-instructions:check`

## Linting Guidelines

- Run linting for every change set; linting is required for all changes, not optional.
- Use the lint command that matches the files you changed:
  - Angular app files: `npm run lint:angular`
  - SCSS stylesheets: `npm run lint:style`
  - Playwright files: `npm run lint:playwright`
  - Mixed changes (Angular + Playwright) or full-repo linting: `npm run lint`
- For scoped linting, pass extra arguments through the matching script (for example: `npm run lint:angular -- <args>` or `npm run lint:playwright -- <args>`).
- Treat lint failures as real issues to fix in code rather than bypass.
- Never disable ESLint rules to make code pass linting.
  - Do not disable rules in root/shared ESLint config files.
  - Do not disable rules at the file level.
  - Do not disable rules inline (for example with `eslint-disable` comments).

## Testing Guidelines

- This project uses `vitest` (v4) for unit testing. Write and update unit tests using Vitest APIs and patterns.
- When running tests, prefer scoped commands that target only the changed project or spec file.
- Example:
  - To run tests for just the `/src/app/app.spec.ts` file: `npm run test:unit -- --include src/app/app.spec.ts`
- Place tests close to the code they verify, and keep test setup focused on behavior rather than implementation details.
- Prefer clear Arrange-Act-Assert structure with descriptive test names that document expected behavior.
- Cover happy paths, edge cases, and error handling for components, services, and utility functions.
- Keep tests deterministic: avoid time, network, and global state coupling unless explicitly mocked.
- Mock only what is necessary, and prefer lightweight fakes/stubs over deep or brittle mocks.
- Ensure tests are fast and isolated so they can run reliably in CI.
