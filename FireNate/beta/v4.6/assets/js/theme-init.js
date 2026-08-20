/* =========================================================================
   FireNate — early theme applier.
   Loaded as a plain, non-deferred <script> as the very first thing in
   <head>, before any stylesheet, so the saved theme is applied before
   first paint (no flash of the wrong theme). Keep this tiny and dependency
   free — assets/js/theme.js holds the full get/set/toggle API used by the
   rest of the site once the DOM is ready.
   "light" is the implicit default (no attribute) — only non-light themes
   ever need the attribute set, which is also what keeps every existing
   :root[data-theme="dark"] block in every page's own stylesheet working
   untouched as new theme values are added here.
   ========================================================================= */
(function () {
  "use strict";
  try {
    var saved = localStorage.getItem("fn-theme");
    if (saved === "dark" || saved === "neon" || saved === "sunshine") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) {
    /* storage unavailable (private browsing, etc.) — default to light */
  }
})();
