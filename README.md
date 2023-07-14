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

Update the `.eslintrc.json` to include `"plugin:prettier/recommended"` in the `extends` array for `.ts` files. Then, add a new `.html` section at the end of the `overrides` that looks like this:

```json
{
  "files": ["*.html"],
  "excludedFiles": ["*inline-template-*.component.html"],
  "extends": ["plugin:prettier/recommended"],
  "rules": {
    "prettier/prettier": ["error", { "parser": "angular" }]
  }
}
```

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
