/* =========================================================================
   FireNate — shared FIRE-jargon glossary data.
   Single source of truth for both the Glossary page and the inline
   fn-term tooltip component (assets/js/glossary-tooltip.js), so a
   definition only ever needs to be written once.
   Hrefs are root-absolute (not FN_BASE-relative) since this file is loaded
   from pages at different nesting depths and the site is always served
   from its own domain root — same convention nav.js uses for its favicon/
   manifest links.
   ========================================================================= */
window.FN_GLOSSARY = [
  {
    id: "fire",
    term: "FIRE",
    category: "Core concepts",
    short: "Financial Independence, Retire Early — building enough invested wealth that work becomes optional.",
    relatedHref: "/GettingStarted/index.html", relatedLabel: "Getting Started",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>'
  },
  {
    id: "lean-fire",
    term: "Lean FIRE",
    category: "FIRE variants",
    short: "Reaching financial independence on a minimal, tightly-budgeted level of spending — a smaller number, reached sooner.",
    relatedHref: "/FireMilestones/index.html", relatedLabel: "FIRE Milestones",
    relatedIcon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>'
  },
  {
    id: "fat-fire",
    term: "Fat FIRE",
    category: "FIRE variants",
    short: "Financial independence at a generous, unrestricted spending level — a bigger number, taking longer to reach.",
    relatedHref: "/FireMilestones/index.html", relatedLabel: "FIRE Milestones",
    relatedIcon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>'
  },
  {
    id: "coast-fire",
    term: "Coast FIRE",
    category: "FIRE variants",
    short: "You've saved enough that, left alone to compound with no further contributions, it'll grow into a full FI number by a normal retirement age — so you can \"coast\" on lower-paying or part-time work from here.",
    relatedHref: "/FireMilestones/index.html", relatedLabel: "FIRE Milestones",
    relatedIcon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>'
  },
  {
    id: "barista-fire",
    term: "Barista FIRE",
    category: "FIRE variants",
    short: "Enough saved to cover most expenses from a portfolio, with a part-time job (often for benefits like health insurance) covering the rest.",
    relatedHref: "/FireMilestones/index.html", relatedLabel: "FIRE Milestones",
    relatedIcon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>'
  },
  {
    id: "swr",
    term: "4% Rule / Safe Withdrawal Rate",
    category: "Retirement withdrawal",
    short: "A starting-point rule of thumb: withdrawing about 4% of a portfolio in year one, then adjusting that dollar amount for inflation each year after, has historically survived most 30-year retirements.",
    relatedHref: "/SafeWithdrawalRate/index.html", relatedLabel: "Safe Withdrawal Rate",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 16 10"></polyline>'
  },
  {
    id: "sorr",
    term: "Sequence of Returns Risk",
    category: "Retirement withdrawal",
    short: "The danger that a run of bad market returns early in retirement — even with a good average return over the whole period — can permanently deplete a portfolio faster than withdrawals alone would suggest.",
    relatedHref: "/VariableWithdrawalRate/index.html", relatedLabel: "Withdrawal Guardrails & Buffer",
    relatedIcon: '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>'
  },
  {
    id: "guardrails",
    term: "Guyton-Klinger Guardrails",
    category: "Retirement withdrawal",
    short: "A dynamic withdrawal strategy that cuts spending after a market downturn pushes the withdrawal rate too high, and allows raises when it drifts too low — instead of withdrawing a fixed amount every year regardless of performance.",
    relatedHref: "/VariableWithdrawalRate/index.html", relatedLabel: "Withdrawal Guardrails & Buffer",
    relatedIcon: '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>'
  },
  {
    id: "magi",
    term: "MAGI",
    category: "Taxes & income",
    short: "Modified Adjusted Gross Income — the income figure used to determine eligibility and cost for things like ACA premium subsidies and Roth IRA contribution limits. Often quite different from net worth or spending.",
    relatedHref: "/HealthcareBridge/index.html", relatedLabel: "Healthcare & ACA Bridge",
    relatedIcon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  {
    id: "fpl",
    term: "Federal Poverty Level (FPL)",
    category: "Taxes & income",
    short: "An annually-set income threshold, scaled by household size, used to determine eligibility for many assistance programs — including how large an ACA marketplace premium subsidy a household qualifies for.",
    relatedHref: "/HealthcareBridge/index.html", relatedLabel: "Healthcare & ACA Bridge",
    relatedIcon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  {
    id: "aca-cliff",
    term: "ACA Subsidy Cliff",
    category: "Taxes & income",
    short: "Under some ACA subsidy rules, premium tax credits disappear entirely above 400% of the Federal Poverty Level — so one extra dollar of MAGI can mean thousands of dollars in lost subsidy per year.",
    relatedHref: "/HealthcareBridge/index.html", relatedLabel: "Healthcare & ACA Bridge",
    relatedIcon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  {
    id: "roth-ladder",
    term: "Roth Conversion Ladder",
    category: "Early access to retirement funds",
    short: "Converting traditional (pre-tax) retirement funds to Roth in planned yearly chunks before you need them, so each chunk finishes its 5-year seasoning clock and becomes penalty-free to withdraw before age 59½.",
    relatedHref: "/RothLadder/index.html", relatedLabel: "Roth Conversion Ladder",
    relatedIcon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
  },
  {
    id: "five-year-rule",
    term: "5-Year Rule",
    category: "Early access to retirement funds",
    short: "A converted Roth balance must season for 5 years from the date of conversion before it can be withdrawn penalty-free — a separate clock for every year's conversion.",
    relatedHref: "/RothLadder/index.html", relatedLabel: "Roth Conversion Ladder",
    relatedIcon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
  },
  {
    id: "bridge",
    term: "Bridge (Income/Healthcare)",
    category: "Early retirement gaps",
    short: "The span of years an early retiree has to self-fund before a later income source — Social Security, a pension, or Medicare — takes over some or all of the cost.",
    relatedHref: "/SocialSecurityBridge/index.html", relatedLabel: "SS & Pension Bridge",
    relatedIcon: '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>'
  },
  {
    id: "debt-snowball",
    term: "Debt Snowball",
    category: "Paying off debt",
    short: "Paying off debts smallest-balance-first, regardless of interest rate, so each payoff frees up its whole minimum payment to permanently roll into the next debt — prioritizing quick psychological wins.",
    relatedHref: "/DebtSnowball/index.html", relatedLabel: "Debt Snowball",
    relatedIcon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  },
  {
    id: "debt-avalanche",
    term: "Debt Avalanche",
    category: "Paying off debt",
    short: "Paying off debts highest-interest-rate-first — mathematically minimizes total interest paid, though it can take longer to see a full payoff than the snowball method.",
    relatedHref: "/DebtSnowball/index.html", relatedLabel: "Debt Snowball",
    relatedIcon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  },
  {
    id: "net-worth",
    term: "Net Worth",
    category: "Core concepts",
    short: "Everything you own (assets) minus everything you owe (liabilities) — the single number FIRE progress is usually measured against.",
    relatedHref: "/NetWorth/index.html", relatedLabel: "Net Worth",
    relatedIcon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>'
  },
  {
    id: "compound-interest",
    term: "Compound Interest",
    category: "Core concepts",
    short: "Growth earned not just on your original contributions, but on the growth those contributions already produced — the mechanism that makes early, consistent saving disproportionately powerful.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "crossover-point",
    term: "Crossover Point",
    category: "Core concepts",
    short: "The age or balance at which compounding investment growth alone — with no further contributions — is enough to carry a portfolio the rest of the way to its goal.",
    relatedHref: "/CrossoverPoint/index.html", relatedLabel: "Crossover Point",
    relatedIcon: '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>'
  },
  {
    id: "emergency-fund",
    term: "Emergency Fund",
    category: "Core concepts",
    short: "Cash set aside, outside of investments, to cover a period of lost income or a major unplanned expense without going into debt or selling investments at a bad time.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  }
];
