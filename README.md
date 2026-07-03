# Example Angular App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Table of Contents

- [Example Angular App](#example-angular-app)
  - [Table of Contents](#table-of-contents)
  - [Updating Angular](#updating-angular)
    - [Example](#example)
  - [Development server](#development-server)
  - [Code scaffolding](#code-scaffolding)
  - [Build](#build)
  - [Running unit tests](#running-unit-tests)
  - [Running end-to-end tests](#running-end-to-end-tests)
  - [Further help](#further-help)

## Updating Angular

To update Angular, run the following command replacing VERSION with the version you want to update to:

```shell
npm run ng -- update @angular/core@latest @angular/cli@latest @angular/material@latest angular-eslint@latest
```

### Example

```shell
npm run ng -- update @angular/core@22 @angular/cli@22 @angular/material@22 angular-eslint@22
```

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng -- g component component-name` to generate a new component. You can also use `npm run ng -- g directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test:unit` to execute the unit tests via [Vitest](https://vitest.dev/).

## Running end-to-end tests

Run `npm run test:cypress` to execute the end-to-end tests via [cypress](https://www.cypress.io/) headless. If you want to test using the interactive `cypress` app, run `npm run test:cypress:open`.

Both commands leverage [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) to run the app and tests in a single terminal.

## Further help

To get more help on the Angular CLI use `npm run ng -- help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
