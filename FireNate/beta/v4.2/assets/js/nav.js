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
    { id: "getting-started", label: "Getting Started", href: BASE + "GettingStarted/index.html" },
    { id: "fi-snapshot", label: "FI Snapshot", href: BASE + "FISnapshot/index.html" },
    { id: "fire-milestones", label: "FIRE Milestones", href: BASE + "FireMilestones/index.html" },
    { id: "ss-bridge", label: "SS & Pension Bridge", href: BASE + "SocialSecurityBridge/index.html" },
    { id: "roth-ladder", label: "Roth Conversion Ladder", href: BASE + "RothLadder/index.html" },
    { id: "net-worth", label: "Net Worth", href: BASE + "NetWorth/index.html" },
    { id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html" },
    { id: "reverse-time-to-fi", label: "Reverse Time to FI", href: BASE + "ReverseTimeToFI/index.html" },
    { id: "compound-interest", label: "Compound Interest", href: BASE + "CompoundInterest-WealthMultiplier/index.html" },
    { id: "crossover-point", label: "Crossover Point", href: BASE + "CrossoverPoint/index.html" },
    { id: "safe-withdrawal-rate", label: "Safe Withdrawal Rate", href: BASE + "SafeWithdrawalRate/index.html" },
    { id: "variable-withdrawal", label: "Withdrawal Guardrails & Buffer", href: BASE + "VariableWithdrawalRate/index.html" },
    { id: "emergency-fund", label: "Emergency Fund", href: BASE + "EmergencyFund/index.html" },
    { id: "loan-calculator", label: "Loan Calculator", href: BASE + "LoanCalculator/index.html" },
    { id: "payoff-or-invest", label: "Payoff or Invest", href: BASE + "Payoff-or-Invest/index.html" },
    { id: "car-buying", label: "Car Buying", href: BASE + "CarBuying/index.html" },
    { id: "homes-vs-stocks", label: "Homes vs. Stocks", href: BASE + "RealEstateVsStocks/index.html" },
    { id: "gen-info", label: "Info", href: BASE + "GenInfo/index.html" },
    { id: "files", label: "Files", href: BASE + "Downloads/index.html" },
    { id: "profile-manager", label: "Profile Manager", href: BASE + "ProfileManager/index.html" }
  ];

  // localStorage keys that hold each individual calculator's own saved
  // inputs, on top of the 6 shared profile fields — snapshots/backups/
  // exports capture these too, so loading a saved profile restores a
  // user's full site state, not just what's in "Your info". Exposed as a
  // global (rather than kept private to this IIFE) so ProfileManager's own
  // script — a separate scope — can read the same list.
  window.FN_PAGE_DATA_KEYS = [
    "fi-runway-inputs",           // TimeToFI
    "payoffOrInvestInputs",       // Payoff-or-Invest
    "emergencyFundInputs",        // EmergencyFund
    "crossoverPointInputs",       // CrossoverPoint
    "swrInputs",                  // SafeWithdrawalRate
    "firenate_fi_calculator_v1",  // ReverseTimeToFI
    "carBuyingInputs",            // CarBuying
    "fireMilestonesInputs",       // FireMilestones
    "ssBridgeInputs",             // SocialSecurityBridge
    "rothLadderInputs",           // RothLadder
    "variableWithdrawalInputs"    // VariableWithdrawalRate
  ];

  // friendly page name for each key above — same labels used in the nav
  // menu itself — so a saved-profile summary can list which calculators a
  // snapshot actually has data for, not just an unlabeled count
  window.FN_PAGE_DATA_LABELS = {
    "fi-runway-inputs": "Time to FI",
    "payoffOrInvestInputs": "Payoff or Invest",
    "emergencyFundInputs": "Emergency Fund",
    "crossoverPointInputs": "Crossover Point",
    "swrInputs": "Safe Withdrawal Rate",
    "firenate_fi_calculator_v1": "Reverse Time to FI",
    "carBuyingInputs": "Car Buying",
    "fireMilestonesInputs": "FIRE Milestones",
    "ssBridgeInputs": "SS & Pension Bridge",
    "rothLadderInputs": "Roth Conversion Ladder",
    "variableWithdrawalInputs": "Withdrawal Guardrails & Buffer"
  };

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

    var trashIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<polyline points="3 6 5 6 21 6"></polyline>' +
        '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
        '<path d="M10 11v6"></path>' +
        '<path d="M14 11v6"></path>' +
        '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' +
      "</svg>";

    var usersIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>' +
        '<circle cx="9" cy="7" r="4"></circle>' +
        '<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>' +
        '<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' +
      "</svg>";

    var cameraIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>' +
        '<circle cx="12" cy="13" r="4"></circle>' +
      "</svg>";

    var profilePanel =
      '<div class="fn-profile-panel" role="menu" aria-label="Your info">' +
        '<div class="fn-settings-title-row">' +
          '<div class="fn-settings-title">Your info</div>' +
          '<div class="fn-settings-title-actions">' +
            '<button type="button" class="fn-profile-snapshot" id="fnProfileSnapshot" aria-label="Take a quick snapshot" title="Take a quick snapshot">' +
              cameraIcon +
            "</button>" +
            '<div class="fn-quickload" id="fnQuickload">' +
              '<button type="button" class="fn-quickload-toggle" id="fnQuickloadToggle" aria-haspopup="true" aria-expanded="false" aria-label="Load saved profile" title="Load saved profile">' +
                usersIcon +
              "</button>" +
              '<div class="fn-quickload-menu" id="fnQuickloadMenu" role="menu">' +
                '<div class="fn-quickload-list" id="fnQuickloadList"></div>' +
                '<div class="fn-quickload-fade fn-quickload-fade-top" aria-hidden="true"><span class="fn-quickload-fade-arrow">&#9650;</span></div>' +
                '<div class="fn-quickload-fade fn-quickload-fade-bottom" aria-hidden="true"><span class="fn-quickload-fade-arrow">&#9660;</span></div>' +
              "</div>" +
            "</div>" +
            '<button type="button" class="fn-profile-clear" aria-label="Clear my info" title="Clear my info">' +
              trashIcon +
            "</button>" +
          "</div>" +
        "</div>" +
        '<p class="fn-profile-hint">Saved on this device, and used to pre-fill common fields across calculators.</p>' +
        '<div class="fn-profile-field-row">' +
          '<div class="fn-profile-field fn-profile-field-birthday">' +
            '<label for="fnProfileBirthday">Birthday</label>' +
            '<input type="date" id="fnProfileBirthday">' +
          "</div>" +
          '<div class="fn-profile-field fn-profile-age-row">' +
            '<label>Age</label>' +
            '<span class="fn-profile-age-value" id="fnProfileAgeValue">&mdash;</span>' +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field-row">' +
          '<div class="fn-profile-field">' +
            '<label for="fnProfileIncome">Annual Income</label>' +
            '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
              '<input type="text" inputmode="decimal" id="fnProfileIncome" placeholder="0">' +
            "</div>" +
          "</div>" +
          '<div class="fn-profile-field fn-profile-field-narrow">' +
            '<label for="fnProfileRetireAge">Retirement Age</label>' +
            '<input class="fn-profile-input-narrow" type="number" id="fnProfileRetireAge" min="1" max="120" step="1" placeholder="62">' +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field-row">' +
          '<div class="fn-profile-field">' +
            '<label for="fnProfileSavings">Savings</label>' +
            '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
              '<input type="text" inputmode="decimal" id="fnProfileSavings" placeholder="0">' +
            "</div>" +
          "</div>" +
          '<div class="fn-profile-field fn-profile-field-narrow">' +
            '<label for="fnProfileReturn">Annual Return Rate</label>' +
            '<div class="fn-profile-inputwrap fn-profile-inputwrap-narrow"><input class="fn-profile-input-narrow" type="number" id="fnProfileReturn" step="0.1" placeholder="10.0">' +
              '<span class="fn-profile-affix">%</span>' +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileGoal">Goal Amount</label>' +
          '<div class="fn-profile-inputwrap"><span class="fn-profile-affix">$</span>' +
            '<input type="text" inputmode="decimal" id="fnProfileGoal" placeholder="0">' +
          "</div>" +
        "</div>" +
      "</div>";

    return (
      '<div class="fn-nav-inner">' +
        '<a href="' + BASE + 'index.html' + '" class="fn-brand">' +
          '<span class="fn-dot">&#9670;</span>FireNate' +
          '<span class="fn-tag">FI Tools</span>' +
        "</a>" +
        (pageTitle ? '<div class="fn-page-title">' + escapeHtml(pageTitle) + "</div>" : "") +
        '<div class="fn-links-wrap" id="fnLinksWrap">' +
          '<nav class="fn-links" aria-label="Site" id="fnLinksScroll">' +
            '<a href="' + BASE + 'index.html' + '" class="fn-nav-link' + homeActive + '" data-c="' + homeColor + '">Home</a>' +
            links +
          "</nav>" +
          '<div class="fn-links-fade fn-links-fade-top" aria-hidden="true"><span class="fn-links-fade-arrow">&#9650;</span></div>' +
          '<div class="fn-links-fade fn-links-fade-bottom" aria-hidden="true"><span class="fn-links-fade-arrow">&#9660;</span></div>' +
        "</div>" +
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
        closeQuickload();
        stopLinksAutoScroll();
      }

      // fade + arrow hints at the top/bottom of the page-links dropdown,
      // shown only when there's actually more to scroll in that direction —
      // a native scrollbar alone is easy to miss (e.g. macOS auto-hides it).
      var linksWrap = document.getElementById("fnLinksWrap");
      var linksScroll = document.getElementById("fnLinksScroll");
      function updateLinksScrollFade() {
        if (!linksWrap || !linksScroll) return;
        var canScrollUp = linksScroll.scrollTop > 2;
        var canScrollDown = linksScroll.scrollTop + linksScroll.clientHeight < linksScroll.scrollHeight - 2;
        linksWrap.classList.toggle("can-scroll-up", canScrollUp);
        linksWrap.classList.toggle("can-scroll-down", canScrollDown);
      }
      if (linksScroll) {
        linksScroll.addEventListener("scroll", updateLinksScrollFade);
      }

      // hovering the top/bottom fade zone auto-scrolls the list in that
      // direction for as long as the cursor stays there, like a drag-scroll
      // edge — setting scrollTop directly also fires "scroll", so the fade
      // hints above stay in sync (and the arrow disappears + scrolling
      // effectively stops on its own once that edge of the list is reached)
      var fadeTop = linksWrap ? linksWrap.querySelector(".fn-links-fade-top") : null;
      var fadeBottom = linksWrap ? linksWrap.querySelector(".fn-links-fade-bottom") : null;
      var autoScrollTimer = null;
      function stopLinksAutoScroll() {
        if (autoScrollTimer) {
          clearInterval(autoScrollTimer);
          autoScrollTimer = null;
        }
      }
      function startLinksAutoScroll(direction) {
        stopLinksAutoScroll();
        autoScrollTimer = setInterval(function () {
          if (!linksScroll) return;
          linksScroll.scrollTop += direction * 12;
        }, 20);
      }
      if (fadeTop) {
        fadeTop.addEventListener("mouseenter", function () { startLinksAutoScroll(-1); });
        fadeTop.addEventListener("mouseleave", stopLinksAutoScroll);
      }
      if (fadeBottom) {
        fadeBottom.addEventListener("mouseenter", function () { startLinksAutoScroll(1); });
        fadeBottom.addEventListener("mouseleave", stopLinksAutoScroll);
      }

      if (toggle) {
        toggle.addEventListener("click", function () {
          var open = navHost.classList.toggle("fn-open");
          navHost.classList.remove("fn-settings-open", "fn-profile-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
          // the dropdown is "display:none" until opened, so scrollHeight/
          // clientHeight only become measurable once it's actually visible
          if (open) updateLinksScrollFade();
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
      document.addEventListener("click", function (e) {
        if (quickload && !quickload.contains(e.target)) closeQuickload();
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

      // brief full-screen "poof" so a destructive action that's easy to
      // click blindly through a confirm() dialog still gets an unmistakable
      // visual payoff — a little burst of particles behind a trash icon —
      // before the page reloads to its blank-slate state
      function triggerClearAllEffect(onDone) {
        var overlay = document.getElementById("fnClearAllOverlay");
        if (!overlay) {
          var particleCount = 10;
          var particlesHtml = "";
          for (var i = 0; i < particleCount; i++) {
            particlesHtml += '<span style="--angle:' + Math.round((360 / particleCount) * i) + 'deg"></span>';
          }
          overlay = document.createElement("div");
          overlay.id = "fnClearAllOverlay";
          overlay.className = "fn-clearall-overlay";
          overlay.setAttribute("aria-hidden", "true");
          overlay.innerHTML =
            '<div class="fn-clearall-particles">' + particlesHtml + "</div>" +
            '<div class="fn-clearall-icon">' +
              '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<polyline points="3 6 5 6 21 6"></polyline>' +
                '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
                '<path d="M10 11v6"></path>' +
                '<path d="M14 11v6"></path>' +
                '<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>' +
              "</svg>" +
            "</div>" +
            '<div class="fn-clearall-label">All cleared</div>';
          document.body.appendChild(overlay);
        }
        overlay.classList.remove("show");
        void overlay.offsetWidth;
        overlay.classList.add("show");
        setTimeout(onDone, 1150);
      }

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

          triggerClearAllEffect(function () {
            window.location.reload();
          });
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
        renderQuickloadMenu();
      }
      syncProfileFields();

      // ---------- QUICK-LOAD SAVED PROFILES ----------
      // hover (desktop) or tap the toggle (touch/keyboard) to reveal a list
      // of every profile saved via the Profile Manager page; click one to
      // load it straight into the live profile without leaving the panel
      var quickload = document.getElementById("fnQuickload");
      var quickloadToggle = document.getElementById("fnQuickloadToggle");
      var quickloadWrap = document.getElementById("fnQuickloadMenu");
      var quickloadList = document.getElementById("fnQuickloadList");

      function closeQuickload() {
        if (quickload) quickload.classList.remove("open");
        if (quickloadToggle) quickloadToggle.setAttribute("aria-expanded", "false");
        stopQuickloadAutoScroll();
      }

      // same "more to scroll" fade + arrow treatment as the hamburger page
      // list, applied to this flyout's own scrollable area
      function updateQuickloadScrollFade() {
        if (!quickloadWrap || !quickloadList) return;
        var canScrollUp = quickloadList.scrollTop > 2;
        var canScrollDown = quickloadList.scrollTop + quickloadList.clientHeight < quickloadList.scrollHeight - 2;
        quickloadWrap.classList.toggle("can-scroll-up", canScrollUp);
        quickloadWrap.classList.toggle("can-scroll-down", canScrollDown);
      }
      if (quickloadList) {
        quickloadList.addEventListener("scroll", updateQuickloadScrollFade);
      }
      if (quickload) {
        // covers the hover-to-open path (no click event fires there)
        quickload.addEventListener("mouseenter", updateQuickloadScrollFade);
      }

      var qlFadeTop = quickloadWrap ? quickloadWrap.querySelector(".fn-quickload-fade-top") : null;
      var qlFadeBottom = quickloadWrap ? quickloadWrap.querySelector(".fn-quickload-fade-bottom") : null;
      var quickloadAutoScrollTimer = null;
      function stopQuickloadAutoScroll() {
        if (quickloadAutoScrollTimer) {
          clearInterval(quickloadAutoScrollTimer);
          quickloadAutoScrollTimer = null;
        }
      }
      function startQuickloadAutoScroll(direction) {
        stopQuickloadAutoScroll();
        quickloadAutoScrollTimer = setInterval(function () {
          if (!quickloadList) return;
          quickloadList.scrollTop += direction * 12;
        }, 20);
      }
      if (qlFadeTop) {
        qlFadeTop.addEventListener("mouseenter", function () { startQuickloadAutoScroll(-1); });
        qlFadeTop.addEventListener("mouseleave", stopQuickloadAutoScroll);
      }
      if (qlFadeBottom) {
        qlFadeBottom.addEventListener("mouseenter", function () { startQuickloadAutoScroll(1); });
        qlFadeBottom.addEventListener("mouseleave", stopQuickloadAutoScroll);
      }

      function renderQuickloadMenu() {
        if (!quickloadList) return;
        var list = [];
        try {
          var raw = localStorage.getItem("fn-scenarios");
          list = raw ? JSON.parse(raw) : [];
        } catch (e) {}

        var itemsHtml = !list.length
          ? '<div class="fn-quickload-empty">No saved profiles yet</div>'
          : list.slice().reverse().map(function (scenario) {
              var when = "";
              try {
                when = new Date(scenario.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
              } catch (e) {}
              return (
                '<button type="button" class="fn-quickload-item" data-scenario-id="' + escapeHtml(scenario.id) + '">' +
                  '<span class="name">' + escapeHtml(scenario.name) + "</span>" +
                  (when ? '<span class="when">' + escapeHtml(when) + "</span>" : "") +
                "</button>"
              );
            }).join("");

        quickloadList.innerHTML = itemsHtml +
          '<div class="fn-quickload-divider"></div>' +
          '<a class="fn-quickload-manage" href="' + BASE + 'ProfileManager/index.html' + '">Manage saved profiles &rarr;</a>';

        quickloadList.querySelectorAll("[data-scenario-id]").forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            // stopPropagation matters here: syncProfileFields() (called below)
            // regenerates this list's innerHTML, which removes this very
            // button from the DOM while the click is still bubbling — the
            // document-level "click outside the nav" listener would then see
            // a detached e.target, read that as "outside", and close the
            // whole panel instead of just this flyout.
            e.stopPropagation();
            var id = btn.getAttribute("data-scenario-id");
            var scenario = list.find(function (s) { return s.id === id; });
            if (!scenario || !window.FNProfile) return;
            window.FNProfile.set(scenario.profile);
            applyPageData(scenario.pageData);
            ensureProfileDefaults();
            syncProfileFields();
            closeQuickload();
          });
        });

        updateQuickloadScrollFade();
      }

      if (quickloadToggle) {
        quickloadToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = quickload.classList.toggle("open");
          quickloadToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (open) updateQuickloadScrollFade();
        });
      }

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
      // reads every calculator's own saved-inputs key (window.FN_PAGE_DATA_KEYS)
      // into a plain { key: rawJsonString } bag for embedding in a snapshot
      function collectPageData() {
        var data = {};
        (window.FN_PAGE_DATA_KEYS || []).forEach(function (key) {
          var raw = null;
          try { raw = localStorage.getItem(key); } catch (e) {}
          if (raw !== null) data[key] = raw;
        });
        return data;
      }
      // writes a previously-collected page-data bag straight back into
      // localStorage under each of its original keys — each page's own
      // loadInputs() picks the values up the next time it's visited
      function applyPageData(pageData) {
        if (!pageData) return;
        Object.keys(pageData).forEach(function (key) {
          try { localStorage.setItem(key, pageData[key]); } catch (e) {}
        });
      }

      // saves the current live profile — plus every calculator's own saved
      // inputs — into fn-scenarios under an auto-generated, date-stamped
      // name. Returns true if it actually saved something (skips a profile
      // with nothing in it anywhere on the site — no point naming and
      // storing a blank snapshot). Shared by the camera "quick snapshot"
      // button and the trash button's pre-clear safety backup below.
      function saveCurrentProfileAsScenario(namePrefix) {
        if (!window.FNProfile) return false;
        var current = window.FNProfile.get();
        var profileKeys = ["birthday", "currentIncome", "currentSavings", "goalAmount", "retireAge", "expectedReturn"];
        var hasProfileData = profileKeys.some(function (k) {
          return current[k] !== undefined && current[k] !== null && current[k] !== "";
        });
        var pageData = collectPageData();
        var hasPageData = Object.keys(pageData).length > 0;
        if (!hasProfileData && !hasPageData) return false;
        try {
          var raw = localStorage.getItem("fn-scenarios");
          var list = raw ? JSON.parse(raw) : [];
          var now = new Date();
          var name = namePrefix +
            now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          list.push({
            id: "sc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
            name: name,
            savedAt: Date.now(),
            profile: {
              birthday: current.birthday || "",
              currentIncome: current.currentIncome || "",
              currentSavings: current.currentSavings || "",
              goalAmount: current.goalAmount || "",
              retireAge: current.retireAge || "",
              expectedReturn: current.expectedReturn || ""
            },
            pageData: pageData
          });
          localStorage.setItem("fn-scenarios", JSON.stringify(list));
          return true;
        } catch (e) {
          return false;
        }
      }

      // full-screen camera-flash overlay, created once and reused — kept as
      // a direct child of <body> (not nested inside the nav) so its
      // position:fixed is guaranteed to cover the real viewport regardless
      // of any ancestor's own positioning/transform
      function triggerFullScreenFlash() {
        var overlay = document.getElementById("fnCameraFlashOverlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.id = "fnCameraFlashOverlay";
          overlay.className = "fn-camera-flash-overlay";
          overlay.setAttribute("aria-hidden", "true");
          document.body.appendChild(overlay);
        }
        overlay.classList.remove("flash");
        void overlay.offsetWidth;
        overlay.classList.add("flash");
        var cleared = false;
        var clear = function () {
          if (cleared) return;
          cleared = true;
          overlay.classList.remove("flash");
        };
        overlay.addEventListener("animationend", clear, { once: true });
        setTimeout(clear, 700);
      }

      var snapshotBtn = document.getElementById("fnProfileSnapshot");
      if (snapshotBtn) {
        snapshotBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var saved = saveCurrentProfileAsScenario("Snapshot ");
          if (!saved) return;
          renderQuickloadMenu();
          // quick camera-flash pulse so the click has an obvious payoff
          snapshotBtn.classList.remove("flash");
          void snapshotBtn.offsetWidth;
          snapshotBtn.classList.add("flash");
          setTimeout(function () { snapshotBtn.classList.remove("flash"); }, 500);
          triggerFullScreenFlash();
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          if (window.FNProfile) {
            // auto-backup before wiping, so an accidental click is a
            // one-second recovery via "Load saved profile" instead of a
            // permanently lost profile
            saveCurrentProfileAsScenario("Backup ");
            window.FNProfile.clear();
          }
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
