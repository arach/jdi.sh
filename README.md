# JDI.SH

Portfolio website for **Just Do It Software Holdings**.

Live at [jdi.sh](https://jdi.sh)

## Stack

- React 19 + TypeScript
- Vite
- React Router (client-side routing)
- Tailwind CSS (via CDN)
- GitHub Pages (deployment)

## Development

```bash
pnpm install
pnpm dev
```

## Build & Deploy

```bash
pnpm build
```

Deploys automatically to GitHub Pages on push to `main` via GitHub Actions.

## Routes

- `/` - Home (holdings overview)
- `/manifesto` - The Protocol
- `/sidecap` - SideCap product page
- `/sidecap/privacy` - SideCap privacy policy

## SPA Routing on GitHub Pages

Uses a `404.html` redirect trick to support clean URLs on GitHub Pages. Direct URL access (e.g., `jdi.sh/sidecap`) works via sessionStorage redirect.
