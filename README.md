# BrandHive Socials

The official website for **BrandHive** — a studio offering web design, branding, and digital growth services.

It's a static website (plain HTML, CSS, and JavaScript) with no build tools or installation required.

## Project Structure

```
index.html     Main website page
css/           Stylesheets
js/            Scripts (animations, site behavior, small fixes)
assets/        Fonts, icons, images, and videos
```

## How to Run

Since this is a static site, just open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
```

Then visit the URL it gives you (usually `http://localhost:3000`).

## Notes

- Do not edit `framer-components.css` or `framer-motion-animation-engine.js` directly — these are auto-generated. Make custom changes in `brandhive.css` and `brandhive.js` instead.
