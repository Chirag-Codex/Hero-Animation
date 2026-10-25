# Scroll-Driven Hero — Car Animation

A buttery-smooth, scroll-tied hero section: an orange McLaren-style supercar "paints" a green strip across a dark road as you scroll down, revealing the headline letter by letter and fading in stat cards at milestone progress points.

**Live demo:** `https://<your-username>.github.io/car-scroll-animation/`  
**Repo:** `https://github.com/<your-username>/car-scroll-animation`

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | Component model, fast dev server |
| Tailwind CSS v4 | Utility classes + `@theme` design tokens |
| GSAP 3 + ScrollTrigger | All animations — intro & scrubbed scroll |

---

## Quick Start

```bash
npm install
npm run dev          # → http://localhost:5173/car-scroll-animation/
npm run build        # production build → dist/
npm run preview      # preview prod build locally
npm run deploy       # builds + pushes to gh-pages branch
```

---

## How the Scroll Sync Works

```
ScrollTrigger.onUpdate(self) {
  p = self.progress  // 0 → 1, scrub: 1.2 (smooth lag)

  car.x   = startX + p * totalTravel          // translateX only
  strip.scaleX = clamp(car.rearX / vw, 0, 1) // rear edge = green edge
  headline.clipPath = inset(0 ${(1-frontProgress)*100}% 0 0)
                                               // front edge = text reveal
  cards[i].opacity = fade(p, milestones[i])   // appear at 15/42/62/82%
}
```

**Why `scaleX` instead of `width`?**  
`transform: scaleX()` never causes layout recalculation. Animating `width` would repaint the entire strip on every frame — `scaleX` costs a single GPU composite operation.

**Why `clip-path` for text reveal?**  
The headline sits on the green strip; clip-path on the *wrapper div* masks it without touching DOM children. The clip boundary moves identically to the car's front edge.

**Why `onUpdate` instead of a GSAP timeline?**  
The three values (car x, strip scaleX, clip-path %) are mathematically derived from a single progress number. Using `onUpdate` keeps the formulas readable and guarantees zero drift between elements.

---

## Project Structure

```
src/
  main.jsx                     React root, StrictMode
  App.jsx                      Hero + below-hero placeholder
  index.css                    Tailwind v4 + custom animation CSS
  components/
    Hero.jsx                   Layout owner, ref registry
    Headline.jsx               <h1> split into letter <span>s
    StatCard.jsx               Stat card (4 variants)
    Car.jsx                    Inline SVG top-down McLaren
  hooks/
    useHeroAnimation.js        All GSAP logic (intro + scroll)
  data/
    stats.js                   4 stat card data objects
```

---

## Deploy to GitHub Pages

1. Create a repo named `car-scroll-animation` on GitHub.
2. Update `vite.config.js` → `base: '/car-scroll-animation/'`
3. Update `package.json` → `"homepage": "https://<you>.github.io/car-scroll-animation"`
4. Push to GitHub, then:

```bash
npm run deploy
```

This runs `vite build` then `gh-pages -d dist`, pushing the `dist/` folder to the `gh-pages` branch. GitHub Pages serves from that branch automatically.

---

## Assumptions & Limitations

- Car asset is an inline SVG (no external image). Swap easily: replace `<Car />` with `<img src={carAsset} className="car-img" />`.
- The green strip's right edge is tied to the car's **rear** (left edge of bounding box). If you resize the SVG, update `carW` in `useHeroAnimation.js`.
- `100svh` used for hero height (safe for mobile browsers with collapsible chrome).
- Tested at 360 – 1920 px viewport widths.

