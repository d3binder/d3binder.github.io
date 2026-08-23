/* =========================================================================
   FireNate — early theme applier.
   Loaded as a plain, non-deferred <script> as the very first thing in
   <head>, before any stylesheet, so the saved theme is applied before
   first paint (no flash of the wrong theme). Keep this tiny and dependency
   free — assets/js/theme.js holds the full get/set/toggle/system API used
   by the rest of the site once the DOM is ready.
   "light" stays the implicit no-attribute state (so every existing
   :root[data-theme="dark"] block in every page's own stylesheet keeps
   working untouched) — but it is no longer the site's default for
   first-time visitors. The site's default preference is "system": with
   nothing saved yet (or "fn-theme" explicitly set to "system"), we check
   prefers-color-scheme and set data-theme="sunshine" for a light device,
   "neon" for a dark one, instead of leaving the attribute off. A visitor
   who has actively picked "light" still gets the attribute-less state,
   since "fn-theme" is only ever missing/"system" before a concrete choice
   is made.
   ========================================================================= */
(function () {
  "use strict";
  function resolveSystemTheme() {
    try {
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "neon" : "sunshine";
    } catch (e) {
      return "sunshine";
    }
  }
  try {
    var saved = localStorage.getItem("fn-theme");
    if (saved === "dark" || saved === "neon" || saved === "sunshine" || saved === "lcars") {
      document.documentElement.setAttribute("data-theme", saved);
    } else if (saved === "light") {
      /* attribute-less — no-op */
    } else {
      /* "system", or nothing saved yet — resolve against the device */
      document.documentElement.setAttribute("data-theme", resolveSystemTheme());
    }
  } catch (e) {
    /* storage unavailable (private browsing, etc.) — still honor the
       device's light/dark setting rather than hardcoding one */
    document.documentElement.setAttribute("data-theme", resolveSystemTheme());
  }
})();
