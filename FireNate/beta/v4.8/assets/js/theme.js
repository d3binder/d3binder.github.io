/* =========================================================================
   FireNate — shared theme controller (light / dark / neon / sunshine /
   lcars / system).
   Exposes window.FNTheme = { get, getPreference, set, toggle, THEMES,
   resolveSystemTheme }. Persists the visitor's *preference* in
   localStorage under "fn-theme" — either a concrete theme name, or
   "system" (also the default when nothing is saved yet) — and sets a
   data-theme="..." attribute on <html> to whichever concrete theme is
   actually showing (light stays attribute-less, the original convention,
   so every page's existing :root[data-theme="dark"] block keeps working
   untouched). Every page's stylesheet keys its non-light colors off that
   attribute; CSS never sees "system" itself.
   "system" resolves via prefers-color-scheme: light → Sunshine, dark →
   Neon (see resolveSystemTheme below) — chosen as the closest-in-spirit
   pair, not a literal light/dark match, since the site has no plain
   "auto-dark" theme of its own.
   assets/js/theme-init.js applies the saved (or resolved-system) choice
   before first paint; this file is the API other scripts (assets/js/
   nav.js) use to read and change it after the DOM is ready, and also
   keeps the applied theme live-synced to the OS setting while a page is
   open, for visitors whose preference is "system".
   To add a future theme: add its name to THEMES below, give
   theme-init.js's saved-value check the same name, and add a matching
   :root[data-theme="yourtheme"] block to the shared stylesheets.
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "fn-theme";
  var THEMES = ["light", "dark", "neon", "sunshine", "lcars"];
  var PREFERENCES = THEMES.concat(["system"]);
  var SYSTEM_LIGHT_THEME = "sunshine";
  var SYSTEM_DARK_THEME = "neon";

  function systemPrefersDark() {
    try {
      return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch (e) {
      return false;
    }
  }

  function resolveSystemTheme() {
    return systemPrefersDark() ? SYSTEM_DARK_THEME : SYSTEM_LIGHT_THEME;
  }

  // the visitor's raw stored preference — a concrete theme name, or
  // "system" (also the fallback for a first-time visitor with nothing
  // saved yet, so "system" is the site's effective default)
  function getPreference() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return stored && PREFERENCES.indexOf(stored) !== -1 ? stored : "system";
  }

  // the theme actually applied right now (always a concrete name, never
  // "system") — reads the live data-theme attribute rather than
  // re-resolving, so it reflects whatever theme-init.js/setTheme last set
  function getTheme() {
    var current = document.documentElement.getAttribute("data-theme");
    return THEMES.indexOf(current) !== -1 ? current : "light";
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  function setTheme(pref) {
    var next = PREFERENCES.indexOf(pref) !== -1 ? pref : "system";
    var applied = next === "system" ? resolveSystemTheme() : next;
    applyTheme(applied);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* storage unavailable — theme still applies for this page view */
    }
    document.dispatchEvent(new CustomEvent("fn-theme-change", { detail: { theme: applied, preference: next } }));
    return applied;
  }

  // cycles through concrete THEMES in order — kept for any old caller
  // still using a single toggle instead of the Settings panel's explicit
  // selector; stepping through here always lands on a concrete choice,
  // never "system"
  function toggleTheme() {
    var next = THEMES[(THEMES.indexOf(getTheme()) + 1) % THEMES.length];
    return setTheme(next);
  }

  // keeps the applied theme following the OS/browser setting live, for
  // any visitor whose preference is "system" and leaves the tab open
  // while their device's light/dark setting changes
  try {
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (getPreference() !== "system") return;
        applyTheme(resolveSystemTheme());
        document.dispatchEvent(new CustomEvent("fn-theme-change", { detail: { theme: getTheme(), preference: "system" } }));
      });
    }
  } catch (e) {
    /* matchMedia change listener unavailable — system preference still
       resolves correctly on the next full page load */
  }

  window.FNTheme = {
    get: getTheme,
    getPreference: getPreference,
    set: setTheme,
    toggle: toggleTheme,
    THEMES: THEMES,
    resolveSystemTheme: resolveSystemTheme
  };
})();
