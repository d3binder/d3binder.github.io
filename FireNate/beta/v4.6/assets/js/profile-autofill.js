/* =========================================================================
   FireNate — profile autofill.
   Each page declares window.FN_PROFILE_FIELDS, mapping profile keys
   ("birthday", "currentAge", "currentIncome", "currentSavings", "goalAmount",
   "retireAge", "expectedReturn") to CSS selectors for that page's own inputs.
   If window.FN_PROFILE_LEGACY_KEY is set and that page already has its own
   saved state under that key, the profile is left alone on initial load so a
   returning visitor's own edits aren't overwritten.

   Runs deferred, after each page's own inline calculator script has already
   loaded and rendered its defaults.

   Exposed as window.FNProfileAutofill.apply(force) so a page's own
   "reset to defaults" button can re-run it after resetting its fields to
   their hardcoded defaults — call apply(true) to skip the legacy-state check
   (the user explicitly asked to reset, so profile values should win even if
   that page had already re-saved its own state moments earlier).
   ========================================================================= */
(function () {
  "use strict";

  function fireEvents(el) {
    ["input", "change", "blur"].forEach(function (type) {
      try {
        el.dispatchEvent(new Event(type, { bubbles: true }));
      } catch (e) {
        /* a page's own listener may throw (e.g. a blocked third-party
           script); don't let that stop the remaining profile fields
           from being applied */
      }
    });
  }

  function apply(force) {
    if (!window.FNProfile || !window.FN_PROFILE_FIELDS) return;

    var legacyKey = window.FN_PROFILE_LEGACY_KEY;
    if (legacyKey && !force) {
      try {
        if (localStorage.getItem(legacyKey)) return;
      } catch (e) {}
    }

    var fields = window.FN_PROFILE_FIELDS;
    var profile = window.FNProfile.get();
    var age = window.FNProfile.getAge(profile);

    Object.keys(fields).forEach(function (key) {
      var value = key === "currentAge" ? age : profile[key];
      if (value === null || value === undefined || value === "") return;

      var selector = fields[key];
      document.querySelectorAll(selector).forEach(function (el) {
        el.value = value;
        fireEvents(el);
      });
    });
  }

  window.FNProfileAutofill = { apply: apply };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(false); });
  } else {
    apply(false);
  }
})();
