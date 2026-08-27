/* =========================================================================
   FireNate — shared calculator input-parsing helper.
   Strips thousands-separator commas from a field's raw string value and
   coerces it to a number, defaulting to 0 for anything unparseable. Used
   by every calculator page's toolbar inputs. Load before a page's own
   inline <script> (non-deferred, plain global — no build step on this
   site) so `parseCurrency` is already defined when that script runs.
   ========================================================================= */
function parseCurrency(id) {
  var el = document.getElementById(id);
  return parseFloat(String(el ? el.value : "").replace(/,/g, "")) || 0;
}
