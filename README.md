# Portfolio site

My personal portfolio: a single static page, plain HTML, CSS and JavaScript, with no build step.

## Run it locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Files

- `index.html`: all of the content (intro, about, projects, experience, contact)
- `styles.css`: the look. The colours are set at the top; change `--accent` to re-theme
- `script.js`: light/dark toggle, mobile menu, nav highlighting and fade-in on scroll

## Deploying

It's just static files, so GitHub Pages, Netlify or Cloudflare Pages all work. For GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` / root**.
