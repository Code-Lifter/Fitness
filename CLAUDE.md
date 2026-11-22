# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

A collection of standalone fitness tools (calculators, timers, trackers) served as a static site on GitHub Pages:
https://code-lifter.github.io/Fitness/

- Repo: https://github.com/Code-Lifter/Fitness (branch `main`; pushing to `main` deploys the site)
- No build step, no package manager, no framework. Every page is a single self-contained `.html` file with inline `<style>` and `<script>`.

## Structure

- `index.html` – the hub page: a grid of cards linking to each tool. **Whenever a tool is added, renamed or removed, update its card here.**
- `nav.html` – shared navbar fragment. Tool pages load it at runtime with `fetch('nav.html')` into a `#nav-placeholder` element. Edit it once to change the nav everywhere.
- Tool pages (one file each): `1-rep-max.html`, `1rm-working-sets.html`, `body-ratio.html`, `breathing.html`, `cardio.html`, `dorian.html`, `drop-set.html`, `health-bench.html`, `heart.html`, `hypertrophy-plan.html`, `rack-master.html`, `rpe.html`, `strength-test.html`, `stretching.html`, `tempo.html`, `timer.html`, `workout-sheet.html`.
- The hub also links to a separate repo/site: `https://code-lifter.github.io/Food-Calculator-/`.

## Conventions

- Styling: Tailwind via the Play CDN (`<script src="https://cdn.tailwindcss.com">`) plus page-specific CSS in a `<style>` block. Fonts come from Google Fonts. Dark theme throughout.
- JavaScript: plain vanilla JS inline in each page. No modules, no bundler.
- Persistence: several pages save user data with `localStorage`. Keep existing storage keys stable so users don't lose saved data.
- Mobile-first: pages are used on phones at the gym. Keep touch targets large and layouts responsive; test at narrow widths.
- New tool pages should follow the existing pattern: a single HTML file, a `#nav-placeholder` + `fetch('nav.html')` for the navbar, and a card in `index.html`.

## Running locally

`fetch('nav.html')` doesn't work over `file://`, so serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

## Workflow

- Commit directly to `main` or use a branch + PR. Either way, changes to `main` go live on GitHub Pages within a minute or two.
- No tests or linters. Check changes by opening the affected page in a browser (including mobile width) and looking for console errors.
