/* =========================================================================
   FireNate — shared site nav + footer injector.
   Each page sets `window.FN_BASE` (relative path back to the site root,
   e.g. "" for /index.html or "../" for /TimeToFI/index.html) and
   `window.FN_PAGE` (this page's id) before loading this script.
   ========================================================================= */
(function () {
  "use strict";

  var BASE = typeof window.FN_BASE === "string" ? window.FN_BASE : "";
  var CURRENT = typeof window.FN_PAGE === "string" ? window.FN_PAGE : "";

  var PAGES = [
    { id: "home", label: "Home", href: BASE + "index.html" },
    { id: "fi-snapshot", label: "FI Snapshot", href: BASE + "FISnapshot/index.html" },
    { id: "net-worth", label: "Net Worth", href: BASE + "NetWorth/index.html" },
    { id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html" },
    { id: "reverse-time-to-fi", label: "Reverse Time to FI", href: BASE + "ReverseTimeToFI/index.html" },
    { id: "compound-interest", label: "Compound Interest", href: BASE + "CompoundInterest-WealthMultiplier/index.html" },
    { id: "crossover-point", label: "Crossover Point", href: BASE + "CrossoverPoint/index.html" },
    { id: "safe-withdrawal-rate", label: "Safe Withdrawal Rate", href: BASE + "SafeWithdrawalRate/index.html" },
    { id: "emergency-fund", label: "Emergency Fund", href: BASE + "EmergencyFund/index.html" },
    { id: "loan-calculator", label: "Loan Calculator", href: BASE + "LoanCalculator/index.html" },
    { id: "payoff-or-invest", label: "Payoff or Invest", href: BASE + "Payoff-or-Invest/index.html" },
    { id: "homes-vs-stocks", label: "Homes vs. Stocks", href: BASE + "RealEstateVsStocks/index.html" },
    { id: "gen-info", label: "Info", href: BASE + "GenInfo/index.html" },
    { id: "files", label: "Files", href: BASE + "Downloads/index.html" }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function currentPageTitle() {
    var match = null;
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].id === CURRENT) { match = PAGES[i]; break; }
    }
    if (match) return match.label;
    // fall back to the <title>, stripped of the "FireNate" branding wherever it
    // sits (leading "FireNate - X" or trailing "X | FireNate"), for pages that
    // aren't in the main nav list (e.g. GenInfo sub-pages)
    var title = (document.title || "")
      .replace(/^FireNate\s*[-—|]\s*/i, "")
      .replace(/\s*[-—|]\s*FireNate$/i, "")
      .trim();
    return title;
  }

  // a rotating set of accent colors so each link in the dropdown gets its
  // own fun highlight instead of every link sharing the same gold
  var LINK_COLORS = ["gold", "jade", "azure", "plum", "rust"];

  function buildNav() {
    var links = PAGES.filter(function (p) { return p.id !== "home"; })
      .map(function (p, i) {
        var active = p.id === CURRENT ? " fn-active" : "";
        var color = LINK_COLORS[(i + 1) % LINK_COLORS.length];
        return '<a href="' + p.href + '" class="fn-nav-link' + active + '" data-c="' + color + '">' + escapeHtml(p.label) + "</a>";
      }).join("");

    var homeActive = CURRENT === "home" ? " fn-active" : "";
    var homeColor = LINK_COLORS[0];
    var pageTitle = currentPageTitle();

    var gearIcon =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="3"></circle>' +
        '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 ' +
          '1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 ' +
          '1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 ' +
          '4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 ' +
          '0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 ' +
          '2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z">' +
        "</path>" +
      "</svg>";

    var settingsPanel =
      '<div class="fn-settings-panel" role="menu" aria-label="Settings">' +
        '<div class="fn-settings-title">Settings</div>' +
        '<div class="fn-settings-row">' +
          '<span class="fn-settings-label">Dark mode</span>' +
          '<button type="button" class="fn-theme-switch" role="switch" aria-checked="false" aria-label="Toggle dark mode">' +
            '<span class="fn-theme-switch-thumb"></span>' +
          "</button>" +
        "</div>" +
        '<div class="fn-settings-divider"></div>' +
        '<div class="fn-settings-row fn-settings-row-stack">' +
          '<span class="fn-settings-label">Reset this device</span>' +
          '<p class="fn-settings-hint">Clears every saved input, your profile, scenarios, and theme &mdash; starts fresh as a new visitor.</p>' +
          '<button type="button" class="fn-reset-all">Clear all local data</button>' +
        "</div>" +
      "</div>";

    var userIcon =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
        '<circle cx="12" cy="7" r="4"></circle>' +
      "</svg>";

    // a bouncing "fill this out" hint shown only for brand-new visitors who
    // haven't entered anything into their profile yet, and haven't already
    // dismissed it by clicking elsewhere
    var onboardHint = "";
    try {
      var onboardDismissed = localStorage.getItem("fn-onboard-dismissed");
      if (!onboardDismissed && window.FNProfile) {
        var existingProfile = window.FNProfile.get();
        var profileKeys = ["birthday", "currentIncome", "currentSavings", "goalAmount", "retireAge", "expectedReturn"];
        var hasProfileData = profileKeys.some(function (k) {
          return existingProfile[k] !== undefined && existingProfile[k] !== null && existingProfile[k] !== "";
        });
        if (!hasProfileData) {
          onboardHint =
            '<span class="fn-onboard-hint" id="fnOnboardHint" role="status">' +
              '<span class="fn-onboard-arrow" aria-hidden="true">&#9650;</span>' +
              '<span class="fn-onboard-bubble">New here? Add your info</span>' +
            "</span>";
        }
      }
    } catch (e) {}

    var profilePanel =
      '<div class="fn-profile-panel" role="menu" aria-label="Your info">' +
        '<div class="fn-settings-title">Your info</div>' +
        '<p class="fn-profile-hint">Saved on this device, and used to pre-fill common fields across calculators.</p>' +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileBirthday">Birthday</label>' +
          '<input type="date" id="fnProfileBirthday">' +
        "</div>" +
        '<div class="fn-profile-field fn-profile-age-row">' +
          '<span>Age</span>' +
          '<span class="fn-profile-age-value" id="fnProfileAgeValue">&mdash;</span>' +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileIncome">Annual Income</label>' +
          '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
            '<input type="text" inputmode="decimal" id="fnProfileIncome" placeholder="0">' +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileSavings">Savings</label>' +
          '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
            '<input type="text" inputmode="decimal" id="fnProfileSavings" placeholder="0">' +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileGoal">Goal Amount (FI Number)</label>' +
          '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
            '<input type="text" inputmode="decimal" id="fnProfileGoal" placeholder="0">' +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileRetireAge">Retirement Age</label>' +
          '<input type="number" id="fnProfileRetireAge" min="1" max="120" step="1" placeholder="62">' +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileReturn">Annual Return Rate</label>' +
          '<div class="fn-profile-inputwrap"><input type="number" id="fnProfileReturn" step="0.1" placeholder="10.0">' +
            '<span class="fn-profile-affix">%</span>' +
          "</div>" +
        "</div>" +
        '<button type="button" class="fn-profile-clear">Clear my info</button>' +
      "</div>";

    return (
      '<div class="fn-nav-inner">' +
        '<a href="' + BASE + 'index.html' + '" class="fn-brand">' +
          '<span class="fn-dot">&#9670;</span>FireNate' +
          '<span class="fn-tag">FI Tools</span>' +
        "</a>" +
        (pageTitle ? '<div class="fn-page-title">' + escapeHtml(pageTitle) + "</div>" : "") +
        '<nav class="fn-links" aria-label="Site">' +
          '<a href="' + BASE + 'index.html' + '" class="fn-nav-link' + homeActive + '" data-c="' + homeColor + '">Home</a>' +
          links +
        "</nav>" +
        '<div class="fn-actions">' +
          '<button type="button" class="fn-profile-toggle" aria-label="Your info" aria-haspopup="true" aria-expanded="false">' +
            userIcon +
            onboardHint +
          "</button>" +
          profilePanel +
          '<button type="button" class="fn-settings-toggle" aria-label="Settings" aria-haspopup="true" aria-expanded="false">' +
            gearIcon +
          "</button>" +
          settingsPanel +
          '<button type="button" class="fn-nav-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>' +
        "</div>" +
      "</div>"
    );
  }

  async function renderFooter() {
    try {
      const response = await fetch(BASE + 'assets/html/footer.html');
      if (!response.ok) throw new Error('Could not fetch footer template');

      const htmlText = await response.text();
      const footerContainer = document.getElementById('site-footer');
      if (!footerContainer) return;

      footerContainer.innerHTML = htmlText;

      const yearSpan = footerContainer.querySelector('#footer-year');
      if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    } catch (error) {
      console.error('Error rendering footer:', error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }

  function init() {
    var navHost = document.getElementById("fn-site-nav");

    if (navHost) {
      navHost.innerHTML = buildNav();

      // backfill retireAge/expectedReturn defaults on load too, not just
      // reactively when a field changes in this panel — a profile set up
      // (birthday/income/savings/goal) before these two fields existed, or
      // in a session that never opened "Your info" since, would otherwise
      // permanently lack them, and every other page's own reset-to-profile
      // logic (e.g. Time to FI's "Reset to defaults") correctly skips a
      // field it finds genuinely unset. Gated on the profile already having
      // OTHER real data so a truly blank new-visitor profile is left alone
      // (this also runs before onboardHint's own "is this a new user?"
      // check further down, so it must not fire for a real first-time visit).
      (function backfillDefaultsIfEngaged() {
        if (!window.FNProfile) return;
        var profile = window.FNProfile.get();
        var otherKeys = ["birthday", "currentIncome", "currentSavings", "goalAmount"];
        var hasOtherData = otherKeys.some(function (k) {
          return profile[k] !== undefined && profile[k] !== null && profile[k] !== "";
        });
        if (!hasOtherData) return;
        var patch = {};
        if (profile.retireAge === undefined || profile.retireAge === null || profile.retireAge === "") patch.retireAge = 62;
        if (profile.expectedReturn === undefined || profile.expectedReturn === null || profile.expectedReturn === "") patch.expectedReturn = 10;
        if (Object.keys(patch).length) window.FNProfile.set(patch);
      })();

      var toggle = navHost.querySelector(".fn-nav-toggle");
      var settingsToggle = navHost.querySelector(".fn-settings-toggle");
      var themeSwitch = navHost.querySelector(".fn-theme-switch");
      var profileToggle = navHost.querySelector(".fn-profile-toggle");

      // dismiss the "New here?" onboarding hint on the very next click
      // anywhere on the page (including the profile icon itself — clicking
      // it to open the panel counts as engaging with the hint)
      var onboardHint = document.getElementById("fnOnboardHint");
      if (onboardHint) {
        document.addEventListener("click", function dismissOnboardHint() {
          var hint = document.getElementById("fnOnboardHint");
          if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
          try { localStorage.setItem("fn-onboard-dismissed", "1"); } catch (e) {}
        }, { once: true });
      }

      function closeAllPanels() {
        navHost.classList.remove("fn-open", "fn-settings-open", "fn-profile-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
        if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
      }

      if (toggle) {
        toggle.addEventListener("click", function () {
          var open = navHost.classList.toggle("fn-open");
          navHost.classList.remove("fn-settings-open", "fn-profile-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
        });
        navHost.querySelectorAll(".fn-links a").forEach(function (a) {
          a.addEventListener("click", function () {
            navHost.classList.remove("fn-open");
            toggle.setAttribute("aria-expanded", "false");
          });
        });
      }

      if (settingsToggle) {
        settingsToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = navHost.classList.toggle("fn-settings-open");
          navHost.classList.remove("fn-open", "fn-profile-open");
          settingsToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
        });
      }

      if (profileToggle) {
        profileToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = navHost.classList.toggle("fn-profile-open");
          navHost.classList.remove("fn-open", "fn-settings-open");
          profileToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (open) syncProfileFields();
        });
      }

      document.addEventListener("click", function (e) {
        if (!navHost.contains(e.target)) closeAllPanels();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeAllPanels();
      });

      function syncThemeSwitch() {
        if (!themeSwitch || !window.FNTheme) return;
        themeSwitch.setAttribute("aria-checked", window.FNTheme.get() === "dark" ? "true" : "false");
      }
      syncThemeSwitch();

      if (themeSwitch) {
        themeSwitch.addEventListener("click", function () {
          if (window.FNTheme) {
            window.FNTheme.toggle();
            syncThemeSwitch();
          }
        });
      }
      document.addEventListener("fn-theme-change", syncThemeSwitch);

      // ---------- RESET THIS DEVICE ----------
      var resetAllBtn = navHost.querySelector(".fn-reset-all");
      if (resetAllBtn) {
        resetAllBtn.addEventListener("click", function (e) {
          // don't let this bubble to the document-level "dismiss onboarding
          // hint" listener — it would re-write fn-onboard-dismissed right
          // after we clear it, defeating the "clean slate" reset below
          e.stopPropagation();

          var confirmed = window.confirm(
            "Clear all saved data on this device?\n\n" +
            "This wipes every calculator's saved inputs, your profile, saved scenarios, and theme preference. " +
            "You'll start over as a brand-new visitor. This can't be undone."
          );
          if (!confirmed) return;

          try { localStorage.clear(); } catch (e) {}
          try { sessionStorage.clear(); } catch (e) {}
          try {
            document.cookie.split(";").forEach(function (c) {
              var eqPos = c.indexOf("=");
              var name = (eqPos > -1 ? c.substr(0, eqPos) : c).trim();
              if (!name) return;
              document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
              document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=" + window.location.pathname;
            });
          } catch (e) {}

          window.location.reload();
        });
      }

      // ---------- USER PROFILE ----------
      var birthdayInput = navHost.querySelector("#fnProfileBirthday");
      var ageValue = navHost.querySelector("#fnProfileAgeValue");
      var incomeInput = navHost.querySelector("#fnProfileIncome");
      var savingsInput = navHost.querySelector("#fnProfileSavings");
      var goalInput = navHost.querySelector("#fnProfileGoal");
      var retireAgeInput = navHost.querySelector("#fnProfileRetireAge");
      var returnInput = navHost.querySelector("#fnProfileReturn");
      var clearBtn = navHost.querySelector(".fn-profile-clear");

      function numOrEmpty(v) {
        if (v === null || v === undefined) return "";
        return v;
      }
      // like numOrEmpty, but falls back to a default display value instead
      // of blank when the user hasn't set anything of their own yet
      function numOrDefault(v, fallback) {
        if (v === null || v === undefined || v === "") return fallback;
        return v;
      }

      // once someone starts filling out ANY part of their profile, actually
      // write the retireAge/expectedReturn defaults into storage (not just
      // display them) — other pages like FI Snapshot read window.FNProfile
      // directly and have no idea about nav.js's display-only fallback, so
      // without this their calculations silently treat those fields as unset
      function ensureProfileDefaults() {
        if (!window.FNProfile) return;
        var profile = window.FNProfile.get();
        var patch = {};
        if (profile.retireAge === undefined || profile.retireAge === null || profile.retireAge === "") {
          patch.retireAge = 62;
        }
        if (profile.expectedReturn === undefined || profile.expectedReturn === null || profile.expectedReturn === "") {
          patch.expectedReturn = 10;
        }
        if (Object.keys(patch).length) window.FNProfile.set(patch);
      }

      // currency fields (income/savings/goal) display with commas + up to 2
      // decimals, matching every calculator page's own $ inputs
      function currencyOrEmpty(v) {
        if (v === null || v === undefined || v === "") return "";
        var n = typeof v === "number" ? v : parseFloat(v);
        return isNaN(n) ? "" : n.toLocaleString("en-US", { maximumFractionDigits: 2 });
      }
      function parseCurrencyValue(str) {
        var n = parseFloat(String(str).replace(/,/g, ""));
        return isNaN(n) ? null : n;
      }
      function sanitizeCurrencyInput(el) {
        var before = el.value;
        var cursorFromEnd = before.length - (el.selectionStart == null ? before.length : el.selectionStart);
        var cleaned = before.replace(/[^0-9.,]/g, "");
        var parts = cleaned.split(".");
        if (parts.length > 2) cleaned = parts[0] + "." + parts.slice(1).join("");
        if (cleaned !== before) {
          el.value = cleaned;
          var newPos = Math.max(0, cleaned.length - cursorFromEnd);
          el.setSelectionRange(newPos, newPos);
        }
      }
      function wireCurrencyField(input, profileKey) {
        if (!input) return;
        input.addEventListener("input", function () {
          sanitizeCurrencyInput(input);
          var n = parseCurrencyValue(input.value);
          var patch = {};
          patch[profileKey] = n === null ? "" : n;
          window.FNProfile.set(patch);
        });
        input.addEventListener("blur", function () {
          input.value = currencyOrEmpty(parseCurrencyValue(input.value));
          ensureProfileDefaults();
        });
      }

      function syncProfileFields() {
        if (!window.FNProfile) return;
        var profile = window.FNProfile.get();
        // skip whichever field the user is actively typing in — wireCurrencyField's
        // own "input" listener calls FNProfile.set(), which fires fn-profile-change
        // and would otherwise re-run this on every keystroke, jamming full comma
        // formatting into the field (and the cursor) mid-type
        var active = document.activeElement;
        if (birthdayInput && active !== birthdayInput) birthdayInput.value = numOrEmpty(profile.birthday);
        if (incomeInput && active !== incomeInput) incomeInput.value = currencyOrEmpty(profile.currentIncome);
        if (savingsInput && active !== savingsInput) savingsInput.value = currencyOrEmpty(profile.currentSavings);
        if (goalInput && active !== goalInput) goalInput.value = currencyOrEmpty(profile.goalAmount);
        if (retireAgeInput && active !== retireAgeInput) retireAgeInput.value = numOrDefault(profile.retireAge, 62);
        if (returnInput && active !== returnInput) returnInput.value = numOrDefault(profile.expectedReturn, 10);
        if (ageValue) {
          var age = window.FNProfile.getAge(profile);
          ageValue.textContent = age === null ? "—" : age;
        }
      }
      syncProfileFields();

      if (birthdayInput) {
        // "input" (not "change") on purpose — native date inputs only fire
        // "change" reliably once focus fully leaves the field, which doesn't
        // happen consistently across browsers when someone types the date
        // via keyboard instead of using the picker. "input" fires as soon as
        // the typed value becomes a complete, valid date (it stays "" while
        // any segment is still incomplete, so partial typing is harmless).
        // ReverseTimeToFI's own birthday field already uses this same fix.
        birthdayInput.addEventListener("input", function () {
          if (!birthdayInput.value) return; // still mid-type, incomplete date
          window.FNProfile.set({ birthday: birthdayInput.value });
          ensureProfileDefaults();
          syncProfileFields();
        });
      }
      wireCurrencyField(incomeInput, "currentIncome");
      wireCurrencyField(savingsInput, "currentSavings");
      wireCurrencyField(goalInput, "goalAmount");
      if (retireAgeInput) {
        retireAgeInput.addEventListener("change", function () {
          var n = parseFloat(retireAgeInput.value);
          window.FNProfile.set({ retireAge: isNaN(n) ? "" : n });
          ensureProfileDefaults();
        });
      }
      if (returnInput) {
        returnInput.addEventListener("change", function () {
          var n = parseFloat(returnInput.value);
          window.FNProfile.set({ expectedReturn: isNaN(n) ? "" : n });
          ensureProfileDefaults();
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          if (window.FNProfile) window.FNProfile.clear();
          syncProfileFields();
        });
      }
      document.addEventListener("fn-profile-change", syncProfileFields);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
