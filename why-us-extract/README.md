# Why us — standalone extract

Self-contained recreation of the **Why us** section from the BrandHive / Lesmana Framer export (`index.html` → `data-framer-name="Why us"`).

## Preview

Open `index.html` in a browser (or serve the folder locally):

```bash
npx serve .
```

Scroll down to see:

1. Middle card zoom (`scale(10)` → `scale(1)`) via `#zoom`
2. Four corner stats slide + fade in via `#scroll-1` … `#scroll-4`
3. Number counters: `20+`, `$2M+`, `$50K+`, `50+`
4. Badge / headline word reveal / signature / blurb fade-in
5. Sticky pin while the tall trigger track scrolls (~150vh)

On mobile (`≤809.98px`) the layout stacks and animations are static (same as the Framer SSR mobile variant).

## Files

| Path | Role |
|------|------|
| `index.html` | Section markup only |
| `css/why-us.css` | Layout, tokens, responsive rules |
| `js/why-us.js` | Scroll zoom, slide-ins, counters |
| `assets/icons/9c47fOR3CNoSsEtr6IEYJoKM.svg` | Pattern fill |
| `assets/images/VYb5PxGZ8tTd69a1Ax7w3OLjFKk.png` | Signature |

## Notes

- Framer Motionscroll was replaced with vanilla scroll progress so the extract works offline without the Framer CDN runtime.
- Counter end values match the section labels (`20`, `$2M`, `$50K`, `50`). Change targets in `js/why-us.js` if needed.
- Colors match the original tokens: cream `#f9f6ed`, dark `#12110d`, gold `#917b50`, grey `#6f6a68`.
