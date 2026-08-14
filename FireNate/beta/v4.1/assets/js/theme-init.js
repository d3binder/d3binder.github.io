/* =========================================================================
   FireNate — early theme applier.
   Loaded as a plain, non-deferred <script> as the very first thing in
   <head>, before any stylesheet, so the saved theme is applied before
   first paint (no flash of the wrong theme). Keep this tiny and dependency
   free — assets/js/theme.js holds the full get/set/toggle API used by the
   rest of the site once the DOM is ready.
   ========================================================================= */
(function () {
  "use strict";
  try {
    if (localStorage.getItem("fn-theme") === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {
    /* storage unavailable (private browsing, etc.) — default to light */
  }
})();
