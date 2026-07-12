# ALMADERY — Fine Diamonds & Gold Jewellery

A single, cinematic scroll-driven teaser landing page. The viewport stays pinned
while scroll progress plays the creation story of an ALMADERY engagement ring:

**Rough Diamond → Polished Diamond → Gold Craftsmanship → Setting → Finished Ring → Brand Reveal**

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS 4
- GSAP + ScrollTrigger (one centralized master timeline)
- All artwork is original inline SVG — no images, no 3D libraries

## Run

```bash
npm install
npm run dev       # local development
npm run build     # type-check + production build
npm run preview   # serve the production build
```

## Structure

```
src/
  App.tsx                          Landing page shell (journey + form + footer)
  components/
    CinematicJourney.tsx           Pinned stage hosting all scenes
    PrivateAccessForm.tsx          Email capture with validation / loading / success
    MinimalFooter.tsx              Emblem, Instagram, Contact, Privacy, copyright
    brand/                         Emblem + wordmark (original inline SVG)
    svg/                           Scene artwork (rough diamond, brilliant, gold craft, ring)
    scenes/                        IntroScene … BrandRevealScene
  hooks/
    useCinematicTimeline.ts        The master GSAP ScrollTrigger timeline
```

## Motion & accessibility

- One scrubbed, pinned timeline coordinates the whole narrative; the user always
  controls playback with scroll.
- `gsap.matchMedia` builds three variants:
  - desktop — full Z-depth camera moves, blur-to-focus pulls, light sweeps
  - mobile — the same story with lighter transforms, no blur filters, fewer layers
  - `prefers-reduced-motion` — elegant fade / scale crossfades only
- Semantic sections, labelled form controls, visible keyboard focus, descriptive
  SVG titles, and `aria-live` form status.
- Scenes are set to `visibility: hidden` while off-story, so only the active
  scene paints.

## Verified

- `npm run build` passes (strict TypeScript).
- Lighthouse (production preview): Performance 92, Accessibility 96+.
- Visual scroll-through, form states, and reduced-motion smoke-tested headlessly
  via `scripts/shots.mjs`, `scripts/form-test.mjs` (dev-only, needs `playwright-core`).
