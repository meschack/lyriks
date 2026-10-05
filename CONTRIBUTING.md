# Contributing to Lyriks

Thanks for helping improve Lyriks. Contributions can be code, bug reports, interface feedback or documentation.

## Getting started

1. Check [existing issues](https://github.com/meschack/lyriks/issues) before starting. For a substantial feature, open an issue to discuss the approach.
2. Fork the repository and create a branch from `main`.
3. Follow the [local setup in the README](README.md#run-locally).

For a fork, configure the original repository as upstream:

```bash
git remote add upstream https://github.com/meschack/lyriks.git
git fetch upstream
git switch -c feat/your-change upstream/main
```

## Working on the code

- Keep changes focused on one problem and follow nearby code conventions.
- Use TypeScript for frontend code and Python type hints for backend code.
- Preserve editable share links and keep the card preview consistent with exported images.
- For interface changes, check desktop and mobile layouts, keyboard access, loading states and errors.
- Add meaningful tests when behaviour changes, and update documentation when setup or usage changes.
- Keep credentials and personal environment files out of commits.

### Checks

Run the checks relevant to your change:

```bash
# Frontend, from frontend/
pnpm lint
pnpm exec tsc --noEmit
pnpm build

# Backend, from backend/ with the virtual environment active
pytest
```

Use `pnpm format` in `frontend/` to format frontend files. There is currently no frontend automated test script; do not use `pnpm test`.

## Opening a pull request

Describe the problem and the resulting behaviour. Link the related issue, explain how you checked the change, and include before/after screenshots for visual changes. The PR template covers these details.

Use clear commit messages, preferably following the existing Conventional Commits style:

```text
feat: add a new card layout
fix: preserve lyric selection when editing
docs: clarify local setup
```

If the base branch changes while you work, update your branch and resolve any conflicts before requesting review.

## Community

Be respectful, focus feedback on the work, and make space for people with different experience levels. Harassment, personal attacks and posting private information are not welcome.

For questions, [open an issue](https://github.com/meschack/lyriks/issues/new) with enough context for someone else to help. Never include API tokens or private user data in an issue or screenshot.
