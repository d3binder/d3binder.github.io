# FireNate — architecture notes for future sessions

A static, no-build-step, multi-page site of FIRE/financial-independence
calculators. No bundler, no npm, no server-side code — every page is plain
HTML/CSS/JS served as-is. Keep it that way; don't introduce a build step.

## Adding a new calculator page

1. Copy the closest existing page as a starting point (`Payoff-or-Invest/`
   or `CashOutOrHold/` are good recent examples of the expected shape).
2. In `<head>`, set `window.FN_BASE = "../"` and `window.FN_PAGE = "your-id"`
   before loading `nav.js` — this drives active-link highlighting, the page
   title in the nav, and BASE-relative asset paths.
3. Register the page in `assets/js/nav.js`:
   - `PAGES` array — `{ id, label, href: BASE + "...", group }`. `group`
     controls which section it appears under in the hamburger menu.
   - The icon SVG map (search for `pageIcon(`).
   - `window.FN_PAGE_DATA_KEYS` / `FN_PAGE_DATA_LABELS` — the page's own
     localStorage key(s), so Profile Manager's snapshot/export/import
     system picks up its inputs. Skip this only for pages with no saved
     inputs (informational pages).
4. Add a `.hp-card` to the right section of `index.html` (the homepage).
5. If the page should auto-fill from the shared profile (age, income,
   savings, etc.), set `window.FN_PROFILE_FIELDS = { profileKey: "#fieldId" }`
   before `profile-autofill.js` loads — see `assets/js/profile-autofill.js`
   for the full list of profile keys it understands.
6. Add the `?` field-help button and `window.FN_FIELD_HELP` content — see
   "Field help" below.
7. If it uses the sticky collapsible input toolbar, see "Toolbar" below.

Non-calculator pages (informational or interactive, no numeric inputs of
their own — e.g. `GettingStarted/`, `GettingStartedCalculators/`) follow
the same steps 1-4 above (template off an existing simple page, register in
`nav.js`'s `PAGES`/icon map, add a homepage card) but skip steps 5-7
entirely: no `FN_PROFILE_FIELDS`, no `FN_FIELD_HELP`/`?` button, no
toolbar. `GettingStartedCalculators/` (a branching quiz that recommends
calculators based on a few plain-language questions) is the reference
example — plain `<button>`-driven question/answer state in an inline
`<script>`, no build step, same as everywhere else on the site.

## Themes

Five themes: `light` (default, no `data-theme` attribute — this preserves
old CSS written before other themes existed), `dark`, `neon`, `sunshine`,
`lcars`. `assets/js/theme.js` exposes `window.FNTheme = { get, set, toggle,
THEMES }` and sets `data-theme` on `<html>`; `theme-init.js` applies the
saved theme before first paint (load it synchronously, first thing in
`<head>`, to avoid a flash of the wrong theme).

`lcars` is deliberately flat and opaque — solid black, bold accent-color
blocks, no `backdrop-filter`/blur/translucency anywhere, unlike neon and
sunshine. That's not just an aesthetic choice: it means `lcars` sidesteps
the whole "`backdrop-filter` breaks `position:fixed` chart tooltips" bug
class below (nothing to break, since it never uses `backdrop-filter`) — a
new theme in that same flat style needs none of the `.chart-card`
exclusions or per-tooltip dim-text fixes that neon/sunshine required.

LCARS's signature move is the **swept-corner rail**: a solid-color block
(a `::before` pseudo-element, `position:absolute; top:0; left:0; bottom:0;
width:12–14px`, on a `position:relative; overflow:hidden` panel) standing
in for the other themes' thin top-accent border, with a large border-radius
(26–32px) on just one corner of both the rail and its parent panel. Use a
pseudo-element, not a plain CSS `border`, or the swept corner renders as a
thin curved outline instead of a solid filled block. A rail on the left
edge can only sweep the panel's top-left or bottom-left corner (the corners
it actually touches) — alternate between the two across adjacent panels so
the page doesn't read as four copies of one card shape. This pattern is
applied via `assets/css/site.css` (nav/footer chrome), `assets/css/
index.css` (homepage cards), `assets/css/timeToFI.css` (the shared
`.ledger`/`.status`/`.chart-card`/`.table-card` shell), and per-page in
CashOutOrHold and Payoff-or-Invest's own local panel classes — extend the
same treatment when adding LCARS support to a new page's own cards.

Each page defines its own color variables in a `:root{}` block plus
`:root[data-theme="dark"]{}` / `="neon"` / `="sunshine"` override blocks for
the same variable names. `assets/css/site.css` and `assets/css/timeToFI.css`
do the same for the shared nav chrome and the ~26 pages built on the shared
calculator shell, respectively.

Known gotchas, already fixed once — don't reintroduce them:
- **Gradient-border trick** (two stacked `background-image` layers: an
  opaque interior + a gradient border) breaks if the interior fill is too
  translucent. Give that element its own more-opaque color instead of
  reusing a shared translucent panel variable.
- **Two `position: sticky` elements both with `backdrop-filter: blur()`**
  can hang the renderer during scroll (seen with the nav bar + homepage's
  sticky quicklinks bar). Use a near-opaque flat background instead of blur
  on sticky elements.
- **`backdrop-filter` on an ancestor of a `position: fixed` element**
  breaks that fixed element's positioning (it creates a new containing
  block). This bit chart hover-tooltips nested inside blurred `.chart-card`
  elements — `.chart-card` is deliberately excluded from the neon/sunshine
  blur treatment in `timeToFI.css` for this reason, even though its
  siblings (`.ledger`, `.status`, `.table-card`) do get blurred.

