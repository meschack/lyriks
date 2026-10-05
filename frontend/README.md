# Lyriks frontend

The Next.js application for searching songs, choosing lyric passages, customising cards and exporting images.

See the [project README](../README.md) for screenshots, backend setup and contribution information.

## Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). `NEXT_PUBLIC_API_URL` points to the FastAPI backend and defaults to `http://localhost:8000`. The own words mode and image export can be used without the backend; remote artwork validation and song search require it.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Main parts

- `src/components/wizard/`: the creation flow.
- `src/components/search/` and `lyrics/`: song discovery and passage selection.
- `src/components/card-preview/`: the preview, styling controls and export actions.
- `src/hooks/use-card-params.ts`: editable URL state and saved styling preferences.
- `src/app/api/export/`: image rendering with Satori and Sharp.
- `src/fonts/`: local interface fonts; export fonts are bundled from `public/fonts/`.
