# Example Angular App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Setup

### Angular App Creation

```bash
ng new example-angular-app --routing=true --style=scss --package-manager=npm
```

### Adding @angular-eslint/schematics

```bash
ng add @angular-eslint/schematics
```

### Adding husky

```bash
npx husky-init && npm install
chmod +x .husky/pre-commit
```

### Prettier

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

Create a `.prettierrc` file. Example:

```json
{
  "singleQuote": true,
  "printWidth": 125,
  "tabWidth": 2,
  "trailingComma": "all",
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    },
    {
      "files": "*.component.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

Update the `.eslintrc.json` to include `"plugin:prettier/recommended"` in the `extends` array for `.ts` and `.html` files.

Next, add some prettier scripts to the `package.json`:

```json
{
  "scripts": {
    "prettier": "prettier --config .prettierrc --write \"**/*.{css,html,js,jsx,json,md,scss,ts,tsx}\"",
    "prettier:test": "prettier --config .prettierrc --list-different \"**/*.{css,html,js,jsx,json,md,scss,ts,tsx}\""
  }
}
```

[@angular-eslint documentation for prettier setup](https://github.com/angular-eslint/angular-eslint#notes-for-eslint-plugin-prettier-users)

### Setting up lint-staged

```bash
npm install --save-dev lint-staged ng-lint-staged
```

Create a `.lintstagedrc.json` file in the root of the project. Example:

```json
{
  "*.{css,html,js,jsx,json,md,ts,tsx,scss}": ["prettier --write"],
  "cypress/**/*.{html,js,jsx,ts,tsx}": ["prettier --write", "ng-lint-staged lint --fix --"],
  "src/**/*.{html,js,jsx,ts,tsx}": ["prettier --write", "ng-lint-staged lint --fix --"]
}
```

Change the `husky` `pre-commit` to be `npx lint-staged`

### Add cypress

```bash
npm install cypress --save-dev
```

Add the following to your `package.json` scripts `"cypress:open": "cypress open",`. Then, run `npm run cypress:open` to open the cypress app and setup the configuration from there.

Add the `eslint-plugin-cypress` to your project by running `npm install eslint-plugin-cypress --save-dev`.

`cypress` overrides the global `jest` definitions making our existing `angular` `jasmine` tests have false-positive linting errors. To fix this we need to do some additional `cypress` config.

[Source](https://docs.cypress.io/guides/tooling/typescript-support)

First, create a `tsconfig.json` file inside the `cypress` folder that looks like this:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts", "../cypress.d.ts", "../cypress.config.ts"],
  "exclude": []
}
```

Then, add a `.eslintrc.json` to the `cypress` folder that looks like this:

```json
{
  "extends": ["plugin:cypress/recommended"]
}
```

Then, we need to add `cypress` to the `lint` config in `angular.json`:

```json
{
  "lint": {
    "builder": "@angular-eslint/builder:lint",
    "options": {
      "lintFilePatterns": ["src/**/*.ts", "src/**/*.html", "cypress"]
    }
  }
}
```

Then, in the base `tsconfig.json` we need to exclude `cypress` like below:

```json
{
  "exclude": ["cypress.config.ts", "cypress"]
}
```

### eslint-plugin-import Setup

```bash
npm i -D eslint-plugin-import eslint-import-resolver-typescript
```

Add new section to `.eslintrc.json` called `settings` that looks like this:

```json
{
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": ["tsconfig.app.json", "tsconfig.spec.json", "tsconfig.json", "cypress/tsconfig.json"]
      }
    }
  }
}
```

Then add two new plugins to the `.ts` `extends` array:

```json
{
  "extends": ["plugin:import/recommended", "plugin:import/typescript"]
}
```

### Setting up @typescript-eslint rules requiring type information

[Source documentation](https://github.com/angular-eslint/angular-eslint/blob/main/docs/RULES_REQUIRING_TYPE_INFORMATION.md)

Add `parserOptions` to the `.ts` override:

```json
{
  "parserOptions": {
    "project": ["tsconfig.app.json", "tsconfig.spec.json", "tsconfig.json", "cypress/tsconfig.json"]
  }
}
```

To automatically add `parserOptions` to newly created applications or libraries within this workspace, simply update the `angular.json` `schematics` with the following:

```json
{
  "@angular-eslint/schematics:application": {
    "setParserOptionsProject": true
  },
  "@angular-eslint/schematics:library": {
    "setParserOptionsProject": true
  }
}
```

Then, add `"plugin:@typescript-eslint/recommended-requiring-type-checking",` to the `.ts` `extends` array underneath `"plugin:@typescript-eslint/recommended",` inside of `.eslintrc.json`.
