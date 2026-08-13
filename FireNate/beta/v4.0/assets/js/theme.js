/* =========================================================================
   FireNate — shared theme controller (dark / light).
   Exposes window.FNTheme = { get, set, toggle }. Persists the choice in
   localStorage under "fn-theme" and toggles a data-theme="dark" attribute
   on <html>, which every page's stylesheet keys its dark-mode colors off
   of. assets/js/theme-init.js applies the saved choice before first paint;
   this file is the API other scripts (assets/js/nav.js) use to read and
   change it after the DOM is ready.
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "fn-theme";

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function setTheme(theme) {
    var next = theme === "dark" ? "dark" : "light";
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* storage unavailable — theme still applies for this page view */
    }
    document.dispatchEvent(new CustomEvent("fn-theme-change", { detail: { theme: next } }));
    return next;
  }

  function toggleTheme() {
    return setTheme(getTheme() === "dark" ? "light" : "dark");
  }

  window.FNTheme = { get: getTheme, set: setTheme, toggle: toggleTheme };
})();
