# Sean Murphy — Personal Website

[![CI](https://github.com/smurphy6492/personal-website/actions/workflows/ci.yml/badge.svg)](https://github.com/smurphy6492/personal-website/actions/workflows/ci.yml)
[![Deploy](https://github.com/smurphy6492/personal-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/smurphy6492/personal-website/actions/workflows/deploy.yml)

Portfolio site showcasing Analytics + AI Systems work. Built with React + Vite + Tailwind. Deployed to Netlify automatically on every push to `master`.

**Live site:** [smurphy.netlify.app](https://smurphy.netlify.app)

---

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- shadcn/ui components
- Netlify (hosting)

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # production build → dist/
npm run typecheck  # TypeScript check
npm run preview    # preview the production build
```

## CI/CD

- **CI:** Runs type check + build on every pull request to `master`
- **Deploy:** Auto-deploys to Netlify on every push to `master`

Workflows: [`.github/workflows/`](.github/workflows/)
