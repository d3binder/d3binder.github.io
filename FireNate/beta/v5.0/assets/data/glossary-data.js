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
    id: "budget",
    term: "Budget / Budgeting",
    category: "Money Basics",
    short: "A plan for where your money goes each pay period — matching income against planned spending and saving, so decisions get made on purpose instead of after the fact, once the money's already gone.",
    relatedHref: "/BudgetCalculator/index.html", relatedLabel: "Budget Calculator",
    relatedIcon: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>'
  },
  {
    id: "savings",
    term: "Savings",
    category: "Money Basics",
    short: "Money you set aside instead of spending — the raw fuel for everything else on this list. Your savings rate (the % of income you save) is usually a bigger lever on how fast you reach FI than your investment returns are.",
    relatedHref: "/TimeToFI/index.html", relatedLabel: "Time to FI",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'
  },
  {
    id: "debt",
    term: "Debt",
    category: "Money Basics",
    short: "Money you owe someone else, usually with interest added on top until it's repaid. Not inherently bad — a low-rate mortgage and a 24% credit card balance are very different kinds of debt — but it's rarely neutral either.",
    relatedHref: "/DebtSnowball/index.html", relatedLabel: "Debt Snowball",
    relatedIcon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  },
  {
    id: "retirement",
    term: "Retirement",
    category: "Money Basics",
    short: "The point where working for income becomes optional. Traditionally tied to a specific age (65, or whenever Social Security or a pension kicks in) — but for FIRE it's really just financial independence, reached whenever the math works.",
    relatedHref: "/FISnapshot/index.html", relatedLabel: "FI Snapshot",
    relatedIcon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>'
  },
  {
    id: "insurance",
    term: "Insurance",
    category: "Money Basics",
    short: "A contract where you pay a smaller, predictable amount (a premium) so someone else takes on the risk of a larger, unpredictable loss. Health, home, auto, life, and deposit insurance (FDIC/NCUA) are all the same basic trade: certainty now in exchange for protection against something bad happening later.",
    relatedHref: "/HealthcareBridge/index.html", relatedLabel: "Healthcare & ACA Bridge",
    relatedIcon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  {
    id: "federal-reserve",
    term: "Federal Reserve",
    category: "Money Basics",
    short: "The central bank of the United States — sets short-term interest rate policy, which ripples out into mortgage rates, savings account yields, credit card APRs, and the Prime Rate. \"The Fed raised rates\" is usually the reason borrowing got more expensive, or savings accounts started paying more, that year.",
    relatedHref: "/RentVsBuy/index.html", relatedLabel: "Rent vs. Buy",
    relatedIcon: '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>'
  },
  {
    id: "under-the-mattress",
    term: "\"Under the Mattress\" Savings",
    category: "Money Basics",
    short: "Cash kept physically at home instead of in a bank or credit union — no interest, no FDIC/NCUA protection if it's lost, stolen, or destroyed, and it quietly loses purchasing power to inflation every year it sits there. A small amount for true emergencies can make sense, but it's not a substitute for an actual emergency fund.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "financial-independence",
    term: "Financial Independence (FI)",
    category: "Core concepts",
    short: "Having enough invested assets that their returns can cover your living expenses indefinitely, without needing to work for income. The foundation everything else on this list builds on — FIRE is just FI reached ahead of a normal retirement age.",
    relatedHref: "/FISnapshot/index.html", relatedLabel: "FI Snapshot",
    relatedIcon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>'
  },
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
    id: "rmd",
    term: "Required Minimum Distribution (RMD)",
    category: "Retirement withdrawal",
    short: "The minimum amount the IRS requires you to withdraw each year from most traditional retirement accounts once you reach a certain age (currently 73) — set by the account balance and your life expectancy, whether or not you actually need the money that year.",
    relatedHref: "/RMD/index.html", relatedLabel: "Required Minimum Distributions",
    relatedIcon: '<polygon points="4 8 12 3 20 8"></polygon><line x1="3" y1="20" x2="21" y2="20"></line><line x1="6" y1="9" x2="6" y2="19"></line><line x1="10" y1="9" x2="10" y2="19"></line><line x1="14" y1="9" x2="14" y2="19"></line><line x1="18" y1="9" x2="18" y2="19"></line>'
  },
  {
    id: "monte-carlo",
    term: "Monte Carlo Simulation",
    category: "Retirement withdrawal",
    short: "Running a retirement plan through hundreds or thousands of randomized (or historically resampled) market sequences instead of one fixed average return, to see what percentage of the time the plan actually survives — a direct stress test against sequence of returns risk.",
    relatedHref: "/MonteCarlo/index.html", relatedLabel: "Monte Carlo Simulator",
    relatedIcon: '<rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8" cy="8" r="1.2"></circle><circle cx="16" cy="8" r="1.2"></circle><circle cx="12" cy="12" r="1.2"></circle><circle cx="8" cy="16" r="1.2"></circle><circle cx="16" cy="16" r="1.2"></circle>'
  },
  {
    id: "annuity",
    term: "Annuity",
    category: "Retirement withdrawal",
    short: "A contract with an insurance company where you hand over a lump sum (or series of payments) in exchange for guaranteed periodic income, often for life. Trades away flexibility and growth potential for certainty — the opposite bet from self-managing a withdrawal strategy like the 4% rule.",
    relatedHref: "/SafeWithdrawalRate/index.html", relatedLabel: "Safe Withdrawal Rate",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 16 10"></polyline>'
  },
  {
    id: "stock-market",
    term: "Stock Market",
    category: "Investment Basics",
    short: "The collection of exchanges (like the NYSE and Nasdaq) where shares of public companies are bought and sold. \"The market\" going up or down usually refers to a broad index, like the S&P 500, tracking the combined value of hundreds of these companies at once.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "stocks",
    term: "Stocks",
    category: "Investment Basics",
    short: "A share of ownership in a single company. Owning a stock means owning a small slice of that business, its profits, and its risk — value can swing a lot day to day, which is exactly the volatility long-term investors are being compensated for riding out.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "short-selling",
    term: "Short Selling (Shorts)",
    category: "Investment Basics",
    short: "Betting that a stock's price will fall — you borrow shares and sell them now, planning to buy them back later at a lower price and pocket the difference. Unlike a normal (\"long\") position, where the most you can lose is what you put in, a short's potential loss is theoretically unlimited if the price rises instead. An advanced, higher-risk strategy most FIRE plans don't rely on.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "stock-options",
    term: "Stock Options",
    category: "Investment Basics",
    short: "A contract giving you the right, but not the obligation, to buy or sell a stock at a set price before a certain date. Used for everything from speculative trading to (in a very different form) employee compensation at some companies — the trading kind is complex and high-risk, and worth understanding thoroughly before ever using real money.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "bonds",
    term: "Bonds",
    category: "Investment Basics",
    short: "A loan you make to a company or government, in exchange for regular interest payments and your principal back at a set maturity date. Generally steadier and lower-return than stocks, which is why a mix of both is the classic way to balance growth against volatility.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "index-funds",
    term: "Index Funds",
    category: "Investment Basics",
    short: "A fund that simply holds every company in a given market index (like the S&P 500) in proportion to its size, instead of trying to pick winners. Low fees and broad diversification make index funds the default building block for most FIRE portfolios.",
    relatedHref: "/SafeWithdrawalRate/index.html", relatedLabel: "Safe Withdrawal Rate",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 12 15 16 10"></polyline>'
  },
  {
    id: "fractional-shares",
    term: "Fractional Shares",
    category: "Investment Basics",
    short: "Owning a partial share of a stock or fund instead of a whole one — lets you invest a specific dollar amount (say, $50) even if one full share costs more than that. Most major brokerages and robo-investors now support buying fractional shares automatically, which makes it easier to stay fully invested with whatever you have to contribute.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "dividends",
    term: "Dividends",
    category: "Investment Basics",
    short: "A portion of a company's profits paid out directly to shareholders, usually quarterly — cash that lands in your account (or reinvests automatically) just for holding the stock, on top of whatever the share price itself does.",
    relatedHref: "/CompoundInterest-WealthMultiplier/index.html", relatedLabel: "Compound Interest & Wealth Multiplier",
    relatedIcon: '<line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle>'
  },
  {
    id: "investor",
    term: "Investor",
    category: "Investment Basics",
    short: "Anyone who puts money into an asset — stocks, bonds, real estate, a business — expecting it to grow or generate income over time. No special license or large sum required; opening a brokerage account and buying your first index fund makes you one.",
    relatedHref: "/GettingStarted/index.html", relatedLabel: "Using This Site",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>'
  },
  {
    id: "robo-investor",
    term: "Robo-Investor (Robo-Advisor)",
    category: "Investment Basics",
    short: "An automated investing service — Betterment, Wealthfront, and similar — that builds and manages a diversified portfolio for you based on a few questions about your goals and risk tolerance, typically using low-cost index funds and rebalancing automatically. A middle ground between doing it yourself and paying a human financial advisor, usually for a small annual fee.",
    relatedHref: "/TimeToFI/index.html", relatedLabel: "Time to FI",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>'
  },
  {
    id: "401k",
    term: "401(k)",
    category: "Retirement Accounts",
    short: "An employer-sponsored retirement account, often with matching contributions and a yearly contribution limit. Money goes in pre-tax (traditional) or after-tax (Roth), and grows tax-advantaged until withdrawal.",
    relatedHref: "/GenInfo/index.html", relatedLabel: "Retirement Info",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  },
  {
    id: "traditional-vs-roth",
    term: "Traditional vs. Roth",
    category: "Retirement Accounts",
    short: "Traditional accounts give you a tax deduction now and tax the withdrawals later. Roth accounts are funded with already-taxed money and grow completely tax-free. Which is better often comes down to whether your tax rate is higher today or in retirement.",
    relatedHref: "/RothLadder/index.html", relatedLabel: "Roth Conversion Ladder",
    relatedIcon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
  },
  {
    id: "hsa",
    term: "HSA (Health Savings Account)",
    category: "Retirement Accounts",
    short: "A tax-advantaged account for medical expenses, available with a qualifying high-deductible health plan. Contributions, growth, and withdrawals for medical costs are all tax-free — one of the few genuine \"triple tax advantage\" accounts.",
    relatedHref: "/HealthcareBridge/index.html", relatedLabel: "Healthcare & ACA Bridge",
    relatedIcon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  {
    id: "ira",
    term: "IRA (Individual Retirement Account)",
    category: "Retirement Accounts",
    short: "A retirement account you open yourself, outside of any employer plan. Traditional (pre-tax, taxed on withdrawal) and Roth (after-tax, tax-free growth) are the common types, each with its own yearly contribution limit — SEP and SIMPLE IRAs extend the idea to the self-employed and small businesses.",
    relatedHref: "/GenInfo/index.html", relatedLabel: "Retirement Info",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  },
  {
    id: "brokerage",
    term: "Brokerage",
    category: "Investment Accounts",
    short: "A financial firm that lets you buy and sell investments — stocks, bonds, ETFs, mutual funds — and holds them in an account for you. Most retirement accounts (401(k)s, IRAs) and taxable investment accounts are opened through a brokerage.",
    relatedHref: "/NetWorth/index.html", relatedLabel: "Net Worth",
    relatedIcon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>'
  },
  {
    id: "individual-brokerage",
    term: "Individual Brokerage Account",
    category: "Investment Accounts",
    short: "A standard taxable investment account, opened in one person's name — no contribution limits or withdrawal restrictions, but no special tax treatment either. The default account type once tax-advantaged space (401(k), IRA) is maxed out.",
    relatedHref: "/NetWorth/index.html", relatedLabel: "Net Worth",
    relatedIcon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>'
  },
  {
    id: "joint-brokerage",
    term: "Joint Brokerage Account",
    category: "Investment Accounts",
    short: "A taxable investment account owned by two people — usually spouses or partners — with equal access and, in most states, equal ownership. A common way households invest together outside of retirement accounts.",
    relatedHref: "/NetWorth/index.html", relatedLabel: "Net Worth",
    relatedIcon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>'
  },
  {
    id: "custodial-account",
    term: "Custodial Account (UGMA/UTMA)",
    category: "Investment Accounts",
    short: "An investment account a parent or guardian opens in a child's name. The parent manages it, but the assets legally belong to the child and transfer to their control at the age of majority (18-21, depending on the state).",
    relatedHref: "/GenInfo/index.html", relatedLabel: "Retirement Info",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  },
  {
    id: "529-plan",
    term: "529 Plan",
    category: "Investment Accounts",
    short: "A tax-advantaged account for education expenses — contributions grow tax-free and withdrawals are tax-free when used for qualified schooling costs. Usually opened by a parent or grandparent for a child's future education.",
    relatedHref: "/GenInfo/index.html", relatedLabel: "Retirement Info",
    relatedIcon: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
  },
  {
    id: "checking-account",
    term: "Checking Account",
    category: "Banking Accounts",
    short: "A bank account built for frequent, everyday transactions — deposits, withdrawals, debit card purchases, and bill pay. Usually pays little to no interest, since it's meant for spending, not growing.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "savings-account",
    term: "Savings Account",
    category: "Banking Accounts",
    short: "A bank account meant for money you're setting aside rather than spending — pays some interest, and often limits how many withdrawals you can make per month. A common home for a starter emergency fund.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "hysa",
    term: "High-Yield Savings Account (HYSA)",
    category: "Banking Accounts",
    short: "A savings account, usually from an online-only bank, paying a meaningfully higher interest rate than a traditional brick-and-mortar bank's savings account, while keeping your money fully liquid. The typical home for an emergency fund.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "cd",
    term: "Certificate of Deposit (CD)",
    category: "Banking Accounts",
    short: "A bank deposit that locks your money up for a fixed term (months to years) in exchange for a guaranteed interest rate, usually higher than a regular savings account. Withdrawing early typically costs a penalty.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "money-market-account",
    term: "Money Market Account",
    category: "Banking Accounts",
    short: "A bank account that splits the difference between checking and savings — usually pays a higher interest rate than a regular savings account, while still allowing limited check-writing or debit card access. FDIC-insured like other bank deposit accounts.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "bank",
    term: "Bank",
    category: "Banking Terms",
    short: "A for-profit financial institution that takes deposits and makes loans — checking, savings, CDs, and most mortgages and auto loans come from banks. Deposits are typically insured by the FDIC up to $250,000 per depositor, per bank.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "credit-union",
    term: "Credit Union",
    category: "Banking Terms",
    short: "A not-for-profit financial institution owned by its members rather than shareholders — offers the same core products as a bank (checking, savings, loans), often with better rates and lower fees, but usually requires membership eligibility to join. Deposits are insured by the NCUA instead of the FDIC.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "fdic",
    term: "FDIC (Federal Deposit Insurance Corporation)",
    category: "Banking Terms",
    short: "A U.S. government agency that insures bank deposits — checking, savings, CDs — up to $250,000 per depositor, per bank, per ownership category. If an FDIC-insured bank fails, your money (up to that limit) is protected.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  },
  {
    id: "ncua",
    term: "NCUA (National Credit Union Administration)",
    category: "Banking Terms",
    short: "The credit union equivalent of the FDIC — a U.S. government agency that insures deposits at credit unions up to the same $250,000 per depositor, per institution, per ownership category.",
    relatedHref: "/EmergencyFund/index.html", relatedLabel: "Emergency Fund",
    relatedIcon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
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
    id: "capital-gains-tax",
    term: "Capital Gains Tax",
    category: "Taxes & income",
    short: "Tax owed on the profit from selling an investment. Short-term gains (held one year or less) are taxed as ordinary income; long-term gains (held over a year) get lower, more favorable rates — so holding period matters as much as the dollar amount.",
    relatedHref: "/CashOutOrHold/index.html", relatedLabel: "Cash Out or Hold",
    relatedIcon: '<rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M6 12h.01M18 12h.01"></path>'
  },
  {
    id: "roth-ladder",
    term: "Roth Conversion Ladder",
    category: "Early Retirement",
    short: "Converting traditional (pre-tax) retirement funds to Roth in planned yearly chunks before you need them, so each chunk finishes its 5-year seasoning clock and becomes penalty-free to withdraw before age 59½.",
    relatedHref: "/RothLadder/index.html", relatedLabel: "Roth Conversion Ladder",
    relatedIcon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
  },
  {
    id: "five-year-rule",
    term: "5-Year Rule",
    category: "Early Retirement",
    short: "A converted Roth balance must season for 5 years from the date of conversion before it can be withdrawn penalty-free — a separate clock for every year's conversion.",
    relatedHref: "/RothLadder/index.html", relatedLabel: "Roth Conversion Ladder",
    relatedIcon: '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>'
  },
  {
    id: "bridge",
    term: "Bridge (Income/Healthcare)",
    category: "Early Retirement",
    short: "The span of years an early retiree has to self-fund before a later income source — Social Security, a pension, or Medicare — takes over some or all of the cost.",
    relatedHref: "/SocialSecurityBridge/index.html", relatedLabel: "SS & Pension Bridge",
    relatedIcon: '<circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>'
  },
  {
    id: "ss-claiming-age",
    term: "Social Security Claiming Age / FRA",
    category: "Early Retirement",
    short: "Your Full Retirement Age (FRA) — 66-67 for most people today — is when you get your full benefit. Claiming as early as 62 permanently reduces it; waiting as late as 70 permanently increases it. That trade-off is the core decision behind any claiming-age strategy.",
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
  },
  {
    id: "fifty-thirty-twenty",
    term: "50/30/20 Rule",
    category: "Core concepts",
    short: "A budgeting guideline: roughly 50% of after-tax income toward needs, 30% toward wants, and 20% toward savings and debt payoff — a simple starting split to compare your own budget against, not a hard rule.",
    relatedHref: "/BudgetCalculator/index.html", relatedLabel: "Budget Calculator",
    relatedIcon: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path>'
  },
  {
    id: "amortization",
    term: "Amortization",
    category: "Loans & borrowing",
    short: "The schedule by which a loan payment splits between interest and principal over time. Early payments are mostly interest, later payments are mostly principal, even though the total payment stays the same the whole time.",
    relatedHref: "/LoanCalculator/index.html", relatedLabel: "Loan Calculator",
    relatedIcon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
  },
  {
    id: "loan",
    term: "Loan",
    category: "Loans & borrowing",
    short: "Money borrowed and repaid over time with interest — the general category that mortgages, student loans, car loans, and credit cards all fall under, each with its own rules for collateral, rates, and payoff structure.",
    relatedHref: "/LoanCalculator/index.html", relatedLabel: "Loan Calculator",
    relatedIcon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
  },
  {
    id: "credit-card",
    term: "Credit Card",
    category: "Loans & borrowing",
    short: "A revolving, unsecured line of credit. Carry a balance past the due date and interest — often 20%+ APR — starts compounding on it immediately, making credit card debt one of the most expensive kinds to carry.",
    relatedHref: "/DebtSnowball/index.html", relatedLabel: "Debt Snowball",
    relatedIcon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  },
  {
    id: "mortgage",
    term: "Mortgage",
    category: "Loans & borrowing",
    short: "A loan secured by real estate, used to buy a home — the property itself is the collateral, so falling far enough behind on payments can mean foreclosure. Usually the largest, longest-term loan most people ever take on.",
    relatedHref: "/RentVsBuy/index.html", relatedLabel: "Rent vs. Buy",
    relatedIcon: '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>'
  },
  {
    id: "mortgage-refinance",
    term: "Mortgage Refinance (Refi)",
    category: "Loans & borrowing",
    short: "Replacing an existing mortgage with a new one — usually to lock in a lower rate, change the loan term, or pull out cash from built-up equity. Comes with its own closing costs, so it only pays off if you keep the loan long enough to recoup them. Some financial institutions call this a Home Refinance Loan (HRL) instead — same product, different name.",
    relatedHref: "/RentVsBuy/index.html", relatedLabel: "Rent vs. Buy",
    relatedIcon: '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>'
  },
  {
    id: "secured-loan",
    term: "Secured Loan",
    category: "Loans & borrowing",
    short: "A loan backed by collateral — an asset the lender can seize if you stop paying (a house for a mortgage, a car for an auto loan). The collateral lowers the lender's risk, which is why secured loans usually carry lower interest rates than unsecured ones.",
    relatedHref: "/LoanCalculator/index.html", relatedLabel: "Loan Calculator",
    relatedIcon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
  },
  {
    id: "unsecured-loan",
    term: "Unsecured Loan",
    category: "Loans & borrowing",
    short: "A loan with no collateral backing it — approval is based on creditworthiness alone. Credit cards and most personal loans are unsecured, part of why they typically carry higher interest rates than secured loans like mortgages or auto loans.",
    relatedHref: "/LoanCalculator/index.html", relatedLabel: "Loan Calculator",
    relatedIcon: '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>'
  },
  {
    id: "heloc",
    term: "HELOC (Home Equity Line of Credit)",
    category: "Loans & borrowing",
    short: "A revolving line of credit secured by the equity in your home — similar to a credit card, you can draw, repay, and redraw against it up to a limit during a set draw period. A related product, the home equity loan, gives you that same equity as a single lump sum instead. Some financial institutions call this a Home Equity Credit Line (HECL) instead — same product, different name.",
    relatedHref: "/RentVsBuy/index.html", relatedLabel: "Rent vs. Buy",
    relatedIcon: '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>'
  },
  {
    id: "student-loan",
    term: "Student Loan",
    category: "Loans & borrowing",
    short: "A loan used to pay for education, often with more flexible repayment options than other debt — federal student loans in particular offer income-driven repayment and deferment options that private loans typically don't.",
    relatedHref: "/DebtSnowball/index.html", relatedLabel: "Debt Snowball",
    relatedIcon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  },
  {
    id: "prime-rate",
    term: "Prime Rate",
    category: "Loans & borrowing",
    short: "The interest rate banks charge their most creditworthy customers, set largely off the Federal Reserve's own benchmark rate. Many variable-rate products — HELOCs, some credit cards, adjustable-rate loans — are priced as \"prime plus X%,\" so their rate moves whenever the prime rate does.",
    relatedHref: "/RentVsBuy/index.html", relatedLabel: "Rent vs. Buy",
    relatedIcon: '<circle cx="7" cy="15" r="4"></circle><line x1="10.5" y1="11.5" x2="21" y2="1"></line><line x1="15" y1="7" x2="18" y2="10"></line><line x1="18" y1="4" x2="21" y2="7"></line>'
  }
];

/* =========================================================================
   Parent groups for the "By Category" browse mode — a category → sub­cate-
   gory tree instead of one flat list. Only read by Glossary/index.html;
   FN_FAQ's own categories are unrelated and unaffected.
   Each entry is {name, categories}: `categories` must exactly match the
   `category` string used above (case-sensitive) — a typo there just means
   that category renders ungrouped, after every mapped parent, rather than
   breaking anything (see the "safety net" in Glossary/index.html's own
   render()). To add a new subcategory to an existing parent, add its
   category name to that parent's array. To add a whole new parent, add a
   new {name, categories} entry — order here is display order, both for
   parents themselves and for the subcategories listed inside one.
   Alphabetical sort mode ignores this entirely (it buckets by the term's
   own first letter, not by category), so this structure only matters in
   "By Category" mode.
   ========================================================================= */
window.FN_GLOSSARY_GROUPS = [
  {
    name: "Foundational Concepts",
    categories: ["Money Basics", "Core concepts", "FIRE variants", "Taxes & income"]
  },
  {
    name: "Retirement",
    categories: ["Retirement Accounts", "Early Retirement", "Retirement withdrawal"]
  },
  {
    name: "Banking",
    categories: ["Banking Accounts", "Banking Terms"]
  },
  {
    name: "Investing",
    categories: ["Investment Accounts", "Investment Basics"]
  },
  {
    name: "Debt & Loans",
    categories: ["Loans & borrowing", "Paying off debt"]
  }
];
