# Babajide — Portfolio

A single-page React + Vite portfolio. On load, the hand-drawn signature
draws itself in over a white background; once it finishes, it shrinks and
docks into the left side of the navbar while the rest of the page fades in.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. To produce a production build:

```bash
npm run build   # outputs to dist/
npm run preview # serve that build locally to sanity-check it
```

This already deploys the same way the project was set up before (the
`homepage` field in `package.json` points at GitHub Pages).

## Where to personalize content

Everything you'll want to edit lives in plain objects/JSX near the top of
each file — no content is buried in markup:

- **`src/Hero.jsx`** — name and tagline.
- **`src/About.jsx`** — the bio paragraph.
- **`src/Skills.jsx`** — the `GROUPS` array (swap categories/tags for your own).
- **`src/Projects.jsx`** — the `PROJECTS` array. Each entry has `title`,
  `tags`, `context`, `problem`, `process`, `outcome`, and `link` — duplicate
  an object to add another project.
- **`src/Contact.jsx`** — the `LINKS` array (email, LinkedIn, GitHub, etc.).
- **`src/Footer.jsx`** — copyright line.

All of the above is placeholder copy meant to be replaced.

## How the intro works

`src/App.jsx` starts a 3-second timer (`DRAW_DURATION`) that matches the
total runtime of the six-stroke draw animation defined in `src/ijab.css`.
When it elapses, `introDone` flips to `true`, which:

1. Adds `.intro-mark--docked` to the big centered signature (`src/App.css`),
   shrinking and sliding it toward the navbar's logo slot while fading out.
2. Reveals the navbar and hero (`src/navbar.css`, `src/Hero.css`).

The navbar's logo slot is a second, separate (non-animated) copy of the
same `Bajlogo` component, positioned using the same `--nav-h`/`--gutter`
tokens as the docking target, so the two line up. If you resize the navbar
logo slot (`.nav-mark` in `navbar.css`), update the matching values in
`.intro-mark--docked` (`App.css`) to keep them aligned. People who have
"reduce motion" turned on skip straight to the final state.

## Structure

```
src/
  tokens.css        design tokens (color, type, layout, motion)
  index.css         reset + shared section/eyebrow/reveal styles
  ijab.jsx/.css      the signature mark + its draw animation
  App.jsx/.css       intro timing + page composition
  navbar.jsx/.css
  Hero.jsx/.css
  About.jsx/.css
  Skills.jsx/.css
  Projects.jsx/.css
  Contact.jsx/.css
  Footer.jsx/.css
  Reveal.jsx         scroll-triggered fade-in wrapper used across sections
```
