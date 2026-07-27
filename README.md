# Example Angular App

A reference Angular v22 application that demonstrates modern Angular patterns — standalone components, signals, lazy-loaded routes, and Angular Material — alongside a fully wired tooling and CI setup (ESLint, Prettier, Husky, Vitest, Playwright, and Codacy coverage).

## Table of Contents

- [Example Angular App](#example-angular-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Available Scripts](#available-scripts)
  - [Development Server](#development-server)
  - [Building](#building)
  - [Testing](#testing)
    - [Unit Tests](#unit-tests)
    - [End-to-End Tests](#end-to-end-tests)
  - [Linting and Formatting](#linting-and-formatting)
  - [AI Agent Instructions](#ai-agent-instructions)
  - [Code Scaffolding](#code-scaffolding)
  - [Updating Angular](#updating-angular)
  - [Continuous Integration](#continuous-integration)
  - [Further Help](#further-help)

## Features

The app exposes two lazy-loaded pages behind a shared shell:

- **`/mat-table`** ([`MatTable`](src/app/pages/mat-table/mat-table.ts)): an Angular Material data table of the periodic elements with client-side sorting, text filtering, per-column filters, pagination, expandable rows, resizable columns, and a multi-select control to choose which columns are displayed. The chosen columns and their widths are persisted through the [`AppState`](src/app/services/app-state.ts) service.
- **`/iframe-resizer`** ([`IframeResizer`](src/app/pages/iframe-resizer/iframe-resizer.ts)): demonstrates the [`IFrameResizer`](src/app/directives/iframe-resizer.ts) directive, which auto-sizes an embedded `<iframe>` to its content using the [`iframe-resizer`](https://github.com/davidjbradshaw/iframe-resizer) library. URLs are sanitized and memoized through the [`UrlCache`](src/app/services/url-cache.ts) service.

`/` redirects to `/mat-table`, and unknown paths fall back to it.

### Switchable navigation

How you move between those pages is a **user setting rather than a route**. [`Shell`](src/app/layouts/shell/shell.ts) renders a persistent app bar whose settings menu picks the navigation layout, and the choice is saved to local storage by the [`Settings`](src/app/services/settings.ts) service, so it survives a reload:

- **Tabs** ([`TabsLayout`](src/app/layouts/tabs-layout/tabs-layout.ts)): a `mat-tab-nav-bar` of routed tab links above a `mat-tab-nav-panel`.
- **Side navigation** ([`ToolbarLayout`](src/app/layouts/toolbar-layout/toolbar-layout.ts)): a collapsible `mat-drawer` of routed links beside the page, toggled from the app bar.

## Tech Stack

- **Framework:** [Angular](https://angular.dev/) v22 (standalone components, signals, native control flow, lazy-loaded routes)
- **UI:** [Angular Material](https://material.angular.io/) + CDK v22
- **Language:** [TypeScript](https://www.typescriptlang.org/) 6 (strict)
- **Unit testing:** [Vitest](https://vitest.dev/) v4 (via `@angular/build:unit-test`)
- **E2E testing:** [Playwright](https://playwright.dev/)
- **Linting:** [ESLint](https://eslint.org/) v9 with [angular-eslint](https://github.com/angular-eslint/angular-eslint) and [typescript-eslint](https://typescript-eslint.io/)
- **Stylesheet linting:** [Stylelint](https://stylelint.io/) with [stylelint-config-standard-scss](https://github.com/stylelint-scss/stylelint-config-standard-scss)
- **Formatting:** [Prettier](https://prettier.io/)
- **Git hooks:** [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)

## Project Structure

```text
src/
├── app/
│   ├── layouts/             # App shell and the navigation layouts it can render
│   ├── pages/               # Route-level components (mat-table, iframe-resizer)
│   ├── components/          # Reusable components (column-filter, column-select, filter, ...)
│   ├── directives/          # column-resize, header-cell-action, iframe-resizer directives
│   ├── interfaces/          # Type definitions, navigation links, periodic element data
│   ├── services/            # Signal-based singleton services (app-state, settings, url-cache)
│   ├── app.config.ts        # Application providers (router, error listeners)
│   ├── app.routes.ts        # Lazy-loaded route definitions
│   └── app.ts               # Root component (<router-outlet />)
├── styles/                  # Material M3 theme
├── main.ts                  # Bootstrap entry point
└── styles.scss              # Global styles
tests/                       # Playwright end-to-end tests and config
scripts/                     # sync-agent-instructions.ts and other tooling
public/                      # Static assets served as-is
```

## Prerequisites

- **Node.js** — the version pinned in [`.nvmrc`](.nvmrc). With [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use`.
- **npm** v11+ (bundled with the Node version above).

## Getting Started

```shell
# Clone the repository
git clone https://github.com/mrlonis/example-angular-app.git
cd example-angular-app

# Use the pinned Node version
nvm use

# Install dependencies (also sets up Husky git hooks via the "prepare" script)
npm install

# Start the dev server
npm run start
```

Then open [http://localhost:4200/](http://localhost:4200/).

## Available Scripts

| Script                                  | Description                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| `npm run start`                         | Start the dev server at `http://localhost:4200/` with hot reload. |
| `npm run build`                         | Production build to `dist/`.                                      |
| `npm run build:dev`                     | Development build (no optimization, source maps).                 |
| `npm run watch`                         | Development build in watch mode.                                  |
| `npm run test`                          | Run unit tests, then end-to-end tests.                            |
| `npm run test:unit`                     | Run Vitest unit tests once (no watch).                            |
| `npm run test:e2e`                      | Install Playwright browsers and run E2E tests.                    |
| `npm run lint`                          | Lint all sources (Angular, SCSS, Playwright, JSON, Markdown).     |
| `npm run lint:angular`                  | Lint Angular source files only.                                   |
| `npm run lint:style`                    | Lint SCSS stylesheets with Stylelint.                             |
| `npm run lint:playwright`               | Lint Playwright test files only.                                  |
| `npm run lint:fix`                      | Lint and auto-fix all sources.                                    |
| `npm run prettier`                      | Format the entire repository.                                     |
| `npm run prettier:test`                 | Check formatting without writing changes.                         |
| `npm run sync:agent-instructions`       | Regenerate AI agent instruction files from the source.            |
| `npm run sync:agent-instructions:check` | Verify generated agent instruction files are up to date.          |

## Development Server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application automatically reloads when you change any source files.

## Building

Run `npm run build` to build the project. Artifacts are written to the `dist/` directory. Production builds enforce bundle budgets defined in [`angular.json`](angular.json) (500 kB initial warning / 1 MB error). Use `npm run build:dev` for an unoptimized development build with source maps.

## Testing

### Unit Tests

Run `npm run test:unit` to execute the unit tests once via [Vitest](https://vitest.dev/). Test coverage (HTML and LCOV) is generated under `coverage/`.

To run a single spec file, scope the run with `--include`:

```shell
npm run test:unit -- --include src/app/app.spec.ts
```

### End-to-End Tests

Run `npm run test:e2e` to execute the end-to-end tests via [Playwright](https://playwright.dev/).

To use interactive UI mode, run:

```shell
npx playwright test --ui --config=./tests/playwright.config.ts
```

Specs live in [`tests/`](tests).

## Linting and Formatting

- `npm run lint` runs all linters: ESLint over the Angular source and Playwright tests, Stylelint over SCSS files, and ESLint over JSON and Markdown files.
- `npm run lint:style` runs [Stylelint](https://stylelint.io/) over all SCSS files in `src/`. Configuration lives in [`.stylelintrc.json`](.stylelintrc.json).
- `npm run prettier` formats the whole repository; `npm run prettier:test` checks formatting in CI.
- A [lint-staged](https://github.com/lint-staged/lint-staged) pre-commit hook (configured in [`package.json`](package.json) and wired through Husky) automatically lints, formats, and sorts staged files.

## AI Agent Instructions

Instruction files for various AI coding assistants (`.claude/CLAUDE.md`, `.gemini/GEMINI.md`, `.github/copilot-instructions.md`, `.junie/guidelines.md`, `.windsurf/rules/guidelines.md`, `.cursor/rules/cursor.mdc`) are **generated** from [`AGENTS.md`](AGENTS.md) and must not be edited by hand.

Edit only [`AGENTS.md`](AGENTS.md), then run:

```shell
npm run sync:agent-instructions
npm run sync:agent-instructions:check
```

## Code Scaffolding

Run `npm run ng -- g component component-name` to generate a new component. You can also use `npm run ng -- g directive|pipe|service|class|guard|interface|enum`. New components use SCSS styles by default.

## Updating Angular

To update Angular, run the following command, replacing `VERSION` with the version you want to update to:

```shell
npm run ng -- update @angular/core@latest @angular/cli@latest @angular/material@latest angular-eslint@latest
```

For example, to update to v22:

```shell
npm run ng -- update @angular/core@22 @angular/cli@22 @angular/material@22 angular-eslint@22
```

## Continuous Integration

The [CI workflow](.github/workflows) runs on pushes and pull requests to `main`. It checks that generated agent instructions are current, lints, runs the full test suite, uploads coverage to [Codacy](https://www.codacy.com/), and builds the project. Dependabot pull requests are auto-approved by a separate workflow.

## Further Help

For more help on the Angular CLI, run `npm run ng -- help` or visit the [Angular CLI Overview and Command Reference](https://angular.dev/cli).
