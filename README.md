# Kanpur Metro Safar Guide 2.0

**Kanpur Metro Safar, Ab Aur Easy.** — a fast, accessible, privacy-first travel companion for the Kanpur Metro. Plan journeys, check fares, explore stations, and discover how to reach the city's key places by metro.

> This website is **NOT affiliated with, endorsed by, or connected to UPMRC** (Uttar Pradesh Metro Rail Corporation). It is an independent, community-built guide. Always verify fares, timings, and service alerts at official UPMRC channels before travelling.

## Features

- **Journey planner** — pick any two stations, get stop count, estimated time, slab fare, and a shareable link (`/journey?from=X&to=Y`, WhatsApp share built in)
- **Versus-free fare honesty** — fares are calculated only from derived stop counts; anything unverified is labelled, never invented
- **Interactive metro map** — SVG map with zoom, clickable stations, elevated vs. underground styling, and dashed upcoming sections (`/metro-map`)
- **Stations directory** — search, filter (operational / under construction, elevated / underground), and sort all 21 Corridor 1 stations; each station gets a static detail page with facilities, gates, timings, and nearby landmarks
- **Explore by landmark** — "how to reach X by Kanpur Metro" pages for railway stations, hospitals, markets, IIT Kanpur, and more (`/explore`)
- **Fare calculator, timings, information hub, FAQ**
- **Dark mode** (system / light / dark) and **EN | हिं** UI language toggle (factual metro data is never machine-translated)
- **PWA** — installable, offline fallback, service-worker caching, install prompt after 30 s
- **Global search** — Ctrl+K or `/`, fully keyboard-navigable, local data only
- **SEO** — per-page metadata, JSON-LD (WebSite / Place / FAQPage), `sitemap.xml`, `robots.txt`
- **Accessibility** — semantic HTML, ARIA states, visible focus rings, skip navigation, 44 px touch targets, reduced-motion support

## Tech stack

- **Next.js 14** (App Router, static generation) + **React 18**
- **TypeScript** (strict) — zero `any`, zero `console.log`
- **Tailwind CSS 3** with CSS-variable design tokens (light/dark)
- **next-themes** for theme switching, **lucide-react** for icons
- Data layer: typed local datasets in `/data` with a barrel at `/services/metro.ts` — no network calls for metro facts

## Project structure

```
app/            App Router pages (/, /stations, /stations/[id], /routes, /fare,
                /timings, /metro-map, /explore, /explore/[landmark-id], /journey,
                /information, /about, /faq, not-found, sitemap, robots, manifest)
components/     layout, journey, fare, map, stations, search, status, faq, pwa
context/        ThemeProvider, LanguageContext (UI chrome only)
data/           stations, routes, fares, timings, landmarks, status, faq
services/       metro.ts barrel re-exports
lib/            utils, site constants, metadata helpers
public/         sw.js, offline.html, PWA icons
scripts/        generate-icons.mjs (regenerates PWA icons)
```

## Data integrity rules

- Only **verified official information** is presented as fact; anything else is marked `// UNVERIFIED` in the data files and shown with a disclaimer in the UI.
- No made-up fare numbers, no hardcoded journey pairs — journeys are derived from the ordered station list.
- UI labels may be translated; **factual metro information is never machine-translated**.

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```
   → http://localhost:3000

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Lint / type-check**
   ```bash
   npm run lint
   ```

5. **Regenerate PWA icons** (optional)
   ```bash
   node scripts/generate-icons.mjs
   ```

### Environment variables (optional)

Create `.env.local` to set the canonical site URL used in metadata, sitemap, and share links:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Deployment

The app is fully static-friendly (`/journey` is the only dynamic route). Deploy to any Node host with `npm run build && npm run start`, or to Vercel/Netlify out of the box.
