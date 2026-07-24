# Pull Request

## Summary

Explain what this PR changes and why. Include motivation, context, and any
trade-offs or decisions a reviewer should be aware of.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that alters existing behavior)
- [ ] Refactor or cleanup (no behavior change)
- [ ] Tests (unit, scripts, or Playwright e2e)
- [ ] Build, CI, or tooling
- [ ] Dependency update
- [ ] Documentation or AI instructions

## Areas Touched

- [ ] Angular app (`src/`)
- [ ] End-to-end tests (`tests/`)
- [ ] Node scripts (`scripts/`)
- [ ] CI or workflows (`.github/`)
- [ ] AI instructions (`AGENTS.md` and its generated copies)
- [ ] Dependencies (`package.json` / `package-lock.json`)

## Related Issues

Closes #

## How to Verify

Steps a reviewer can follow to confirm the change behaves as expected.

1. `npm ci`
2. `npm run start`, then open http://localhost:4200/
3. ...

For UI changes, attach before/after screenshots or a short recording.

## Checklist

Mirror the CI pipeline in `.github/workflows/actions.yml` before requesting a review.

- [ ] Edited `AGENTS.md` (not the generated copies), then ran `npm run sync:agent-instructions`; `npm run sync:agent-instructions:check` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (unit, scripts, and Playwright e2e)
- [ ] `npm run build` succeeds
- [ ] Tests added or updated to cover new or changed behavior
- [ ] UI changes meet accessibility requirements (AXE clean, WCAG AA)
- [ ] Documentation updated where applicable
