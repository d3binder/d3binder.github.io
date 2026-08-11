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
    { id: "time-to-fi", label: "Time to FI", href: BASE + "TimeToFI/index.html" },
    { id: "reverse-time-to-fi", label: "Reverse Time to FI", href: BASE + "ReverseTimeToFI/index.html" },
    { id: "compound-interest", label: "Compound Interest", href: BASE + "CompoundInterest-WealthMultiplier/index.html" },
    { id: "loan-calculator", label: "Loan Calculator", href: BASE + "LoanCalculator/index.html" },
    { id: "payoff-or-invest", label: "Payoff or Invest", href: BASE + "Payoff-or-Invest/index.html" },
    { id: "homes-vs-stocks", label: "Homes vs. Stocks", href: BASE + "RealEstateVsStocks/index.html" },
    { id: "files", label: "Files", href: BASE + "Downloads/index.html" }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildNav() {
    var links = PAGES.filter(function (p) { return p.id !== "home"; })
      .map(function (p) {
        var active = p.id === CURRENT ? " fn-active" : "";
        return '<a href="' + p.href + '" class="fn-nav-link' + active + '">' + escapeHtml(p.label) + "</a>";
      }).join("");

    var homeActive = CURRENT === "home" ? " fn-active" : "";

    return (
      '<div class="fn-nav-inner">' +
        '<a href="' + BASE + 'index.html' + '" class="fn-brand">' +
          '<span class="fn-dot">&#9670;</span>FireNate' +
          '<span class="fn-tag">FI Tools</span>' +
        "</a>" +
        '<nav class="fn-links" aria-label="Site">' +
          '<a href="' + BASE + 'index.html' + '" class="fn-nav-link' + homeActive + '">Home</a>' +
          links +
        "</nav>" +
        '<button type="button" class="fn-nav-toggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>' +
      "</div>"
    );
  }

  // function buildFooter() {
  //   var year = new Date().getFullYear();
  //   var linkItems = PAGES.filter(function (p) { return p.id !== "home"; })
  //     .map(function (p) { return "<li><a href=\"" + p.href + "\">" + escapeHtml(p.label) + "</a></li>"; })
  //     .join("");

  //   return (
  //     '<div class="fn-footer-inner">' +
  //       '<div class="fn-footer-grid">' +
  //         "<div>" +
  //           '<a href="' + BASE + 'index.html' + '" class="fn-footer-brand"><span class="fn-dot">&#9670;</span>FireNate</a>' +
  //           "<p>A small toolset for financial-independence planning: time to FI, loan and amortization math, buy-vs-invest trade-offs, and the long arc of compounding.</p>" +
  //         "</div>" +
  //         "<div>" +
  //           "<h5>Calculators</h5>" +
  //           "<ul>" + linkItems + "</ul>" +
  //         "</div>" +
  //         "<div>" +
  //           "<h5>Resources</h5>" +
  //           "<ul>" +
  //             '<li><a href="https://www.ssa.gov/myaccount/" target="_blank" rel="noopener">SSA.gov &mdash; my Social Security</a></li>' +
  //             '<li><a href="' + BASE + 'index.html' + '">About this project</a></li>' +
  //           "</ul>" +
  //         "</div>" +
  //       "</div>" +
  //       '<div class="fn-footer-bottom">' +
  //         "<strong>Not financial advice.</strong> These tools are provided for general educational and planning purposes only and do not constitute financial, tax, or legal advice. All results are estimates based on the assumptions you enter &mdash; actual returns, rates, and outcomes will vary and are not guaranteed. Please consult a licensed financial advisor before making decisions about savings, investing, or retirement. &copy; " + year + " FireNate. Built for planning, not promises." +
  //       "</div>" +
  //     "</div>"
  //   );
  // }

async function buildFooter(containerId) {
  try {
    // 1. Fetch the external HTML file
    const response = await fetch('../assets/html/footer.html'); // Adjust path if footer.html is in a subfolder
    if (!response.ok) throw new Error('Failed to load footer template');
    
    const htmlText = await response.text();
    
    // 2. Inject into the DOM container
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = htmlText;

    // 3. Populate dynamic content (Year)
    const yearSpan = container.querySelector('#footer-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Populate dynamic calculator links from your PAGES array
    const linkList = container.querySelector('#footer-calculators-list');
    if (linkList && typeof PAGES !== 'undefined') {
      linkList.innerHTML = PAGES
        .filter(p => p.id !== "home")
        // .map(p => `<li><a href="${BASE}${p.href}">${escapeHtml(p.label)}</a></li>`)
        .map(p => `<li><a href="${p.href}">${escapeHtml(p.label)}</a></li>`)
        .join("");
    }

  } catch (error) {
    console.error('Error loading footer:', error);
  }
} // /buildFooter

// Frender Footer
async function renderFooter() {
  try {
    // 1. Fetch the external HTML snippet
    const response = await fetch('../assets/html/footer.html');
    if (!response.ok) throw new Error('Could not fetch footer template');
    
    const htmlText = await response.text();

    // 2. Find your target container on the page
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
      footerContainer.innerHTML = htmlText;

      // 3. Update dynamic values (like current year) after injection
      const yearSpan = footerContainer.querySelector('#footer-year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    }
  } catch (error) {
    console.error('Error rendering footer:', error);
  }
}

// How & Where to Call It:
// This listens for the HTML page to finish loading before running renderFooter()
document.addEventListener('DOMContentLoaded', renderFooter);

// /Render Footer



// Call it when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  buildFooter('site-footer');
});





  function init() {
    var navHost = document.getElementById("fn-site-nav");
    //var footerHost = document.getElementById("fn-site-footer");

    if (navHost) {
      navHost.innerHTML = buildNav();
      var toggle = navHost.querySelector(".fn-nav-toggle");
      if (toggle) {
        toggle.addEventListener("click", function () {
          var open = navHost.classList.toggle("fn-open");
          toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        navHost.querySelectorAll(".fn-links a").forEach(function (a) {
          a.addEventListener("click", function () {
            navHost.classList.remove("fn-open");
            toggle.setAttribute("aria-expanded", "false");
          });
        });
      }
    }

    // if (footerHost) {
    //   footerHost.innerHTML = buildFooter();
    // }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
