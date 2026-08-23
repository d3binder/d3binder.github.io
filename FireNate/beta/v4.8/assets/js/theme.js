/* =========================================================================
   FireNate — shared theme controller (light / dark / neon).
   Exposes window.FNTheme = { get, set, toggle, THEMES }. Persists the
   choice in localStorage under "fn-theme" and sets a data-theme="dark"
   or data-theme="neon" attribute on <html> (light stays attribute-less,
   the original convention, so every page's existing
   :root[data-theme="dark"] block keeps working untouched). Every page's
   stylesheet keys its non-light colors off that attribute.
   assets/js/theme-init.js applies the saved choice before first paint;
   this file is the API other scripts (assets/js/nav.js) use to read and
   change it after the DOM is ready.
   To add a future theme: add its name to THEMES below, give
   theme-init.js's saved-value check the same name, and add a matching
   :root[data-theme="yourtheme"] block to the shared stylesheets.
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "fn-theme";
  var THEMES = ["light", "dark", "neon", "sunshine", "lcars"];

  function getTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    return THEMES.indexOf(current) !== -1 ? current : "light";
  }

  function setTheme(theme) {
    var next = THEMES.indexOf(theme) !== -1 ? theme : "light";
    if (next === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", next);
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* storage unavailable — theme still applies for this page view */
    }
    document.dispatchEvent(new CustomEvent("fn-theme-change", { detail: { theme: next } }));
    return next;
  }

  // cycles through THEMES in order — kept for any old caller still using
  // a single toggle instead of the Settings panel's explicit selector
  function toggleTheme() {
    var next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
    return setTheme(next);
  }

  window.FNTheme = { get: getTheme, set: setTheme, toggle: toggleTheme, THEMES: THEMES };
})();
