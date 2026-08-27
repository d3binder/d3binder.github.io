/* =========================================================================
   FireNate — F.A.Q. page data.
   Single source of truth for the FAQ page (FAQ/index.html) — add a new
   question by adding a new object to this array, no HTML/JS editing
   required. Fields:
     id       — unique, url-safe (letters/numbers/hyphens only) — used for
                deep links like FAQ/index.html#faq-<id>
     category — groups questions into the page's collapsible sections;
                reusing an existing category string (exact spelling
                matters) adds a question to that section, a new string
                creates a new section in the order it's first used
     question — plain text, no HTML
     answer   — HTML allowed (e.g. <a href="../Glossary/index.html#term-…">
                to link a specific Glossary entry, or <strong>) — kept as
                plain strings rather than Markdown so no extra parsing step
                is needed to render it
   ========================================================================= */
window.FN_FAQ = [
  {
    id: "which-calculators",
    category: "About this Site",
    question: "How do I know what calculators and tools to use?",
    answer: "Not sure where to start? <a href=\"../GettingStartedCalculators/index.html\">Calculator Picker</a> asks a few quick questions and points you to the two or three tools that actually fit your situation — or lets you browse every calculator laid out as a subway-style map instead. If you're brand new to the site in general, <a href=\"../GettingStarted/index.html\">Using This Site</a> is a fuller walkthrough of profile setup, saving snapshots, and everything else the site does."
  },
  {
    id: "where-does-my-info-go",
    category: "About this Site",
    question: "Where does my information go?",
    answer: "Nowhere but your own device. Every number you enter — your profile, every calculator's inputs, every saved snapshot — is stored locally in your browser's storage. Nothing is uploaded to a server, and FireNate has no accounts, login, or backend database to send it to."
  },
  {
    id: "save-export-info",
    category: "About this Site",
    question: "How can I save / export my information and use it on other machines?",
    answer: "Open <a href=\"../ProfileManager/index.html\">Profile Manager</a> and use Export — it downloads everything (your profile, every saved snapshot, and every calculator's own inputs) as a single file. Bring that file to another device or browser and use Import to load it right back in. To send just one specific scenario instead, each page's \"Your info\" panel also has a share-link icon that copies a link encoding your current numbers, ready to paste anywhere."
  },
  {
    id: "clear-browser-cache",
    category: "About this Site",
    question: "What happens to my information if I clear my browser cache (temporary internet files, cookies, etc.)?",
    answer: "It depends on exactly what you clear. Your FireNate data lives in your browser's <em>local storage</em>, not its cache or cookies — clearing \"temporary files\" alone usually leaves it untouched. But a broader \"Clear browsing data\" that includes <strong>cookies and site data</strong> (or using a private/incognito window) will wipe it, since local storage falls under that umbrella too. If you're ever about to do a deep clean, export a backup from <a href=\"../ProfileManager/index.html\">Profile Manager</a> first — it takes a few seconds and means nothing is at risk."
  },
  {
    id: "do-i-need-an-account",
    category: "About this Site",
    question: "Do I need to create an account?",
    answer: "No — there's no signup, login, or account of any kind. Everything works immediately, and everything you enter stays on your own device (see \"Where does my information go?\" above)."
  },

  {
    id: "budgeting-getting-started",
    category: "Budgeting",
    question: "If I've never budgeted before, how do I get started?",
    answer: "Start with the <a href=\"../BudgetCalculator/index.html\">Budget Calculator</a> — enter your monthly take-home income and what you spend across a handful of common categories (housing, groceries, debt payments, and so on), and it sorts everything into the <a href=\"../Glossary/index.html#term-fifty-thirty-twenty\">50/30/20 rule</a>'s needs/wants/savings split so you can see at a glance where your money is actually going. You don't need a perfect number for every category on day one — even a rough first pass gives you something real to work from."
  },
  {
    id: "budgeting-categories-dont-fit",
    category: "Budgeting",
    question: "What if my expenses don't fit neatly into needs, wants, and savings?",
    answer: "That's normal — real budgets are messier than any three-bucket framework. Use your best judgment on where something belongs (a car payment is usually a \"need\"; upgrading to a nicer car than you needed is arguably a \"want\"), and don't stress about getting every line item perfect. The <a href=\"../Glossary/index.html#term-fifty-thirty-twenty\">50/30/20 split</a> is a guideline for spotting imbalances, not a strict rulebook."
  },

  {
    id: "fire-what-is-it",
    category: "About F.I.R.E.",
    question: "What is FIRE?",
    answer: "FIRE stands for <a href=\"../Glossary/index.html#term-fire\">Financial Independence, Retire Early</a> — building up enough savings and investments that your money, not a paycheck, covers your living expenses. \"Retire Early\" is right there in the name, but plenty of people pursuing FIRE care a lot more about the \"Financial Independence\" half — see the next question."
  },
  {
    id: "fire-too-late",
    category: "About F.I.R.E.",
    question: "Is it too late for me?",
    answer: "No. <a href=\"../Glossary/index.html#term-financial-independence\">Financial independence</a> is a direction, not a finish line you either reach by a deadline or miss entirely — every dollar saved and invested moves your timeline closer, no matter your age or starting point. <a href=\"../TimeToFI/index.html\">Time to FI</a> shows exactly how your own numbers play out; a lot of people find they're closer than they assumed once they actually run them."
  },
  {
    id: "fire-worth-it-not-early-retiring",
    category: "About F.I.R.E.",
    question: "Is FIRE worth it if I don't care about retiring early?",
    answer: "Yes — most of what \"FIRE\" actually means day-to-day is just financial independence: having enough invested that work becomes optional, whether or not you ever stop working. Plenty of people who pursue it never retire early at all; they just like having the choice, a bigger cushion, and the option to change careers, cut hours, or walk away from a bad job without it being a financial emergency."
  },
  {
    id: "fire-variants",
    category: "About F.I.R.E.",
    question: "What are Lean, Fat, Coast, and Barista FIRE?",
    answer: "They're all variations on the same core idea, with different lifestyles and different paths to get there — see the Glossary's <a href=\"../Glossary/index.html#cat-fire-variants\">FIRE variants</a> section for a plain-English breakdown of each."
  },

  {
    id: "investing-getting-started",
    category: "Investing",
    question: "How and where do I get started investing?",
    answer: "For most people, the simplest starting point is an employer's <a href=\"../Glossary/index.html#term-401k\">401(k)</a> if one's offered — especially if there's a match, since that's free money. From there, opening an <a href=\"../Glossary/index.html#term-ira\">IRA</a> or a plain <a href=\"../Glossary/index.html#term-brokerage\">brokerage account</a> with any major provider takes about the same amount of effort as opening a bank account. See the Glossary's <a href=\"../Glossary/index.html#cat-investment-accounts\">account types</a> section for what each option actually offers."
  },
  {
    id: "investing-what-to-invest-in",
    category: "Investing",
    question: "What should someone who's never invested before actually invest in?",
    answer: "A low-cost, broad-market <a href=\"../Glossary/index.html#term-index-funds\">index fund</a> — something tracking the total U.S. stock market or the S&amp;P 500 — is the standard starting point. It spreads your money across hundreds or thousands of companies instead of betting on any one of them, and typically costs a fraction of a percent per year to hold. It won't be the most exciting choice, but \"boring and consistent\" beats \"exciting and unpredictable\" for almost everyone's long-term plan."
  },
  {
    id: "investing-good-materials",
    category: "Investing",
    question: "What are some good sources to learn more?",
    answer: "We deliberately don't recommend specific books, creators, or services — the FIRE space changes fast, and a specific pick here would go stale. A good rule of thumb: look for resources that explain <em>why</em> index investing and a high savings rate matter, are upfront about fees, and don't pressure you toward a specific product. The <a href=\"../Glossary/index.html\">Glossary</a> is a good place to get comfortable with the vocabulary first, so whatever you read next makes more sense."
  },
  {
    id: "investing-what-kinds-exist",
    category: "Investing",
    question: "What kinds of investments are there?",
    answer: "Stocks, bonds, and index funds are the building blocks most FIRE plans are built on — see the Glossary's <a href=\"../Glossary/index.html#cat-investment-basics\">Investing Basics</a> section for what each one actually is. For where to hold them, the <a href=\"../Glossary/index.html#cat-investment-accounts\">account types</a> section covers brokerage accounts, custodial accounts, 529 plans, and more."
  },

  {
    id: "other-is-it-free",
    category: "Other Topics",
    question: "Is FireNate free to use?",
    answer: "Yes, completely — no signup, no paywall, no premium tier. Every calculator and tool on this site is free."
  },
  {
    id: "other-will-it-stay-free",
    category: "Other Topics",
    question: "Will FireNate always be free?",
    answer: "We hope to keep the core functionality we have today free forever. But at some point, we do have to figure out how to keep the lights on — we may look into optional donations, hosting saved profiles/scenarios, future premium options, or limited promotions for products or services we truly believe in. FireNate is a project of love that we don't want to distract from, meant to help people start thinking about how they can begin (or keep going) building a better future for themselves and their family."
  },
  {
    id: "other-how-accurate",
    category: "Other Topics",
    question: "How accurate are these calculators?",
    answer: "As accurate as the assumptions you put into them — a calculator can't know your actual future return rate, inflation, or life events, so every result is a projection based on the numbers you enter, not a guarantee. Treat the outputs as a way to compare scenarios and spot trends, not as a prediction of your exact future."
  },
  {
    id: "other-bug-or-suggestion",
    category: "Other Topics",
    question: "I found a bug or have a suggestion — who do I tell?",
    answer: "The <a href=\"../Contact/index.html\">Contact</a> page has the details — we read every submission, though a response isn't guaranteed (see <a href=\"../Terms/index.html\">Terms, Conditions &amp; Copyright</a> for the fine print)."
  },
  {
    id: "other-not-advice",
    category: "Other Topics",
    question: "Does FireNate give investment or tax advice?",
    answer: "No. Every calculator here is a general-purpose planning tool, not personalized advice — it doesn't know your full financial picture, tax situation, or goals the way a licensed professional would. See our <a href=\"../Terms/index.html\">Terms, Conditions &amp; Copyright</a> page for the full disclaimer."
  }
];
