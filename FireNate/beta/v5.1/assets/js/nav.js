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

  // Journey Progress' Insights section (further down) reads IRS benefits
  // limits to build its 401(k)/HSA tips, but that data file is only worth
  // loading on the handful of visits where the compass icon actually gets
  // clicked — loaded here (once, lazily) rather than added to every page's
  // own <head> the way theme.js/user-profile.js are. ContributionLimits'
  // own page already loads this file itself via a plain (non-deferred)
  // <script> tag that runs before this deferred one, so the guard below
  // skips a redundant second fetch there.
  if (!window.FN_BENEFITS_LIMITS) {
    var blDataScript = document.createElement("script");
    blDataScript.src = BASE + "assets/data/benefits-limits-data.js";
    document.head.appendChild(blDataScript);
  }

  // favicon + web-app manifest + theme-color — injected here instead of
  // hardcoded into every page's own <head> (20+ near-identical edits) since
  // nav.js already loads on every page and this keeps a single source of
  // truth. BASE-relative like every other asset this script references —
  // the site isn't guaranteed to be served from an actual domain root (e.g.
  // a versioned subfolder like /v4.3/), so root-absolute paths would break.
  (function injectHeadTags() {
    var head = document.head;
    if (!head) return;
    function addLink(rel, href, extraAttrs) {
      if (head.querySelector('link[rel="' + rel + '"]')) return;
      var link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (extraAttrs) {
        for (var key in extraAttrs) link.setAttribute(key, extraAttrs[key]);
      }
      head.appendChild(link);
    }
    addLink("icon", BASE + "assets/img/favicon.svg", { type: "image/svg+xml" });
    addLink("manifest", BASE + "manifest.json");
    if (!head.querySelector('meta[name="theme-color"]')) {
      var meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = "#15111A";
      head.appendChild(meta);
    }
  })();

  // offline-caching service worker, registered once per page load — guarded
  // for contexts where it isn't available (e.g. opening a page via file://).
  // BASE-relative for the same reason as injectHeadTags above; a service
  // worker's default scope is the directory its script lives in, so
  // registering it this way also keeps that scope correctly confined to
  // wherever the site actually sits, subfolder or not.
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(BASE + "sw.js").catch(function () {});
    });
  }

  // "group" mirrors the homepage's own section headings, so the hamburger
  // menu and the homepage organize calculators the same way
  var PAGES = [
    { id: "home", label: "Home", href: BASE + "index.html" },

    { id: "getting-started", label: "Using This Site", href: BASE + "GettingStarted/index.html", group: "Getting Started" },
    { id: "getting-started-calculators", label: "Calculator Picker", href: BASE + "GettingStartedCalculators/index.html", group: "Getting Started" },

    { id: "fi-snapshot", label: "FI Snapshot", href: BASE + "FISnapshot/index.html", group: "Basics" },
    { id: "net-worth", label: "Net Worth", href: BASE + "NetWorth/index.html", group: "Basics" },
    { id: "budget-calculator", label: "Budget Calculator", href: BASE + "BudgetCalculator/index.html", group: "Basics" },
    { id: "emergency-fund", label: "Emergency Fund", href: BASE + "EmergencyFund/index.html", group: "Basics" },
    { id: "debt-snowball", label: "Debt Payoff Planner", href: BASE + "DebtSnowball/index.html", group: "Basics" },
    { id: "contribution-limits", label: "Contribution Limits", href: BASE + "ContributionLimits/index.html", group: "Basics" },

    { id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html", group: "Independence" },
    { id: "reverse-time-to-fi", label: "Reverse Time to FI", href: BASE + "ReverseTimeToFI/index.html", group: "Independence" },
    { id: "fire-milestones", label: "FIRE Milestones", href: BASE + "FireMilestones/index.html", group: "Independence" },
    { id: "coast-fire", label: "Coast & Barista FIRE", href: BASE + "CoastFire/index.html", group: "Independence" },
    { id: "crossover-point", label: "Crossover Point", href: BASE + "CrossoverPoint/index.html", group: "Independence" },
    { id: "compound-interest", label: "Compound Interest", href: BASE + "CompoundInterest-WealthMultiplier/index.html", group: "Independence" },

    { id: "safe-withdrawal-rate", label: "Safe Withdrawal Rate", href: BASE + "SafeWithdrawalRate/index.html", group: "Retirement" },
    { id: "monte-carlo", label: "Monte Carlo Simulator", href: BASE + "MonteCarlo/index.html", group: "Retirement" },
    { id: "variable-withdrawal", label: "Withdrawal Guardrails & Buffer", href: BASE + "VariableWithdrawalRate/index.html", group: "Retirement" },
    { id: "ss-bridge", label: "SS & Pension Bridge", href: BASE + "SocialSecurityBridge/index.html", group: "Retirement" },
    { id: "healthcare-bridge", label: "Healthcare & ACA Bridge", href: BASE + "HealthcareBridge/index.html", group: "Retirement" },
    { id: "roth-ladder", label: "Roth Conversion Ladder", href: BASE + "RothLadder/index.html", group: "Retirement" },
    { id: "rmd", label: "Required Minimum Distributions", href: BASE + "RMD/index.html", group: "Retirement" },

    { id: "payoff-or-invest", label: "Payoff or Invest", href: BASE + "Payoff-or-Invest/index.html", group: "Daily Decisions" },
    { id: "cash-out-or-hold", label: "Cash Out or Hold", href: BASE + "CashOutOrHold/index.html", group: "Daily Decisions" },
    { id: "loan-calculator", label: "Loan Calculator", href: BASE + "LoanCalculator/index.html", group: "Daily Decisions" },
    { id: "car-buying", label: "Car Buying", href: BASE + "CarBuying/index.html", group: "Daily Decisions" },
    { id: "rent-vs-buy", label: "Rent vs. Buy", href: BASE + "RentVsBuy/index.html", group: "Daily Decisions" },
    { id: "homes-vs-stocks", label: "Homes vs. Stocks", href: BASE + "RealEstateVsStocks/index.html", group: "Daily Decisions" },

    { id: "files", label: "Files", href: BASE + "Downloads/index.html", group: "Resources" },
    { id: "gen-info", label: "Info", href: BASE + "GenInfo/index.html", group: "Resources" },
    { id: "glossary", label: "Glossary", href: BASE + "Glossary/index.html", group: "Resources" },
    { id: "faq", label: "F.A.Q.", href: BASE + "FAQ/index.html", group: "Resources" },
    { id: "about", label: "About", href: BASE + "About/index.html", group: "Resources" },
    { id: "terms", label: "Terms, Conditions & Copyright", href: BASE + "Terms/index.html", group: "Resources" },
    { id: "contact", label: "Contact", href: BASE + "Contact/index.html", group: "Resources" },
    { id: "profile-manager", label: "Profile Manager", href: BASE + "ProfileManager/index.html", group: "Resources" }
  ];

  // localStorage keys that hold each individual calculator's own saved
  // inputs, on top of the 6 shared profile fields — snapshots/backups/
  // exports capture these too, so loading a saved profile restores a
  // user's full site state, not just what's in "Your info". Exposed as a
  // global (rather than kept private to this IIFE) so ProfileManager's own
  // script — a separate scope — can read the same list.
  window.FN_PAGE_DATA_KEYS = [
    "fi-runway-inputs",           // TimeToFI
    "fi-runway-history",          // TimeToFI (logged dated snapshots)
    "payoffOrInvestInputs",       // Payoff-or-Invest
    "emergencyFundInputs",        // EmergencyFund
    "emergencyFundHistory",       // EmergencyFund (logged dated snapshots)
    "crossoverPointInputs",       // CrossoverPoint
    "swrInputs",                  // SafeWithdrawalRate
    "firenate_fi_calculator_v1",  // ReverseTimeToFI
    "carBuyingInputs",            // CarBuying
    "fireMilestonesInputs",       // FireMilestones
    "ssBridgeInputs",             // SocialSecurityBridge
    "rothLadderInputs",           // RothLadder
    "variableWithdrawalInputs",   // VariableWithdrawalRate
    "debtSnowballInputs",         // DebtSnowball
    "healthcareBridgeInputs",     // HealthcareBridge
    "netWorthInputs",             // NetWorth (current field values)
    "netWorthHistory",            // NetWorth (logged dated snapshots)
    "rentVsBuyInputs",            // RentVsBuy
    "coastFireInputs",            // CoastFire
    "rmdInputs",                  // RMD
    "monteCarloInputs",           // MonteCarlo
    "cashOutOrHoldInputs",        // CashOutOrHold
    "budgetCalculatorInputs",     // BudgetCalculator (current field values)
    "budgetHistory",              // BudgetCalculator (logged dated snapshots)
    "compoundCalcState",          // CompoundInterest-WealthMultiplier
    "loanCalculatorInputs",       // LoanCalculator
    "realEstateVsStocksInputs",   // RealEstateVsStocks
    "journeyProgressHistory",     // Journey Progress (logged overall-% snapshots)
    "contributionLimitsInputs",   // ContributionLimits
    "systemNotifications",        // Notifications bell (system-generated milestone/reminder list)
    "journeyKnownMilestones",     // Notifications bell (dedup state driving what counts as "new")
    "notificationsReadIds",       // Notifications bell (read/unread state)
    "notificationsHiddenIds",     // Notifications bell (permanently dismissed items)
    "notificationsMutedTypes",    // Notifications bell (per-type mute preference)
    "autoSnapshotIntervalHours"   // Automatic local snapshot cadence preference
  ];

  // friendly page name for each key above — same labels used in the nav
  // menu itself — so a saved-profile summary can list which calculators a
  // snapshot actually has data for, not just an unlabeled count
  window.FN_PAGE_DATA_LABELS = {
    "fi-runway-inputs": "Time to FI",
    "fi-runway-history": "Time to FI (history)",
    "payoffOrInvestInputs": "Payoff or Invest",
    "emergencyFundInputs": "Emergency Fund",
    "emergencyFundHistory": "Emergency Fund (history)",
    "crossoverPointInputs": "Crossover Point",
    "swrInputs": "Safe Withdrawal Rate",
    "firenate_fi_calculator_v1": "Reverse Time to FI",
    "carBuyingInputs": "Car Buying",
    "fireMilestonesInputs": "FIRE Milestones",
    "ssBridgeInputs": "SS & Pension Bridge",
    "rothLadderInputs": "Roth Conversion Ladder",
    "variableWithdrawalInputs": "Withdrawal Guardrails & Buffer",
    "debtSnowballInputs": "Debt Snowball",
    "healthcareBridgeInputs": "Healthcare & ACA Bridge",
    "netWorthInputs": "Net Worth",
    "netWorthHistory": "Net Worth (history)",
    "rentVsBuyInputs": "Rent vs. Buy",
    "coastFireInputs": "Coast & Barista FIRE",
    "rmdInputs": "Required Minimum Distributions",
    "monteCarloInputs": "Monte Carlo Simulator",
    "cashOutOrHoldInputs": "Cash Out or Hold",
    "budgetCalculatorInputs": "Budget Calculator",
    "budgetHistory": "Budget Calculator (history)",
    "compoundCalcState": "Compound Interest & Wealth Multiplier",
    "loanCalculatorInputs": "Loan Calculator",
    "realEstateVsStocksInputs": "Homes vs. Stocks",
    "journeyProgressHistory": "Journey Progress (history)",
    "contributionLimitsInputs": "Contribution Limits",
    "systemNotifications": "Notifications (system-generated)",
    "journeyKnownMilestones": "Notifications (dedup state)",
    "notificationsReadIds": "Notifications (read/unread)",
    "notificationsHiddenIds": "Notifications (hidden)",
    "notificationsMutedTypes": "Notifications (muted types)",
    "autoSnapshotIntervalHours": "Automatic snapshot frequency"
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // encodes a plain object as a URL-safe, unicode-safe base64 string (and
  // back) for the "shareable link" feature — same {profile, pageData} shape
  // ProfileManager's JSON export already uses, just carried in a URL instead
  // of a downloaded file
  function encodeSharePayload(obj) {
    try {
      var json = JSON.stringify(obj);
      var b64 = btoa(unescape(encodeURIComponent(json)));
      return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } catch (e) {
      return null;
    }
  }
  function decodeSharePayload(str) {
    try {
      var b64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) b64 += "=";
      var json = decodeURIComponent(escape(atob(b64)));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
  // exposed so ProfileManager's own script (a separate scope) can reuse the
  // exact same encoding for its "share a saved profile as text" feature,
  // instead of keeping a second copy in sync by hand
  window.FN_encodeSharePayload = encodeSharePayload;
  window.FN_decodeSharePayload = decodeSharePayload;

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

  // which group headers the user has collapsed, keyed by group label —
  // stored as a set-like object ({label: true}) so a page reload (or a
  // different page's own nav render) opens back up exactly as left
  var COLLAPSE_KEY = "fn-nav-collapsed-groups";
  function readCollapsedGroups() {
    try {
      var raw = localStorage.getItem(COLLAPSE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  var chevronIcon =
    '<svg class="fn-links-group-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';

  // one small wayfinding icon per page in the hamburger menu — inner
  // shapes only (no <svg> wrapper), stroke="currentColor" so each picks up
  // its link's own hover/active accent color automatically. Values are
  // standard, widely-used icon glyphs (not invented shapes), chosen to be
  // simple enough to hand-verify: circles/lines/rects and a couple of
  // well-known compound icons (heart, shield, house, envelope, etc).
  var PAGE_ICONS = {
    "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    "getting-started": '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>',
    "getting-started-calculators": '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>',
    "fi-snapshot": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
    "net-worth": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
    "budget-calculator": '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>',
    "emergency-fund": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
    "debt-snowball": '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
    "time-to-fi": '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
    "reverse-time-to-fi": '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>',
    "fire-milestones": '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>',
    "coast-fire": '<line x1="12" y1="3" x2="12" y2="15"></line><polygon points="12 4 12 13 19 13"></polygon><polyline points="4 17 20 17 17 20 7 20"></polyline>',
    "crossover-point": '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>',
    "compound-interest": '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>',
    "safe-withdrawal-rate": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 16 10"></polyline>',
    "monte-carlo": '<rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8" cy="8" r="1.2"></circle><circle cx="16" cy="8" r="1.2"></circle><circle cx="12" cy="12" r="1.2"></circle><circle cx="8" cy="16" r="1.2"></circle><circle cx="16" cy="16" r="1.2"></circle>',
    "variable-withdrawal": '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
    "ss-bridge": '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>',
    "healthcare-bridge": '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    "roth-ladder": '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
    "rmd": '<polygon points="4 8 12 3 20 8"></polygon><line x1="3" y1="20" x2="21" y2="20"></line><line x1="6" y1="9" x2="6" y2="19"></line><line x1="10" y1="9" x2="10" y2="19"></line><line x1="14" y1="9" x2="14" y2="19"></line><line x1="18" y1="9" x2="18" y2="19"></line>',
    "contribution-limits": '<circle cx="12" cy="12" r="10"></circle><line x1="8" y1="16" x2="16" y2="8"></line><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle>',
    "payoff-or-invest": '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
    "cash-out-or-hold": '<rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 12h.01M18 12h.01"></path>',
    "loan-calculator": '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
    "car-buying": '<path d="M4 15 L5 9 L8 6 L16 6 L19 9 L20 15"></path><rect x="2" y="14" width="20" height="5" rx="1"></rect><circle cx="7" cy="19" r="2.2"></circle><circle cx="17" cy="19" r="2.2"></circle>',
    "rent-vs-buy": '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>',
    "homes-vs-stocks": '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
    "files": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
    "gen-info": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    "glossary": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
    "faq": '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
    "about": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    "terms": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>',
    "contact": '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline>',
    "profile-manager": '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  function pageIcon(id) {
    var inner = PAGE_ICONS[id];
    if (!inner) return "";
    return '<svg class="fn-nav-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }

  function buildNav() {
    // bucket every non-home page into its group, preserving PAGES' own
    // order both for the groups themselves and for pages within a group
    var groupOrder = [];
    var groupMap = {};
    PAGES.filter(function (p) { return p.id !== "home"; }).forEach(function (p) {
      var g = p.group || "More";
      if (!groupMap[g]) { groupMap[g] = []; groupOrder.push(g); }
      groupMap[g].push(p);
    });

    var collapsedGroups = readCollapsedGroups();
    var colorIdx = 1; // start at 1 so Home (index 0) keeps the first color
    var links = groupOrder.map(function (g) {
      var isCollapsed = !!collapsedGroups[g];
      var items = groupMap[g].map(function (p) {
        var active = p.id === CURRENT ? " fn-active" : "";
        var color = LINK_COLORS[colorIdx % LINK_COLORS.length];
        colorIdx++;
        return '<a href="' + p.href + '" class="fn-nav-link' + active + '" data-c="' + color + '" data-page-id="' +
          escapeHtml(p.id) + '" data-label="' + escapeHtml(p.label.toLowerCase()) + '">' + pageIcon(p.id) +
          "<span>" + escapeHtml(p.label) + "</span></a>";
      }).join("");
      return '<div class="fn-links-group' + (isCollapsed ? " is-collapsed" : "") + '">' +
          '<button type="button" class="fn-links-group-label" aria-expanded="' + (isCollapsed ? "false" : "true") +
            '" data-group-label="' + escapeHtml(g) + '">' +
            '<span>' + escapeHtml(g) + "</span>" +
            chevronIcon +
          "</button>" +
          '<div class="fn-links-group-items"' + (isCollapsed ? " hidden" : "") + ">" +
            items +
          "</div>" +
        "</div>";
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

    var compassIcon =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<circle cx="12" cy="12" r="10"></circle>' +
        '<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>' +
      "</svg>";

    // built from NOTIF_TYPES (defined further down, but already assigned
    // by the time buildNav() actually runs at init()) so the checklist
    // can never drift out of sync with the icons/colors the panel itself
    // renders — one source of truth for "what types exist"
    var mutedNotifTypesForPanel = readMutedNotifTypes();
    var notifMuteOptionsHtml = ["urgent", "warning", "info", "achievement"].map(function (t) {
      var info = notifTypeInfo(t);
      return '<label class="fn-notif-mute-option">' +
        '<input type="checkbox" data-mute-type="' + t + '"' + (mutedNotifTypesForPanel[t] ? "" : " checked") + '>' +
        '<span class="fn-notif-mute-icon" style="color:var(' + info.varName + ')" aria-hidden="true">' + info.svg + "</span>" +
        escapeHtml(info.label) +
      "</label>";
    }).join("");

    var settingsPanel =
      '<div class="fn-settings-panel" role="menu" aria-label="Settings">' +
        '<div class="fn-settings-title">Settings</div>' +
        '<div class="fn-settings-row fn-settings-row-stack">' +
          '<span class="fn-settings-label">Theme</span>' +
          '<div class="fn-theme-select" role="radiogroup" aria-label="Theme">' +
            '<div class="fn-theme-group">' +
              '<svg class="fn-theme-group-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<rect x="2" y="3" width="20" height="14" rx="2"></rect>' +
                '<line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>' +
              "</svg>" +
              '<div class="fn-theme-group-options fn-theme-group-options-single">' +
                '<button type="button" class="fn-theme-option" data-theme-option="system" role="radio" aria-checked="false">System</button>' +
              "</div>" +
            "</div>" +
            '<div class="fn-theme-group">' +
              '<svg class="fn-theme-group-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<circle cx="12" cy="12" r="4"></circle>' +
                '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>' +
              "</svg>" +
              '<div class="fn-theme-group-options">' +
                '<button type="button" class="fn-theme-option" data-theme-option="light" role="radio" aria-checked="false">Light</button>' +
                '<button type="button" class="fn-theme-option" data-theme-option="sunshine" role="radio" aria-checked="false">Sunshine</button>' +
              "</div>" +
            "</div>" +
            '<div class="fn-theme-group">' +
              '<svg class="fn-theme-group-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
              "</svg>" +
              '<div class="fn-theme-group-options">' +
                '<button type="button" class="fn-theme-option" data-theme-option="dark" role="radio" aria-checked="false">Dark</button>' +
                '<button type="button" class="fn-theme-option" data-theme-option="neon" role="radio" aria-checked="false">Neon</button>' +
                '<button type="button" class="fn-theme-option" data-theme-option="lcars" role="radio" aria-checked="false">LCARS</button>' +
              "</div>" +
            "</div>" +
          "</div>" +
          '<p class="fn-settings-hint">System matches your device: light &rarr; Sunshine, dark &rarr; Neon.</p>' +
        "</div>" +
        '<div class="fn-settings-divider"></div>' +
        '<div class="fn-settings-row fn-settings-row-stack">' +
          '<span class="fn-settings-label">Notifications</span>' +
          '<p class="fn-settings-hint">Uncheck a type to hide it from the bell &mdash; muting doesn&rsquo;t stop the underlying check (an unchecked "Urgent" still misses real alerts like an approaching RMD deadline), it just keeps it out of the list.</p>' +
          '<div class="fn-notif-mute-list" id="fnNotifMuteList">' +
            notifMuteOptionsHtml +
          "</div>" +
        "</div>" +
        '<div class="fn-settings-divider"></div>' +
        '<div class="fn-settings-row fn-settings-row-stack">' +
          '<span class="fn-settings-label">Reset this device</span>' +
          '<p class="fn-settings-hint">Clears every saved input, your profile, scenarios, and theme &mdash; starts fresh as a new visitor.</p>' +
          '<button type="button" class="fn-reset-all">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              '<circle cx="12" cy="6" r="4"></circle><circle cx="7" cy="8.5" r="3"></circle><circle cx="17" cy="8.5" r="3"></circle>' +
              '<path d="M9 11 8 20 16 20 15 11"></path><line x1="5" y1="21" x2="19" y2="21"></line>' +
            "</svg>" +
            "<span>Clear all local data</span>" +
          "</button>" +
        "</div>" +
      "</div>";

    var userIcon =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
        '<circle cx="12" cy="7" r="4"></circle>' +
      "</svg>";

    var bellIcon =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>' +
        '<path d="M13.73 21a2 2 0 0 1-3.46 0"></path>' +
      "</svg>";

    var notificationsPanel =
      '<div class="fn-notifications-panel" role="menu" aria-label="Notifications">' +
        '<div class="fn-notifications-head">' +
          '<span class="fn-notifications-title">Notifications</span>' +
          '<button type="button" class="fn-notifications-clear-all" id="fnNotificationsClearAll">Clear all</button>' +
        "</div>" +
        '<div class="fn-notifications-list" id="fnNotificationsList">' +
          '<div class="fn-notifications-empty">You&rsquo;re all caught up.</div>' +
        "</div>" +
      "</div>";

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

    var linkIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>' +
        '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>' +
      "</svg>";

    var saveIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>' +
        '<polyline points="17 21 17 13 7 13 7 21"></polyline>' +
        '<polyline points="7 3 7 8 15 8"></polyline>' +
      "</svg>";

    var downloadIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
        '<polyline points="7 10 12 15 17 10"></polyline>' +
        '<line x1="12" y1="15" x2="12" y2="3"></line>' +
      "</svg>";

    var uploadIcon =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
        '<polyline points="17 8 12 3 7 8"></polyline>' +
        '<line x1="12" y1="3" x2="12" y2="15"></line>' +
      "</svg>";

    var profilePanel =
      '<div class="fn-profile-panel" role="menu" aria-label="Your info">' +
        '<div class="fn-settings-title-row">' +
          '<div class="fn-settings-title">Your info</div>' +
          '<div class="fn-settings-title-actions">' +
            '<button type="button" class="fn-profile-share" id="fnProfileShare" aria-label="Copy a shareable link" title="Copy a shareable link">' +
              linkIcon +
            "</button>" +
            '<div class="fn-settings-title-actions-right">' +
              '<button type="button" class="fn-profile-save" id="fnProfileSaveBtn" aria-label="Save your info" title="Nothing new to save" disabled>' +
                saveIcon +
              "</button>" +
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
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="fn-profile-savemeta">' +
          '<span class="fn-profile-savemeta-row"><span class="fn-profile-savemeta-label">Last saved</span><span class="fn-profile-savemeta-value" id="fnProfileLastSaved">&mdash;</span></span>' +
          '<span class="fn-profile-savemeta-row"><span class="fn-profile-savemeta-label">Last snapshot</span><span class="fn-profile-savemeta-value" id="fnProfileLastSnapshot">&mdash;</span></span>' +
        "</div>" +
        '<span class="fn-share-toast" id="fnShareToast" role="status" aria-live="polite"></span>' +
        '<div class="fn-profile-field">' +
          '<label for="fnProfileName">Name</label>' +
          '<input type="text" id="fnProfileName" placeholder="e.g. Nate" maxlength="40" autocomplete="off">' +
        "</div>" +
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
        '<p class="fn-profile-hint">Saved on this device, and used to pre-fill common fields across calculators.</p>' +
        '<div class="fn-profile-footer-row">' +
          '<button type="button" class="fn-profile-export" id="fnProfileExport" aria-label="Download a backup" title="Download a backup">' +
            downloadIcon +
          "</button>" +
          '<button type="button" class="fn-profile-import" id="fnProfileImport" aria-label="Load a backup file" title="Load a backup file">' +
            uploadIcon +
          "</button>" +
          '<input type="file" id="fnProfileImportFile" accept="application/json,.json" style="display:none;">' +
          '<button type="button" class="fn-profile-clear" aria-label="Clear my info" title="Clear my info">' +
            trashIcon +
          "</button>" +
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
            '<div class="fn-links-search-wrap">' +
              '<input type="search" class="fn-links-search" id="fnLinksSearch" placeholder="Search calculators&hellip;" aria-label="Search calculators">' +
            "</div>" +
            '<a href="' + BASE + 'index.html' + '" class="fn-nav-link' + homeActive + '" data-c="' + homeColor + '">' +
              pageIcon("home") + "<span>Home</span></a>" +
            links +
            '<div class="fn-links-empty" id="fnLinksEmpty" hidden>No calculators match your search.</div>' +
          "</nav>" +
          '<div class="fn-links-fade fn-links-fade-top" aria-hidden="true"><span class="fn-links-fade-arrow">&#9650;</span></div>' +
          '<div class="fn-links-fade fn-links-fade-bottom" aria-hidden="true"><span class="fn-links-fade-arrow">&#9660;</span></div>' +
        "</div>" +
        '<div class="fn-actions">' +
          '<span class="fn-profile-name-badge" id="fnProfileNameBadge"></span>' +
          '<button type="button" class="fn-profile-toggle" aria-label="Your info" aria-haspopup="true" aria-expanded="false">' +
            userIcon +
            onboardHint +
          "</button>" +
          profilePanel +
          '<button type="button" class="fn-notifications-toggle" aria-label="Notifications" aria-haspopup="true" aria-expanded="false">' +
            bellIcon +
            '<span class="fn-notifications-badge" id="fnNotificationsBadge" hidden>0</span>' +
          "</button>" +
          notificationsPanel +
          '<button type="button" class="fn-journey-toggle" aria-label="Journey Progress" aria-haspopup="dialog">' +
            compassIcon +
          "</button>" +
          '<button type="button" class="fn-settings-toggle" aria-label="Settings" aria-haspopup="true" aria-expanded="false">' +
            gearIcon +
          "</button>" +
          settingsPanel +
          '<button type="button" class="fn-nav-toggle" aria-label="Main Menu" aria-expanded="false">&#9776;</button>' +
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

      // footer.html is authored with root-absolute hrefs ("/About/index.html")
      // for readability, but the site isn't guaranteed to be served from an
      // actual domain root (e.g. a versioned subfolder like /v4.3/) — rewrite
      // them relative to BASE, same as every other link nav.js builds
      footerContainer.querySelectorAll('a[href^="/"]').forEach(function (a) {
        var href = a.getAttribute('href');
        a.setAttribute('href', BASE + href.slice(1));
      });

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

  // =========================================================================
  // Journey Progress — a site-wide modal, opened from the nav's compass
  // icon on any page, that pulls together saved data from a handful of
  // "milestone" calculators into one dashboard. Lives here (not a separate
  // script) because nav.js is already the one file every page loads, so
  // this doesn't require editing every page's own <head> to wire up.
  // Reads each calculator's own localStorage key directly rather than
  // re-deriving its full projection math — every stat below is either a
  // value the source page already stored pre-computed (Net Worth's logged
  // snapshots) or simple arithmetic on its raw saved inputs (savings as a
  // % of a goal, sum of debt balances), so this stays cheap to keep in
  // sync if those pages' own fields ever change shape.
  // =========================================================================
  function fmtUSD0(n) {
    return "$" + Math.round(n || 0).toLocaleString("en-US");
  }

  function readJourneyJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // Several source pages' own saveInputs() stores a field's live <input>
  // value straight to localStorage after their own formatCurrencyField()
  // has already run — which for any value ≥ 1,000 means the stored string
  // is comma-grouped (e.g. "12,000"), not a plain number. Plain parseFloat()
  // stops at the first comma, silently truncating a value like "12,000"
  // down to 12 — which reads exactly like an unlabeled "divide by ~1,000"
  // shortening bug. Every numeric field read out of a saved calculator's
  // JSON blob below goes through this instead of bare parseFloat(); it
  // mirrors parseFloat()'s own NaN-on-failure behavior so existing
  // "|| 0" / isFinite() call sites don't need to change.
  function journeyNum(v) {
    if (typeof v === "number") return v;
    return parseFloat(String(v === null || v === undefined ? "" : v).replace(/,/g, ""));
  }

  var JOURNEY_FREQ_TO_ANNUAL = {
    weekly: 52, biweekly: 26, monthly: 12, bimonthly: 6,
    quarterly: 4, semiannually: 2, annually: 1
  };

  // Small inline trend chart, reused for Net Worth's own history and for
  // the overall-progress ring's history below — same shape as the site's
  // other sparklines, just inlined here rather than pulled in as a shared
  // helper since nothing else on the page needs it.
  function buildJourneySparkline(values, strokeColor) {
    if (!values || values.length < 2) return "";
    var w = 84, h = 26, pad = 3;
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var range = max - min;
    var pts = values.map(function (v, i) {
      var x = pad + (i * (w - pad * 2)) / (values.length - 1);
      var y = range === 0 ? h / 2 : (h - pad) - ((v - min) / range) * (h - pad * 2);
      return x.toFixed(1) + "," + y.toFixed(1);
    });
    var last = pts[pts.length - 1].split(",");
    return '<svg class="fn-journey-spark" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true">' +
      '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + strokeColor + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></polyline>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="2.3" fill="' + strokeColor + '"></circle>' +
    "</svg>";
  }

  // Shared by "Since your last visit" and "Last 30 Days" — both are just
  // this same per-card dollar diff against a different logged baseline
  // entry (the immediately-previous visit vs. one roughly a month back).
  function journeyCardDeltaSpans(cards, baseEntry) {
    if (!baseEntry || !baseEntry.cards) return [];
    var changes = [];
    cards.forEach(function (c) {
      if (c.value === null || c.value === undefined) return;
      var prevCard = baseEntry.cards[c.id];
      if (!prevCard || prevCard.value === null || prevCard.value === undefined) return;
      var cDelta = c.value - prevCard.value;
      if (Math.abs(cDelta) < 1) return;
      var cSign = cDelta > 0 ? "+" : "−";
      changes.push('<span class="fn-journey-change fn-journey-change-' + c.color + '">' + c.label + " " + cSign + fmtUSD0(Math.abs(cDelta)) + "</span>");
    });
    return changes;
  }

  // journeyProgressHistory: [{date, overallPct, cards:{id:{value,pct,milestone}}}]
  // — one dated snapshot per day the modal is opened (dedup by date, same
  // overwrite-today's-entry pattern Net Worth uses for its own history).
  // Logging each card's raw value + milestone (not just the ring's overall
  // %) is what lets the modal show a "since your last visit" diff, notice
  // a milestone that was *just* crossed, and estimate how stale a card's
  // number is — all without asking the user to log anything extra.
  function readJourneyHistoryArr(key) {
    var arr = readJourneyJSON(key);
    return Array.isArray(arr) ? arr : [];
  }

  function logJourneySnapshot(overallPct, cards, rankName) {
    try {
      var history = readJourneyHistoryArr("journeyProgressHistory");
      var today = new Date().toISOString().slice(0, 10);
      var cardData = {};
      cards.forEach(function (c) {
        cardData[c.id] = {
          value: (c.value === undefined ? null : c.value),
          pct: c.pct,
          milestone: c.milestone ? c.milestone.text : null
        };
      });
      var entry = { date: today, overallPct: overallPct, cards: cardData, rank: rankName || null };
      var idx = -1;
      for (var i = 0; i < history.length; i++) {
        if (history[i].date === today) { idx = i; break; }
      }
      if (idx >= 0) history[idx] = entry;
      else history.push(entry);
      history.sort(function (a, b) { return (a.date || "") < (b.date || "") ? -1 : 1; });
      if (history.length > 90) history = history.slice(history.length - 90);
      localStorage.setItem("journeyProgressHistory", JSON.stringify(history));
      return history;
    } catch (e) {
      return readJourneyHistoryArr("journeyProgressHistory");
    }
  }

  function formatJourneyShortDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function formatJourneyMonthYear(date) {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  function journeyDaysBetween(isoA, isoB) {
    var a = new Date(isoA + "T00:00:00"), b = new Date(isoB + "T00:00:00");
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  function journeyPad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  // Per-card pace projection, same rate-over-time approach as the overall
  // ring's own projection but scoped to one card's own logged history —
  // needs 14+ days of span to extrapolate from, same threshold as the ring.
  // For a card whose % rises toward 100 (Time to FI, Emergency Fund).
  function computeJourneyPctProjection(id, journeyHistory) {
    var entries = journeyHistory
      .filter(function (h) { var cd = h.cards && h.cards[id]; return cd && cd.pct !== null && cd.pct !== undefined; })
      .map(function (h) { return { date: h.date, pct: h.cards[id].pct }; });
    if (entries.length < 2) return null;
    var first = entries[0], last = entries[entries.length - 1];
    if (last.pct >= 100) return null;
    var spanDays = journeyDaysBetween(first.date, last.date);
    if (spanDays < 14) return null;
    var rate = (last.pct - first.pct) / spanDays;
    if (rate <= 0) return null;
    var daysToGoal = (100 - last.pct) / rate;
    if (!isFinite(daysToGoal) || daysToGoal <= 0) return null;
    var target = new Date();
    target.setDate(target.getDate() + Math.round(daysToGoal));
    return formatJourneyMonthYear(target);
  }

  // For a card whose raw $ value falls toward zero (Debt Payoff).
  function computeJourneyZeroProjection(id, journeyHistory) {
    var entries = journeyHistory
      .filter(function (h) { var cd = h.cards && h.cards[id]; return cd && cd.value !== null && cd.value !== undefined; })
      .map(function (h) { return { date: h.date, value: h.cards[id].value }; });
    if (entries.length < 2) return null;
    var first = entries[0], last = entries[entries.length - 1];
    if (last.value <= 0) return null;
    var spanDays = journeyDaysBetween(first.date, last.date);
    if (spanDays < 14) return null;
    var rate = (first.value - last.value) / spanDays;
    if (rate <= 0) return null;
    var daysToZero = last.value / rate;
    if (!isFinite(daysToZero) || daysToZero <= 0) return null;
    var target = new Date();
    target.setDate(target.getDate() + Math.round(daysToZero));
    return formatJourneyMonthYear(target);
  }

  // Quick-log, straight from the Net Worth card in the modal — writes the
  // same netWorthHistory shape and same overwrite-today's-entry behavior as
  // NetWorth/index.html's own logSnapshot() (date built from local
  // Y/M/D, not toISOString(), to match that page's own formatDateOnly()
  // and avoid a UTC-vs-local date mismatch near midnight).
  function saveJourneyNetWorthSnapshot(assets, liabilities) {
    try {
      var history = readJourneyHistoryArr("netWorthHistory");
      var today = new Date();
      var date = today.getFullYear() + "-" + journeyPad2(today.getMonth() + 1) + "-" + journeyPad2(today.getDate());
      var list = history.filter(function (e) { return e.date !== date; });
      list.push({ date: date, assets: assets, liabilities: liabilities, netWorth: assets - liabilities });
      localStorage.setItem("netWorthHistory", JSON.stringify(list));
    } catch (e) { /* ignore */ }
  }

  // Quick-edit for the three cards whose "current savings" is a single
  // field on an otherwise-already-set-up page (goal/target/expenses have
  // to exist first, which is why this only ever shows once c.started is
  // true) — unlike Net Worth's dated history log above, these pages don't
  // track history of their own, so this just overwrites that one field in
  // place, exactly like editing it on the page itself would.
  var JOURNEY_QUICKEDIT = {
    "time-to-fi": { key: "fi-runway-inputs", field: "savings", asNumber: false },
    "emergency-fund": { key: "emergencyFundInputs", field: "currentEfSavings", asNumber: false },
    "reverse-time-to-fi": { key: "firenate_fi_calculator_v1", field: "currentSavings", asNumber: true }
  };
  function saveJourneyQuickEditValue(cardId, value) {
    var qe = JOURNEY_QUICKEDIT[cardId];
    if (!qe) return;
    try {
      var raw = readJourneyJSON(qe.key) || {};
      raw[qe.field] = qe.asNumber ? value : String(value);
      localStorage.setItem(qe.key, JSON.stringify(raw));
    } catch (e) { /* ignore */ }
  }

  // Debt Payoff's own quick-edit — unlike the single-field cards above,
  // debts are a list with no one obvious field to overwrite, so this always
  // applies to whichever debt the current strategy would actually pay down
  // next (same ordering as journeySimulateDebtPayoff: smallest balance
  // first for snowball, highest APR first for avalanche) — matches
  // computeJourneyCards()' own targetDebtIdx so the card's displayed
  // "Applies to" label and the actual write always agree. "Additional debt"
  // targets that same debt for a consistent, predictable mental model
  // rather than needing its own picker.
  function saveJourneyDebtQuickEdit(mode, amount) {
    try {
      var raw = readJourneyJSON("debtSnowballInputs");
      if (!raw || !Array.isArray(raw.debts) || !raw.debts.length) return;
      var strategy = raw.strategy || "snowball";
      var liveIdxs = raw.debts.map(function (d, i) { return i; }).filter(function (i) { return (journeyNum(raw.debts[i].balance) || 0) > 0; });
      var idx;
      if (liveIdxs.length) {
        liveIdxs.sort(function (a, b) {
          return strategy === "avalanche"
            ? (journeyNum(raw.debts[b].apr) || 0) - (journeyNum(raw.debts[a].apr) || 0)
            : (journeyNum(raw.debts[a].balance) || 0) - (journeyNum(raw.debts[b].balance) || 0);
        });
        idx = liveIdxs[0];
      } else {
        idx = 0;
      }
      var bal = journeyNum(raw.debts[idx].balance) || 0;
      raw.debts[idx].balance = mode === "payment" ? Math.max(0, bal - amount) : bal + amount;
      localStorage.setItem("debtSnowballInputs", JSON.stringify(raw));
    } catch (e) { /* ignore */ }
  }

  // ---------------------------------------------------------------------
  // Insights — practical, computed tidbits ("put these numbers into
  // action") built straight from the same localStorage keys the cards
  // above already read, plus ContributionLimits' saved inputs + IRS data
  // file for the benefits tip. Each computeJourney*Insight() returns a
  // single finished sentence or null if it doesn't have enough data to say
  // anything useful — buildJourneyModal() collects whichever come back.
  // ---------------------------------------------------------------------

  function journeyFmt1(n) { return (Math.round(n * 10) / 10).toString(); }

  // Mirrors ContributionLimits/index.html's own get401k()/getHsa()/getIra()
  // catch-up lookups — kept in sync by hand since they're small and this is
  // the only other place that needs them.
  function journeyGet401kLimit(yearData, age) {
    var base = yearData.k401.employee;
    if (age >= 60 && age <= 63 && yearData.k401.catchup60to63 != null) return base + yearData.k401.catchup60to63;
    if (age >= 50) return base + yearData.k401.catchup50;
    return base;
  }
  function journeyGetHsaLimit(yearData, age, coverage) {
    var base = coverage === "family" ? yearData.hsa.family : yearData.hsa.self;
    return base + (age >= 55 ? yearData.hsa.catchup55 : 0);
  }
  function journeyGetIraLimit(yearData, age) {
    return yearData.ira.limit + (age >= 50 ? yearData.ira.catchup50 : 0);
  }

  // Mirrors ContributionLimits/index.html's own getEffectiveContribPct() /
  // computeAccountContribution() / projectBalanceSeries() — kept in sync by
  // hand, same as the limit lookups above. "prefix" matches that page's own
  // field-id convention ("401k" / "Hsa" / "Ira"), so contribMode+prefix and
  // contribPct+prefix resolve to the right saved fields directly.
  function journeyGetEffectiveContribPct(raw, prefix, income) {
    var mode = raw["contribMode" + prefix] || "pct";
    var rawVal = journeyNum(raw["contribPct" + prefix]) || 0;
    if (mode === "pct") return rawVal;
    var annualDollar = mode === "monthly" ? rawVal * 12 : rawVal;
    return income > 0 ? (annualDollar / income) * 100 : 0;
  }
  function journeyComputeAccountContribution(income, contribPct, matchPct, employeeLimit, combinedLimit) {
    var employeeAmt = income * (contribPct / 100);
    if (employeeLimit != null && employeeAmt > employeeLimit) employeeAmt = employeeLimit;
    var employerAmt = income * (matchPct / 100);
    var totalAmt = employeeAmt + employerAmt;
    if (totalAmt > combinedLimit) totalAmt = combinedLimit;
    return totalAmt;
  }
  function journeyProjectFinalBalance(startBalance, annualContrib, ageStart, ageEnd, returnPct) {
    if (ageEnd <= ageStart) return null;
    var r = returnPct / 100;
    var bal = startBalance;
    for (var a = ageStart; a < ageEnd; a++) {
      bal = bal * (1 + r) + annualContrib;
    }
    return bal;
  }

  // Picks the single furthest-behind-in-dollars account among 401(k)/HSA/
  // IRA and turns it into a per-paycheck "here's what maxing out actually
  // takes" tip — only fires once the user has entered real numbers on the
  // ContributionLimits page (a "have" amount > 0 for at least one account).
  function computeJourneyBenefitsInsight() {
    if (!window.FN_BENEFITS_LIMITS || !window.FN_BENEFITS_LIMITS.length) return null;
    var raw = readJourneyJSON("contributionLimitsInputs");
    if (!raw) return null;
    var yearData = window.FN_BENEFITS_LIMITS.filter(function (y) { return y.year === Number(raw.year); })[0] || window.FN_BENEFITS_LIMITS[0];
    var age = journeyNum(raw.age) || 0;
    var income = journeyNum(raw.income) || 0;
    var payPeriods = journeyNum(raw.payFreq) || 26;
    var accounts = [
      { label: "401(k)", prefix: "401k", have: journeyNum(raw.have401k) || 0, limit: journeyGet401kLimit(yearData, age) },
      { label: "HSA", prefix: "Hsa", have: journeyNum(raw.haveHsa) || 0, limit: journeyGetHsaLimit(yearData, age, raw.hsaCoverage) },
      { label: "IRA", prefix: "Ira", have: journeyNum(raw.haveIra) || 0, limit: journeyGetIraLimit(yearData, age) }
    ];
    var behind = accounts.filter(function (a) { return a.have > 0 && a.have < a.limit; });
    if (!behind.length) return null;
    behind.sort(function (a, b) { return (b.limit - b.have) - (a.limit - a.have); });
    var acc = behind[0];

    var isCurrentYear = yearData.year === new Date().getFullYear();
    var now = new Date();
    var remainingPeriods = payPeriods;
    var remainingMonths = 12;
    if (isCurrentYear) {
      var startOfYear = new Date(now.getFullYear(), 0, 1);
      var endOfYear = new Date(now.getFullYear(), 11, 31);
      var frac = Math.max(0, (endOfYear - now) / (endOfYear - startOfYear));
      remainingPeriods = Math.max(1, Math.round(payPeriods * frac));
      remainingMonths = Math.max(1, 12 - now.getMonth());
    }
    var remaining = acc.limit - acc.have;
    var perPaycheck = remaining / remainingPeriods;
    var text = "To max out your " + acc.label + " for " + yearData.year + ", you'd need about " + fmtUSD0(perPaycheck) +
      " per paycheck across your " + remainingPeriods + " remaining pay period" + (remainingPeriods === 1 ? "" : "s") +
      " (" + fmtUSD0(remaining) + " more on top of the " + fmtUSD0(acc.have) + " you've already put in).";

    // Second sentence: the paycheck figure above is a total-still-needed
    // number, not the ongoing contribution setting itself — this converts
    // it to the same $/month + % shape as the page's own "Your
    // Contribution" field, so it reads as "change the setting from X to Z"
    // instead of a one-off catch-up amount.
    if (income > 0) {
      var currentPct = journeyGetEffectiveContribPct(raw, acc.prefix, income);
      var currentMonthly = income * currentPct / 100 / 12;
      var neededMonthly = remaining / remainingMonths;
      var neededPct = (neededMonthly * 12 / income) * 100;
      if (neededMonthly > currentMonthly + 0.5) {
        text += " Based on your current setting of " + fmtUSD0(currentMonthly) + "/month (" + journeyFmt1(currentPct) +
          "%), you'd need to increase that to about " + fmtUSD0(neededMonthly) + "/month (" + journeyFmt1(neededPct) +
          "%) to hit the max by year-end.";
      } else {
        text += " Your current setting of " + fmtUSD0(currentMonthly) + "/month (" + journeyFmt1(currentPct) +
          "%) is already enough to get you there.";
      }
    }

    return {
      text: text,
      href: BASE + "ContributionLimits/index.html", label: "Contribution Limits"
    };
  }

  // Simplified monthly amortization — interest accrues on the remaining
  // balance, minimums get paid, and whatever's left of the extra payment
  // snowballs to the smallest balance (or avalanches to the highest APR),
  // matching DebtSnowball's own strategy choice. Good enough for a
  // rounded "~" planning tip, not meant to reproduce that page's own
  // month-by-month table exactly.
  function journeySimulateDebtPayoff(debts, extraPayment, strategy) {
    var working = debts.map(function (d) {
      return { balance: journeyNum(d.balance) || 0, apr: journeyNum(d.apr) || 0, minPayment: journeyNum(d.minPayment) || 0 };
    }).filter(function (d) { return d.balance > 0; });
    if (!working.length) return null;
    var months = 0, totalInterest = 0, maxMonths = 600;
    while (working.some(function (d) { return d.balance > 0.005; }) && months < maxMonths) {
      months++;
      working.forEach(function (d) {
        if (d.balance <= 0) return;
        var interest = d.balance * (d.apr / 100 / 12);
        totalInterest += interest;
        d.balance += interest;
      });
      working.forEach(function (d) {
        if (d.balance <= 0) return;
        d.balance -= Math.min(d.minPayment, d.balance);
      });
      var pool = extraPayment;
      var order = working.filter(function (d) { return d.balance > 0.005; });
      order.sort(function (a, b) { return strategy === "avalanche" ? b.apr - a.apr : a.balance - b.balance; });
      for (var i = 0; i < order.length && pool > 0.005; i++) {
        var pay = Math.min(pool, order[i].balance);
        order[i].balance -= pay;
        pool -= pay;
      }
    }
    return { months: months, totalInterest: totalInterest };
  }

  function computeJourneyDebtInsight() {
    var raw = readJourneyJSON("debtSnowballInputs");
    if (!raw || !Array.isArray(raw.debts) || !raw.debts.length) return null;
    var extraPayment = journeyNum(raw.extraPayment) || 0;
    var strategy = raw.strategy || "snowball";
    var baseline = journeySimulateDebtPayoff(raw.debts, extraPayment, strategy);
    if (!baseline || baseline.months >= 600) return null;
    var totalMin = raw.debts.reduce(function (s, d) { return s + (journeyNum(d.minPayment) || 0); }, 0);
    var bump = Math.max(25, Math.round((totalMin + extraPayment) * 0.10));
    var boosted = journeySimulateDebtPayoff(raw.debts, extraPayment + bump, strategy);
    if (!boosted || boosted.months >= baseline.months) return null;
    var interestSaved = baseline.totalInterest - boosted.totalInterest;
    if (interestSaved <= 0) return null;

    var baseDate = new Date(); baseDate.setMonth(baseDate.getMonth() + baseline.months);
    var boostDate = new Date(); boostDate.setMonth(boostDate.getMonth() + boosted.months);
    return {
      text: "With your current payments and rates, your debt will be paid off around " + formatJourneyMonthYear(baseDate) +
        " with about " + fmtUSD0(baseline.totalInterest) + " in interest. Adding " + fmtUSD0(bump) + "/month (about 10% more) could get you there by " +
        formatJourneyMonthYear(boostDate) + " and save roughly " + fmtUSD0(interestSaved) + " in interest.",
      href: BASE + "DebtSnowball/index.html", label: "Debt Snowball"
    };
  }

  // Same "years/contribution needed" math as TimeToFI's own
  // rateNeededForAge(), just returned as a raw monthly $ instead of a % of
  // income — compared against what fi-runway-inputs.currentRate implies
  // you're actually contributing today.
  function journeyMonthlyNeededForGoal(P, G, r, n) {
    if (P >= G) return 0;
    if (n <= 0) return null;
    var annualC;
    if (Math.abs(r) < 1e-9) {
      annualC = (G - P) / n;
    } else {
      var x = Math.pow(1 + r, n);
      annualC = (G - P * x) * r / (x - 1);
    }
    return annualC > 0 ? annualC / 12 : 0;
  }

  // Shared by the Insight sentence below and the maxed-out-retirement-
  // accounts insight further down — both need the same "how much more per
  // month, past what you're on pace for today, to hit your FI goal" gap.
  function computeJourneyFiGap() {
    var raw = readJourneyJSON("fi-runway-inputs");
    if (!raw || raw.currentRate === undefined || raw.currentRate === null || raw.currentRate === "") return null;
    var goal = journeyNum(raw.goal) || 0;
    var savings = journeyNum(raw.savings) || 0;
    var age = journeyNum(raw.age) || 0;
    var targetAge = journeyNum(raw.targetAge);
    var returnPct = journeyNum(raw.returnPct) || 0;
    var income = journeyNum(raw.income) || 0;
    var currentRate = journeyNum(raw.currentRate);
    if (!goal || !isFinite(targetAge) || targetAge <= age || income <= 0) return null;

    var neededMonthly = journeyMonthlyNeededForGoal(savings, goal, returnPct / 100, targetAge - age);
    if (neededMonthly === null || neededMonthly <= 0) return null;
    var currentMonthly = (income * currentRate / 100) / 12;
    var gap = neededMonthly - currentMonthly;
    if (gap <= 1) return null;

    return {
      goal: goal, targetAge: targetAge, returnPct: returnPct,
      neededMonthly: neededMonthly, currentMonthly: currentMonthly,
      gap: gap, gapAnnual: gap * 12, gapPct: (gap * 12) / income * 100
    };
  }

  function computeJourneyFiInsight() {
    var gap = computeJourneyFiGap();
    if (!gap) return null;
    return {
      text: "To meet your FI goal of " + fmtUSD0(gap.goal) + " by age " + journeyFmt1(gap.targetAge) + " at a " + journeyFmt1(gap.returnPct) +
        "% return, you'd need to save about " + fmtUSD0(gap.neededMonthly) + "/month. You're currently on pace for about " + fmtUSD0(gap.currentMonthly) +
        "/month — that's " + fmtUSD0(gap.gap) + " more per month (" + fmtUSD0(gap.gapAnnual) + "/yr, " + journeyFmt1(gap.gapPct) + "% of income) to get there.",
      href: BASE + "TimeToFI/index.html", label: "Time to FI"
    };
  }

  // Feeds the "Reach FI By Age" slider section below — unlike
  // computeJourneyFiGap() above (which needs TimeToFI's own saved
  // fi-runway-inputs, including a current-savings-rate the user typed
  // there), this only needs the shared "Your info" profile, so it works
  // for anyone who's filled that in regardless of which calculators
  // they've actually visited. Just the inputs; journeyMonthlyNeededForGoal()
  // (same formula, already used above) does the actual math per slider tick.
  function computeJourneyFiAgePlanner() {
    if (!window.FNProfile) return null;
    var profile = window.FNProfile.get();
    var age = window.FNProfile.getAge(profile);
    var goal = journeyNum(profile.goalAmount) || 0;
    if (age === null || !goal) return null;
    var savings = journeyNum(profile.currentSavings) || 0;
    var returnPct = journeyNum(profile.expectedReturn) || 0;
    var defaultAge = journeyNum(profile.retireAge);
    if (!isFinite(defaultAge) || defaultAge < 40 || defaultAge > 70) defaultAge = 65;
    return { age: age, savings: savings, goal: goal, returnPct: returnPct, defaultAge: Math.round(defaultAge) };
  }

  // Shared by the slider section's initial (server-rendered) result and its
  // live "input" handler in openJourneyModal() — same three-outcome shape
  // every time: not-yet-reachable (target age <= current age), already
  // there (current savings alone already clear the goal), or the normal
  // "here's the monthly number" case.
  function journeyFiAgeResult(data, targetAge) {
    var years = targetAge - data.age;
    var neededMonthly = years > 0 ? journeyMonthlyNeededForGoal(data.savings, data.goal, data.returnPct / 100, years) : null;
    if (neededMonthly === null) {
      return {
        amountText: "—",
        detail: "Pick an age after your current age (" + data.age + ") to see what it'd take."
      };
    }
    if (neededMonthly <= 0) {
      var fv = data.savings * Math.pow(1 + data.returnPct / 100, years);
      return {
        amountText: "$0/mo",
        detail: "You're already there — your " + fmtUSD0(data.savings) + " saved already covers your " + fmtUSD0(data.goal) +
          " goal. Left alone at a " + journeyFmt1(data.returnPct) + "% return, it'd grow to about " + fmtUSD0(fv) + " by age " + targetAge + "."
      };
    }
    return {
      amountText: fmtUSD0(neededMonthly) + "/mo",
      detail: "to reach " + fmtUSD0(data.goal) + " by age " + targetAge + " (" + years + " year" + (years === 1 ? "" : "s") +
        " from now), assuming a " + journeyFmt1(data.returnPct) + "% average annual return on the " + fmtUSD0(data.savings) + " you've got now."
    };
  }

  // Once every tax-advantaged account the user actually funds is maxed out,
  // there's no more room left in 401(k)/HSA/IRA — if the Time to FI gap
  // above is still open, the only place for that extra money to go is a
  // taxable brokerage or other outside account. Chains the two calculators'
  // own numbers together rather than inventing a new calculation.
  function computeJourneyMaxedRetirementGapInsight() {
    var raw = readJourneyJSON("contributionLimitsInputs");
    var hasLimitsData = !!(window.FN_BENEFITS_LIMITS && window.FN_BENEFITS_LIMITS.length);
    if (!raw || !hasLimitsData) return null;
    var yearData = window.FN_BENEFITS_LIMITS.filter(function (y) { return y.year === Number(raw.year); })[0] || window.FN_BENEFITS_LIMITS[0];
    var age = journeyNum(raw.age) || 0;
    var accounts = [
      { label: "401(k)", have: journeyNum(raw.have401k) || 0, limit: journeyGet401kLimit(yearData, age) },
      { label: "HSA", have: journeyNum(raw.haveHsa) || 0, limit: journeyGetHsaLimit(yearData, age, raw.hsaCoverage) },
      { label: "IRA", have: journeyNum(raw.haveIra) || 0, limit: journeyGetIraLimit(yearData, age) }
    ].filter(function (a) { return a.have > 0; });
    if (!accounts.length) return null;
    var allMaxed = accounts.every(function (a) { return a.limit > 0 && a.have >= a.limit; });
    if (!allMaxed) return null;

    var gap = computeJourneyFiGap();
    if (!gap) return null;

    var labels = accounts.map(function (a) { return a.label; });
    var labelStr = labels.length === 1 ? labels[0]
      : labels.length === 2 ? labels[0] + " and " + labels[1]
      : labels.slice(0, -1).join(", ") + ", and " + labels[labels.length - 1];
    return {
      text: "You're maxing out your " + labelStr + (labels.length === 1 ? "" : " accounts") + ", but still need about " +
        fmtUSD0(gap.gap) + "/month (" + fmtUSD0(gap.gapAnnual) + "/yr) more to reach your FI goal of " + fmtUSD0(gap.goal) +
        " by age " + journeyFmt1(gap.targetAge) + " — that extra will need to go into a taxable brokerage or other account outside your tax-advantaged limits.",
      href: BASE + "ContributionLimits/index.html", label: "Contribution Limits"
    };
  }

  // Emergency Fund completion date — a real compound-growth projection
  // (contribution + APY compounding monthly), not naive division, since
  // emergencyFundInputs already stores both.
  // Shared by the Insight sentence below and the Emergency Fund card's
  // inline "what if" slider — both need the same compound-growth months-
  // to-target loop, just at a different contribution amount (the saved one
  // vs. whatever the slider is currently set to).
  function journeyEfMonthsToTarget(target, current, contribution, apy) {
    if (target <= 0 || current >= target || contribution <= 0) return null;
    var monthlyRate = apy / 100 / 12;
    var balance = current, months = 0, maxMonths = 600;
    while (balance < target && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + contribution;
      months++;
    }
    return months < maxMonths ? months : null;
  }

  function computeJourneyEfInsight() {
    var raw = readJourneyJSON("emergencyFundInputs");
    if (!raw) return null;
    var target = (journeyNum(raw.monthlyExpenses) || 0) * (journeyNum(raw.targetMonths) || 0);
    var current = journeyNum(raw.currentEfSavings) || 0;
    var contribution = journeyNum(raw.monthlyContribution) || 0;
    var apy = journeyNum(raw.apy) || 0;
    var months = journeyEfMonthsToTarget(target, current, contribution, apy);
    if (months === null) return null;
    var doneDate = new Date(); doneDate.setMonth(doneDate.getMonth() + months);
    return {
      text: "At " + fmtUSD0(contribution) + "/month" + (apy > 0 ? " plus " + journeyFmt1(apy) + "% APY" : "") +
        ", your Emergency Fund will be fully funded by ~" + formatJourneyMonthYear(doneDate) + ".",
      href: BASE + "EmergencyFund/index.html", label: "Emergency Fund"
    };
  }

  // Round-number milestones for the Net Worth projection below — picks the
  // smallest one strictly above the current balance, unless the user's own
  // Time to FI goal is a nearer, more meaningful target to project toward.
  var JOURNEY_NET_WORTH_MILESTONES = [10000, 25000, 50000, 100000, 150000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000, 10000000];

  // Shared by the Net Worth Insight sentence below and the "Coming Up"
  // forecast list — both need the same "next round-number milestone (or
  // your real FI goal, if it's the nearer target) at the current savings
  // rate" projection, just wrapped in different words.
  function computeJourneyNetWorthMilestoneProjection() {
    var history = readJourneyHistoryArr("netWorthHistory");
    if (history.length < 2) return null;
    var sorted = history.slice().sort(function (a, b) { return (a.date || "") < (b.date || "") ? -1 : 1; });
    var first = sorted[0], last = sorted[sorted.length - 1];
    var spanDays = journeyDaysBetween(first.date, last.date);
    if (spanDays < 14) return null;
    var rate = (last.netWorth - first.netWorth) / spanDays;
    if (rate <= 0) return null;

    var currentNW = last.netWorth;
    var target, targetLabel;
    var fiRaw = readJourneyJSON("fi-runway-inputs");
    var fiGoal = fiRaw ? (journeyNum(fiRaw.goal) || 0) : 0;
    if (fiGoal >= 1000 && fiGoal > currentNW) {
      target = fiGoal;
      targetLabel = "your FI goal of " + fmtUSD0(fiGoal);
    } else {
      target = JOURNEY_NET_WORTH_MILESTONES.filter(function (m) { return m > currentNW; })[0];
      if (!target) target = (Math.floor(currentNW / 1000000) + 1) * 1000000;
      targetLabel = fmtUSD0(target);
    }
    var daysToTarget = (target - currentNW) / rate;
    if (!isFinite(daysToTarget) || daysToTarget <= 0) return null;
    var targetDate = new Date(); targetDate.setDate(targetDate.getDate() + Math.round(daysToTarget));
    return { targetLabel: targetLabel, targetDate: targetDate };
  }

  function computeJourneyNetWorthInsight() {
    var proj = computeJourneyNetWorthMilestoneProjection();
    if (!proj) return null;
    return {
      text: "At your current pace, your net worth is on track to reach " + proj.targetLabel + " by ~" + formatJourneyMonthYear(proj.targetDate) + ".",
      href: BASE + "NetWorth/index.html", label: "Net Worth"
    };
  }

  // Once debt is gone, every dollar that was going to minimum payments +
  // the extra payment is freed up — this shows how much of the Time to FI
  // monthly gap (see computeJourneyFiInsight above) that freed cash flow
  // would cover, chaining the two calculators' own math together rather
  // than tracking anything new.
  function computeJourneyDebtToFiInsight() {
    var debtRaw = readJourneyJSON("debtSnowballInputs");
    if (!debtRaw || !Array.isArray(debtRaw.debts) || !debtRaw.debts.length) return null;
    var extraPayment = journeyNum(debtRaw.extraPayment) || 0;
    var strategy = debtRaw.strategy || "snowball";
    var baseline = journeySimulateDebtPayoff(debtRaw.debts, extraPayment, strategy);
    if (!baseline || baseline.months >= 600) return null;
    var totalMin = debtRaw.debts.reduce(function (s, d) { return s + (journeyNum(d.minPayment) || 0); }, 0);
    var freedMonthly = totalMin + extraPayment;
    if (freedMonthly <= 0) return null;

    var fiRaw = readJourneyJSON("fi-runway-inputs");
    if (!fiRaw || fiRaw.currentRate === undefined || fiRaw.currentRate === null || fiRaw.currentRate === "") return null;
    var goal = journeyNum(fiRaw.goal) || 0;
    var savings = journeyNum(fiRaw.savings) || 0;
    var age = journeyNum(fiRaw.age) || 0;
    var targetAge = journeyNum(fiRaw.targetAge);
    var returnPct = journeyNum(fiRaw.returnPct) || 0;
    var income = journeyNum(fiRaw.income) || 0;
    var currentRate = journeyNum(fiRaw.currentRate);
    if (!goal || !isFinite(targetAge) || targetAge <= age || income <= 0) return null;

    var neededMonthly = journeyMonthlyNeededForGoal(savings, goal, returnPct / 100, targetAge - age);
    if (neededMonthly === null || neededMonthly <= 0) return null;
    var currentMonthly = (income * currentRate / 100) / 12;
    var gap = neededMonthly - currentMonthly;
    if (gap <= 1) return null;

    var payoffDate = new Date(); payoffDate.setMonth(payoffDate.getMonth() + baseline.months);
    var newGap = Math.max(0, gap - freedMonthly);
    var text;
    if (newGap <= 1) {
      text = "Once your debt is paid off around " + formatJourneyMonthYear(payoffDate) + ", redirecting that freed-up " + fmtUSD0(freedMonthly) +
        "/month to savings would fully close your Time to FI gap — no shortfall left.";
    } else {
      var coverage = Math.min(100, (freedMonthly / gap) * 100);
      text = "Once your debt is paid off around " + formatJourneyMonthYear(payoffDate) + ", redirecting that freed-up " + fmtUSD0(freedMonthly) +
        "/month to savings would cover about " + journeyFmt1(coverage) + "% of your Time to FI gap, leaving about " + fmtUSD0(newGap) + "/month still needed.";
    }
    return { text: text, href: BASE + "TimeToFI/index.html", label: "Time to FI" };
  }

  // Avalanche (highest APR first) is always at least as interest-efficient
  // as Snowball (smallest balance first) for the same debts and payments —
  // this only ever has something to say when the user picked Snowball and
  // the two strategies would actually land differently.
  function computeJourneyDebtStrategyInsight() {
    var raw = readJourneyJSON("debtSnowballInputs");
    if (!raw || !Array.isArray(raw.debts) || raw.debts.length < 2) return null;
    var extraPayment = journeyNum(raw.extraPayment) || 0;
    var currentStrategy = raw.strategy || "snowball";
    var otherStrategy = currentStrategy === "avalanche" ? "snowball" : "avalanche";
    var current = journeySimulateDebtPayoff(raw.debts, extraPayment, currentStrategy);
    var other = journeySimulateDebtPayoff(raw.debts, extraPayment, otherStrategy);
    if (!current || !other || current.months >= 600 || other.months >= 600) return null;
    var interestDiff = current.totalInterest - other.totalInterest;
    if (interestDiff <= 1) return null;

    var otherLabel = otherStrategy === "avalanche" ? "Avalanche (highest interest rate first)" : "Snowball (smallest balance first)";
    return {
      text: "You're using the " + (currentStrategy === "avalanche" ? "Avalanche" : "Snowball") + " strategy. Switching to " + otherLabel +
        " would save you roughly " + fmtUSD0(interestDiff) + " in interest over the life of your debts — the tradeoff is losing the quick psychological wins of clearing small balances first.",
      href: BASE + "DebtSnowball/index.html", label: "Debt Snowball"
    };
  }

  // A quiet heads-up the year a catch-up contribution actually kicks in —
  // uses the live-computed profile age (not a possibly-stale saved input)
  // so it surfaces for anyone with a birthday set, whether or not they've
  // ever visited Contribution Limits.
  // Fires every visit once you're 50+, not just in the exact calendar year
  // you turn 50/55/60 — the original one-shot version meant missing the
  // modal that one year lost the nudge forever, even though catch-up
  // eligibility is permanent from that age on. Each account is only
  // mentioned while there's still real room left in it (via the same
  // "have" vs. limit comparison the Contribution Limits card itself uses),
  // so someone already maxing out isn't reminded about room they've
  // already claimed.
  function computeJourneyCatchupInsight() {
    if (!window.FN_BENEFITS_LIMITS || !window.FN_BENEFITS_LIMITS.length) return null;
    if (!window.FNProfile || typeof window.FNProfile.getAge !== "function") return null;
    var age = window.FNProfile.getAge();
    if (age === null || age < 50) return null;
    var yearData = window.FN_BENEFITS_LIMITS[0];
    var contribRaw = readJourneyJSON("contributionLimitsInputs");

    function stillHasRoom(have, limit) {
      return have === null || have < limit;
    }
    var have401k = contribRaw ? (journeyNum(contribRaw.have401k) || 0) : null;
    var haveIra = contribRaw ? (journeyNum(contribRaw.haveIra) || 0) : null;
    var haveHsa = contribRaw ? (journeyNum(contribRaw.haveHsa) || 0) : null;
    var hsaCoverage = contribRaw ? contribRaw.hsaCoverage : null;

    var notes = [];

    // journeyGet401kLimit already resolves to the right band (standard 50+
    // rate, or the enhanced 60–63 rate) for the given age, so the catch-up
    // dollar amount itself doesn't need separate branching here.
    var limit401k = journeyGet401kLimit(yearData, age);
    var catchup401k = limit401k - yearData.k401.employee;
    if (catchup401k > 0 && stillHasRoom(have401k, limit401k)) {
      notes.push(age === 50
        ? "401(k) catch-up (+" + fmtUSD0(catchup401k) + ") kicks in this year"
        : (age === 60 && yearData.k401.catchup60to63 != null)
          ? "your 401(k) catch-up jumps to " + fmtUSD0(catchup401k) + " for the next 4 years"
          : "401(k) catch-up (+" + fmtUSD0(catchup401k) + ") is available");
    }

    var limitIra = journeyGetIraLimit(yearData, age);
    if (stillHasRoom(haveIra, limitIra)) {
      notes.push(age === 50
        ? "IRA catch-up (+" + fmtUSD0(yearData.ira.catchup50) + ") kicks in this year"
        : "IRA catch-up (+" + fmtUSD0(yearData.ira.catchup50) + ") is available");
    }

    if (age >= 55) {
      var limitHsa = journeyGetHsaLimit(yearData, age, hsaCoverage);
      if (stillHasRoom(haveHsa, limitHsa)) {
        notes.push(age === 55
          ? "your HSA catch-up (+" + fmtUSD0(yearData.hsa.catchup55) + "/yr) kicks in this year"
          : "your HSA catch-up (+" + fmtUSD0(yearData.hsa.catchup55) + "/yr) is available");
      }
    }

    if (!notes.length) return null;
    var headline = (age === 50 || age === 55 || age === 60) ? ("Turning " + age + " this year: ") : (age + " years old: ");
    return {
      text: headline + notes.join("; ") + ".",
      href: BASE + "ContributionLimits/index.html", label: "Contribution Limits"
    };
  }

  function computeJourneyInsights() {
    var insights = [];
    var benefits = computeJourneyBenefitsInsight();
    if (benefits) insights.push(benefits);
    var debt = computeJourneyDebtInsight();
    if (debt) insights.push(debt);
    var fi = computeJourneyFiInsight();
    if (fi) insights.push(fi);
    var maxedGap = computeJourneyMaxedRetirementGapInsight();
    if (maxedGap) insights.push(maxedGap);
    var ef = computeJourneyEfInsight();
    if (ef) insights.push(ef);
    var netWorth = computeJourneyNetWorthInsight();
    if (netWorth) insights.push(netWorth);
    var debtToFi = computeJourneyDebtToFiInsight();
    if (debtToFi) insights.push(debtToFi);
    var debtStrategy = computeJourneyDebtStrategyInsight();
    if (debtStrategy) insights.push(debtStrategy);
    var catchup = computeJourneyCatchupInsight();
    if (catchup) insights.push(catchup);
    return insights;
  }

  // "Coming Up" — the forward-looking sibling to Achievements below, one
  // pace-based ETA per card that still has a finish line ahead of it.
  // Reuses the exact same projection math already computed per-card
  // (computeJourneyPctProjection / computeJourneyZeroProjection / Net
  // Worth's own milestone projection) rather than a separate estimate, so
  // this list can never disagree with what a card's own "On track for
  // ~..." line already says.
  function computeJourneyComingUp(cards, journeyHistory) {
    var byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });
    var items = [];

    var nw = byId["net-worth"];
    if (nw && nw.started) {
      var nwProj = computeJourneyNetWorthMilestoneProjection();
      if (nwProj) items.push({ color: nw.color, text: "Net Worth: " + nwProj.targetLabel + " by ~" + formatJourneyMonthYear(nwProj.targetDate), href: nw.href });
    }
    var tfi = byId["time-to-fi"];
    if (tfi && tfi.started && tfi.pct !== null && tfi.pct < 100) {
      var tfiDate = computeJourneyPctProjection("time-to-fi", journeyHistory);
      if (tfiDate) items.push({ color: tfi.color, text: "Time to FI: hit your FI number by ~" + tfiDate, href: tfi.href });
    }
    var ef = byId["emergency-fund"];
    if (ef && ef.started && ef.pct !== null && ef.pct < 100) {
      var efDate = computeJourneyPctProjection("emergency-fund", journeyHistory);
      if (efDate) items.push({ color: ef.color, text: "Emergency Fund: fully funded by ~" + efDate, href: ef.href });
    }
    var ds = byId["debt-snowball"];
    if (ds && ds.started && ds.value !== null && ds.value > 0) {
      var dsDate = computeJourneyZeroProjection("debt-snowball", journeyHistory);
      if (dsDate) items.push({ color: ds.color, text: "Debt Payoff: debt-free by ~" + dsDate, href: ds.href });
    }
    var rfi = byId["reverse-time-to-fi"];
    if (rfi && rfi.started && rfi.pct !== null && rfi.pct < 100) {
      var rfiDate = computeJourneyPctProjection("reverse-time-to-fi", journeyHistory);
      if (rfiDate) items.push({ color: rfi.color, text: "Spending-Based FI: reach your number by ~" + rfiDate, href: rfi.href });
    }
    // FIRE Milestones' next-milestone ETA is a direct formula result (years
    // out from today), not a trend read off logged history like the others
    // above — so unlike them it doesn't need 14+ days of prior visits to
    // show up.
    var fm = byId["fire-milestones"];
    if (fm && fm.started && fm.nextMilestone) {
      var fmDate = new Date();
      fmDate.setMonth(fmDate.getMonth() + Math.round(fm.nextMilestone.years * 12));
      items.push({ color: fm.color, text: "FIRE Milestones: " + fm.nextMilestone.label + " by ~" + formatJourneyMonthYear(fmDate), href: fm.href });
    }
    return items.slice(0, 4);
  }

  // Achievements — every distinct milestone any card has ever crossed,
  // reusing the milestone text already stored in each day's snapshot
  // rather than tracking anything new. Keeps a milestone's *earliest*
  // logged date even if a later, "bigger" milestone superseded it on that
  // same card, since it's still a real thing the user accomplished.
  function computeJourneyAchievements(history, cards) {
    var labels = {};
    cards.forEach(function (c) { labels[c.id] = { label: c.label, color: c.color }; });
    var seen = {};
    history.forEach(function (entry) {
      if (!entry.cards) return;
      Object.keys(entry.cards).forEach(function (id) {
        var cd = entry.cards[id];
        if (!cd || !cd.milestone) return;
        var key = id + "|" + cd.milestone;
        if (!seen[key] || entry.date < seen[key].date) {
          seen[key] = { id: id, text: cd.milestone, date: entry.date };
        }
      });
    });
    var list = Object.keys(seen).map(function (k) { return seen[k]; }).filter(function (a) { return !!labels[a.id]; });
    list.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return list.slice(0, 6).map(function (a) {
      return { id: a.id, text: a.text, date: a.date, label: labels[a.id].label, color: labels[a.id].color };
    });
  }

  // Mirrors NetWorth/index.html's own field groups (each input there
  // carries a data-group attribute this reads off of) — kept in sync by
  // hand, same convention as the benefits-limit lookups above. Lets the Net
  // Worth card fall back to live, never-logged field values instead of
  // going blank until the user remembers to click "Log snapshot."
  var JOURNEY_NW_ASSET_IDS = ["ca_checking", "ca_savings", "ca_otherBank", "ca_brokerage1", "ca_brokerage2", "ca_crypto1", "ca_otherInvestment", "lta_401k1", "lta_401k2", "lta_rothIra", "lta_traditionalIra", "lta_hsa", "lta_otherRetirement", "lta_cars", "lta_house"];
  var JOURNEY_NW_LIABILITY_IDS = ["cl_cc1", "cl_cc2", "cl_cc3", "cl_cc4", "cl_cc5", "cl_otherDebt1", "cl_otherDebt2", "ltl_studentLoan1", "ltl_studentLoan2", "ltl_carLoan", "ltl_mortgage", "ltl_otherLoans"];
  function journeySumFields(raw, ids) {
    var total = 0;
    for (var i = 0; i < ids.length; i++) {
      var n = journeyNum(raw[ids[i]]);
      if (!isNaN(n)) total += n;
    }
    return total;
  }

  // Mirrors BudgetCalculator/index.html's own LINE_ITEM_LABELS field-id
  // groups — kept in sync by hand, same convention as the Net Worth field
  // groups above. Lets the Monthly Budget card fall back to live,
  // never-logged field values instead of going blank until the user
  // remembers to click "Log this month."
  var JOURNEY_BC_NEEDS_IDS = ["n_housing", "n_utilities", "n_groceries", "n_transportation", "n_insurance", "n_minDebt", "n_healthcare", "n_other"];
  var JOURNEY_BC_WANTS_IDS = ["w_dining", "w_entertainment", "w_shopping", "w_travel", "w_other"];
  var JOURNEY_BC_SAVINGS_IDS = ["s_retirement", "s_extraDebt", "s_other"];

  // Mirrors FireMilestones/index.html's own simulateBalances()/findReach()/
  // findCoastReach() — kept in sync by hand, same convention as the other
  // "mirrors X page" helpers above.
  function journeyFireSimulateBalances(currentSavings, annualContribution, r, maxYears) {
    var balances = [currentSavings];
    for (var y = 1; y <= maxYears; y++) {
      balances[y] = balances[y - 1] * (1 + r) + annualContribution;
    }
    return balances;
  }
  function journeyFireFindReach(balances, target, currentAge) {
    if (balances[0] >= target) return { achieved: true, years: 0, age: currentAge };
    for (var y = 1; y < balances.length; y++) {
      if (balances[y] >= target) return { achieved: true, years: y, age: currentAge + y };
    }
    return { achieved: false, years: null, age: null };
  }
  function journeyFireFindCoastReach(balances, traditionalTarget, currentAge, retireAge, r) {
    for (var y = 0; y < balances.length; y++) {
      var age = currentAge + y;
      var yearsRemaining = Math.max(0, retireAge - age);
      var requiredNow = traditionalTarget / Math.pow(1 + r, yearsRemaining);
      if (balances[y] >= requiredNow) return { achieved: true, years: y, age: age };
    }
    return { achieved: false, years: null, age: null };
  }

  function computeJourneyCards() {
    var cards = [];

    // ---- Net Worth (netWorthHistory: [{date, assets, liabilities, netWorth}]) ----
    (function () {
      var history = readJourneyJSON("netWorthHistory");
      var hasHistory = Array.isArray(history) && history.length > 0;
      var latest = null, prev = null, sorted = null;
      if (hasHistory) {
        sorted = history.slice().sort(function (a, b) {
          return (a.date || "") < (b.date || "") ? -1 : 1;
        });
        latest = sorted[sorted.length - 1];
        prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
      }

      // No logged history yet — fall back to whatever's actually sitting in
      // the page's live fields rather than showing "no data" when there
      // plainly is some.
      var liveNetWorth = null, liveAssets = null, liveLiabilities = null;
      if (!hasHistory) {
        var liveRaw = readJourneyJSON("netWorthInputs");
        if (liveRaw) {
          liveAssets = journeySumFields(liveRaw, JOURNEY_NW_ASSET_IDS);
          liveLiabilities = journeySumFields(liveRaw, JOURNEY_NW_LIABILITY_IDS);
          if (liveAssets > 0 || liveLiabilities > 0) liveNetWorth = liveAssets - liveLiabilities;
        }
      }

      var started = hasHistory || liveNetWorth !== null;
      var displayNetWorth = hasHistory ? latest.netWorth : liveNetWorth;
      cards.push({
        id: "net-worth", label: "Net Worth", href: BASE + "NetWorth/index.html", color: "gold",
        started: started, pct: null, value: displayNetWorth,
        assetsValue: hasHistory ? latest.assets : liveAssets,
        liabilitiesValue: hasHistory ? latest.liabilities : liveLiabilities,
        statLine: started ? fmtUSD0(displayNetWorth) : null,
        subLine: hasHistory
          ? (prev
              ? (latest.netWorth >= prev.netWorth ? "↑ up since your last snapshot" : "↓ down since your last snapshot")
              : "Latest logged snapshot")
          : (liveNetWorth !== null ? "Entered but not logged yet — log a snapshot to start tracking the trend" : "Log a snapshot to start tracking"),
        sparkline: hasHistory ? sorted.slice(-10).map(function (h) { return h.netWorth; }) : null,
        // The highest round-number milestone currently cleared, not just
        // "positive or not" — each threshold crossed on a different logged
        // visit becomes its own distinct Achievement over time (see
        // computeJourneyAchievements), the same way Time to FI's 25/50/75%
        // stops do below.
        milestone: (started && displayNetWorth > 0)
          ? (function () {
              var crossed = JOURNEY_NET_WORTH_MILESTONES.filter(function (m) { return displayNetWorth >= m; });
              return crossed.length
                ? { text: fmtUSD0(crossed[crossed.length - 1]) + " net worth!" }
                : { text: "Positive net worth" };
            })()
          : null
      });
    })();

    // ---- Time to FI (fi-runway-inputs: {goal, savings, ...}) ----
    (function () {
      var raw = readJourneyJSON("fi-runway-inputs");
      var started = !!raw;
      var goal = 0, savings = 0, pct = null, goalLooksInvalid = false;
      if (started) {
        goal = journeyNum(raw.goal) || 0;
        savings = journeyNum(raw.savings) || 0;
        // A real FI goal is never under $1,000 — this small a number almost
        // always means an in-progress edit got interrupted before the new
        // value finished being typed (see saveInputs()'s own comment on
        // TimeToFI). Flagging it beats silently showing a nonsense % or
        // "you've hit your goal!" off a $3 target.
        goalLooksInvalid = goal > 0 && goal < 1000;
        pct = goal > 0 ? (savings / goal) * 100 : 0;
      }
      cards.push({
        id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html", color: "plum",
        started: started, pct: (started && !goalLooksInvalid) ? Math.min(100, pct) : null, value: started ? savings : null,
        statLine: started ? fmtUSD0(savings) + " of " + fmtUSD0(goal) : null,
        subLine: started
          ? (goalLooksInvalid ? "Goal amount looks too low — double-check it on Time to FI" : Math.round(Math.min(100, pct)) + "% of your FI number")
          : "Set your FI goal to start tracking",
        milestone: (started && !goalLooksInvalid)
          ? (pct >= 100 ? { text: "You’ve hit your FI number!" }
              : pct >= 75 ? { text: "75% of the way there!" }
              : pct >= 50 ? { text: "Halfway there!" }
              : pct >= 25 ? { text: "25% of the way there!" }
              : null)
          : null
      });
    })();

    // ---- Emergency Fund (emergencyFundInputs: {monthlyExpenses, targetMonths, currentEfSavings}) ----
    (function () {
      var raw = readJourneyJSON("emergencyFundInputs");
      var started = !!raw;
      var target = 0, current = 0, pct = null, targetLooksInvalid = false;
      if (started) {
        target = (journeyNum(raw.monthlyExpenses) || 0) * (journeyNum(raw.targetMonths) || 0);
        current = journeyNum(raw.currentEfSavings) || 0;
        // A real emergency-fund target is never under $100 — this small a
        // number almost always means an in-progress edit to monthly
        // expenses or target months got interrupted before finishing.
        targetLooksInvalid = target > 0 && target < 100;
        pct = target > 0 ? (current / target) * 100 : 0;
      }
      cards.push({
        id: "emergency-fund", label: "Emergency Fund", href: BASE + "EmergencyFund/index.html", color: "jade",
        started: started, pct: (started && !targetLooksInvalid) ? Math.min(100, pct) : null, value: started ? current : null,
        statLine: started ? fmtUSD0(current) + " of " + fmtUSD0(target) : null,
        subLine: started
          ? (targetLooksInvalid ? "Target looks too low — double-check it on Emergency Fund" : Math.round(Math.min(100, pct)) + "% funded")
          : "Set your target to start tracking",
        milestone: (started && !targetLooksInvalid)
          ? (pct >= 100 ? { text: "Fully funded!" } : pct >= 50 ? { text: "Halfway funded!" } : null)
          : null
      });
    })();

    // ---- Debt Snowball (debtSnowballInputs: {debts: [{balance, ...}]}) ----
    (function () {
      var raw = readJourneyJSON("debtSnowballInputs");
      var started = !!raw && Array.isArray(raw.debts) && raw.debts.length > 0;
      var total = 0, count = 0;
      if (started) {
        raw.debts.forEach(function (d) {
          total += journeyNum(d.balance) || 0;
          count += 1;
        });
      }

      // The strategy-order target debt — whichever one an extra payment (or
      // a newly-incurred charge) would actually apply to, matching
      // journeySimulateDebtPayoff's own ordering (smallest balance first for
      // snowball, highest APR first for avalanche). Used by the quick-edit
      // form below; computed here since this is the one place that already
      // has the raw debts array in hand.
      var strategy = started ? (raw.strategy || "snowball") : "snowball";
      var targetDebtIdx = -1, targetDebtLabel = null;
      if (started) {
        var liveIdxs = raw.debts.map(function (d, i) { return i; }).filter(function (i) { return (journeyNum(raw.debts[i].balance) || 0) > 0; });
        if (liveIdxs.length) {
          liveIdxs.sort(function (a, b) {
            return strategy === "avalanche"
              ? (journeyNum(raw.debts[b].apr) || 0) - (journeyNum(raw.debts[a].apr) || 0)
              : (journeyNum(raw.debts[a].balance) || 0) - (journeyNum(raw.debts[b].balance) || 0);
          });
          targetDebtIdx = liveIdxs[0];
          targetDebtLabel = raw.debts[targetDebtIdx].name || ("Debt #" + (targetDebtIdx + 1));
        }
      }

      // % paid off milestones need a baseline to measure against — debt
      // payoff has no natural "target" the way a savings goal does, so this
      // uses the earliest logged debt-snowball value in journeyProgressHistory
      // as the starting point (first-ever recorded balance, not the account's
      // true original balance, but the closest thing available without
      // asking the user to enter one separately). That means a first-ever
      // visit with real, pre-existing debt has no baseline to compare
      // against yet — hasBaseline below tracks that so the sub-line can say
      // so explicitly instead of silently showing no progress at all.
      var milestone = null;
      var hasBaseline = false;
      if (started) {
        if (total <= 0) {
          milestone = { text: "Debt-free!" };
          hasBaseline = true;
        } else {
          var debtHistory = readJourneyHistoryArr("journeyProgressHistory");
          var earliestDebtValue = null;
          for (var dhi = 0; dhi < debtHistory.length; dhi++) {
            var dcd = debtHistory[dhi].cards && debtHistory[dhi].cards["debt-snowball"];
            if (dcd && dcd.value !== null && dcd.value !== undefined) { earliestDebtValue = dcd.value; break; }
          }
          hasBaseline = earliestDebtValue !== null;
          if (earliestDebtValue && earliestDebtValue > total) {
            var pctPaid = ((earliestDebtValue - total) / earliestDebtValue) * 100;
            if (pctPaid >= 75) milestone = { text: "75% of your debt paid off!" };
            else if (pctPaid >= 50) milestone = { text: "Half your debt paid off!" };
            else if (pctPaid >= 25) milestone = { text: "25% of your debt paid off!" };
          }
        }
      }

      cards.push({
        id: "debt-snowball", label: "Debt Payoff", href: BASE + "DebtSnowball/index.html", color: "rust",
        started: started, pct: null, value: started ? total : null,
        statLine: started ? fmtUSD0(total) + " remaining" : null,
        subLine: started
          ? ("Across " + count + " debt" + (count === 1 ? "" : "s") + (total > 0 && !hasBaseline ? " — tracking starts now, check back next visit for progress" : ""))
          : "Add your debts to start tracking payoff",
        milestone: milestone,
        strategy: strategy, targetDebtIdx: targetDebtIdx, targetDebtLabel: targetDebtLabel
      });
    })();

    // ---- Reverse Time to FI (firenate_fi_calculator_v1: {currentSavings, expenses:[{amount,freq}], withdrawalRate}) ----
    (function () {
      var raw = readJourneyJSON("firenate_fi_calculator_v1");
      var started = !!raw;
      var fiNumber = 0, savings = 0, pct = null, fiNumberLooksInvalid = false;
      if (started) {
        var totalAnnual = 0;
        (raw.expenses || []).forEach(function (e) {
          var mult = JOURNEY_FREQ_TO_ANNUAL[e.freq] || 12;
          totalAnnual += (journeyNum(e.amount) || 0) * mult;
        });
        var wr = journeyNum(raw.withdrawalRate) || 4;
        fiNumber = wr > 0 ? totalAnnual / (wr / 100) : 0;
        savings = journeyNum(raw.currentSavings) || 0;
        // A real expense-derived FI number is never under $1,000 — this
        // small a number almost always means an interrupted edit to one of
        // the underlying expense amounts.
        fiNumberLooksInvalid = fiNumber > 0 && fiNumber < 1000;
        pct = fiNumber > 0 ? (savings / fiNumber) * 100 : 0;
      }
      cards.push({
        // Labeled "Spending-Based FI" here rather than the page's own name
        // ("Reverse Time to FI") — that name reads clearly as a page title
        // but was confusing people as a dashboard card label, since this
        // card only surfaces the expense-derived FI-number math (savings
        // vs. an FI number computed from stated spending), not the page's
        // full "work backward from a target retirement date" feature. Also
        // distinguishes it at a glance from "Time to FI", whose number is a
        // manually-entered goal rather than one derived from expenses.
        id: "reverse-time-to-fi", label: "Spending-Based FI", href: BASE + "ReverseTimeToFI/index.html", color: "gold",
        started: started, pct: (started && !fiNumberLooksInvalid) ? Math.min(100, pct) : null, value: started ? savings : null,
        statLine: started ? fmtUSD0(savings) + " of " + fmtUSD0(fiNumber) : null,
        subLine: started
          ? (fiNumberLooksInvalid ? "Expense total looks too low — double-check it on Spending-Based FI" : Math.round(Math.min(100, pct)) + "% of your number")
          : "Build your expense list to start tracking",
        milestone: (started && !fiNumberLooksInvalid)
          ? (pct >= 100 ? { text: "You could retire today!" }
              : pct >= 75 ? { text: "75% of the way there!" }
              : pct >= 50 ? { text: "Halfway there!" }
              : pct >= 25 ? { text: "25% of the way there!" }
              : null)
          : null,
        note: "Reverse FI"
      });
    })();

    // ---- Contribution Limits (contributionLimitsInputs: {year, age, income, payFreq, have401k, haveHsa, haveIra, hsaCoverage, contribPct401k, matchPct401k, balance401k, contribMode401k, retireAge, returnPct, ...}) ----
    (function () {
      var raw = readJourneyJSON("contributionLimitsInputs");
      var hasLimitsData = !!(window.FN_BENEFITS_LIMITS && window.FN_BENEFITS_LIMITS.length);
      var started = !!raw && hasLimitsData;
      var bars = null, maxedCount = 0, overallPct = null, projected = null, projectedGoal = null;
      if (started) {
        var yearData = window.FN_BENEFITS_LIMITS.filter(function (y) { return y.year === Number(raw.year); })[0] || window.FN_BENEFITS_LIMITS[0];
        var age = journeyNum(raw.age) || 0;
        var income = journeyNum(raw.income) || 0;
        var retireAge = journeyNum(raw.retireAge) || 65;
        var returnPct = journeyNum(raw.returnPct) || 7;
        var accounts = [
          { prefix: "401k", label: "401(k)", have: journeyNum(raw.have401k) || 0, limit: journeyGet401kLimit(yearData, age),
            employeeLimit: journeyGet401kLimit(yearData, age), combinedLimit: yearData.k401.overall415c, color: "gold" },
          { prefix: "Hsa", label: "HSA", have: journeyNum(raw.haveHsa) || 0, limit: journeyGetHsaLimit(yearData, age, raw.hsaCoverage),
            employeeLimit: null, combinedLimit: journeyGetHsaLimit(yearData, age, raw.hsaCoverage), color: "jade" },
          { prefix: "Ira", label: "IRA", have: journeyNum(raw.haveIra) || 0, limit: journeyGetIraLimit(yearData, age),
            employeeLimit: null, combinedLimit: journeyGetIraLimit(yearData, age), color: "rust" }
        ];
        bars = accounts.map(function (a) {
          var pct = a.limit > 0 ? Math.min(100, (a.have / a.limit) * 100) : 0;
          if (pct >= 100) maxedCount++;
          return { label: a.label, pct: pct, have: a.have, limit: a.limit, color: a.color };
        });
        overallPct = bars.reduce(function (s, b) { return s + b.pct; }, 0) / bars.length;

        // Same FI-goal source (and >= $1,000 sanity floor against an
        // interrupted-edit dollar amount) already used by the other
        // goal-comparison insights — lets the projected balances answer
        // "how much of my actual retirement goal does this get me to?"
        // rather than just sitting as bare dollar figures.
        var fiRaw = readJourneyJSON("fi-runway-inputs");
        var fiGoal = fiRaw ? (journeyNum(fiRaw.goal) || 0) : 0;
        if (!(fiGoal >= 1000)) fiGoal = null;

        var projectedTotal = 0;
        projected = accounts.map(function (a) {
          var contribPct = journeyGetEffectiveContribPct(raw, a.prefix, income);
          var matchPct = journeyNum(raw["matchPct" + a.prefix]) || 0;
          var balance = journeyNum(raw["balance" + a.prefix]) || 0;
          var annualContrib = journeyComputeAccountContribution(income, contribPct, matchPct, a.employeeLimit, a.combinedLimit);
          var finalBalance = journeyProjectFinalBalance(balance, annualContrib, age, retireAge, returnPct);
          if (finalBalance !== null) projectedTotal += finalBalance;
          var goalPct = (fiGoal && finalBalance !== null) ? Math.min(100, (finalBalance / fiGoal) * 100) : null;
          return { label: a.label, color: a.color, balance: finalBalance, retireAge: retireAge, goalPct: goalPct };
        });
        projectedGoal = fiGoal ? {
          amount: fiGoal,
          total: projectedTotal,
          pct: Math.min(100, (projectedTotal / fiGoal) * 100)
        } : null;
      }
      cards.push({
        id: "contribution-limits", label: "Contribution Limits", href: BASE + "ContributionLimits/index.html", color: "plum",
        started: started, pct: overallPct, value: null, bars: bars, projected: projected, projectedGoal: projectedGoal,
        statLine: null,
        subLine: started
          ? (maxedCount + " of " + bars.length + " account" + (bars.length === 1 ? "" : "s") + " maxed out")
          : "Enter your accounts to start tracking",
        milestone: (started && bars.length && maxedCount === bars.length) ? { text: "All maxed out!" }
          : (started && maxedCount > 0) ? { text: maxedCount + " account" + (maxedCount === 1 ? "" : "s") + " maxed out!" }
          : null
      });
    })();

    // ---- Monthly Budget (budgetHistory: [{date, income, needs, wants, savings, surplus}]) ----
    // Primarily driven by the page's own logged snapshots — but falls back
    // to live, never-logged field values when there's no history yet, same
    // reasoning as the Net Worth card above. pct stays null on purpose: a
    // savings rate is a recurring monthly habit, not a bounded "% of the
    // way to done" like a goal balance, so it doesn't belong in the overall
    // ring's average.
    (function () {
      var history = readJourneyHistoryArr("budgetHistory");
      var hasHistory = history.length > 0;
      var latest = null, prev = null, sorted = null;
      if (hasHistory) {
        sorted = history.slice().sort(function (a, b) {
          return (a.date || "") < (b.date || "") ? -1 : 1;
        });
        latest = sorted[sorted.length - 1];
        prev = sorted.length > 1 ? sorted[sorted.length - 2] : null;
      }

      var liveIncome = null, liveSavings = null;
      if (!hasHistory) {
        var liveRaw = readJourneyJSON("budgetCalculatorInputs");
        if (liveRaw) {
          var lIncome = journeyNum(liveRaw.bcIncome) || 0;
          var lNeeds = journeySumFields(liveRaw, JOURNEY_BC_NEEDS_IDS);
          var lWants = journeySumFields(liveRaw, JOURNEY_BC_WANTS_IDS);
          var lSavings = journeySumFields(liveRaw, JOURNEY_BC_SAVINGS_IDS);
          if (lIncome > 0 || lNeeds > 0 || lWants > 0 || lSavings > 0) {
            liveIncome = lIncome;
            liveSavings = lSavings;
          }
        }
      }

      var started = hasHistory || liveIncome !== null;
      var displayIncome = hasHistory ? latest.income : liveIncome;
      var displaySavings = hasHistory ? latest.savings : liveSavings;
      var savingsPct = (started && displayIncome > 0) ? (displaySavings / displayIncome) * 100 : null;
      var prevSavingsPct = (prev && prev.income > 0) ? (prev.savings / prev.income) * 100 : null;
      cards.push({
        id: "budget-calculator", label: "Monthly Budget", href: BASE + "BudgetCalculator/index.html", color: "jade",
        started: started, pct: null, value: started ? displaySavings : null,
        statLine: started
          ? (savingsPct !== null ? (Math.round(savingsPct) + "% saved of " + fmtUSD0(displayIncome) + "/mo") : (fmtUSD0(displaySavings) + " saved"))
          : null,
        subLine: hasHistory
          ? (prevSavingsPct !== null
              ? (savingsPct >= prevSavingsPct ? "↑ up since your last snapshot" : "↓ down since your last snapshot")
              : "Latest logged snapshot")
          : (liveIncome !== null ? "Entered but not logged yet — log a snapshot to start tracking the trend" : "Log a monthly snapshot to start tracking"),
        sparkline: (hasHistory && sorted.length > 1) ? sorted.slice(-10).map(function (h) { return h.income > 0 ? (h.savings / h.income) * 100 : 0; }) : null,
        milestone: (started && savingsPct !== null && savingsPct >= 20) ? { text: "Hit the 20% savings-rate guideline!" } : null
      });
    })();

    // ---- FIRE Milestones (fireMilestonesInputs: {currentAge, retireAge, currentSavings, annualContribution, annualExpenses, returnPct, swrPct, baristaIncome, leanPct, fatPct}) ----
    (function () {
      var raw = readJourneyJSON("fireMilestonesInputs");
      var started = !!raw;
      var currentSavings = 0, nextMilestone = null, biggestAlready = null, noneReached = false;
      if (started) {
        currentSavings = journeyNum(raw.currentSavings) || 0;
        var currentAge = journeyNum(raw.currentAge) || 0;
        var retireAge = journeyNum(raw.retireAge) || 0;
        var annualContribution = journeyNum(raw.annualContribution) || 0;
        var annualExpenses = journeyNum(raw.annualExpenses) || 0;
        var r = (journeyNum(raw.returnPct) || 0) / 100;
        var swr = (journeyNum(raw.swrPct) || 0) / 100 || 0.0001;
        var baristaIncome = journeyNum(raw.baristaIncome) || 0;
        var leanPct = journeyNum(raw.leanPct) || 0;
        var fatPct = journeyNum(raw.fatPct) || 0;
        var traditionalTarget = annualExpenses / swr;

        var balances = journeyFireSimulateBalances(currentSavings, annualContribution, r, 70);
        var tierDefs = [
          { rank: 0, label: "Lean FI", target: (annualExpenses * (leanPct / 100)) / swr },
          { rank: 1, label: "Barista FI", target: Math.max(0, annualExpenses - baristaIncome) / swr },
          { rank: 2, label: "Coast FI", target: traditionalTarget, coast: true },
          { rank: 3, label: "Traditional FI", target: traditionalTarget },
          { rank: 4, label: "Fat FI", target: (annualExpenses * (fatPct / 100)) / swr }
        ];
        var tiers = tierDefs.map(function (t) {
          var reach = t.coast
            ? journeyFireFindCoastReach(balances, t.target, currentAge, retireAge, r)
            : journeyFireFindReach(balances, t.target, currentAge);
          return { rank: t.rank, label: t.label, target: t.target, achieved: reach.achieved, years: reach.years, age: reach.age };
        });

        var reached = tiers.filter(function (t) { return t.achieved; });
        var upcoming = reached.filter(function (t) { return t.years > 0; }).sort(function (a, b) { return a.years - b.years; });
        nextMilestone = upcoming.length ? upcoming[0] : null;
        var alreadyTrue = tiers.filter(function (t) { return t.years === 0; });
        biggestAlready = alreadyTrue.length ? alreadyTrue.reduce(function (a, b) { return b.rank > a.rank ? b : a; }) : null;
        noneReached = reached.length === 0;
      }

      cards.push({
        id: "fire-milestones", label: "FIRE Milestones", href: BASE + "FireMilestones/index.html", color: "azure",
        started: started, pct: null, value: started ? currentSavings : null,
        nextMilestone: nextMilestone,
        statLine: started
          ? (nextMilestone ? (nextMilestone.label + " at age " + journeyFmt1(nextMilestone.age))
              : biggestAlready ? "All reachable milestones hit"
              : fmtUSD0(currentSavings) + " saved so far")
          : null,
        subLine: started
          ? (nextMilestone
              ? (journeyFmt1(nextMilestone.years) + " year" + (nextMilestone.years === 1 ? "" : "s") + " away · " + fmtUSD0(nextMilestone.target))
              : biggestAlready
                ? (biggestAlready.label + " and earlier, already funded")
                : "No milestones reached within a 70-year projection — try increasing contributions")
          : "Set up your milestones to start tracking",
        milestone: biggestAlready ? { text: biggestAlready.label + " reached!" } : null
      });
    })();

    return cards;
  }

  // Rank — a single badge meant to read as "how are you actually doing"
  // rather than just restating the ring's own goal-average %. Blends three
  // things, each capped independently so no single number can carry the
  // whole score: how close your %-target goals are to done (up to 50 pts),
  // how many of the 5 tracked calculators you've actually started (up to
  // 20 pts — someone with one great number isn't ranked the same as
  // someone with a full, tracked picture), and foundational health — a
  // positive net worth, a fully-funded emergency fund, being debt-free (up
  // to 10 pts each, 30 total). Ordered lowest-first; the tooltip lists all
  // of them so the badge is legible on its own, not just relative.
  var JOURNEY_RANKS = [
    { min: 0, name: "Getting Started", color: "faint" },
    { min: 20, name: "Building Momentum", color: "rust" },
    { min: 40, name: "On Track", color: "gold" },
    { min: 60, name: "Ahead of Pace", color: "jade" },
    { min: 80, name: "Thriving", color: "plum" },
    { min: 95, name: "FI Ready", color: "gold-filled" }
  ];

  // Shared by the Rank score's healthScore and the "Financial Foundations"
  // checklist UI, so the two can never drift apart on what counts as done —
  // one list of criteria, read by both.
  // Three visual states per item — green (done), yellow (real, healthy
  // progress), red (not started, or started with too little progress to
  // call "healthy" yet) — so an item nobody's touched and one that's barely
  // begun both read as "needs attention" instead of looking identical to a
  // blank, unaccounted-for slot. `done` still drives the Rank's own
  // healthScore below unchanged; `status` is purely the visual state.
  function computeJourneyHealthChecklist(cards) {
    var byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });
    var nw = byId["net-worth"], ef = byId["emergency-fund"], ds = byId["debt-snowball"], cl = byId["contribution-limits"];

    function statusFor(done, inProgress) {
      return done ? "green" : (inProgress ? "yellow" : "red");
    }

    // Net worth has no natural 0–100% target to gauge "healthy progress"
    // against, so anything short of positive just reads as actively
    // tracked (yellow) vs. never touched (red).
    var nwDone = !!(nw && nw.started && nw.value !== null && nw.value > 0);
    var nwInProgress = !!(nw && nw.started && !nwDone);

    var efDone = !!(ef && ef.milestone && ef.milestone.text === "Fully funded!");
    var efInProgress = !!(ef && ef.started && !efDone && ef.pct !== null && ef.pct >= 25);

    // Debt has no bounded % either, but its own milestone text already
    // marks real 25/50/75%-paid-off progress — reused here instead of a
    // second measure of the same thing.
    var dsDone = !!(ds && ds.milestone && ds.milestone.text === "Debt-free!");
    var dsInProgress = !!(ds && ds.started && !dsDone && ds.milestone);

    var clDone = !!(cl && cl.milestone && cl.milestone.text === "All maxed out!");
    var clInProgress = !!(cl && cl.started && !clDone && cl.pct !== null && cl.pct >= 25);

    return [
      { id: "net-worth", label: "Positive net worth", href: nw ? nw.href : null,
        done: nwDone, status: statusFor(nwDone, nwInProgress) },
      { id: "emergency-fund", label: "Emergency fund fully funded", href: ef ? ef.href : null,
        done: efDone, status: statusFor(efDone, efInProgress) },
      { id: "debt-snowball", label: "Debt-free", href: ds ? ds.href : null,
        done: dsDone, status: statusFor(dsDone, dsInProgress) },
      { id: "contribution-limits", label: "Contribution limits maxed", href: cl ? cl.href : null,
        done: clDone, status: statusFor(clDone, clInProgress) }
    ];
  }

  function computeJourneyRank(cards, overallPct) {
    var startedCount = cards.filter(function (c) { return c.started; }).length;

    var goalScore = overallPct !== null ? (overallPct / 100) * 50 : 0;
    var engagementScore = (startedCount / cards.length) * 20;

    var healthChecklist = computeJourneyHealthChecklist(cards);
    var healthScore = healthChecklist.filter(function (item) { return item.done; }).length * 10;

    var score = Math.round(Math.min(100, goalScore + engagementScore + healthScore));
    var rank = JOURNEY_RANKS[0];
    var nextRank = null;
    for (var i = 0; i < JOURNEY_RANKS.length; i++) {
      if (score >= JOURNEY_RANKS[i].min) rank = JOURNEY_RANKS[i];
      else if (!nextRank) nextRank = JOURNEY_RANKS[i];
    }
    return {
      name: rank.name, color: rank.color, score: score, totalCards: cards.length,
      nextName: nextRank ? nextRank.name : null,
      pointsToNext: nextRank ? nextRank.min - score : 0
    };
  }

  function journeyRankTooltip(current) {
    var tierList = JOURNEY_RANKS.map(function (r) {
      return r.name + " (" + r.min + "+)";
    }).join(", ");
    var nextLine = current.nextName
      ? " You're " + current.pointsToNext + " point" + (current.pointsToNext === 1 ? "" : "s") + " from " + current.nextName + "."
      : " You've hit the top rank.";
    return "Your rank blends three things, out of 100: how close your %-target goals (Time to FI, Emergency Fund, Spending-Based FI, Contribution Limits) are to done — up to 50 points; how many of the " + current.totalCards + " tracked calculators you've started — up to 20 points; and foundational health, 10 points each for a positive net worth, a fully-funded emergency fund, being debt-free, and maxing out your contribution limits. You're at " +
      current.score + "/100." + nextLine + " Ranks: " + tierList + ".";
  }

  function computeJourneyNextSteps(cards) {
    var byId = {};
    cards.forEach(function (c) { byId[c.id] = c; });
    var steps = [];

    var ef = byId["emergency-fund"];
    if (!ef.started) {
      steps.push({ text: "Start your Emergency Fund — most people tackle this first, before investing aggressively.", href: ef.href, label: "Set up Emergency Fund" });
    } else if (ef.pct < 100) {
      steps.push({ text: "Your Emergency Fund is " + Math.round(ef.pct) + "% funded — keep building it toward your target.", href: ef.href, label: "Open Emergency Fund" });
    }

    var ds = byId["debt-snowball"];
    if (ds.started && !ds.milestone) {
      steps.push({ text: ds.statLine + " left across your debts — paying this down frees up real cash flow.", href: ds.href, label: "Open Debt Snowball" });
    }

    var ti = byId["time-to-fi"], rv = byId["reverse-time-to-fi"];
    if (!ti.started && !rv.started) {
      steps.push({ text: "You haven't set up a FI number yet — Time to FI or Spending-Based FI can show you where you stand.", href: ti.href, label: "Set up Time to FI" });
    }

    var nw = byId["net-worth"];
    if (!nw.started) {
      steps.push({ text: "Log a Net Worth snapshot to start tracking your overall trend over time.", href: nw.href, label: "Open Net Worth" });
    }

    if (!steps.length) {
      steps.push({ text: "You're covering the basics well — explore Coast FIRE or the Safe Withdrawal Rate stress test next.", href: BASE + "CoastFire/index.html", label: "Explore more calculators" });
    }

    return steps.slice(0, 3);
  }

  // Shared by every collapsible section below (Financial Foundations, Your
  // Progress, Next Steps, Insights, Coming Up, Achievements) — same chevron
  // used for ContributionLimits' own collapsible toolbar groups, rotated
  // via the details[open] selector in CSS rather than a JS class toggle,
  // since <details> already tracks its own open/closed state for free.
  var JOURNEY_CHEVRON_SVG = '<svg class="fn-journey-section-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  var JOURNEY_MAXIMIZE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>';
  var JOURNEY_RESTORE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"></rect><path d="M4 17V6a2 2 0 0 1 2-2h11"></path></svg>';

  function buildJourneyModal() {
    var cards = computeJourneyCards();
    var pctVals = cards.map(function (c) { return c.pct; }).filter(function (p) { return p !== null; });
    var overallPct = pctVals.length ? Math.round(pctVals.reduce(function (a, b) { return a + b; }, 0) / pctVals.length) : null;
    var anyStarted = cards.some(function (c) { return c.started; });

    var circumference = 2 * Math.PI * 44;
    var ringOffset = overallPct !== null ? circumference * (1 - Math.min(100, overallPct) / 100) : circumference;

    // Computed before logging (it only needs cards + overallPct, both
    // already in hand) so today's tier name can be written into today's own
    // history entry — that's what lets a *future* visit detect a rank-up
    // against it.
    var journeyRank = anyStarted ? computeJourneyRank(cards, overallPct) : null;

    // Log a full snapshot (overall % + every card's own value/milestone) so
    // the modal can show a trend, a "since your last visit" diff, and
    // notice a milestone the moment it's crossed — logged silently on every
    // open, nothing for the user to remember to click.
    var journeyHistory = anyStarted
      ? logJourneySnapshot(overallPct, cards, journeyRank ? journeyRank.name : null)
      : readJourneyHistoryArr("journeyProgressHistory");

    var todayStr = new Date().toISOString().slice(0, 10);
    var latestIsToday = journeyHistory.length > 0 && journeyHistory[journeyHistory.length - 1].date === todayStr;
    var prevEntry = latestIsToday
      ? (journeyHistory.length > 1 ? journeyHistory[journeyHistory.length - 2] : null)
      : (journeyHistory.length > 0 ? journeyHistory[journeyHistory.length - 1] : null);

    var pctEntries = journeyHistory.filter(function (h) { return h.overallPct !== null && h.overallPct !== undefined; });

    var trendHtml = "";
    var projectionHtml = "";
    if (overallPct !== null && pctEntries.length > 1) {
      var prevPctEntry = pctEntries[pctEntries.length - 2];
      var delta = overallPct - Math.round(prevPctEntry.overallPct);
      var arrow = delta > 0 ? "↑" : (delta < 0 ? "↓" : "→");
      var deltaLabel = delta === 0 ? "No change" : ((delta > 0 ? "+" : "") + delta + "%");
      var sparkValues = pctEntries.slice(-10).map(function (h) { return h.overallPct; });
      trendHtml = '<div class="fn-journey-ring-trend">' +
          buildJourneySparkline(sparkValues, "var(--fn-jade)") +
          '<span>' + arrow + " " + deltaLabel + " since " + formatJourneyShortDate(prevPctEntry.date) + "</span>" +
        "</div>";

      // Forward-looking pace projection: needs a real time span to measure
      // a rate from (14+ days between the earliest and latest logged %),
      // an actually-improving trend, and somewhere left to go.
      var firstPctEntry = pctEntries[0];
      var spanDays = journeyDaysBetween(firstPctEntry.date, pctEntries[pctEntries.length - 1].date);
      if (spanDays >= 14 && overallPct < 100) {
        var rate = (pctEntries[pctEntries.length - 1].overallPct - firstPctEntry.overallPct) / spanDays;
        if (rate > 0) {
          var daysToGoal = (100 - overallPct) / rate;
          if (isFinite(daysToGoal) && daysToGoal > 0) {
            var target = new Date();
            target.setDate(target.getDate() + Math.round(daysToGoal));
            var ageSuffix = "";
            if (window.FNProfile && typeof window.FNProfile.getAge === "function") {
              var currentAge = window.FNProfile.getAge();
              if (currentAge !== null) {
                var ageAtGoal = Math.round(currentAge + daysToGoal / 365.25);
                ageSuffix = " (around age " + ageAtGoal + ")";
              }
            }
            projectionHtml = '<div class="fn-journey-ring-projection">At your current pace, on track for ~' + formatJourneyMonthYear(target) + ageSuffix + "</div>";
          }
        }
      }
    }

    // A rank-up only gets the celebratory treatment when it's a genuine
    // tier crossing since the last *logged* visit (comparing tier names by
    // position in JOURNEY_RANKS), not just any score wiggle within the same
    // tier — same "only the real thing earns the pop" principle as the
    // milestone badges' own isNewMilestone check above.
    var isRankUp = false;
    if (journeyRank && prevEntry && prevEntry.rank) {
      var prevRankIdx = JOURNEY_RANKS.map(function (r) { return r.name; }).indexOf(prevEntry.rank);
      var curRankIdx = JOURNEY_RANKS.map(function (r) { return r.name; }).indexOf(journeyRank.name);
      if (prevRankIdx >= 0 && curRankIdx > prevRankIdx) isRankUp = true;
    }
    var rankNextHtml = journeyRank
      ? (journeyRank.nextName
          ? '<div class="fn-journey-rank-next">' + journeyRank.pointsToNext + " pt" + (journeyRank.pointsToNext === 1 ? "" : "s") + " to " + journeyRank.nextName + "</div>"
          : '<div class="fn-journey-rank-next">Top rank!</div>')
      : "";
    var rankHtml = journeyRank
      ? '<div class="fn-journey-rank fn-journey-rank-' + journeyRank.color + (isRankUp ? " fn-journey-rank-up" : "") + '">' +
          '<div class="fn-journey-rank-row">' +
            '<span class="fn-journey-rank-tier">' + (isRankUp ? "✨ " : "") + journeyRank.name + "</span>" +
            '<span class="fn-info-dot" tabindex="0" aria-label="' + journeyRankTooltip(journeyRank) + (isRankUp ? " You just moved up a rank!" : "") + '">i</span>' +
          "</div>" +
          rankNextHtml +
        "</div>"
      : "";

    var overallHtml = anyStarted
      ? '<div class="fn-journey-overall">' +
          rankHtml +
          '<svg class="fn-journey-ring" viewBox="0 0 100 100" aria-hidden="true">' +
            '<circle class="fn-journey-ring-track" cx="50" cy="50" r="44"></circle>' +
            (overallPct !== null
              ? '<circle class="fn-journey-ring-fill" cx="50" cy="50" r="44" ' +
                  'style="stroke-dasharray:' + circumference.toFixed(1) + '; stroke-dashoffset:' + ringOffset.toFixed(1) + ';"></circle>'
              : "") +
          "</svg>" +
          '<div class="fn-journey-ring-label">' +
            (overallPct !== null
              ? '<div class="fn-journey-ring-pct">' + overallPct + "%</div>" +
                '<div class="fn-journey-ring-sub">avg. across ' + pctVals.length + " goal" + (pctVals.length === 1 ? "" : "s") + " with a target" +
                  '<span class="fn-info-dot" tabindex="0" aria-label="Only calculators with a clear % target — Time to FI, Emergency Fund, Spending-Based FI — feed this average. Net Worth and Debt Payoff track a dollar amount instead, so they’re shown below but not counted here.">i</span>' +
                "</div>" +
                trendHtml +
                projectionHtml
              : '<div class="fn-journey-ring-sub">Tracking started</div>') +
          "</div>" +
        "</div>"
      : '<div class="fn-journey-empty">You haven’t saved any numbers yet — open a calculator below and your progress will start showing up here.</div>';

    // "Financial Foundations" — the same four criteria the Rank's
    // healthScore already checks, shown explicitly as a checklist rather
    // than folded into one number, so it's legible at a glance which ones
    // are actually left.
    var checklistHtml = "";
    if (anyStarted) {
      var healthChecklist = computeJourneyHealthChecklist(cards);
      checklistHtml = '<details class="fn-journey-checklist fn-journey-section" id="fn-journey-sec-foundations" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Financial Foundations</summary>" +
          '<div class="fn-journey-checklist-items">' +
            healthChecklist.map(function (item) {
              var icon = item.status === "green"
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 11 15 16 9"></polyline></svg>'
                : item.status === "yellow"
                  ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none"></circle></svg>'
                  : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg>';
              return '<a class="fn-journey-checklist-item status-' + item.status + '" href="' + item.href + '">' +
                '<span class="fn-journey-checklist-check">' + icon + "</span>" +
                "<span>" + item.label + "</span>" +
              "</a>";
            }).join("") +
          "</div>" +
        "</details>";
    }

    // "Since your last visit" — a quiet diff against the previously logged
    // snapshot, reusing the same per-card values the ring/cards already
    // compute rather than tracking anything separately.
    var changesHtml = "";
    var lastVisitChanges = journeyCardDeltaSpans(cards, prevEntry);
    if (lastVisitChanges.length) {
      changesHtml = '<div class="fn-journey-changes">' +
          '<div class="fn-help-section-heading">Since your last visit</div>' +
          '<div class="fn-journey-changes-line">' + lastVisitChanges.join(" &middot; ") + "</div>" +
        "</div>";
    }

    // "Last 30 Days" — the same per-card diff, but against whichever logged
    // entry is closest to (without being more recent than) 25 days old, so
    // a still-growing history doesn't just repeat "since your last visit"
    // under a different label. Silent until there's actually a month of
    // logged visits behind it.
    var recapHtml = "";
    var monthAgoEntry = null;
    for (var mi = journeyHistory.length - 1; mi >= 0; mi--) {
      if (journeyDaysBetween(journeyHistory[mi].date, todayStr) >= 25) { monthAgoEntry = journeyHistory[mi]; break; }
    }
    if (monthAgoEntry && monthAgoEntry !== prevEntry) {
      var recapParts = [];
      if (overallPct !== null && monthAgoEntry.overallPct !== null && monthAgoEntry.overallPct !== undefined) {
        var recapPctDelta = overallPct - Math.round(monthAgoEntry.overallPct);
        if (recapPctDelta !== 0) {
          recapParts.push('<span class="fn-journey-change fn-journey-change-plum">Overall ' + (recapPctDelta > 0 ? "+" : "") + recapPctDelta + "%</span>");
        }
      }
      recapParts = recapParts.concat(journeyCardDeltaSpans(cards, monthAgoEntry));
      if (recapParts.length) {
        recapHtml = '<div class="fn-journey-changes">' +
            '<div class="fn-help-section-heading">Last 30 Days</div>' +
            '<div class="fn-journey-changes-line">' + recapParts.join(" &middot; ") + "</div>" +
          "</div>";
      }
    }

    var cardsHtml = cards.map(function (c) {
      var barHtml = c.pct !== null
        ? '<div class="fn-journey-bar"><div class="fn-journey-bar-fill fn-journey-' + c.color + '" style="width:' + Math.max(2, Math.min(100, c.pct)) + '%;"></div></div>'
        : "";
      var sparkHtml = c.sparkline ? buildJourneySparkline(c.sparkline, "var(--fn-" + c.color + ")") : "";

      // A milestone badge only gets the celebratory pop-in treatment the
      // first time it appears — compares against the previous snapshot's
      // stored milestone text for this same card, so it settles into a
      // plain static badge on the very next distinct-day visit.
      var prevCardData = prevEntry && prevEntry.cards ? prevEntry.cards[c.id] : null;
      var isNewMilestone = !!(c.milestone && (!prevCardData || prevCardData.milestone !== c.milestone.text));
      var badgeHtml = c.milestone
        ? '<span class="fn-journey-badge fn-journey-badge-' + c.color + (isNewMilestone ? " fn-journey-badge-new" : "") + '">' +
            (isNewMilestone ? "✨ " : "") + c.milestone.text +
          "</span>"
        : "";

      // "No change since ..." — walks backward through the logged history
      // while this card's value stays identical to today's, and surfaces
      // the oldest matching date once that unchanged streak is long enough
      // (3+ weeks) to be worth flagging as possibly stale.
      var staleHtml = "";
      if (c.started && c.value !== null && c.value !== undefined) {
        var staleSince = null;
        for (var si = journeyHistory.length - (latestIsToday ? 2 : 1); si >= 0; si--) {
          var cd = journeyHistory[si].cards && journeyHistory[si].cards[c.id];
          if (!cd || cd.value === null || cd.value === undefined || cd.value !== c.value) break;
          staleSince = journeyHistory[si].date;
        }
        if (staleSince && journeyDaysBetween(staleSince, todayStr) >= 21) {
          staleHtml = '<div class="fn-journey-stale">No change since ' + formatJourneyShortDate(staleSince) + "</div>";
        }
      }

      // Per-card pace projection — "On track for ~Sep 2028" / "Debt-free by
      // ~Mar 2027" — only for the three cards with a clear finish line
      // (Time to FI, Emergency Fund rise toward 100%; Debt Payoff falls
      // toward $0). Reuses the same logged history as everything else, so
      // it's silent until there's 14+ days of real trend behind it.
      var projectionText = null;
      if (c.started) {
        if (c.id === "time-to-fi" || c.id === "emergency-fund") {
          var pctProjection = computeJourneyPctProjection(c.id, journeyHistory);
          if (pctProjection) projectionText = "On track for ~" + pctProjection;
        } else if (c.id === "debt-snowball") {
          var zeroProjection = computeJourneyZeroProjection(c.id, journeyHistory);
          if (zeroProjection) projectionText = "Debt-free by ~" + zeroProjection;
        }
      }
      var projectionHtml = projectionText
        ? '<div class="fn-journey-card-projection fn-journey-change-' + c.color + '">' + projectionText + "</div>"
        : "";

      var bodyHtml = c.started
        ? '<div class="fn-journey-card-stat">' + c.statLine + "</div>" + sparkHtml + barHtml + '<div class="fn-journey-card-sub">' + c.subLine + "</div>" + projectionHtml + staleHtml + badgeHtml
        : '<div class="fn-journey-card-sub fn-journey-card-empty">' + c.subLine + "</div>";

      // Emergency Fund's inline "what if" slider — always visible (not
      // behind a toggle, unlike the quick-edit form below) since exploring
      // a contribution rate is the point, not a rare edit. Live-recomputed
      // client-side on drag (see openJourneyModal()'s wiring) using the
      // exact same compound-growth loop as the Insight sentence above, just
      // fed the slider's value instead of the saved monthlyContribution.
      if (c.id === "emergency-fund" && c.started) {
        var efRaw = readJourneyJSON("emergencyFundInputs") || {};
        var efTarget = (journeyNum(efRaw.monthlyExpenses) || 0) * (journeyNum(efRaw.targetMonths) || 0);
        var efCurrent = journeyNum(efRaw.currentEfSavings) || 0;
        var efContribution = journeyNum(efRaw.monthlyContribution) || 0;
        var efApy = journeyNum(efRaw.apy) || 0;
        if (efTarget > 0 && efCurrent < efTarget) {
          var efSliderMax = Math.max(1000, Math.ceil((Math.max(efContribution, 1) * 2) / 100) * 100);
          var efMonths = journeyEfMonthsToTarget(efTarget, efCurrent, efContribution, efApy);
          var efResultText = efMonths !== null
            ? "Fully funded by ~" + formatJourneyMonthYear((function () { var d = new Date(); d.setMonth(d.getMonth() + efMonths); return d; })())
            : "Enter a contribution to see a projection";
          bodyHtml += '<div class="fn-journey-whatif" data-target="' + efTarget + '" data-current="' + efCurrent + '" data-apy="' + efApy + '">' +
            '<div class="fn-journey-whatif-label">What if: <span class="fn-journey-whatif-amt">' + fmtUSD0(efContribution) + '</span>/mo</div>' +
            '<input type="range" class="fn-journey-whatif-slider" min="0" max="' + efSliderMax + '" step="25" value="' + efContribution + '">' +
            '<div class="fn-journey-whatif-result">' + efResultText + "</div>" +
          "</div>";
        }
      }

      // Contribution Limits shows one bar per account (401(k)/HSA/IRA)
      // instead of the other cards' single overall-% bar, so it builds its
      // own body rather than using the generic stat/bar/sub layout above —
      // plus a Current/Projected toggle (wired up in openJourneyModal())
      // switching between this year's contributions and the same balance
      // projection ContributionLimits' own page shows.
      if (c.id === "contribution-limits" && c.started) {
        var clCurrentRowsHtml = c.bars.map(function (b) {
          return '<div class="fn-journey-cl-row">' +
            '<div class="fn-journey-cl-row-top">' +
              '<span class="fn-journey-cl-row-label">' + b.label + "</span>" +
              '<span class="fn-journey-cl-row-amt">' + fmtUSD0(b.have) + " of " + fmtUSD0(b.limit) + "</span>" +
            "</div>" +
            '<div class="fn-journey-bar"><div class="fn-journey-bar-fill fn-journey-' + b.color + '" style="width:' + Math.max(2, Math.min(100, b.pct)) + '%;"></div></div>' +
          "</div>";
        }).join("");
        // Each account's bar shows its own projected balance as a % of the
        // user's FI goal (from Time to FI) — "how much of my actual
        // retirement goal does this one account alone get me to" — plus a
        // combined summary bar below for the three accounts together.
        var clProjectedRowsHtml = c.projected.map(function (p) {
          var barHtml = p.goalPct !== null
            ? '<div class="fn-journey-bar"><div class="fn-journey-bar-fill fn-journey-' + p.color + '" style="width:' + Math.max(2, p.goalPct) + '%;"></div></div>'
            : "";
          return '<div class="fn-journey-cl-row">' +
            '<div class="fn-journey-cl-row-top">' +
              '<span class="fn-journey-cl-row-label">' + p.label + "</span>" +
              '<span class="fn-journey-cl-row-amt">' + (p.balance !== null ? fmtUSD0(p.balance) + " at " + p.retireAge : "Set a retirement age past your current age") + "</span>" +
            "</div>" +
            barHtml +
          "</div>";
        }).join("");
        var clProjectedGoalHtml = c.projectedGoal
          ? '<div class="fn-journey-cl-goal">' +
              '<div class="fn-journey-cl-row-top">' +
                '<span class="fn-journey-cl-row-label">Toward your ' + fmtUSD0(c.projectedGoal.amount) + " goal</span>" +
                '<span class="fn-journey-cl-row-amt">' + Math.round(c.projectedGoal.pct) + "%</span>" +
              "</div>" +
              '<div class="fn-journey-bar"><div class="fn-journey-bar-fill fn-journey-plum" style="width:' + Math.max(2, c.projectedGoal.pct) + '%;"></div></div>' +
            "</div>"
          : '<div class="fn-journey-cl-goal-hint">Set your FI goal on Time to FI to see how close this gets you.</div>';
        var clToggleHtml = '<div class="fn-journey-cl-toggle">' +
          '<button type="button" class="fn-journey-cl-toggle-btn active" data-view="current">Current</button>' +
          '<button type="button" class="fn-journey-cl-toggle-btn" data-view="projected">Projected</button>' +
        "</div>";
        bodyHtml = clToggleHtml +
          '<div class="fn-journey-cl-current">' + clCurrentRowsHtml + "</div>" +
          '<div class="fn-journey-cl-projected" hidden>' + clProjectedRowsHtml + clProjectedGoalHtml + "</div>" +
          '<div class="fn-journey-card-sub">' + c.subLine + "</div>" + badgeHtml;
      }

      var noteHtml = c.note ? '<div class="fn-journey-card-note">' + c.note + "</div>" : "";
      var topHtml = '<div class="fn-journey-card-top">' +
          '<span class="fn-journey-dot fn-journey-' + c.color + '"></span>' +
          '<span class="fn-journey-card-label">' + c.label + "</span>" +
        "</div>" + noteHtml;

      // Net Worth is the one card built around a repeated manual log, so it
      // gets an inline quick-log form instead of just linking out — needs
      // interactive controls of its own, so this one card is a <div> with
      // its own "Open" link rather than the other cards' whole-card <a>.
      if (c.id === "net-worth") {
        var qlAssets = c.assetsValue !== null && c.assetsValue !== undefined ? Math.round(c.assetsValue) : "";
        var qlLiab = c.liabilitiesValue !== null && c.liabilitiesValue !== undefined ? Math.round(c.liabilitiesValue) : "";
        return '<div class="fn-journey-card fn-journey-card-networth">' +
          topHtml + bodyHtml +
          '<div class="fn-journey-quicklog" hidden>' +
            '<label>Assets<input type="text" inputmode="decimal" class="fn-journey-ql-assets" value="' + qlAssets + '"></label>' +
            '<label>Liabilities<input type="text" inputmode="decimal" class="fn-journey-ql-liab" value="' + qlLiab + '"></label>' +
            '<div class="fn-journey-quicklog-actions">' +
              '<button type="button" class="fn-journey-ql-save" data-card="net-worth">Save</button>' +
              '<button type="button" class="fn-journey-ql-cancel">Cancel</button>' +
            "</div>" +
          "</div>" +
          '<div class="fn-journey-card-actions">' +
            '<button type="button" class="fn-journey-ql-toggle">+ Log today</button>' +
            '<a class="fn-journey-card-open" href="' + c.href + '">Open &rarr;</a>' +
          "</div>" +
        "</div>";
      }

      // Same idea as Net Worth's quick-log above, minus the dated history —
      // just overwrites this one saved field in place. A <div> wrapper for
      // the same reason Net Worth's is: the toggle/save/cancel controls
      // need somewhere to live besides an otherwise-whole-card <a href>.
      if (JOURNEY_QUICKEDIT[c.id] && c.started) {
        var qeVal = c.value !== null && c.value !== undefined ? Math.round(c.value) : "";
        return '<div class="fn-journey-card">' +
          topHtml + bodyHtml +
          '<div class="fn-journey-quicklog" hidden>' +
            '<label>Current savings<input type="text" inputmode="decimal" class="fn-journey-ql-value" value="' + qeVal + '"></label>' +
            '<div class="fn-journey-quicklog-actions">' +
              '<button type="button" class="fn-journey-ql-save" data-card="' + c.id + '">Save</button>' +
              '<button type="button" class="fn-journey-ql-cancel">Cancel</button>' +
            "</div>" +
          "</div>" +
          '<div class="fn-journey-card-actions">' +
            '<button type="button" class="fn-journey-ql-toggle">+ Update savings</button>' +
            '<a class="fn-journey-card-open" href="' + c.href + '">Open &rarr;</a>' +
          "</div>" +
        "</div>";
      }

      // Debt Payoff's own quick-edit — a Payment/Additional-debt toggle
      // instead of a single field, since a dollar amount here needs a
      // direction. Always applies to c.targetDebtLabel (the strategy-order
      // debt computeJourneyCards() already picked out), shown right in the
      // form so it's never a surprise which debt actually moves.
      if (c.id === "debt-snowball" && c.started && c.targetDebtIdx >= 0) {
        return '<div class="fn-journey-card">' +
          topHtml + bodyHtml +
          '<div class="fn-journey-quicklog" hidden>' +
            '<div class="fn-journey-debt-mode">' +
              '<button type="button" class="fn-journey-debt-mode-btn active" data-mode="payment">Payment</button>' +
              '<button type="button" class="fn-journey-debt-mode-btn" data-mode="additional">Additional debt</button>' +
            "</div>" +
            '<label>Applies to ' + c.targetDebtLabel + '<input type="text" inputmode="decimal" class="fn-journey-ql-value" value=""></label>' +
            '<input type="hidden" class="fn-journey-ql-mode" value="payment">' +
            '<div class="fn-journey-quicklog-actions">' +
              '<button type="button" class="fn-journey-ql-save" data-card="' + c.id + '">Save</button>' +
              '<button type="button" class="fn-journey-ql-cancel">Cancel</button>' +
            "</div>" +
          "</div>" +
          '<div class="fn-journey-card-actions">' +
            '<button type="button" class="fn-journey-ql-toggle">+ Log payment / debt</button>' +
            '<a class="fn-journey-card-open" href="' + c.href + '">Open &rarr;</a>' +
          "</div>" +
        "</div>";
      }

      return '<a class="fn-journey-card" href="' + c.href + '">' +
        topHtml + bodyHtml +
        '<span class="fn-journey-card-open">Open &rarr;</span>' +
      "</a>";
    }).join("");

    var nextSteps = computeJourneyNextSteps(cards);
    var nextHtml = nextSteps.map(function (s) {
      return '<div class="fn-journey-next-item">' +
        '<p>' + s.text + "</p>" +
        '<a href="' + s.href + '">' + s.label + " &rarr;</a>" +
      "</div>";
    }).join("");

    // "Reach FI By Age" — an interactive slider (40-70), not a passive
    // insight, so it gets its own always-rendered section (same
    // always-visible-with-an-empty-state pattern as "Your Progress" above,
    // not the "only if there's something to say" pattern Insights/Coming
    // Up/Achievements use below) — someone who hasn't filled in their
    // profile yet should still discover the tool exists, not have it
    // silently missing. journeyFiAgeResult() computes the initial position's
    // result server-side; the slider's own "input" handler in
    // openJourneyModal() recomputes it live via the same function.
    var fiPlanner = computeJourneyFiAgePlanner();
    var fiPlannerHtml;
    if (fiPlanner) {
      var fiPlannerResult = journeyFiAgeResult(fiPlanner, fiPlanner.defaultAge);
      fiPlannerHtml =
        '<details class="fn-journey-fiplanner fn-journey-section" id="fn-journey-sec-fiplanner" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Reach FI By Age</summary>" +
          '<div class="fn-journey-fiplanner-body" data-age="' + fiPlanner.age + '" data-savings="' + fiPlanner.savings +
            '" data-goal="' + fiPlanner.goal + '" data-return="' + fiPlanner.returnPct + '">' +
            '<div class="fn-journey-fiplanner-row">' +
              "<span>What you'd need to do to reach FI/retirement at age</span>" +
              '<span class="fn-journey-fiplanner-age" id="fnJourneyFiPlannerAge">' + fiPlanner.defaultAge + "</span>" +
            "</div>" +
            '<input type="range" class="fn-journey-fiplanner-slider" id="fnJourneyFiPlannerSlider" min="40" max="70" step="1" value="' + fiPlanner.defaultAge + '" aria-label="Target FI age">' +
            '<div class="fn-journey-fiplanner-ticks"><span>40</span><span>70</span></div>' +
            '<div class="fn-journey-fiplanner-amt" id="fnJourneyFiPlannerAmt">' + fiPlannerResult.amountText + "</div>" +
            '<div class="fn-journey-fiplanner-detail" id="fnJourneyFiPlannerDetail">' + fiPlannerResult.detail + "</div>" +
          "</div>" +
        "</details>";
    } else {
      fiPlannerHtml =
        '<details class="fn-journey-fiplanner fn-journey-section" id="fn-journey-sec-fiplanner" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Reach FI By Age</summary>" +
          '<div class="fn-journey-empty">Add your birthday and a goal amount in <strong>Your info</strong> to see what it would take to reach FI at any age.</div>' +
        "</details>";
    }

    // Insights — practical tips computed from the same saved inputs as the
    // cards above (plus ContributionLimits' own data for the benefits
    // tip), turning raw numbers into "here's what to actually do" copy.
    var insights = computeJourneyInsights();
    var insightsHtml = insights.length
      ? '<details class="fn-journey-insights fn-journey-section" id="fn-journey-sec-insights" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Insights</summary>" +
          insights.map(function (ins) {
            return '<div class="fn-journey-insight">' +
              "<p>" + ins.text + "</p>" +
              '<a href="' + ins.href + '">Open ' + ins.label + " &rarr;</a>" +
            "</div>";
          }).join("") +
        "</details>"
      : "";

    // "Coming Up" — Achievements' forward-looking sibling, immediately
    // above it: one pace-based ETA per card that still has a finish line
    // ahead. Reuses the same list styling (dot + text row) rather than
    // inventing a new one.
    var comingUp = anyStarted ? computeJourneyComingUp(cards, journeyHistory) : [];
    var comingUpHtml = comingUp.length
      ? '<details class="fn-journey-achievements fn-journey-section" id="fn-journey-sec-comingup" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Coming Up</summary>" +
          comingUp.map(function (item) {
            return '<div class="fn-journey-achievement">' +
              '<span class="fn-journey-dot fn-journey-' + item.color + '"></span>' +
              '<span class="fn-journey-achievement-text">' + item.text + "</span>" +
            "</div>";
          }).join("") +
        "</details>"
      : "";

    // Achievements — a trophy case of every milestone ever crossed, most
    // recent first, so a superseded one (e.g. "Halfway there!" after later
    // hitting 100%) still gets remembered rather than just disappearing.
    var achievements = computeJourneyAchievements(journeyHistory, cards);
    var achievementsHtml = achievements.length
      ? '<details class="fn-journey-achievements fn-journey-section" id="fn-journey-sec-achievements" open>' +
          '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Achievements</summary>" +
          achievements.map(function (a) {
            return '<div class="fn-journey-achievement">' +
              '<span class="fn-journey-dot fn-journey-' + a.color + '"></span>' +
              '<span class="fn-journey-achievement-text">' + a.label + ": " + a.text + "</span>" +
              '<span class="fn-journey-achievement-date">since ' + formatJourneyShortDate(a.date) + "</span>" +
            "</div>";
          }).join("") +
        "</details>"
      : "";

    // Quick-nav row — one button per section that actually rendered above,
    // in the same order they appear, so jumping to "Insights" never lands
    // on an empty section. Order here is authoritative for the row's visual
    // order (unlike collecting these inline as each section's own HTML was
    // built above, which would have followed *code* order, not the page's
    // actual top-to-bottom layout).
    var journeySections = [
      checklistHtml ? { id: "fn-journey-sec-foundations", label: "Foundations" } : null,
      { id: "fn-journey-sec-progress", label: "Your Progress" },
      { id: "fn-journey-sec-next", label: "Next Steps" },
      { id: "fn-journey-sec-fiplanner", label: "Reach FI" },
      insights.length ? { id: "fn-journey-sec-insights", label: "Insights" } : null,
      comingUp.length ? { id: "fn-journey-sec-comingup", label: "Coming Up" } : null,
      achievements.length ? { id: "fn-journey-sec-achievements", label: "Achievements" } : null
    ].filter(function (s) { return !!s; });
    var quickNavHtml = anyStarted
      ? '<div class="fn-journey-quicknav">' +
          journeySections.map(function (s) {
            return '<button type="button" class="fn-journey-quicknav-btn" data-target="' + s.id + '">' + s.label + "</button>";
          }).join("") +
        "</div>"
      : "";

    var wrap = document.createElement("div");
    wrap.className = "fn-help-overlay fn-journey-overlay";
    wrap.innerHTML =
      '<div class="fn-help-modal fn-journey-modal" role="dialog" aria-modal="true" aria-labelledby="fnJourneyTitle" tabindex="-1">' +
        '<div class="fn-journey-titlebar">' +
          '<span class="fn-journey-titlebar-label" id="fnJourneyTitle">Journey Progress</span>' +
          '<div class="fn-journey-titlebar-actions">' +
            '<button type="button" class="fn-journey-maximize" aria-label="Maximize" aria-pressed="false">' + JOURNEY_MAXIMIZE_SVG + "</button>" +
            '<button type="button" class="fn-help-close" aria-label="Close">&times;</button>' +
          "</div>" +
        "</div>" +
        '<div class="fn-help-scroll">' +
          '<div class="fn-help-intro">Your path to financial independence, pulled together from what you’ve saved across the site.</div>' +
          quickNavHtml +
          overallHtml +
          checklistHtml +
          changesHtml +
          recapHtml +
          '<details class="fn-journey-section" id="fn-journey-sec-progress" open>' +
            '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Your Progress</summary>" +
            '<div class="fn-journey-grid">' + cardsHtml + "</div>" +
          "</details>" +
          '<details class="fn-journey-next fn-journey-section" id="fn-journey-sec-next" open>' +
            '<summary class="fn-journey-section-heading">' + JOURNEY_CHEVRON_SVG + "Next steps</summary>" +
            nextHtml +
          "</details>" +
          fiPlannerHtml +
          insightsHtml +
          comingUpHtml +
          achievementsHtml +
        "</div>" +
        '<div class="fn-help-fade fn-help-fade-top" aria-hidden="true"><span class="fn-help-fade-arrow">&#9650;</span></div>' +
        '<div class="fn-help-fade fn-help-fade-bottom" aria-hidden="true"><span class="fn-help-fade-arrow">&#9660;</span></div>' +
      "</div>";
    return wrap;
  }

  var journeyOverlay = null;
  var journeyLastFocused = null;
  var journeyAutoScrollTimer = null;
  var journeyDragCleanup = null;

  function stopJourneyAutoScroll() {
    if (journeyAutoScrollTimer) { clearInterval(journeyAutoScrollTimer); journeyAutoScrollTimer = null; }
  }
  function startJourneyAutoScroll(scrollEl, direction) {
    stopJourneyAutoScroll();
    journeyAutoScrollTimer = setInterval(function () { scrollEl.scrollTop += direction * 12; }, 20);
  }
  function onJourneyKeydown(e) {
    if (e.key === "Escape") closeJourneyModal();
  }
  function closeJourneyModal() {
    if (!journeyOverlay) return;
    if (journeyDragCleanup) { journeyDragCleanup(); journeyDragCleanup = null; }
    stopJourneyAutoScroll();
    if (journeyOverlay.parentNode) journeyOverlay.parentNode.removeChild(journeyOverlay);
    journeyOverlay = null;
    document.body.classList.remove("fn-help-lock");
    document.removeEventListener("keydown", onJourneyKeydown);
    if (journeyLastFocused && journeyLastFocused.focus) journeyLastFocused.focus();
  }
  function openJourneyModal() {
    if (journeyOverlay) return;
    journeyLastFocused = document.activeElement;
    journeyOverlay = buildJourneyModal();
    document.body.appendChild(journeyOverlay);
    document.body.classList.add("fn-help-lock");
    journeyOverlay.addEventListener("click", function (e) {
      if (e.target === journeyOverlay) closeJourneyModal();
    });
    var closeBtn = journeyOverlay.querySelector(".fn-help-close");
    if (closeBtn) closeBtn.addEventListener("click", closeJourneyModal);
    document.addEventListener("keydown", onJourneyKeydown);

    var modal = journeyOverlay.querySelector(".fn-journey-modal");
    var scrollEl = journeyOverlay.querySelector(".fn-help-scroll");
    var fadeTop = journeyOverlay.querySelector(".fn-help-fade-top");
    var fadeBottom = journeyOverlay.querySelector(".fn-help-fade-bottom");
    function updateFade() {
      if (!modal || !scrollEl) return;
      modal.classList.toggle("can-scroll-up", scrollEl.scrollTop > 2);
      modal.classList.toggle("can-scroll-down", scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 2);
    }
    if (scrollEl) scrollEl.addEventListener("scroll", updateFade);
    if (fadeTop) {
      fadeTop.addEventListener("mouseenter", function () { startJourneyAutoScroll(scrollEl, -1); });
      fadeTop.addEventListener("mouseleave", stopJourneyAutoScroll);
    }
    if (fadeBottom) {
      fadeBottom.addEventListener("mouseenter", function () { startJourneyAutoScroll(scrollEl, 1); });
      fadeBottom.addEventListener("mouseleave", stopJourneyAutoScroll);
    }

    // ---- movable (drag by titlebar) + maximize/restore — desktop
    // (fine-pointer) only, same reasoning as the resizable modal itself:
    // dragging a small titlebar isn't a practical touch interaction, and a
    // narrow phone viewport is already close to fullscreen anyway.
    var titlebar = journeyOverlay.querySelector(".fn-journey-titlebar");
    var maximizeBtn = journeyOverlay.querySelector(".fn-journey-maximize");
    var journeyIsDesktop = window.matchMedia("(min-width:768px) and (pointer:fine)").matches;
    if (modal && titlebar && journeyIsDesktop) {
      var journeyMaximized = false;
      var journeySavedRect = null;

      function journeyPinToCurrentPosition() {
        var rect = modal.getBoundingClientRect();
        modal.style.position = "fixed";
        modal.style.margin = "0";
        modal.style.top = rect.top + "px";
        modal.style.left = rect.left + "px";
      }
      function journeyClamp(left, top) {
        var rect = modal.getBoundingClientRect();
        var minVisible = 60; // keep at least this much of the titlebar reachable
        return {
          left: Math.min(Math.max(left, minVisible - rect.width), window.innerWidth - minVisible),
          top: Math.min(Math.max(top, 0), window.innerHeight - minVisible)
        };
      }
      function journeyDragMove(e) {
        var clamped = journeyClamp(e.clientX - journeyDragOffsetX, e.clientY - journeyDragOffsetY);
        modal.style.left = clamped.left + "px";
        modal.style.top = clamped.top + "px";
      }
      function journeyDragEnd() {
        document.removeEventListener("mousemove", journeyDragMove);
        document.removeEventListener("mouseup", journeyDragEnd);
        journeyDragCleanup = null;
      }
      var journeyDragOffsetX = 0, journeyDragOffsetY = 0;
      titlebar.addEventListener("mousedown", function (e) {
        if (journeyMaximized || e.target.closest("button")) return;
        var rect = modal.getBoundingClientRect();
        journeyPinToCurrentPosition();
        journeyDragOffsetX = e.clientX - rect.left;
        journeyDragOffsetY = e.clientY - rect.top;
        document.addEventListener("mousemove", journeyDragMove);
        document.addEventListener("mouseup", journeyDragEnd);
        journeyDragCleanup = journeyDragEnd;
        e.preventDefault();
      });

      if (maximizeBtn) {
        maximizeBtn.addEventListener("click", function () {
          if (!journeyMaximized) {
            journeySavedRect = {
              position: modal.style.position, top: modal.style.top, left: modal.style.left,
              width: modal.style.width, height: modal.style.height, margin: modal.style.margin,
              resize: modal.style.resize
            };
            modal.style.position = "fixed";
            modal.style.top = "16px";
            modal.style.left = "16px";
            modal.style.width = "calc(100vw - 32px)";
            modal.style.height = "calc(100vh - 32px)";
            modal.style.margin = "0";
            modal.style.resize = "none";
            modal.classList.add("fn-journey-maximized");
            maximizeBtn.setAttribute("aria-label", "Restore");
            maximizeBtn.setAttribute("aria-pressed", "true");
            maximizeBtn.innerHTML = JOURNEY_RESTORE_SVG;
            journeyMaximized = true;
          } else {
            if (journeySavedRect) {
              modal.style.position = journeySavedRect.position;
              modal.style.top = journeySavedRect.top;
              modal.style.left = journeySavedRect.left;
              modal.style.width = journeySavedRect.width;
              modal.style.height = journeySavedRect.height;
              modal.style.margin = journeySavedRect.margin;
              modal.style.resize = journeySavedRect.resize;
            }
            modal.classList.remove("fn-journey-maximized");
            maximizeBtn.setAttribute("aria-label", "Maximize");
            maximizeBtn.setAttribute("aria-pressed", "false");
            maximizeBtn.innerHTML = JOURNEY_MAXIMIZE_SVG;
            journeyMaximized = false;
          }
        });
      }
    }

    // Inline quick-log/quick-edit — toggle the mini-form, save, then refresh
    // the whole modal in place so the ring, sparkline and "since your last
    // visit" line all pick up the new number immediately instead of only
    // updating after the next open. Several cards can each have their own
    // .fn-journey-quicklog now (Net Worth's dated log, plus Time to FI/
    // Emergency Fund/Spending-Based FI's single-field quick-edit), so this
    // is scoped per-card via closest(".fn-journey-card") rather than
    // grabbing the first match on the page.
    journeyOverlay.querySelectorAll(".fn-journey-ql-toggle").forEach(function (toggle) {
      var card = toggle.closest(".fn-journey-card");
      var form = card ? card.querySelector(".fn-journey-quicklog") : null;
      if (!form) return;
      toggle.addEventListener("click", function () {
        form.hidden = !form.hidden;
        var firstInput = form.querySelector("input");
        if (!form.hidden && firstInput) firstInput.focus();
      });
    });
    journeyOverlay.querySelectorAll(".fn-journey-ql-cancel").forEach(function (cancel) {
      var card = cancel.closest(".fn-journey-card");
      var form = card ? card.querySelector(".fn-journey-quicklog") : null;
      if (form) cancel.addEventListener("click", function () { form.hidden = true; });
    });
    // Quick-nav row — each button expands its target <details> (in case the
    // user had collapsed it) before scrolling, so "jump to Insights" never
    // lands on a closed, empty-looking section.
    journeyOverlay.querySelectorAll(".fn-journey-quicknav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.dataset.target);
        if (!target) return;
        if (target.tagName === "DETAILS") target.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Emergency Fund's "what if" slider — pure client-side preview, nothing
    // saved. Re-runs the same journeyEfMonthsToTarget() loop the card's own
    // initial render already used, just with the slider's live value in
    // place of the saved monthlyContribution.
    journeyOverlay.querySelectorAll(".fn-journey-whatif-slider").forEach(function (slider) {
      var wrap = slider.closest(".fn-journey-whatif");
      var amtEl = wrap ? wrap.querySelector(".fn-journey-whatif-amt") : null;
      var resultEl = wrap ? wrap.querySelector(".fn-journey-whatif-result") : null;
      if (!wrap || !amtEl || !resultEl) return;
      var target = parseFloat(wrap.dataset.target) || 0;
      var current = parseFloat(wrap.dataset.current) || 0;
      var apy = parseFloat(wrap.dataset.apy) || 0;
      slider.addEventListener("input", function () {
        var contribution = parseFloat(slider.value) || 0;
        amtEl.textContent = fmtUSD0(contribution);
        var months = journeyEfMonthsToTarget(target, current, contribution, apy);
        resultEl.textContent = months !== null
          ? "Fully funded by ~" + formatJourneyMonthYear((function () { var d = new Date(); d.setMonth(d.getMonth() + months); return d; })())
          : "Enter a contribution to see a projection";
      });
    });

    // "Reach FI By Age" slider — live client-side preview via the same
    // journeyFiAgeResult() the initial server-rendered position already
    // used, so the two never drift out of sync with each other.
    (function () {
      var slider = document.getElementById("fnJourneyFiPlannerSlider");
      var body = slider ? slider.closest(".fn-journey-fiplanner-body") : null;
      var ageEl = document.getElementById("fnJourneyFiPlannerAge");
      var amtEl = document.getElementById("fnJourneyFiPlannerAmt");
      var detailEl = document.getElementById("fnJourneyFiPlannerDetail");
      if (!slider || !body || !ageEl || !amtEl || !detailEl) return;
      var data = {
        age: parseFloat(body.dataset.age) || 0,
        savings: parseFloat(body.dataset.savings) || 0,
        goal: parseFloat(body.dataset.goal) || 0,
        returnPct: parseFloat(body.dataset.return) || 0
      };
      slider.addEventListener("input", function () {
        var targetAge = parseInt(slider.value, 10);
        ageEl.textContent = targetAge;
        var result = journeyFiAgeResult(data, targetAge);
        amtEl.textContent = result.amountText;
        detailEl.textContent = result.detail;
      });
    })();

    // Debt Payoff's Payment/Additional-debt toggle — just flips the hidden
    // .fn-journey-ql-mode input the save handler below reads, same
    // preventDefault/stopPropagation reasoning as Contribution Limits'
    // Current/Projected toggle (this card is fine as a <div> today, but
    // keeping the guard costs nothing and matches the sibling pattern).
    journeyOverlay.querySelectorAll(".fn-journey-debt-mode-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var group = btn.closest(".fn-journey-debt-mode");
        var card = btn.closest(".fn-journey-card");
        var modeInput = card ? card.querySelector(".fn-journey-ql-mode") : null;
        if (group) group.querySelectorAll(".fn-journey-debt-mode-btn").forEach(function (b) { b.classList.toggle("active", b === btn); });
        if (modeInput) modeInput.value = btn.dataset.mode;
      });
    });

    journeyOverlay.querySelectorAll(".fn-journey-ql-save").forEach(function (save) {
      save.addEventListener("click", function () {
        var cardId = save.dataset.card;
        var card = save.closest(".fn-journey-card");
        if (cardId === "net-worth") {
          var assetsInput = card.querySelector(".fn-journey-ql-assets");
          var liabInput = card.querySelector(".fn-journey-ql-liab");
          var assets = parseFloat(((assetsInput && assetsInput.value) || "0").replace(/,/g, "")) || 0;
          var liabilities = parseFloat(((liabInput && liabInput.value) || "0").replace(/,/g, "")) || 0;
          saveJourneyNetWorthSnapshot(assets, liabilities);
        } else if (cardId === "debt-snowball") {
          var debtValueInput = card ? card.querySelector(".fn-journey-ql-value") : null;
          var debtModeInput = card ? card.querySelector(".fn-journey-ql-mode") : null;
          var debtAmount = parseFloat(((debtValueInput && debtValueInput.value) || "0").replace(/,/g, "")) || 0;
          var debtMode = (debtModeInput && debtModeInput.value) || "payment";
          saveJourneyDebtQuickEdit(debtMode, debtAmount);
        } else {
          var valueInput = card ? card.querySelector(".fn-journey-ql-value") : null;
          var value = parseFloat(((valueInput && valueInput.value) || "0").replace(/,/g, "")) || 0;
          saveJourneyQuickEditValue(cardId, value);
        }
        refreshJourneyModal();
      });
    });

    // Contribution Limits' Current/Projected toggle — pure show/hide, both
    // views are already rendered into the DOM, so this never needs to
    // rebuild the modal the way the net-worth quick-log save above does.
    var clToggleBtns = journeyOverlay.querySelectorAll(".fn-journey-cl-toggle-btn");
    var clCurrentEl = journeyOverlay.querySelector(".fn-journey-cl-current");
    var clProjectedEl = journeyOverlay.querySelector(".fn-journey-cl-projected");
    if (clToggleBtns.length && clCurrentEl && clProjectedEl) {
      clToggleBtns.forEach(function (btn) {
        // Unlike Net Worth's own <div>-wrapped card, this card is still the
        // other cards' whole-card <a href="..."> — without stopping the
        // click here it bubbles up and navigates to ContributionLimits
        // instead of just switching views.
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var view = btn.dataset.view;
          clToggleBtns.forEach(function (b) { b.classList.toggle("active", b === btn); });
          clCurrentEl.hidden = view !== "current";
          clProjectedEl.hidden = view !== "projected";
        });
      });
    }

    requestAnimationFrame(updateFade);
    if (modal) modal.focus();
  }

  function refreshJourneyModal() {
    if (!journeyOverlay) return;
    closeJourneyModal();
    openJourneyModal();
  }

  // ---------- Notifications ----------
  // Two sources feed the bell: an admin-authored JSON file (fetched, so a
  // non-technical admin can edit it directly — same reasoning the shared
  // footer template already uses fetch() for) and locally-computed "system"
  // notifications for milestones crossed on this device. The two are only
  // ever merged in memory for display; the JSON file itself is never
  // written back to.
  var NOTIFICATIONS_JSON_URL = BASE + "assets/data/notifications.json";
  var SYSTEM_NOTIFICATIONS_KEY = "systemNotifications";
  var KNOWN_MILESTONES_KEY = "journeyKnownMilestones";
  var NOTIFICATIONS_READ_KEY = "notificationsReadIds";
  var NOTIFICATIONS_HIDDEN_KEY = "notificationsHiddenIds";
  var NOTIFICATIONS_MUTED_KEY = "notificationsMutedTypes";
  var SYSTEM_NOTIFICATIONS_CAP = 30;
  var notificationsCache = { admin: [], system: [] };

  // when a real backup was last taken (the "Your info" panel's own
  // download button, or either Export button on Profile Manager — all
  // three call recordBackupTaken()) and roughly how much profile+
  // calculator data existed at that moment, so the reminder below can
  // tell "you've added a lot since then" apart from "it's just been a
  // while." Deliberately NOT in FN_PAGE_DATA_KEYS/exported — it's a
  // device-local operational marker (what actually happened on THIS
  // device), not profile data; carrying it through an export/import would
  // let a stale timestamp from one device masquerade as a real backup on
  // another.
  var LAST_BACKUP_KEY = "lastBackupInfo";

  // same device-local-only reasoning as LAST_BACKUP_KEY above, and same
  // requirement to live at top level (not nested inside init(), where a
  // plain `var` declared textually after its first call site would still
  // be `undefined` at call time — hoisting only lifts the declaration,
  // not the assignment)
  var AUTO_SNAPSHOT_KEY = "lastAutoSnapshotAt";

  // Notification "type" (severity) drives the small icon shown next to
  // each item's title — a shape+color pair, not color alone, so it still
  // reads for colorblind visitors. "info" is the default/fallback for any
  // entry (admin-authored or system-generated) with no type set or an
  // unrecognized one, so a typo in notifications.json degrades instead of
  // breaking — same "unmapped still renders" philosophy as
  // FN_GLOSSARY_GROUPS. Reuses the same --fn-* chrome tokens (already
  // theme-mapped) the rest of this panel is built on, not new colors.
  var NOTIF_TYPES = {
    urgent: { label: "Urgent", varName: "--fn-rust", svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' },
    warning: { label: "Warning", varName: "--fn-gold", svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' },
    info: { label: "Informational", varName: "--fn-azure", svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="11"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>' },
    achievement: { label: "Achievement", varName: "--fn-jade", svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"></circle><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"></path></svg>' }
  };
  function notifTypeInfo(type) {
    return NOTIF_TYPES[type] || NOTIF_TYPES.info;
  }

  function readNotifJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeNotifJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function formatNotifDate(iso) {
    try {
      var d = new Date((iso || "").slice(0, 10) + "T00:00:00");
      if (isNaN(d.getTime())) return iso || "";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) { return iso || ""; }
  }
  // "date" doubles as a schedule gate — a plain "YYYY-MM-DD" parses as
  // midnight that day (so it's visible as soon as that day arrives, same
  // as before this existed), but writing a full "YYYY-MM-DDTHH:MM" lets an
  // admin hold a notification back until a specific time, not just a day.
  // Falls back to "always visible" (the epoch) for anything unparseable,
  // same graceful-degradation spirit as an unrecognized notification type.
  function notifDateTime(str) {
    if (!str) return new Date(0);
    var d = new Date(str.indexOf("T") > -1 ? str : (str + "T00:00:00"));
    return isNaN(d.getTime()) ? new Date(0) : d;
  }

  // rough byte-size of the live profile + every calculator's saved inputs
  // right now — cheap stand-in for "how much would be lost," used both to
  // stamp a backup's own size at the moment it's taken and to compare
  // against later. Reads FN_PAGE_DATA_KEYS directly rather than going
  // through the profile panel's own collectPageData() (nested inside
  // init(), not reachable from here) — raw string lengths are just as
  // valid a size proxy and don't need that helper's object-building.
  function currentBackupDataSize() {
    var size = 0;
    try { size += JSON.stringify(window.FNProfile ? window.FNProfile.get() : {}).length; } catch (e) {}
    (window.FN_PAGE_DATA_KEYS || []).forEach(function (key) {
      try {
        var raw = localStorage.getItem(key);
        if (raw !== null) size += raw.length;
      } catch (e) {}
    });
    return size;
  }
  // true total across every key in storage, not just the curated
  // FN_PAGE_DATA_KEYS subset currentBackupDataSize() above measures — the
  // browser's quota applies to everything in the origin's localStorage,
  // theme choice and dismissed-hint flags included, so the storage-warning
  // check below needs the real total, not the backup-relevant slice
  function totalLocalStorageSize() {
    var size = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var val = localStorage.getItem(key);
        size += (key ? key.length : 0) + (val ? val.length : 0);
      }
    } catch (e) {}
    return size;
  }
  // conservative cross-browser floor (some browsers allow more, but
  // nothing guarantees it) — top level so both the storage-size warning
  // notification below AND Profile Manager's own usage graphic (via
  // window.FNStorageInfo) check against the exact same number
  var STORAGE_QUOTA_ESTIMATE = 5 * 1024 * 1024;
  window.FNStorageInfo = {
    QUOTA_ESTIMATE: STORAGE_QUOTA_ESTIMATE,
    used: totalLocalStorageSize
  };
  // shared by the "Your info" panel's own download button and both of
  // Profile Manager's Export buttons (curated + raw) — same window.FNX
  // convention as FNTheme/FNProfile, since Profile Manager is a separate
  // page/script that still needs to record the exact same thing
  window.FNBackupTracker = {
    record: function () {
      writeNotifJSON(LAST_BACKUP_KEY, { at: new Date().toISOString(), size: currentBackupDataSize() });
    },
    read: function () {
      return readNotifJSON(LAST_BACKUP_KEY);
    }
  };

  // how often the automatic local snapshot (see maybeTakeAutoSnapshot(),
  // nested in init() since it calls the also-nested
  // saveCurrentProfileAsScenario()) actually saves — configurable from
  // Profile Manager, stored in hours so "Hourly" and "28 Days" share one
  // unit. Exposed the same window.FNX way as FNBackupTracker above, since
  // Profile Manager is a separate page/script and needs the exact same
  // option list its own <select> is built from, not a second copy of it.
  var AUTO_SNAPSHOT_INTERVAL_KEY = "autoSnapshotIntervalHours";
  var AUTO_SNAPSHOT_INTERVAL_OPTIONS = [
    { hours: 1, label: "Hourly" },
    { hours: 24, label: "Daily" },
    { hours: 72, label: "Every 3 days" },
    { hours: 168, label: "Every 7 days" },
    { hours: 336, label: "Every 14 days" },
    { hours: 672, label: "Every 28 days" }
  ];
  var AUTO_SNAPSHOT_DEFAULT_HOURS = 168; // 7 days
  function readAutoSnapshotIntervalHours() {
    try {
      var raw = localStorage.getItem(AUTO_SNAPSHOT_INTERVAL_KEY);
      var n = raw ? parseFloat(raw) : NaN;
      return !isNaN(n) && n > 0 ? n : AUTO_SNAPSHOT_DEFAULT_HOURS;
    } catch (e) { return AUTO_SNAPSHOT_DEFAULT_HOURS; }
  }
  function writeAutoSnapshotIntervalHours(hours) {
    try { localStorage.setItem(AUTO_SNAPSHOT_INTERVAL_KEY, String(hours)); } catch (e) {}
  }
  // lowercased so it reads naturally mid-sentence in the auto-snapshot's
  // own notification body ("set to snapshot every 7 days"); falls back to
  // a plain "every N hours" for a value that isn't one of the six exact
  // options (shouldn't happen via the UI, but localStorage can be hand-edited)
  function autoSnapshotIntervalLabel(hours) {
    var match = null;
    AUTO_SNAPSHOT_INTERVAL_OPTIONS.forEach(function (o) { if (o.hours === hours) match = o; });
    return match ? match.label.toLowerCase() : ("every " + hours + " hours");
  }
  window.FNAutoSnapshot = {
    OPTIONS: AUTO_SNAPSHOT_INTERVAL_OPTIONS,
    DEFAULT_HOURS: AUTO_SNAPSHOT_DEFAULT_HOURS,
    read: readAutoSnapshotIntervalHours,
    write: writeAutoSnapshotIntervalHours,
    label: autoSnapshotIntervalLabel
  };

  // Compares each card's current milestone (from computeJourneyCards() —
  // already fully built for Journey Progress, not duplicated here) against
  // the last-known milestone recorded for that card, and turns any real
  // change into a new notification. Runs on every page load, not just when
  // Journey Progress is opened, so crossing a milestone while browsing
  // anywhere on the site still surfaces here without requiring a visit to
  // the dashboard first.
  // Mirrors SocialSecurityBridge/index.html's own bridgeFundFor() — kept in
  // sync by hand, same convention as the other "mirrors X page" helpers.
  function journeyPresentValueAnnuity(annual, years, r) {
    if (years <= 0 || annual <= 0) return 0;
    if (Math.abs(r) < 1e-9) return annual * years;
    return annual * (1 - Math.pow(1 + r, -years)) / r;
  }

  function generateSystemNotifications() {
    var today = new Date().toISOString().slice(0, 10);
    var known = readNotifJSON(KNOWN_MILESTONES_KEY) || {};
    var list = readNotifJSON(SYSTEM_NOTIFICATIONS_KEY) || [];
    var changed = false;
    function pushNotification(entry) {
      list.push(entry);
      changed = true;
    }

    // ---- Journey Progress card milestones ----
    var cards;
    try { cards = computeJourneyCards(); } catch (e) { cards = []; }
    cards.forEach(function (c) {
      var text = c.milestone ? c.milestone.text : null;
      if (text && known[c.id] !== text) {
        pushNotification({
          id: "system-" + c.id + "-" + text.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-" + today,
          date: today,
          title: c.label + ": " + text,
          body: "Based on what's saved on " + c.label + " right now.",
          href: c.href,
          label: "Open " + c.label,
          type: "achievement"
        });
      }
      if (text) { known[c.id] = text; }
      else if (known[c.id] !== undefined) { delete known[c.id]; changed = true; }
    });

    // ---- RMD age reminder — fires once per stage transition, using the
    // real profile birthday (same source the catch-up-contribution insight
    // uses) against rmdInputs' own rmdStartAge, defaulting to the current
    // 73 if the user's never actually visited RMD — missing a first RMD
    // carries a real penalty, so this is worth surfacing proactively
    // rather than only after they've set the page up. ----
    if (window.FNProfile && typeof window.FNProfile.getAge === "function") {
      var rmdAge = window.FNProfile.getAge();
      if (rmdAge !== null) {
        var rmdRaw = readJourneyJSON("rmdInputs");
        var rmdStartAge = rmdRaw && rmdRaw.rmdStartAge ? (journeyNum(rmdRaw.rmdStartAge) || 73) : 73;
        var rmdStage = rmdAge >= rmdStartAge ? "active" : (rmdAge >= rmdStartAge - 1 ? "approaching" : null);
        if (rmdStage && known["rmd-reminder"] !== rmdStage) {
          pushNotification({
            id: "system-rmd-" + rmdStage,
            date: today,
            title: rmdStage === "active" ? "RMDs are due" : "RMD age is approaching",
            body: rmdStage === "active"
              ? ("You're " + rmdAge + " — Required Minimum Distributions from traditional retirement accounts are due this year. Missing one carries a real penalty.")
              : ("You're " + rmdAge + " — Required Minimum Distributions start at age " + rmdStartAge + ". Worth planning ahead."),
            href: BASE + "RMD/index.html",
            label: "Open RMD",
            type: rmdStage === "active" ? "urgent" : "warning"
          });
          known["rmd-reminder"] = rmdStage;
        }
      }
    }

    // ---- Social Security / Pension Bridge funded — mirrors
    // SocialSecurityBridge/index.html's own compute() for the standard
    // (67, full retirement age) scenario only, gated on the user having
    // actually entered real numbers there (unlike RMD above, there's no
    // sensible universal default for a bridge target). ----
    (function () {
      var ssRaw = readJourneyJSON("ssBridgeInputs");
      if (!ssRaw) return;
      var retireAge = journeyNum(ssRaw.retireAge) || 0;
      var currentSavings = journeyNum(ssRaw.currentSavings) || 0;
      var annualExpenses = journeyNum(ssRaw.annualExpenses) || 0;
      var ssR = (journeyNum(ssRaw.returnPct) || 0) / 100;
      var ssSwr = (journeyNum(ssRaw.swrPct) || 0) / 100;
      var ssAt67 = journeyNum(ssRaw.ssAt67) || 0;
      if (!(annualExpenses > 0) || !(ssSwr > 0)) return;

      var gapYears = Math.max(0, 67 - retireAge);
      var bridgeFund = journeyPresentValueAnnuity(annualExpenses, gapYears, ssR);
      var ongoingGap = Math.max(0, annualExpenses - ssAt67);
      var ongoingFund = ongoingGap / ssSwr;
      var trueTarget = bridgeFund + ongoingFund;
      if (!(trueTarget > 0)) return;

      var ssStage = currentSavings >= trueTarget ? "funded" : null;
      if (ssStage && known["ss-bridge"] !== ssStage) {
        pushNotification({
          id: "system-ss-bridge-funded",
          date: today,
          title: "Social Security Bridge: fully funded",
          body: "At full retirement age (67), your savings now cover the gap until Social Security kicks in — " + fmtUSD0(trueTarget) + " needed, based on what's saved right now.",
          href: BASE + "SocialSecurityBridge/index.html",
          label: "Open SS & Pension Bridge",
          type: "achievement"
        });
        known["ss-bridge"] = ssStage;
      } else if (!ssStage && known["ss-bridge"] !== undefined) {
        delete known["ss-bridge"];
        changed = true;
      }
    })();

    // ---- Backup reminder — nudges toward the "Your info" panel's own
    // download button (or Profile Manager's) once either real time has
    // passed since the last one, or a fair amount has been added since
    // then. currentBackupDataSize() is a rough byte-size proxy for "how
    // much would be lost," not a real diff — good enough to distinguish
    // "barely anything's changed" from "a lot has," not meant to be exact.
    // Two stages, same one-shot-per-transition pattern as the RMD
    // reminder above: fires once entering "warning," again on escalating
    // to "urgent," and clears (so it can fire again later) once an actual
    // backup resets the clock. ----
    (function () {
      var profile = window.FNProfile ? window.FNProfile.get() : {};
      var profileKeys = ["birthday", "currentIncome", "currentSavings", "goalAmount", "retireAge", "expectedReturn"];
      var hasProfileData = profileKeys.some(function (k) {
        return profile[k] !== undefined && profile[k] !== null && profile[k] !== "";
      });
      var hasPageData = (window.FN_PAGE_DATA_KEYS || []).some(function (key) {
        try { return localStorage.getItem(key) !== null; } catch (e) { return false; }
      });
      if (!hasProfileData && !hasPageData) return; // nothing worth backing up yet

      var backup = window.FNBackupTracker ? window.FNBackupTracker.read() : null;
      var stage = null;
      var daysSince = null;
      var growth = null;
      if (!backup || !backup.at) {
        stage = "never";
      } else {
        daysSince = (Date.now() - new Date(backup.at).getTime()) / 86400000;
        growth = backup.size > 0 ? (currentBackupDataSize() - backup.size) / backup.size : 1;
        if (daysSince >= 45 || growth >= 0.75) stage = "urgent";
        else if (daysSince >= 21 || growth >= 0.35) stage = "warning";
      }

      if (stage && known["backup-reminder"] !== stage) {
        var reasons = [];
        if (stage === "never") {
          reasons.push("you haven't backed up yet");
        } else {
          if (daysSince >= 21) reasons.push("it's been " + Math.round(daysSince) + " day" + (Math.round(daysSince) === 1 ? "" : "s") + " since your last backup");
          if (growth >= 0.35) reasons.push("you've added a good amount of new data since then");
        }
        pushNotification({
          id: "system-backup-reminder-" + stage + "-" + today,
          date: today,
          title: stage === "urgent" ? "Back up your data" : "Consider backing up your data",
          body: "Everything you enter lives only in this browser — " + reasons.join(" and ") + ". A quick export (Your info panel, or Profile Manager) means clearing site data or losing the device won't wipe it out.",
          href: BASE + "ProfileManager/index.html",
          label: "Open Profile Manager",
          type: stage === "urgent" ? "urgent" : "warning"
        });
        known["backup-reminder"] = stage;
      } else if (!stage && known["backup-reminder"] !== undefined) {
        delete known["backup-reminder"];
        changed = true;
      }
    })();

    // ---- Storage-size warning — localStorage has a hard per-origin
    // quota (5MB is the conservative cross-browser floor; some browsers
    // allow more, but nothing guarantees it), and this site's own growing
    // history logs (net worth, budget, Journey Progress) plus a pile of
    // saved scenarios can approach it over a long enough time. Three
    // stages, same one-shot-per-transition pattern as the checks above —
    // "notice" is a plain heads-up (nothing to act on yet), "warning" and
    // "urgent" actually suggest doing something about it. ----
    (function () {
      var ratio = totalLocalStorageSize() / STORAGE_QUOTA_ESTIMATE;
      var stage = ratio >= 0.9 ? "urgent" : ratio >= 0.7 ? "warning" : ratio >= 0.5 ? "notice" : null;

      if (stage && known["storage-warning"] !== stage) {
        var usedKB = Math.round(totalLocalStorageSize() / 1024);
        var title = stage === "urgent" ? "Running low on browser storage"
          : stage === "warning" ? "Browser storage is filling up"
          : "Storage usage is at the halfway point";
        var body = stage === "notice"
          ? "This site is using about " + usedKB + " KB of this browser's storage — around half of what browsers typically allow per site. Nothing to do yet, just worth knowing about."
          : "This site is using about " + usedKB + " KB of this browser's storage — getting close to what browsers typically allow per site. If it fills up, new saves can silently fail. Export a backup, then consider deleting old saved snapshots in Profile Manager.";
        pushNotification({
          id: "system-storage-warning-" + stage + "-" + today,
          date: today,
          title: title,
          body: body,
          href: BASE + "ProfileManager/index.html",
          label: "Open Profile Manager",
          type: stage === "urgent" ? "urgent" : stage === "warning" ? "warning" : "info"
        });
        known["storage-warning"] = stage;
      } else if (!stage && known["storage-warning"] !== undefined) {
        delete known["storage-warning"];
        changed = true;
      }
    })();

    if (changed) {
      if (list.length > SYSTEM_NOTIFICATIONS_CAP) list = list.slice(list.length - SYSTEM_NOTIFICATIONS_CAP);
      writeNotifJSON(SYSTEM_NOTIFICATIONS_KEY, list);
      writeNotifJSON(KNOWN_MILESTONES_KEY, known);
    }
    notificationsCache.system = list;
  }

  // "hidden" is stronger than "read" — a hidden notification is gone from
  // every consumer of mergedNotifications() (badge count, the list, "mark
  // all read"), permanently, the moment the user dismisses it, rather than
  // just no longer counting toward unread. Filtered here rather than in
  // each caller so nothing has to remember to re-apply it.
  function mergedNotifications() {
    var now = new Date();
    var today = now.toISOString().slice(0, 10);
    var hidden = readNotifHiddenIds();
    var muted = readMutedNotifTypes();
    var admin = (notificationsCache.admin || []).filter(function (n) {
      return (!n.expires || n.expires >= today) && !hidden[n.id] && !muted[n.type || "info"] && notifDateTime(n.date) <= now;
    });
    var system = (notificationsCache.system || []).filter(function (n) {
      return !hidden[n.id] && !muted[n.type || "info"];
    });
    var all = admin.concat(system);
    all.sort(function (a, b) {
      var ad = a.date || "", bd = b.date || "";
      return ad < bd ? 1 : (ad > bd ? -1 : 0);
    });
    return all;
  }
  function readNotifReadIds() {
    var arr = readNotifJSON(NOTIFICATIONS_READ_KEY) || [];
    var set = {};
    arr.forEach(function (id) { set[id] = true; });
    return set;
  }
  function readNotifHiddenIds() {
    var arr = readNotifJSON(NOTIFICATIONS_HIDDEN_KEY) || [];
    var set = {};
    arr.forEach(function (id) { set[id] = true; });
    return set;
  }
  // per-type opt-out (Settings panel's "Notifications" checklist) — a
  // muted type is filtered out of mergedNotifications() entirely, same
  // "gone everywhere at once" treatment as a hidden id, just scoped to a
  // whole type instead of one item. Muting doesn't stop the underlying
  // check from running (an urgent RMD reminder still gets generated and
  // stored) — it's purely a display filter, so un-muting later surfaces
  // anything that fired while muted instead of losing it.
  function readMutedNotifTypes() {
    var arr = readNotifJSON(NOTIFICATIONS_MUTED_KEY) || [];
    var set = {};
    arr.forEach(function (t) { set[t] = true; });
    return set;
  }
  // dismissing also marks the item read — once it's gone from the list
  // for good, there's no meaningful "unread hidden item" state to track
  function hideNotification(id) {
    var hidden = readNotifHiddenIds();
    hidden[id] = true;
    writeNotifJSON(NOTIFICATIONS_HIDDEN_KEY, Object.keys(hidden));
    var read = readNotifReadIds();
    read[id] = true;
    writeNotifJSON(NOTIFICATIONS_READ_KEY, Object.keys(read));
    renderNotificationsList();
    updateNotificationsBadge();
  }
  // same idea as hideNotification(), just every currently-listed id at
  // once — a fresh admin entry or a milestone crossed later still shows
  // up normally, this only clears what's visible right now
  function clearAllNotifications() {
    var hidden = readNotifHiddenIds();
    var read = readNotifReadIds();
    mergedNotifications().forEach(function (n) {
      hidden[n.id] = true;
      read[n.id] = true;
    });
    writeNotifJSON(NOTIFICATIONS_HIDDEN_KEY, Object.keys(hidden));
    writeNotifJSON(NOTIFICATIONS_READ_KEY, Object.keys(read));
    renderNotificationsList();
    updateNotificationsBadge();
  }
  function updateNotificationsBadge() {
    var badge = document.getElementById("fnNotificationsBadge");
    if (!badge) return;
    var read = readNotifReadIds();
    var unread = mergedNotifications().filter(function (n) { return !read[n.id]; }).length;
    badge.hidden = unread === 0;
    if (unread > 0) badge.textContent = unread > 99 ? "99+" : String(unread);
  }
  function renderNotificationsList() {
    var host = document.getElementById("fnNotificationsList");
    if (!host) return;
    var items = mergedNotifications();
    var clearAllBtn = document.getElementById("fnNotificationsClearAll");
    if (clearAllBtn) clearAllBtn.hidden = !items.length;
    if (!items.length) {
      host.innerHTML = '<div class="fn-notifications-empty">You&rsquo;re all caught up.</div>';
      return;
    }
    host.innerHTML = items.map(function (n) {
      var linkHtml = n.href
        ? '<a href="' + escapeHtml(n.href) + '">' + escapeHtml(n.label || "Open") + " &rarr;</a>"
        : "";
      var typeInfo = notifTypeInfo(n.type);
      var iconHtml = '<span class="fn-notif-icon" style="color:var(' + typeInfo.varName + ')" role="img" aria-label="' + typeInfo.label + '">' + typeInfo.svg + "</span>";
      var hideHtml = '<button type="button" class="fn-notification-item-hide" data-notif-id="' + escapeHtml(n.id) + '" aria-label="Hide this notification" title="Hide">&times;</button>';
      return '<div class="fn-notification-item">' +
        '<div class="fn-notification-item-title">' + iconHtml + escapeHtml(n.title || "") + "</div>" +
        (n.body ? '<div class="fn-notification-item-body">' + escapeHtml(n.body) + "</div>" : "") +
        '<div class="fn-notification-item-meta"><span class="fn-notification-item-date">' + formatNotifDate(n.date) + "</span>" +
          '<span class="fn-notification-item-actions">' + linkHtml + hideHtml + "</span></div>" +
      "</div>";
    }).join("");
  }
  function markAllNotificationsRead() {
    var read = readNotifReadIds();
    mergedNotifications().forEach(function (n) { read[n.id] = true; });
    writeNotifJSON(NOTIFICATIONS_READ_KEY, Object.keys(read));
    updateNotificationsBadge();
  }
  function loadAdminNotifications() {
    fetch(NOTIFICATIONS_JSON_URL)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (json) {
        notificationsCache.admin = (Array.isArray(json) ? json : []).map(function (n) {
          return {
            id: n.id, date: n.date, title: n.title, body: n.body,
            href: n.href ? (n.href.indexOf("http") === 0 ? n.href : BASE + n.href) : "",
            label: n.label || "", expires: n.expires || null, type: n.type || "info"
          };
        });
        updateNotificationsBadge();
        renderNotificationsList();
      })
      .catch(function () { /* admin notifications file unavailable — system ones (if any) still work */ });
  }

  function init() {
    var navHost = document.getElementById("fn-site-nav");

    if (navHost) {
      navHost.innerHTML = buildNav();

      generateSystemNotifications();
      updateNotificationsBadge();
      renderNotificationsList();
      loadAdminNotifications();
      maybeTakeAutoSnapshot();

      // delegated (not per-item) so it keeps working across every
      // renderNotificationsList() re-render — hide buttons are recreated
      // wholesale each time via host.innerHTML, which would silently drop
      // any listener bound directly to them
      var notificationsListHost = navHost.querySelector("#fnNotificationsList");
      if (notificationsListHost) {
        notificationsListHost.addEventListener("click", function (e) {
          var btn = e.target.closest(".fn-notification-item-hide");
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          hideNotification(btn.getAttribute("data-notif-id"));
        });
      }
      // lives in the panel head, not #fnNotificationsList, so unlike the
      // per-item hide button above it's never rebuilt — a plain listener
      // is fine, no delegation needed
      var notificationsClearAllBtn = navHost.querySelector("#fnNotificationsClearAll");
      if (notificationsClearAllBtn) {
        notificationsClearAllBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          clearAllNotifications();
        });
      }

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
      var themeOptions = navHost.querySelectorAll(".fn-theme-option");
      var profileToggle = navHost.querySelector(".fn-profile-toggle");
      var journeyToggle = navHost.querySelector(".fn-journey-toggle");
      var notificationsToggle = navHost.querySelector(".fn-notifications-toggle");
      if (journeyToggle) {
        journeyToggle.addEventListener("click", function () {
          closeAllPanels();
          openJourneyModal();
        });
      }
      if (notificationsToggle) {
        notificationsToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = navHost.classList.toggle("fn-notifications-open");
          navHost.classList.remove("fn-open", "fn-settings-open", "fn-profile-open");
          notificationsToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
          if (open) markAllNotificationsRead();
        });
      }

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
        navHost.classList.remove("fn-open", "fn-settings-open", "fn-profile-open", "fn-notifications-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
        if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
        if (notificationsToggle) notificationsToggle.setAttribute("aria-expanded", "false");
        closeQuickload();
        stopLinksAutoScroll();
        resetLinksFilter();
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

      // filters the grouped page list as-you-type: hides non-matching links,
      // then hides a whole group once none of its links match, so search and
      // the group headers work together instead of one hiding the other
      var linksSearch = document.getElementById("fnLinksSearch");
      var linksEmpty = document.getElementById("fnLinksEmpty");
      function applyLinksFilter(query) {
        var q = (query || "").trim().toLowerCase();
        var anyVisible = false;
        navHost.querySelectorAll(".fn-links-group").forEach(function (group) {
          var groupHasMatch = false;
          group.querySelectorAll(".fn-nav-link").forEach(function (a) {
            var match = !q || (a.getAttribute("data-label") || "").indexOf(q) > -1;
            a.hidden = !match;
            if (match) groupHasMatch = true;
          });
          group.hidden = !groupHasMatch;
          if (groupHasMatch) anyVisible = true;
          // while actively searching, force every matching group open so
          // results aren't hidden behind a collapsed header — once the
          // search clears, each group falls back to its own saved state
          var items = group.querySelector(".fn-links-group-items");
          if (items) items.hidden = q ? false : group.classList.contains("is-collapsed");
        });
        if (linksEmpty) linksEmpty.hidden = anyVisible || !q;
        updateLinksScrollFade();
      }
      function resetLinksFilter() {
        if (linksSearch) linksSearch.value = "";
        applyLinksFilter("");
      }
      if (linksSearch) {
        linksSearch.addEventListener("input", function () {
          applyLinksFilter(linksSearch.value);
        });
      }

      // group headers collapse/expand their own list of links, with the
      // choice remembered per group across visits
      navHost.querySelectorAll(".fn-links-group-label").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var group = btn.closest(".fn-links-group");
          var items = group.querySelector(".fn-links-group-items");
          if (!group || !items) return;
          var collapsed = group.classList.toggle("is-collapsed");
          items.hidden = collapsed;
          btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
          var label = btn.getAttribute("data-group-label");
          var stored = readCollapsedGroups();
          if (collapsed) stored[label] = true; else delete stored[label];
          try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(stored)); } catch (e) {}
          updateLinksScrollFade();
        });
      });

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

      // jumps the scrollable link list to whichever page is currently open,
      // so on a long list (especially the cramped viewport on a phone) you
      // land on your place in the menu instead of the alphabetical top
      function scrollActiveLinkIntoView() {
        if (!linksScroll) return;
        var activeLink = linksScroll.querySelector(".fn-nav-link.fn-active");
        if (!activeLink) return;
        var group = activeLink.closest(".fn-links-group");
        if (group && group.classList.contains("is-collapsed")) {
          var items = group.querySelector(".fn-links-group-items");
          var label = group.querySelector(".fn-links-group-label");
          if (items) items.hidden = false;
          group.classList.remove("is-collapsed");
          if (label) {
            label.setAttribute("aria-expanded", "true");
            var groupName = label.getAttribute("data-group-label");
            var stored = readCollapsedGroups();
            delete stored[groupName];
            try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(stored)); } catch (e) {}
          }
        }
        // no smooth-scroll animation — this should land you there the
        // instant the menu opens, not scroll visibly into place after
        activeLink.scrollIntoView({ block: "center", behavior: "auto" });
      }

      if (toggle) {
        toggle.addEventListener("click", function () {
          var open = navHost.classList.toggle("fn-open");
          navHost.classList.remove("fn-settings-open", "fn-profile-open", "fn-notifications-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
          if (notificationsToggle) notificationsToggle.setAttribute("aria-expanded", "false");
          // the dropdown is "display:none" until opened, so scrollHeight/
          // clientHeight only become measurable once it's actually visible —
          // on the very first open specifically, the browser hasn't finished
          // laying the panel out yet in this same tick, which throws off
          // scrollIntoView's centering; a rAF defers just long enough for
          // that layout pass to land first
          if (open) {
            requestAnimationFrame(function () {
              scrollActiveLinkIntoView();
              updateLinksScrollFade();
            });
          } else {
            resetLinksFilter();
          }
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
          navHost.classList.remove("fn-open", "fn-profile-open", "fn-notifications-open");
          settingsToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (profileToggle) profileToggle.setAttribute("aria-expanded", "false");
          if (notificationsToggle) notificationsToggle.setAttribute("aria-expanded", "false");
        });
      }

      if (profileToggle) {
        profileToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var open = navHost.classList.toggle("fn-profile-open");
          navHost.classList.remove("fn-open", "fn-settings-open", "fn-notifications-open");
          profileToggle.setAttribute("aria-expanded", open ? "true" : "false");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
          if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "false");
          if (notificationsToggle) notificationsToggle.setAttribute("aria-expanded", "false");
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

      function syncThemeSelect() {
        if (!themeOptions.length || !window.FNTheme) return;
        // check against the visitor's stored *preference* ("system" or a
        // concrete theme), not the resolved applied theme — otherwise a
        // "system" visitor whose device is dark would see "Neon" marked
        // active instead of "System"
        var current = window.FNTheme.getPreference ? window.FNTheme.getPreference() : window.FNTheme.get();
        themeOptions.forEach(function (btn) {
          var active = btn.getAttribute("data-theme-option") === current;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-checked", active ? "true" : "false");
        });
      }
      syncThemeSelect();

      themeOptions.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!window.FNTheme) return;
          window.FNTheme.set(btn.getAttribute("data-theme-option"));
          syncThemeSelect();
        });
      });
      document.addEventListener("fn-theme-change", syncThemeSelect);

      // ---------- NOTIFICATION TYPE MUTING ----------
      var notifMuteInputs = navHost.querySelectorAll("[data-mute-type]");
      notifMuteInputs.forEach(function (input) {
        input.addEventListener("change", function () {
          var muted = readMutedNotifTypes();
          var type = input.getAttribute("data-mute-type");
          if (input.checked) delete muted[type]; else muted[type] = true;
          writeNotifJSON(NOTIFICATIONS_MUTED_KEY, Object.keys(muted));
          renderNotificationsList();
          updateNotificationsBadge();
        });
      });

      // ---------- RESET THIS DEVICE ----------
      var resetAllBtn = navHost.querySelector(".fn-reset-all");

      // brief full-screen "poof" so a destructive action that's easy to
      // click blindly through a confirm() dialog still gets an unmistakable
      // visual payoff — a little burst of particles behind a trash icon —
      // before the page reloads (or, for the "Clear my info" trash button
      // below, before the now-empty fields just settle in place). Shared
      // across both destructive actions rather than duplicated — `label`
      // lets each call site say what actually got cleared.
      function triggerClearAllEffect(onDone, label) {
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
            '<div class="fn-clearall-label" id="fnClearAllLabel">All cleared</div>';
          document.body.appendChild(overlay);
        }
        var labelEl = document.getElementById("fnClearAllLabel");
        if (labelEl) labelEl.textContent = label || "All cleared";
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
            // send them to the homepage, not just reload wherever they were
            // — with everything now cleared, that's where the first-visit
            // welcome modal and "Add your info" hint pick them back up,
            // same as a genuinely brand-new visitor
            window.location.href = BASE + "index.html";
          });
        });
      }

      // ---------- USER PROFILE ----------
      var nameInput = navHost.querySelector("#fnProfileName");
      var nameBadge = navHost.querySelector("#fnProfileNameBadge");
      var birthdayInput = navHost.querySelector("#fnProfileBirthday");
      var ageValue = navHost.querySelector("#fnProfileAgeValue");
      var incomeInput = navHost.querySelector("#fnProfileIncome");
      var savingsInput = navHost.querySelector("#fnProfileSavings");
      var goalInput = navHost.querySelector("#fnProfileGoal");
      var retireAgeInput = navHost.querySelector("#fnProfileRetireAge");
      var returnInput = navHost.querySelector("#fnProfileReturn");
      var clearBtn = navHost.querySelector(".fn-profile-clear");
      var lastSavedValue = navHost.querySelector("#fnProfileLastSaved");
      var lastSnapshotValue = navHost.querySelector("#fnProfileLastSnapshot");
      var saveCheckpointBtn = navHost.querySelector("#fnProfileSaveBtn");

      // shared by both save-meta rows below
      function formatSavedAt(ts) {
        if (!ts) return "—";
        var d = new Date(ts);
        if (isNaN(d.getTime())) return "—";
        var today = new Date();
        var isToday = d.toDateString() === today.toDateString();
        var time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
        if (isToday) return "Today, " + time;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + time;
      }

      // fn-scenarios isn't tracked by FNProfile (ProfileManager and the
      // camera "quick snapshot" button both write it directly), so unlike
      // "Last saved" this has to be read fresh from storage each time
      function getLastSnapshotTime() {
        try {
          var raw = localStorage.getItem("fn-scenarios");
          var list = raw ? JSON.parse(raw) : [];
          var latest = 0;
          list.forEach(function (s) {
            if (s && s.savedAt > latest) latest = s.savedAt;
          });
          return latest || null;
        } catch (e) {
          return null;
        }
      }

      function updateSaveMeta() {
        if (lastSavedValue && window.FNProfile) {
          lastSavedValue.textContent = formatSavedAt(window.FNProfile.get().lastSaved);
        }
        if (lastSnapshotValue) {
          lastSnapshotValue.textContent = formatSavedAt(getLastSnapshotTime());
        }
        updateSaveCheckpointBtn();
      }

      // ---------- MANUAL SAVE CHECKPOINT ----------
      // the live profile already autosaves on every keystroke (other pages
      // read it immediately) — this button doesn't gate that, it's purely a
      // "you've made changes" affordance — lights up the instant a field
      // autosaves, then quietly greys itself back out ~1s after the last
      // edit (once that autosave has actually landed), no click required.
      // Clicking it just clears it immediately instead of waiting out the
      // debounce. Checkpoint is stored separately from the profile object
      // itself (own localStorage key) so it survives page navigation
      // without ever being swept up in exports/snapshots/shares, which
      // only ever read the whitelisted profile fields.
      var SAVE_CHECKPOINT_KEY = "fn-profile-save-checkpoint";
      var SAVE_AUTO_CLEAR_MS = 1000;
      var saveAutoClearTimer = null;
      function getSaveCheckpoint() {
        try {
          var v = localStorage.getItem(SAVE_CHECKPOINT_KEY);
          return v ? parseInt(v, 10) : null;
        } catch (e) {
          return null;
        }
      }
      function setSaveCheckpoint(ts) {
        try { localStorage.setItem(SAVE_CHECKPOINT_KEY, String(ts)); } catch (e) {}
      }
      // marks the current profile state as confirmed and greys the icon —
      // shared by the auto-clear debounce and an explicit click
      function commitSaveCheckpoint() {
        if (!window.FNProfile) return;
        clearTimeout(saveAutoClearTimer);
        setSaveCheckpoint(window.FNProfile.get().lastSaved || Date.now());
        updateSaveCheckpointBtn();
      }
      function updateSaveCheckpointBtn() {
        if (!saveCheckpointBtn || !window.FNProfile) return;
        var lastSaved = window.FNProfile.get().lastSaved || 0;
        var checkpoint = getSaveCheckpoint();
        // first time this device has ever seen the checkpoint key — treat
        // whatever's already saved as already-confirmed instead of lighting
        // up immediately for someone who never touched anything this visit
        if (checkpoint === null) {
          checkpoint = lastSaved;
          setSaveCheckpoint(checkpoint);
        }
        var dirty = lastSaved > checkpoint;
        saveCheckpointBtn.disabled = !dirty;
        saveCheckpointBtn.classList.toggle("is-dirty", dirty);
        saveCheckpointBtn.title = dirty ? "Save your info" : "Nothing new to save";
        clearTimeout(saveAutoClearTimer);
        if (dirty) {
          saveAutoClearTimer = setTimeout(commitSaveCheckpoint, SAVE_AUTO_CLEAR_MS);
        }
      }
      if (saveCheckpointBtn) {
        saveCheckpointBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          commitSaveCheckpoint();
          saveCheckpointBtn.classList.remove("flash");
          void saveCheckpointBtn.offsetWidth;
          saveCheckpointBtn.classList.add("flash");
          setTimeout(function () { saveCheckpointBtn.classList.remove("flash"); }, 500);
        });
      }

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
        if (nameInput && active !== nameInput) nameInput.value = numOrEmpty(profile.name);
        if (nameBadge) {
          var trimmedName = (profile.name || "").trim();
          nameBadge.textContent = trimmedName;
          nameBadge.style.display = trimmedName ? "" : "none";
        }
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
        updateSaveMeta();
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

      if (nameInput) {
        nameInput.addEventListener("input", function () {
          window.FNProfile.set({ name: nameInput.value });
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
          var namedPrefix = current.name ? current.name.trim() + " — " + namePrefix : namePrefix;
          var name = namedPrefix +
            now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          list.push({
            id: "sc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
            name: name,
            savedAt: Date.now(),
            profile: {
              name: current.name || "",
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

      // a passive safety net distinct from the backup-reminder
      // notification above — this one protects against an in-browser
      // mistake (a fat-fingered field, a bad import) via "Load saved
      // profile," NOT against losing the device or clearing site data,
      // since it's stored in the exact same place a real export protects
      // against losing. Doesn't replace exporting — the reminder still
      // nags for that separately. Runs on every page load but only
      // actually does anything once the configured interval has passed
      // (readAutoSnapshotIntervalHours() — defaults to 7 days, changeable
      // from Profile Manager's own <select>, see window.FNAutoSnapshot).
      function maybeTakeAutoSnapshot() {
        var lastRaw = null;
        try { lastRaw = localStorage.getItem(AUTO_SNAPSHOT_KEY); } catch (e) {}
        var last = lastRaw ? new Date(lastRaw).getTime() : 0;
        var intervalHours = readAutoSnapshotIntervalHours();
        var hoursSince = (Date.now() - last) / 3600000;
        if (hoursSince < intervalHours) return;

        var saved = saveCurrentProfileAsScenario("Auto ");
        try { localStorage.setItem(AUTO_SNAPSHOT_KEY, new Date().toISOString()); } catch (e) {}
        if (!saved) return;
        renderQuickloadMenu();
        updateSaveMeta();

        // let the notifications system know, for transparency — appended
        // directly to the same list/key generateSystemNotifications()
        // itself writes to (both are in scope via closure), since this
        // fires on its own schedule rather than as part of that
        // function's own once-per-page-load pass
        var list = readNotifJSON(SYSTEM_NOTIFICATIONS_KEY) || [];
        list.push({
          id: "system-auto-snapshot-" + Date.now(),
          date: new Date().toISOString().slice(0, 10),
          title: "Took an automatic snapshot",
          body: "Set to snapshot " + autoSnapshotIntervalLabel(intervalHours) + " (changeable in Profile Manager) — this save is an in-browser safety net against accidental changes, recoverable anytime via “Load saved profile.” It lives in the same browser storage as everything else, though, so it's not a substitute for actually exporting a backup file.",
          href: BASE + "ProfileManager/index.html",
          label: "Open Profile Manager",
          type: "info"
        });
        if (list.length > SYSTEM_NOTIFICATIONS_CAP) list = list.slice(list.length - SYSTEM_NOTIFICATIONS_CAP);
        writeNotifJSON(SYSTEM_NOTIFICATIONS_KEY, list);
        updateNotificationsBadge();
        renderNotificationsList();
      }

      // ---------- EXPORT / IMPORT (same payload shape as Profile
      // Manager's own "Export profiles"/"Import profiles" buttons, so a
      // file from one round-trips through the other) ----------
      function loadScenariosList() {
        try {
          var raw = localStorage.getItem("fn-scenarios");
          return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
      }
      function saveScenariosList(list) {
        try { localStorage.setItem("fn-scenarios", JSON.stringify(list)); } catch (e) {}
      }
      // mirrors Profile Manager's own profileComplete() — deliberately a
      // narrower check than saveCurrentProfileAsScenario()'s "any field
      // set" (used to decide whether backing up is worthwhile); this one
      // decides whether an imported file's top-level "profile" is a real
      // live profile worth offering to load, vs. just an empty shell
      function profileLooksComplete(p) {
        return !!(p && p.birthday && p.goalAmount && p.retireAge && p.currentSavings !== undefined && p.currentSavings !== "");
      }

      function doProfileExport() {
        if (!window.FNProfile) return;
        var profile = window.FNProfile.get();
        var payload = {
          app: "FireNate",
          kind: "profile-export",
          version: 2,
          exportedAt: new Date().toISOString(),
          profile: profile,
          pageData: collectPageData(),
          scenarios: loadScenariosList()
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        var now = new Date();
        var pad2 = function (n) { return String(n).padStart(2, "0"); };
        var stamp = now.getFullYear() + "-" + pad2(now.getMonth() + 1) + "-" + pad2(now.getDate()) + "-" +
          pad2(now.getHours()) + "-" + pad2(now.getMinutes()) + "-" + pad2(now.getSeconds());
        var profileNameSlug = (profile.name || "").trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        a.download = profileNameSlug ? ("FireNate-" + profileNameSlug + "-Profiles-" + stamp + ".json") : ("FireNate-Profiles-" + stamp + ".json");
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        if (window.FNBackupTracker) window.FNBackupTracker.record();
      }

      function doProfileImport(file, backedUp) {
        var reader = new FileReader();
        reader.onload = function () {
          var data;
          try { data = JSON.parse(reader.result); }
          catch (e) { window.alert("That file isn't valid JSON."); return; }

          var incoming = Array.isArray(data && data.scenarios) ? data.scenarios : Array.isArray(data) ? data : [];
          var valid = incoming.filter(function (s) { return s && typeof s === "object" && s.profile && typeof s.profile === "object"; });
          var hasLiveProfileFields = !!(data && data.profile && typeof data.profile === "object" && profileLooksComplete(data.profile));
          var importPageData = (data && data.pageData && typeof data.pageData === "object") ? data.pageData : null;
          var hasLivePageData = !!(importPageData && Object.keys(importPageData).length);
          var hasLiveState = hasLiveProfileFields || hasLivePageData;

          if (!valid.length && !hasLiveState) {
            window.alert("No profiles found in that file.");
            return;
          }

          // the pre-import safety backup already happened on the button's
          // own click (see importBtn's handler below) — backedUp just
          // reflects whether that actually saved anything, for the
          // confirm-dialog wording just below

          if (valid.length) {
            var imported = valid.map(function (s) {
              return {
                id: "sc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
                name: s.name ? String(s.name) : "Imported profile",
                savedAt: s.savedAt || Date.now(),
                profile: {
                  name: s.profile.name || "",
                  birthday: s.profile.birthday || "",
                  currentIncome: s.profile.currentIncome || "",
                  currentSavings: s.profile.currentSavings || "",
                  goalAmount: s.profile.goalAmount || "",
                  retireAge: s.profile.retireAge || "",
                  expectedReturn: s.profile.expectedReturn || ""
                },
                pageData: (s.pageData && typeof s.pageData === "object") ? s.pageData : {}
              };
            });
            saveScenariosList(loadScenariosList().concat(imported));
          }

          var loadedLive = false;
          if (hasLiveState) {
            // same stale-file check as Profile Manager's own import —
            // compares the file's exportedAt against the live profile's
            // own lastSaved (set on every field edit), so it catches an
            // old file about to overwrite more recent numbers regardless
            // of how long the file sat around before being imported
            var currentProfile = window.FNProfile.get();
            var fileExportedAt = data && data.exportedAt ? new Date(data.exportedAt).getTime() : null;
            var currentLastSaved = currentProfile && currentProfile.lastSaved ? currentProfile.lastSaved : null;
            var looksStale = fileExportedAt && currentLastSaved && !isNaN(fileExportedAt) && fileExportedAt < currentLastSaved;
            var fmtWhenNav = function (ts) {
              var d = new Date(ts);
              return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
                " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            };

            var confirmed = window.confirm(
              (looksStale
                ? "Heads up: this file looks OLDER than what's already here — exported " + fmtWhenNav(fileExportedAt) + ", but your current data was last changed " + fmtWhenNav(currentLastSaved) + ". Loading it will replace your more recent numbers with these older ones.\n\n"
                : "") +
              "This file also has a live profile in it (your age/savings/goal fields, plus your saved calculator inputs). Load it as your current data too?\n\n" +
              (backedUp
                ? "Your current profile and calculator inputs were just backed up as a snapshot, so you can get them back anytime. This will still replace what's currently there."
                : "This replaces what's currently there.")
            );
            if (confirmed) {
              if (hasLiveProfileFields) window.FNProfile.set(data.profile);
              if (hasLivePageData) applyPageData(importPageData);
              loadedLive = true;
            }
          }

          window.alert("Imported " + valid.length + " saved profile" + (valid.length === 1 ? "" : "s") +
            (backedUp ? " (backed up your previous live profile)" : "") +
            (loadedLive ? " + set as your live profile" : "") + ".");

          if (loadedLive) {
            // a plain in-place refresh only covers this panel — other
            // calculator pages' own fields only ever read localStorage at
            // their own page load, same reasoning "Load a shared link" above
            // already reloads for
            window.location.reload();
          } else {
            renderQuickloadMenu();
            updateSaveMeta();
          }
        };
        reader.onerror = function () { window.alert("Could not read that file."); };
        reader.readAsText(file);
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

      // quick camera-flash pulse on one icon button — shared by the
      // snapshot, export, and import buttons, since all three now take a
      // snapshot at click time and want the same "that click had an
      // obvious payoff" cue
      function flashProfileIcon(btn) {
        btn.classList.remove("flash");
        void btn.offsetWidth;
        btn.classList.add("flash");
        setTimeout(function () { btn.classList.remove("flash"); }, 500);
      }

      var snapshotBtn = document.getElementById("fnProfileSnapshot");
      if (snapshotBtn) {
        snapshotBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          var saved = saveCurrentProfileAsScenario("Snapshot ");
          if (!saved) return;
          renderQuickloadMenu();
          updateSaveMeta();
          flashProfileIcon(snapshotBtn);
          triggerFullScreenFlash();
        });
      }

      // export and import both take a snapshot first, same flash cue as
      // the dedicated snapshot button above — so either one doubles as an
      // extra safety copy of whatever's here right now, and the click has
      // the same obvious "something just got saved" payoff, before the
      // file dialog (import) or download (export) even opens
      var exportBtn = document.getElementById("fnProfileExport");
      if (exportBtn) {
        exportBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (saveCurrentProfileAsScenario("Snapshot ")) {
            renderQuickloadMenu();
            updateSaveMeta();
          }
          flashProfileIcon(exportBtn);
          triggerFullScreenFlash();
          doProfileExport();
        });
      }

      var importBtn = document.getElementById("fnProfileImport");
      var importFileInput = document.getElementById("fnProfileImportFile");
      if (importBtn && importFileInput) {
        importBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          // same pre-import safety net as the trash button and "Load a
          // shared link" — an accidental or mistaken import is a
          // one-second recovery via "Load saved profile," not a lost
          // profile. Taken right here (not once a file's actually picked)
          // so it happens even if the file dialog gets cancelled, and so
          // the flash lands on the click that felt like "the action."
          var backedUp = saveCurrentProfileAsScenario("Backup ");
          if (backedUp) {
            renderQuickloadMenu();
            updateSaveMeta();
          }
          flashProfileIcon(importBtn);
          triggerFullScreenFlash();
          importFileInput.dataset.backedUp = backedUp ? "1" : "";
          importFileInput.click();
        });
        importFileInput.addEventListener("click", function (e) { e.stopPropagation(); });
        importFileInput.addEventListener("change", function (e) {
          var file = e.target.files && e.target.files[0];
          var backedUp = importFileInput.dataset.backedUp === "1";
          e.target.value = ""; // clear so re-selecting the same file later still fires "change"
          if (!file) return;
          doProfileImport(file, backedUp);
        });
      }

      var shareBtn = document.getElementById("fnProfileShare");
      if (shareBtn) {
        shareBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          if (!window.FNProfile) return;
          var current = window.FNProfile.get();
          var payload = {
            kind: "profile-share",
            version: 1,
            profile: {
              name: current.name || "",
              birthday: current.birthday || "",
              currentIncome: current.currentIncome || "",
              currentSavings: current.currentSavings || "",
              goalAmount: current.goalAmount || "",
              retireAge: current.retireAge || "",
              expectedReturn: current.expectedReturn || ""
            },
            pageData: collectPageData()
          };
          var encoded = encodeSharePayload(payload);
          if (!encoded) return;
          var url = window.location.origin + window.location.pathname + "?share=" + encoded;

          function showCopiedState() {
            var originalTitle = shareBtn.getAttribute("title");
            shareBtn.classList.add("copied");
            shareBtn.setAttribute("title", "Link copied!");
            setTimeout(function () {
              shareBtn.classList.remove("copied");
              shareBtn.setAttribute("title", originalTitle);
            }, 1600);
          }

          // small toast bubble anchored right under the share button —
          // positioned via JS since it needs to track wherever that icon
          // actually sits in the panel's own layout, not a fixed guess
          var shareToast = document.getElementById("fnShareToast");
          var shareToastTimer = null;
          function showShareToast(success, message) {
            if (!shareToast) return;
            var panel = shareBtn.closest(".fn-profile-panel");
            if (panel) {
              var btnRect = shareBtn.getBoundingClientRect();
              var panelRect = panel.getBoundingClientRect();
              shareToast.style.left = (btnRect.left - panelRect.left + btnRect.width / 2) + "px";
              shareToast.style.top = (btnRect.bottom - panelRect.top + 8) + "px";
            }
            shareToast.textContent = message || (success ? "Link copied!" : "Couldn't copy — try again");
            shareToast.classList.toggle("is-error", !success);
            shareToast.classList.remove("show");
            void shareToast.offsetWidth;
            shareToast.classList.add("show");
            clearTimeout(shareToastTimer);
            shareToastTimer = setTimeout(function () { shareToast.classList.remove("show"); }, 1800);
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () {
              showCopiedState();
              showShareToast(true);
            }).catch(function () {
              showShareToast(false);
              window.prompt("Copy this link:", url);
            });
          } else {
            // no Clipboard API at all — most commonly because the page is
            // loaded over plain HTTP (an insecure context), where the API
            // doesn't exist regardless of permissions. Without this toast
            // the click looked like it silently did nothing; the dialog
            // that follows is where the link actually gets copied.
            showShareToast(true, "Link ready — copy it from the dialog");
            window.prompt("Copy this link:", url);
          }
        });
      }

      // ---------- LOAD A SHARED LINK ----------
      // a link created by the button above carries the full {profile,
      // pageData} payload in a "?share=" param — offer to load it the same
      // way "Load saved profile" does, then always strip the param so a
      // refresh or re-sharing this exact URL doesn't re-trigger the prompt
      (function checkForSharedLink() {
        try {
          var params = new URLSearchParams(window.location.search);
          var shared = params.get("share");
          if (!shared) return;
          var payload = decodeSharePayload(shared);
          var cleanUrl = window.location.origin + window.location.pathname;
          if (!payload || payload.kind !== "profile-share") {
            window.history.replaceState({}, document.title, cleanUrl);
            return;
          }
          var pageCount = payload.pageData ? Object.keys(payload.pageData).length : 0;
          var confirmed = window.confirm(
            "Load the shared scenario from this link?\n\n" +
            "This will overwrite your current profile" +
            (pageCount ? " and " + pageCount + " calculator's saved inputs" : "") +
            " on this device. This can't be undone."
          );
          window.history.replaceState({}, document.title, cleanUrl);
          if (!confirmed) return;
          if (window.FNProfile) window.FNProfile.set(payload.profile || {});
          applyPageData(payload.pageData);
          window.location.reload();
        } catch (e) {}
      })();

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
          // same trash-burst payoff as "Reset this device" in Settings —
          // there's no confirm() dialog here (the auto-backup above is the
          // safety net instead), so a click that might have been a
          // misclick still gets an unmistakable "yes, that just happened"
          triggerClearAllEffect(function () {}, "Info cleared");
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
