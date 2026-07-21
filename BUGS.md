# Bug report — portfolio-nextJS

Audit date: 2026-07-14. Baseline `main` @ a46ab84.

**Status: 20 of 22 findings fixed, applied 2026-07-20.** Two groups were deliberately left alone at the owner's request — see [Deferred by owner](#deferred-by-owner) at the bottom.

> **Note on history:** this document previously claimed the fixes were applied when they were not — the working tree still carried every original bug. The fixes described below are now genuinely in the tree; each one was re-verified against the actual file before being applied.

**Verification after the fixes (2026-07-20):**

- `npx tsc --noEmit` — clean.
- `npm run build` — succeeds; static export generated. (Confirmed failing on untouched `main` first, with the `document is not defined` prerender error in finding 0.)
- `npx next lint` — 17 warnings, **0 errors**. All 17 are the two categories called out under [Not actioned](#not-actioned-deliberately): 7 `no-img-element`, 10 `react-hooks/exhaustive-deps`, all in vendored `components/ui/`.
- Heading outline in the built `out/index.html`: **1 `<h1>`, 5 `<h2>`, 8 `<h3>`** — as intended.
- Export served over HTTP: `/` returns 200 with every section rendering; `/usama.png` and `/Usama-XR-resume.pdf` both 200 (the two relative paths from finding 16).
- `getYouTubeId` checked against all 10 real URLs in `data/index.ts` (all parse unchanged) plus `youtu.be/`, `?si=`, `&t=30s`, and `/embed/` forms; non-YouTube input returns `null` and the iframe is skipped.

**Interactive behaviour driven in a real browser** (headless Chromium against `npm run dev`), since the static export cannot exercise it. All of the following pass with **zero uncaught page errors and zero 404s**:

| Finding | Checked |
|---|---|
| 1 | Next is enabled on "All" (11 projects) and correctly disabled on a filtered category; the filtered grid stays populated instead of emptying |
| 2 | "Try now →" does not open the modal (stopPropagation holds) |
| 3 | Overlay computes to `z-index: 6000` vs the nav's `5000` |
| 4 | ArrowRight outside the carousel does not page it; ArrowRight with the carousel focused does |
| 5 | Card click opens the dialog with `aria-modal` and `aria-labelledby`; focus lands inside it; body scroll locks; Escape closes it and scroll is restored |
| 11, 12 | Download flips the label to "Resume downloaded!", the confetti mounts and plays, and after 3s the label reverts and the confetti unmounts cleanly |

---

## P0 — Found during verification: the site did not build

### 0. `npm run build` crashed with `ReferenceError: document is not defined` — FIXED

This was **not** in the original report; I only caught it when I ran the build to check my own changes. I then stashed everything and rebuilt the untouched `main`, which failed identically — so this was pre-existing and unrelated to my edits. **The production static export has been broken on `main`.**

Cause: `components/ui/BentoGrid.tsx` imported `react-lottie` at module scope. `react-lottie` pulls in `lottie-web`, which calls `document.createElement` while the module initialises (`lottie.js:1316`, building a canvas for feature detection). Under `output: 'export'` every page — including client components — is prerendered in Node at build time, where `document` doesn't exist, so the prerender of `/` threw and the export aborted.

Fix: load it through the same `ssr: false` boundary the globe already uses.

```js
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
```

Worth knowing: this is exactly the failure mode CLAUDE.md warns about for the globe. Any browser-only library added to this project needs the same treatment.

---

## P1 — Broken behavior a visitor will hit — all FIXED

### 1. Paging a filtered category emptied the grid — FIXED
`components/RecentProjects.tsx`

The visible slice came from `filteredProjects` but the pager's bounds were computed against `totalProjects` (`projects.length`, always 11). Every category holds 5 or fewer projects and a page holds 6, so any filtered view is single-page — yet Next stayed enabled, because `0 + 6 >= 11` is false. Clicking it produced `filteredProjects.slice(6, 12)`, i.e. nothing.

Fixed by bounding both the disabled state and the `handleNext` guard on `filteredProjects.length`. The category list, the filtered list, and the derived `canPrev` / `canNext` flags are now memoised, and switching category resets the page directly in the click handler instead of via an after-the-fact effect.

### 2. "Try now →" fired twice, and opened a shared tab — FIXED
`components/RecentProjects.tsx`

The card wrapper's `onClick` opened the modal, and the link inside it never stopped propagation — so clicking the link opened a new tab *and* the modal behind it. The link also had `target="__blank"` (two underscores), which is not the `_blank` keyword but an ordinary window *name*, so every project reused one shared tab. It also lacked `rel`.

Fixed: `onClick={(e) => e.stopPropagation()}`, `target="_blank"`, `rel="noopener noreferrer"`.

### 3. The floating nav rendered on top of the modal — FIXED
The nav is `z-[5000]` and fixed; the modal overlay was `z-[100]`, so the nav floated above the backdrop. The `body { overflow: hidden }` trick in the code was commented as hiding the nav, but `overflow` only locks scrolling and has no effect on a fixed element.

Fixed by raising the overlay to `z-[6000]`, above the nav. The scroll lock is kept, but moved out of an injected `<style>` tag and into an effect that saves and restores the previous `overflow` value.

### 4. Arrow keys were hijacked page-wide — FIXED
The keydown listener sat on `window` with an unconditional `preventDefault()`, so Left/Right paged the project list from anywhere on the page — including while the modal was open — and broke ordinary keyboard scrolling everywhere else.

Fixed by moving the handler onto the carousel itself (`role="group"`, `tabIndex={0}`, with a visible focus ring). Arrows now page the carousel only while it holds focus — tab to a chevron and they work — and scroll the page normally everywhere else. `preventDefault()` only fires when a page actually happens.

### 5. Modal had no Escape, no focus management — FIXED
Added: `Escape` closes; `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the title; focus moves into the dialog on open and returns to the element that opened it on close; Tab cycles within the dialog instead of escaping to the page behind. The modal title also dropped from `<h2>` to `<h3>` to fit the new outline.

---

## P2 — Visible but not breaking

### 8. Stale copyright year — FIXED
`components/Footer.tsx` — hardcoded `2024` replaced with `{new Date().getFullYear()}`. Note this is evaluated at *build* time under a static export, so it updates whenever you rebuild.

### 9. Five competing `<h1>`s — FIXED
Worse than reported: besides the five section headings, each of the four Experience cards also rendered its title as an `<h1>`.

The page now has a correct outline: **one `<h1>`** (the hero title), **five `<h2>`** (the section headings), **eight `<h3>`** (the Experience and Approach card titles) — confirmed by grepping the built `out/index.html`.

To make the hero title an `h1`, `TextGenerateEffect` gained an `as` prop. Its internals were switched from `div`s to `span`s, because a `div` inside an `h1` is invalid HTML while a `span` is fine. The `span`s carry `block` so the layout is unchanged.

One extra change beyond the original finding: the hero's eyebrow line ("Extended Reality (XR) with Unity/Unreal Engine") was an `<h2>` sitting *above* the `<h1>`, which is a heading-order violation on its own. It's a tagline rather than a section heading, so it became a `<p>` with the same classes — visually identical, and it keeps the five `<h2>`s meaning exactly "the five section headings".

### 10. Alt text was filenames — FIXED
`BentoGrid` announced "slash b5 dot s v g"; `Experience` announced the thumbnail path; the footer's three social icons all announced "icons". Background and decorative images now use `alt=""` (the correct value for decorative imagery — a screen reader skips them rather than reading a path). The social icons take a real name from a new `name` field on each `socialMedia` entry.

### 11. Resume button stuck on "Resume downloaded!" — FIXED
`copied` was set to `true` on download and never reset. It's now a `downloaded` flag that reverts after 3 seconds, with the timer cleared on unmount.

### 12. Confetti was always on screen — FIXED
The wrapper was `${copied ? "block" : "block"}` — both branches identical — so the Lottie mounted from first paint with `autoplay: false`, leaving a frozen first frame on the tile. It now mounts only while `downloaded` is true and plays once.

**Follow-up: this fix initially introduced a crash.** Because the confetti now *unmounts* after 3 seconds, it began exercising a `componentWillUnmount` path that the old always-mounted version never reached:

```
TypeError: Cannot read properties of undefined (reading 'forEach')
  Lottie.deRegisterEvents      react-lottie/dist/index.js (186)
  Lottie.componentWillUnmount  react-lottie/dist/index.js (128)
```

`deRegisterEvents` does an unguarded `eventListeners.forEach(...)`. The library declares `eventListeners: []` in `Lottie.defaultProps`, but that default does not survive the `next/dynamic` wrapper the P0 fix introduced, so the prop arrives `undefined`.

Fixed by passing it explicitly — `<Lottie eventListeners={[]} … />`. Worth remembering that the `ssr: false` wrapper and `defaultProps` interact badly; pass props explicitly to dynamically-imported class components rather than relying on their defaults.

---

## P3 — Latent bugs, dead code, hazards

### 13. YouTube id parsing — FIXED
`videoUrl.split('v=')[1]` worked for the 9 current URLs but would break on `youtu.be/…` short links (yielding `/embed/undefined`) and on any URL with trailing params (`&t=30s`, or the `?si=` the modern Share button appends). Replaced with a `getYouTubeId` helper that parses the URL properly and handles `watch?v=`, `youtu.be/`, and `/embed/`, returning `null` on anything unrecognised — in which case the video block is skipped rather than rendering a broken iframe.

### 14. Tailwind classes that generated nothing — FIXED
- `Hero.tsx`: the fourth Spotlight's `top-18 left-90` — neither value exists in the default spacing scale, so both were dropped and it wasn't positioned at all. Replaced with the arbitrary values they clearly meant: `top-[4.5rem] left-[22.5rem]` (18 and 90 on Tailwind's 0.25rem scale).
- `FloatingNav.tsx`: `border-black/.1` → `border-black/10` (invalid opacity syntax).
- `MovingBorders.tsx`: `rounde-[1.75rem]` (typo) and `bg-slate-900/[0.]` (malformed) both **removed rather than corrected** — they currently produce no CSS, so "fixing" the syntax would have *changed* how the cards look. Removing them keeps the current appearance and deletes the dead code.

### 15. Spotlight colors — FIXED (please eyeball this one)
`fill="purple"` and `fill="blue"` land in an SVG `fill` attribute, so they resolved to the *CSS* named colors — `#800080` and `#0000FF` — not the theme's `purple` (`#CBACF9`) or `blue-100` (`#E4ECFF`). Now set to the theme hexes.

**This is the one change that intentionally alters the visual output.** The hero spotlights will read lighter and more lavender. If you preferred the old darker cast, revert those two `fill` values in `components/Hero.tsx` — nothing else depends on them.

### 16. Relative asset paths — FIXED
`gridItems[0].img` was `"usama.png"` and the resume download used `"Usama-XR-resume.pdf"`, both without a leading slash, so both resolved against the current document URL. They worked only because the site is served from `/`; under a sub-path deploy (a GitHub Pages project site, say) the profile image and the resume would both 404. Both now use a leading slash, like every other asset in the codebase.

### 17. Testimonial cards tripled in dev — FIXED
`InfiniteMovingCards` clones its list by hand to make the marquee seamless, from an effect with an empty dep array. React StrictMode (on by default in dev) runs effects twice, and the second pass cloned the clones. Guarded with a `hasCloned` ref. Production was always correct; dev was showing 3× the cards.

### 18. Dead code and config — FIXED
- `app/page.tsx`: removed the unused `FaHome` import and the duplicated commented-out `RecentProjects` import.
- `package.json`: removed `@types/pg` and `@types/mysql` (via `npm uninstall`, so the lockfile is updated). There is no database in this project.
- `next.config.mjs`: removed `images.remotePatterns` for `images.unsplash.com` — inert under `unoptimized: true`, and no Unsplash URL exists anywhere in the codebase.
- `BentoGrid.tsx`: removed the commented-out `handleCopy` block and the now-unused `IoCopyOutline` import.

### 19. `Math.random()` during render — FIXED
`Experience.tsx` rolled each card's border-animation duration in the render body, re-rolling on every re-render. Now rolled once in a `useMemo`.

### 20. `ignoreBuildErrors: true` — FIXED (removed)
The flag meant a type error would sail through `npm run build` and land in a visitor's browser as a runtime crash. The project type-checks clean, so removing it cost nothing — and `npm run build` now genuinely type-checks. It passes.

---

## Deferred by owner

Left untouched on request — these are content decisions, not defects to be guessed at.

### 6. Two projects point at a placeholder link
`data/index.ts` — projects **8** (*VR room*) and **9** (*Spark-AR*) both carry `link: "https://github.com"`. "Try now →" and "Visit Project" on those two cards therefore land on the GitHub homepage rather than the project.

Everything *around* those links is now fixed — they open correctly in a new tab, with `rel="noopener noreferrer"`, and no longer trigger the modal at the same time. So the moment you drop a real URL into those two fields, both cards work with no further code changes.

### 7. Duplicated and mismatched content
Also `data/index.ts`, also untouched:

| Where | What |
|---|---|
| `workExperience` 2 and 3 | Identical `desc`, word for word ("Lead the design and development of an interactable AR mobile app for iOS…") |
| `projects` 3 and 8 | Identical `des`, near-identical titles (*ROOM VR* / *VR room*), though they're different projects with different media |
| `companies` 3 | Named `"stream"`, but the logos are nxtDynamics |
| `companies` 5 | Named `"docker."`, but the logos are Keymech |

One knock-on worth flagging: the `companies` **`name` is used as the logo `alt` text**. So until those two names are corrected, screen readers announce the nxtDynamics logo as "stream" and the Keymech logo as "docker." That's a real accessibility defect, but the fix is to write the right company name — which is yours to decide, not mine to invent.

---

## Not actioned (deliberately)

**Sentry over-configuration.** Under `output: 'export'` there's no server or edge runtime in production, so `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`, and `automaticVercelMonitors` never execute once deployed; only the client config is live. This is inert, not broken, and deleting it would be an annoyance if you ever move off static export — so I left it. `tracesSampleRate: 1` samples 100% of sessions; fine at portfolio traffic, but it's the first setting to turn down if a link ever goes viral.

**The 16 remaining lint warnings** (7 `no-img-element`, 9 `react-hooks/exhaustive-deps`). All are warnings, none are errors. The `exhaustive-deps` ones are concentrated in the vendored Aceternity components — `Globe.tsx` in particular runs setup effects keyed on `[globeRef.current, globeData]`, and "correcting" those deps would re-run three.js scene setup on every render. That's a behavior change dressed up as a lint fix, and it isn't worth the risk to silence a warning. The `<img>` warnings are moot under `unoptimized: true`, which turns `next/image` into a plain `<img>` anyway.
