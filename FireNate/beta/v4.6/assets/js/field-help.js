/* =========================================================================
   FireNate — per-page field help modal.
   Opt-in: place a trigger button with class "fn-help-btn" somewhere on the
   page (usually the toolbar's summary row) and define window.FN_FIELD_HELP
   before this script runs:
     window.FN_FIELD_HELP = {
       title: "About these inputs",         // optional
       intro: "One or two sentences.",      // optional
       sections: [
         { heading: "Group name", items: [  // heading optional
           { label: "Field name", text: "What it means, how it's used." }
         ]}
       ]
     };
   ========================================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var data = window.FN_FIELD_HELP;
    var btn = document.querySelector(".fn-help-btn");
    if (!btn || !data || !data.sections || !data.sections.length) return;

    var overlay = null;
    var lastFocused = null;
    var autoScrollTimer = null;

    function escapeHtml(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function buildModal() {
      var wrap = document.createElement("div");
      wrap.className = "fn-help-overlay";

      var sectionsHtml = data.sections.map(function (sec) {
        var itemsHtml = (sec.items || []).map(function (item) {
          return '<div class="fn-help-item">' +
            '<div class="fn-help-item-label">' + escapeHtml(item.label) + "</div>" +
            '<div class="fn-help-item-text">' + escapeHtml(item.text) + "</div>" +
          "</div>";
        }).join("");
        return '<div class="fn-help-section">' +
          (sec.heading ? '<div class="fn-help-section-heading">' + escapeHtml(sec.heading) + "</div>" : "") +
          itemsHtml +
        "</div>";
      }).join("");

      wrap.innerHTML =
        '<div class="fn-help-modal" role="dialog" aria-modal="true" aria-labelledby="fnHelpTitle" tabindex="-1">' +
          '<button type="button" class="fn-help-close" aria-label="Close">&times;</button>' +
          '<div class="fn-help-scroll">' +
            '<div class="fn-help-head">' +
              '<div class="fn-help-title" id="fnHelpTitle">' + escapeHtml(data.title || "About this Tool") + "</div>" +
            "</div>" +
            (data.intro ? '<div class="fn-help-intro">' + escapeHtml(data.intro) + "</div>" : "") +
            '<div class="fn-help-body">' + sectionsHtml + "</div>" +
          "</div>" +
          '<div class="fn-help-fade fn-help-fade-top" aria-hidden="true"><span class="fn-help-fade-arrow">&#9650;</span></div>' +
          '<div class="fn-help-fade fn-help-fade-bottom" aria-hidden="true"><span class="fn-help-fade-arrow">&#9660;</span></div>' +
        "</div>";
      return wrap;
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }
    function startAutoScroll(scrollEl, direction) {
      stopAutoScroll();
      autoScrollTimer = setInterval(function () {
        scrollEl.scrollTop += direction * 12;
      }, 20);
    }

    function onKeydown(e) {
      if (e.key === "Escape") closeModal();
    }

    function closeModal() {
      if (!overlay) return;
      stopAutoScroll();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
      document.body.classList.remove("fn-help-lock");
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function openModal() {
      if (overlay) return;
      lastFocused = document.activeElement;
      overlay = buildModal();
      document.body.appendChild(overlay);
      document.body.classList.add("fn-help-lock");
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
      var closeBtn = overlay.querySelector(".fn-help-close");
      if (closeBtn) closeBtn.addEventListener("click", closeModal);
      document.addEventListener("keydown", onKeydown);
      var modal = overlay.querySelector(".fn-help-modal");
      var scrollEl = overlay.querySelector(".fn-help-scroll");
      var fadeTop = overlay.querySelector(".fn-help-fade-top");
      var fadeBottom = overlay.querySelector(".fn-help-fade-bottom");

      function updateFade() {
        if (!modal || !scrollEl) return;
        var canScrollUp = scrollEl.scrollTop > 2;
        var canScrollDown = scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 2;
        modal.classList.toggle("can-scroll-up", canScrollUp);
        modal.classList.toggle("can-scroll-down", canScrollDown);
      }
      if (scrollEl) scrollEl.addEventListener("scroll", updateFade);
      if (fadeTop) {
        fadeTop.addEventListener("mouseenter", function () { startAutoScroll(scrollEl, -1); });
        fadeTop.addEventListener("mouseleave", stopAutoScroll);
      }
      if (fadeBottom) {
        fadeBottom.addEventListener("mouseenter", function () { startAutoScroll(scrollEl, 1); });
        fadeBottom.addEventListener("mouseleave", stopAutoScroll);
      }
      // the modal is "display:none"-free but just inserted, so wait a frame
      // for layout before measuring scrollHeight/clientHeight for the hints
      requestAnimationFrame(updateFade);

      if (modal) modal.focus();
    }

    btn.setAttribute("type", "button");
    if (!btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", "What do these inputs mean?");
    btn.addEventListener("click", openModal);
  });
})();
