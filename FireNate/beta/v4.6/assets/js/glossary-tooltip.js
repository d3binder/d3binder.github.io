/* =========================================================================
   FireNate — inline FIRE-jargon tooltips.
   Opt-in: wrap a term in a page's own body copy with
   <span class="fn-term" data-term="coast-fire">Coast FIRE</span> and this
   script turns it into a click/tap/keyboard-activated popover, sourced from
   the shared glossary data (assets/js/glossary-data.js — load that first).
   Pages must set window.FN_BASE before this script, same as nav.js.
   ========================================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var glossary = window.FN_GLOSSARY || [];
    var BASE = typeof window.FN_BASE === "string" ? window.FN_BASE : "";
    var terms = Array.prototype.slice.call(document.querySelectorAll(".fn-term[data-term]"));
    if (!terms.length || !glossary.length) return;

    var byId = {};
    glossary.forEach(function (t) { byId[t.id] = t; });

    var activePopover = null;
    var activeTerm = null;

    function closePopover() {
      if (activePopover && activePopover.parentNode) activePopover.parentNode.removeChild(activePopover);
      activePopover = null;
      if (activeTerm) activeTerm.setAttribute("aria-expanded", "false");
      activeTerm = null;
    }

    function openPopover(el, data) {
      closePopover();
      var pop = document.createElement("div");
      pop.className = "fn-term-popover";
      pop.setAttribute("role", "tooltip");
      pop.innerHTML =
        '<div class="fn-term-popover-title">' + data.term + "</div>" +
        '<div class="fn-term-popover-body">' + data.short + "</div>" +
        (data.relatedHref
          ? '<a class="fn-term-popover-link" href="' + BASE + data.relatedHref.replace(/^\//, "") + '">' +
            (data.relatedIcon
              ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + data.relatedIcon + "</svg>"
              : "") +
            (data.relatedLabel || "Open calculator") + " &rarr;</a>"
          : "");
      document.body.appendChild(pop);

      var rect = el.getBoundingClientRect();
      var popRect = pop.getBoundingClientRect();
      var top = window.scrollY + rect.bottom + 8;
      var left = window.scrollX + rect.left;
      var maxLeft = window.scrollX + document.documentElement.clientWidth - popRect.width - 12;
      if (left > maxLeft) left = Math.max(12, maxLeft);
      pop.style.top = top + "px";
      pop.style.left = left + "px";

      activePopover = pop;
      activeTerm = el;
      el.setAttribute("aria-expanded", "true");
    }

    terms.forEach(function (el) {
      var data = byId[el.getAttribute("data-term")];
      if (!data) return;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-expanded", "false");
      el.setAttribute("aria-label", data.term + " — glossary definition");

      // click/tap works for both mouse and touch; keyboard users get the
      // same toggle via Enter/Space — simpler and more reliable than
      // juggling hover timing (which doesn't really work on touch anyway)
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        // a term can sit inside a clickable card/link (e.g. Getting
        // Started's calculator picks) — without this, clicking it would
        // both open the popover AND follow the ancestor's link
        e.preventDefault();
        if (activeTerm === el) { closePopover(); return; }
        openPopover(el, data);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.click();
        }
      });
    });

    document.addEventListener("click", function (e) {
      if (activePopover && !activePopover.contains(e.target) && e.target !== activeTerm) closePopover();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopover();
    });
    window.addEventListener("scroll", closePopover, { passive: true });
    window.addEventListener("resize", closePopover);
  });
})();
