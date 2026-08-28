/* =========================================================================
   FireNate — IRS benefits-account contribution limits, by year.
   Single source of truth for ContributionLimits/index.html. Add a new tax
   year by pushing a new object to the front of this array (newest first) —
   no HTML/JS editing required. The page always defaults to the highest
   `year` present here.

   Sourced from IRS.gov (irs.gov/newsroom and irs.gov/retirement-plans),
   cross-checked against Fidelity, Schwab, and SHRM coverage of the same
   IRS announcements, current as of this file's last edit (Aug 2026).
   Limits are announced by the IRS in the fall of the preceding year —
   double-check irs.gov before relying on a brand-new year's figures if
   this file hasn't been updated recently.

   Fields per year:
     year         — the tax year these limits apply to
     k401         — 401(k)/403(b)/most 457(b) plans (traditional + Roth
                    combined count toward the same limit)
       employee     — standard employee elective-deferral limit
       catchup50    — additional amount allowed for those turning 50+
                      that year (on top of `employee`)
       catchup60to63 — the larger SECURE 2.0 "super catch-up" for ages
                      60-63 specifically (replaces catchup50 for that
                      age band, not added on top of it); null for years
                      before 2025, when this provision didn't exist yet
       overall415c  — the combined employee + employer (match/profit-
                      sharing) annual-additions limit under IRC 415(c)
     hsa          — Health Savings Account (requires HDHP enrollment)
       self         — self-only coverage limit
       family       — family coverage limit
       catchup55    — additional amount for those 55+ (not inflation-
                      indexed, has stayed $1,000 since 2009)
     ira          — Traditional + Roth IRA combined limit
       limit        — base contribution limit
       catchup50    — additional amount for those 50+
   ========================================================================= */
window.FN_BENEFITS_LIMITS = [
  {
    year: 2026,
    k401: { employee: 24500, catchup50: 8000, catchup60to63: 11250, overall415c: 72000 },
    hsa: { self: 4400, family: 8750, catchup55: 1000 },
    ira: { limit: 7500, catchup50: 1100 }
  },
  {
    year: 2025,
    k401: { employee: 23500, catchup50: 7500, catchup60to63: 11250, overall415c: 70000 },
    hsa: { self: 4300, family: 8550, catchup55: 1000 },
    ira: { limit: 7000, catchup50: 1000 }
  },
  {
    year: 2024,
    k401: { employee: 23000, catchup50: 7500, catchup60to63: null, overall415c: 69000 },
    hsa: { self: 4150, family: 8300, catchup55: 1000 },
    ira: { limit: 7000, catchup50: 1000 }
  },
  {
    year: 2023,
    k401: { employee: 22500, catchup50: 7500, catchup60to63: null, overall415c: 66000 },
    hsa: { self: 3850, family: 7750, catchup55: 1000 },
    ira: { limit: 6500, catchup50: 1000 }
  }
];
