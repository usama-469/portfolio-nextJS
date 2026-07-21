# CLAUDE.md

Personal portfolio site for Usama Irfan (XR/AR/VR developer). Single-page Next.js App Router site, statically exported.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # static export -> out/
npm run lint     # next lint
npx tsc --noEmit # type check (build does NOT do this — see below)
```

## Architecture

One page. `app/page.tsx` stacks every section in order:

`FloatingNav` → `Hero` → `Grid` → `RecentProjects` → `Clients` → `Experience` → `Approach` → `Footer`

- `app/` — layout, the single page, `globals.css`, theme provider (`next-themes`, forced `defaultTheme="dark"`), Sentry `global-error.tsx`.
- `components/` — one file per section.
- `components/ui/` — mostly vendored Aceternity UI primitives (BentoGrid, Spotlight, MovingBorders, InfiniteMovingCards, CanvasRevealEffect, 3d-card, TextGenerateEffect, Globe/GridGlobe). Treat these as third-party: they were copy-pasted in, and their hook deps are deliberately not exhaustive.
- `data/index.ts` — **all site content**. `navItems`, `gridItems`, `projects`, `testimonials`, `companies`, `workExperience`, `socialMedia`. Copy, image paths, project links, and layout classNames all live here, not in the components.
- `public/` — every image and svg, flat. Referenced from `data/index.ts` by path.
- `utils/cn.ts` — `cn()` = `twMerge(clsx(...))`. Use it for any conditional class.

**Content changes almost always mean editing `data/index.ts`, not a component.** The `className` fields on `gridItems` drive the bento grid layout — changing one reflows the grid.

## Things that will bite you

**Static export (`output: 'export'`).** No server. No route handlers, no server actions, no `next/image` optimization (`unoptimized: true`), no runtime env vars. Every page is prerendered in Node at build time — *including client components*.

**Browser-only libraries must be loaded with `ssr: false`.** Because of the prerender above, any module that touches `document` or `window` at import time crashes `npm run build`. `three` is already handled this way in `components/ui/GridGlobe.tsx`:

```ts
const World = dynamic(() => import("./Globe").then((m) => m.World), { ssr: false });
```

`react-lottie` (imported at module scope in `components/ui/BentoGrid.tsx`) has this exact problem and currently breaks the build — see below. Any new browser-only dep needs the same `dynamic(..., { ssr: false })` treatment.

**`typescript.ignoreBuildErrors: true` in `next.config.mjs`.** `npm run build` does not type check. Run `npx tsc --noEmit` yourself before considering a change done.

**Sentry is configured for server, edge, and client**, but under static export only `sentry.client.config.ts` ever runs in production. `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`, and `automaticVercelMonitors` are inert. Don't spend time debugging them.

**Tailwind theme colors are custom** (`tailwind.config.ts`): `black-100 #000319`, `purple #CBACF9`, `blue-100 #E4ECFF`, plus `white-100/200`. Note that a color name in an *SVG `fill` attribute* is a CSS named color, not a Tailwind token — `fill="purple"` gives `#800080`, not the theme purple.

**`react-hooks/exhaustive-deps` warnings in `components/ui/` are expected.** `Globe.tsx` in particular keys three.js setup effects on refs on purpose; "fixing" the deps re-runs scene setup every render. Leave them.

## Outstanding work

`BUGS.md` documents a 22-finding audit. 20 are fixed and verified as of 2026-07-20; the build passes and the export renders.

The two that remain are **content decisions, not code defects** — both in `data/index.ts`, both left for the owner:

- Projects **8** (*VR room*) and **9** (*Spark-AR*) have `link: "https://github.com"`, a placeholder. The surrounding code is correct, so dropping in a real URL is the entire fix.
- `workExperience` 2 and 3 share an identical `desc`; `projects` 3 and 8 share an identical `des`; `companies` 3 is named `"stream"` but shows nxtDynamics logos, and `companies` 5 is named `"docker."` but shows Keymech. The `companies` `name` doubles as the logo `alt` text, so those last two are an accessibility bug that can only be fixed by writing the correct company name.