## The sticky collapsible input toolbar

Used by ~15 calculator pages (TimeToFI, CoastFire, CrossoverPoint,
EmergencyFund, FireMilestones, HealthcareBridge, MonteCarlo, RMD,
RothLadder, RentVsBuy, SafeWithdrawalRate, SocialSecurityBridge,
VariableWithdrawalRate, CarBuying). Each page keeps its own class prefix
(`.ti-`, `.cf-`, `.cx-`, ...) in its markup, but the actual CSS lives once
in `assets/css/toolbar.css`, which lists every prefix together on shared
rules. **When adding a new page to this family, add its prefix to every
rule in `toolbar.css` rather than writing a new inline block** — that's
the whole point of having pulled it out.

A page whose toolbar needs to differ from the shared defaults overrides one
of three CSS variables in its own `<style>` block instead of redeclaring a
rule: `--toolbar-input-width`, `--toolbar-narrow-width`,
`--toolbar-content-max-height`. A page with something genuinely extra (a
`<select>`, an extra button — see HealthcareBridge, MonteCarlo,
VariableWithdrawalRate, RentVsBuy) keeps that bit of CSS inline, since it
doesn't apply anywhere else.

The same 14 pages also share `assets/js/calc-utils.js` (currently just
`parseCurrency(id)` — reads a field by id, strips comma separators, returns
a number). It's a plain global function (no module, no IIFE) loaded via a
non-deferred `<script>` tag placed right before the page's own calculator
`<script>`, so it's guaranteed to exist by the time that script runs.

## Field help (`?` button)

Every calculator page has a small `?` button (class `fn-help-btn`) that
opens a modal explaining its inputs. The button markup and its placement
are page-specific (usually the toolbar's summary row, or near the input
section's heading) — there's no single shared insertion point. The modal
itself is entirely driven by `assets/js/field-help.js` + `assets/css/
site.css`, reading `window.FN_FIELD_HELP` from the page:

```js
window.FN_FIELD_HELP = {
  title: "About this Tool",          // optional, defaults to this
  intro: "One or two sentences.",    // optional
  sections: [
    { heading: "Group name", items: [   // heading optional
      { label: "Field name", text: "What it means, how it's used." }
    ]}
  ]
};
```

The modal is styled with the shared `--fn-*` variables from `site.css`
(the same "always-dark chrome over any page theme" tokens the nav uses),
so it needs zero per-page theme CSS — new pages get correct theming for
free just by defining `FN_FIELD_HELP`.

## Shared JS load order

Every page loads, in this order: `theme-init.js` (sync, before `<meta
viewport>`) → page CSS → `theme.js`, `user-profile.js`, `nav.js`,
`profile-autofill.js` (all `defer`) → the page's own `window.FN_BASE` /
`FN_PAGE` / `FN_FIELD_HELP` inline script → (calculator pages only)
`calc-utils.js` (non-deferred) immediately before the page's own
calculator `<script>` at the bottom of `<body>`.

- `window.FNTheme` — theme.js (see Themes above)
- `window.FNProfile = { get, set, clear, getAge }` — user-profile.js;
  the shared "Your info" profile, persisted to localStorage
- `window.FN_PAGE_DATA_KEYS` / `FN_PAGE_DATA_LABELS` — nav.js; drives
  Profile Manager's snapshot/export/import
- `parseCurrency(id)` — calc-utils.js, toolbar-family pages only

## Glossary tooltips

Opt-in, unrelated to field help. Wrap a term in body copy with
`<span class="fn-term" data-term="coast-fire">Coast FIRE</span>` and load
`assets/js/glossary-data.js` + `assets/js/glossary-tooltip.js` — it turns
matching spans into click-activated popovers sourced from
`window.FN_GLOSSARY`. Currently used on GettingStarted, FireMilestones,
and HealthcareBridge.

## Testing

`tests/index.html` (`noindex`, not linked from nav — dev tool only) loads
individual calculator pages in hidden iframes and calls their own exposed
pure functions with known inputs. Coverage is currently thin — only
DebtSnowball, SafeWithdrawalRate/VariableWithdrawalRate (cross-checked
against each other), and TimeToFI have tests. When you add a calculation
that's easy to get subtly wrong (rollover logic, compounding order, tax
math), consider adding a case here rather than only manually verifying.

## Service worker

`sw.js` caches an app-shell for offline use, keyed by `CACHE_NAME`. Bump
this string on every version bump (e.g. `firenate-v4.6` → `firenate-v4.7`)
— other site versions (v4.5, v4.4, ...) live under the same origin, and an
unbumped cache name collides with theirs.

## Footer version string

`assets/html/footer.html`'s copyright line ends in a hardcoded version
string (e.g. "FireNate v4.7") — since multiple versions of the live site
coexist under the same origin, this is how someone can tell which one
they're looking at from a bookmark or shared link, without going back to
the version picker. Update it by hand on every version bump, same as the
service worker's `CACHE_NAME` — deliberately not derived from the URL, to
keep it as simple and hard-to-silently-break as everything else here.

## Version picker

`/Volumes/Public/Web/FireNate/index.html` (one level above this folder) is
the "choose a site version" landing page. When cutting a new version:
mark the new folder's card `is-active is-live-green` with a "✔ Current"
pill, demote the previous current version to `is-active is-live-orange`
with a "View" pill (matching how older versions are already shown), and
update the footer's "Page Last Updated" date.
