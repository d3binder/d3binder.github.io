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

    { id: "getting-started", label: "Getting Started", href: BASE + "GettingStarted/index.html", group: "First Steps" },
    { id: "fi-snapshot", label: "FI Snapshot", href: BASE + "FISnapshot/index.html", group: "First Steps" },
    { id: "net-worth", label: "Net Worth", href: BASE + "NetWorth/index.html", group: "First Steps" },
    { id: "emergency-fund", label: "Emergency Fund", href: BASE + "EmergencyFund/index.html", group: "First Steps" },
    { id: "debt-snowball", label: "Debt Snowball", href: BASE + "DebtSnowball/index.html", group: "First Steps" },

    { id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html", group: "Your Path to FI" },
    { id: "reverse-time-to-fi", label: "Reverse Time to FI", href: BASE + "ReverseTimeToFI/index.html", group: "Your Path to FI" },
    { id: "fire-milestones", label: "FIRE Milestones", href: BASE + "FireMilestones/index.html", group: "Your Path to FI" },
    { id: "coast-fire", label: "Coast & Barista FIRE", href: BASE + "CoastFire/index.html", group: "Your Path to FI" },
    { id: "crossover-point", label: "Crossover Point", href: BASE + "CrossoverPoint/index.html", group: "Your Path to FI" },
    { id: "compound-interest", label: "Compound Interest", href: BASE + "CompoundInterest-WealthMultiplier/index.html", group: "Your Path to FI" },

    { id: "safe-withdrawal-rate", label: "Safe Withdrawal Rate", href: BASE + "SafeWithdrawalRate/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "monte-carlo", label: "Monte Carlo Simulator", href: BASE + "MonteCarlo/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "variable-withdrawal", label: "Withdrawal Guardrails & Buffer", href: BASE + "VariableWithdrawalRate/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "ss-bridge", label: "SS & Pension Bridge", href: BASE + "SocialSecurityBridge/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "healthcare-bridge", label: "Healthcare & ACA Bridge", href: BASE + "HealthcareBridge/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "roth-ladder", label: "Roth Conversion Ladder", href: BASE + "RothLadder/index.html", group: "Retirement & Withdrawal Strategy" },
    { id: "rmd", label: "Required Minimum Distributions", href: BASE + "RMD/index.html", group: "Retirement & Withdrawal Strategy" },

    { id: "payoff-or-invest", label: "Payoff or Invest", href: BASE + "Payoff-or-Invest/index.html", group: "Everyday Money Decisions" },
    { id: "loan-calculator", label: "Loan Calculator", href: BASE + "LoanCalculator/index.html", group: "Everyday Money Decisions" },
    { id: "car-buying", label: "Car Buying", href: BASE + "CarBuying/index.html", group: "Everyday Money Decisions" },
    { id: "rent-vs-buy", label: "Rent vs. Buy", href: BASE + "RentVsBuy/index.html", group: "Everyday Money Decisions" },
    { id: "homes-vs-stocks", label: "Homes vs. Stocks", href: BASE + "RealEstateVsStocks/index.html", group: "Everyday Money Decisions" },

    { id: "files", label: "Files", href: BASE + "Downloads/index.html", group: "Resources" },
    { id: "gen-info", label: "Info", href: BASE + "GenInfo/index.html", group: "Resources" },
    { id: "glossary", label: "Glossary", href: BASE + "Glossary/index.html", group: "Resources" },
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
    "payoffOrInvestInputs",       // Payoff-or-Invest
    "emergencyFundInputs",        // EmergencyFund
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
    "monteCarloInputs"            // MonteCarlo
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
    "variableWithdrawalInputs": "Withdrawal Guardrails & Buffer",
    "debtSnowballInputs": "Debt Snowball",
    "healthcareBridgeInputs": "Healthcare & ACA Bridge",
    "netWorthInputs": "Net Worth",
    "netWorthHistory": "Net Worth (history)",
    "rentVsBuyInputs": "Rent vs. Buy",
    "coastFireInputs": "Coast & Barista FIRE",
    "rmdInputs": "Required Minimum Distributions",
    "monteCarloInputs": "Monte Carlo Simulator"
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
    "fi-snapshot": '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
    "net-worth": '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
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
    "payoff-or-invest": '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
    "loan-calculator": '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
    "car-buying": '<path d="M4 15 L5 9 L8 6 L16 6 L19 9 L20 15"></path><rect x="2" y="14" width="20" height="5" rx="1"></rect><circle cx="7" cy="19" r="2.2"></circle><circle cx="17" cy="19" r="2.2"></circle>',
    "rent-vs-buy": '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>',
    "homes-vs-stocks": '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
    "files": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
    "gen-info": '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    "glossary": '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
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

    var profilePanel =
      '<div class="fn-profile-panel" role="menu" aria-label="Your info">' +
        '<div class="fn-settings-title-row">' +
          '<div class="fn-settings-title">Your info</div>' +
          '<div class="fn-settings-title-actions">' +
            '<button type="button" class="fn-profile-snapshot" id="fnProfileSnapshot" aria-label="Take a quick snapshot" title="Take a quick snapshot">' +
              cameraIcon +
            "</button>" +
            '<button type="button" class="fn-profile-share" id="fnProfileShare" aria-label="Copy a shareable link" title="Copy a shareable link">' +
              linkIcon +
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
        '<span class="fn-share-toast" id="fnShareToast" role="status" aria-live="polite"></span>' +
        '<p class="fn-profile-hint">Saved on this device, and used to pre-fill common fields across calculators.</p>' +
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
          else resetLinksFilter();
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
