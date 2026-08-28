(() => {
  "use strict";

  // ---------- formatting helpers ----------
  const currency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const compactCurrency = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);

  function formatDate(d) {
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" });
  }

  function addMonths(date, months) {
    const d = new Date(date);
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  // Formats a raw text-input value into a comma-grouped number string as the
  // user types, e.g. "500000" -> "500,000", "500000.5" -> "500,000.5"
  function formatNumberInput(raw) {
    let cleaned = raw.replace(/[^0-9.]/g, "");
    const dot = cleaned.indexOf(".");
    let intPart = dot === -1 ? cleaned : cleaned.slice(0, dot);
    let decPart = dot === -1 ? "" : "." + cleaned.slice(dot + 1).replace(/\./g, "").slice(0, 2);
    intPart = intPart.replace(/^0+(?=\d)/, "");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return withCommas + decPart;
  }

  function parseFormattedNumber(str) {
    const n = parseFloat(String(str).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  // ---------- state ----------
  const state = {
    loanAmountStr: "500,000",
    rate: 6.5,
    termUnit: "years", // "years" | "months"
    termValue: 30,
    startDate: "2026-08-08",
    tableOpen: false,
    extraAmt: 100,
    refiPaymentsMade: 0,
    refiRate: null, // null until init() defaults it relative to the loan's own rate
    refiFeesStr: "0",
  };

  // ---------- persistence ----------
  const LC_STORAGE_KEY = "loanCalculatorInputs";

  function loadLcInputs() {
    try {
      const raw = localStorage.getItem(LC_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.loanAmountStr !== undefined) state.loanAmountStr = saved.loanAmountStr;
      if (saved.rate !== undefined) state.rate = saved.rate;
      if (saved.termUnit !== undefined) state.termUnit = saved.termUnit;
      if (saved.termValue !== undefined) state.termValue = saved.termValue;
      if (saved.startDate !== undefined) state.startDate = saved.startDate;
      if (saved.extraAmt !== undefined) state.extraAmt = saved.extraAmt;
      if (saved.refiPaymentsMade !== undefined) state.refiPaymentsMade = saved.refiPaymentsMade;
      if (saved.refiRate !== undefined) state.refiRate = saved.refiRate;
      if (saved.refiFeesStr !== undefined) state.refiFeesStr = saved.refiFeesStr;
    } catch (e) { /* storage unavailable or corrupt — fall back to defaults */ }
  }

  function lcPad2(n) { return String(n).padStart(2, "0"); }
  function updateLcSaveStatus() {
    const status = document.getElementById("lcSaveStatus");
    if (!status) return;
    const d = new Date();
    status.textContent = `Last saved: ${lcPad2(d.getHours())}:${lcPad2(d.getMinutes())}:${lcPad2(d.getSeconds())}`;
  }

  function saveLcInputs() {
    try {
      localStorage.setItem(LC_STORAGE_KEY, JSON.stringify({
        loanAmountStr: state.loanAmountStr,
        rate: state.rate,
        termUnit: state.termUnit,
        termValue: state.termValue,
        startDate: state.startDate,
        extraAmt: state.extraAmt,
        refiPaymentsMade: state.refiPaymentsMade,
        refiRate: state.refiRate,
        refiFeesStr: state.refiFeesStr,
      }));
      updateLcSaveStatus();
    } catch (e) { /* storage unavailable, ignore */ }
  }

  function termYears() {
    return state.termUnit === "years" ? Number(state.termValue) || 0 : (Number(state.termValue) || 0) / 12;
  }

  // ---------- amortization ----------
  function buildSchedule() {
    const P = parseFormattedNumber(state.loanAmountStr);
    const n = Math.round(termYears() * 12);
    const r = (Number(state.rate) || 0) / 100 / 12;

    if (P <= 0 || n <= 0) {
      return { rows: [], payment: 0, totalInterest: 0, crossover: null, payoffDate: null };
    }

    const payment = r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));

    let balance = P;
    let cumPrincipal = 0;
    let cumInterest = 0;
    let crossover = null;
    const rows = [];
    const base = new Date(state.startDate);

    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      let principal = payment - interest;
      if (i === n) principal = balance; // clean up rounding on final payment
      const pay = i === n ? principal + interest : payment;
      balance = Math.max(0, balance - principal);
      cumPrincipal += principal;
      cumInterest += interest;

      if (crossover === null && principal > interest) crossover = i;

      rows.push({
        num: i,
        date: addMonths(base, i),
        beginBalance: balance + principal,
        payment: pay,
        principal,
        interest,
        endBalance: balance,
        cumPrincipal,
        cumInterest,
      });
    }

    return {
      rows,
      payment,
      totalInterest: cumInterest,
      crossover,
      payoffDate: rows.length ? rows[rows.length - 1].date : null,
    };
  }

  // Same interest-then-principal monthly mechanics as buildSchedule(), with
  // a flat extra amount added to every payment — used only to compute the
  // scenario's totals (months, interest), not to redraw the full ledger.
  function buildScheduleWithExtra(P, r, basePayment, extra) {
    if (P <= 0 || basePayment <= 0) return { months: 0, totalInterest: 0 };
    const totalPayment = basePayment + extra;
    let balance = P;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 1200;
    while (balance > 0.005 && months < maxMonths) {
      months++;
      const interest = balance * r;
      let principal = totalPayment - interest;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
    }
    return { months, totalInterest };
  }

  // Remaining balance is read straight off the already-built schedule at
  // the "payments already made" row, so this can never disagree with the
  // ledger above it — then amortizes that remaining balance over the same
  // remaining number of months at the new rate.
  function computeRefinance(schedule, paymentsMade, refiRatePct, refiFees) {
    const n = schedule.rows.length;
    if (!n) return null;
    const made = Math.max(0, Math.min(Math.round(paymentsMade) || 0, n));
    const lastRow = made > 0 ? schedule.rows[made - 1] : null;
    const remainingBalance = lastRow ? lastRow.endBalance : parseFormattedNumber(state.loanAmountStr);
    const remainingMonths = n - made;
    if (remainingBalance <= 0.5 || remainingMonths <= 0) return null;

    const interestPaidSoFar = lastRow ? lastRow.cumInterest : 0;
    const remainingInterestCurrent = schedule.totalInterest - interestPaidSoFar;

    const rNew = (Number(refiRatePct) || 0) / 100 / 12;
    const newPayment = rNew === 0
      ? remainingBalance / remainingMonths
      : (remainingBalance * rNew) / (1 - Math.pow(1 + rNew, -remainingMonths));

    let balance = remainingBalance;
    let interestNew = 0;
    const newBalances = [{ month: 0, balance: remainingBalance }];
    for (let i = 1; i <= remainingMonths; i++) {
      const interest = balance * rNew;
      let principal = newPayment - interest;
      if (i === remainingMonths) principal = balance;
      balance = Math.max(0, balance - principal);
      interestNew += interest;
      newBalances.push({ month: i, balance });
    }

    // same balances the ledger already shows, just re-indexed to start at 0
    // from the refinance decision point instead of from loan origination
    const currentBalances = [{ month: 0, balance: remainingBalance }].concat(
      schedule.rows.slice(made).map((row, i) => ({ month: i + 1, balance: row.endBalance }))
    );

    const totalCostNew = interestNew + (Number(refiFees) || 0);
    return {
      remainingBalance,
      remainingMonths,
      currentPayment: schedule.payment,
      remainingInterestCurrent,
      newPayment,
      totalCostNew,
      savings: remainingInterestCurrent - totalCostNew,
      newBalances,
      currentBalances,
    };
  }

  function downsample(rows, maxPoints) {
    if (rows.length <= maxPoints) return rows;
    const step = Math.ceil(rows.length / maxPoints);
    const out = rows.filter((_, i) => i % step === 0 || i === rows.length - 1);
    return out;
  }

  // ---------- rendering ----------
  const el = {
    loanAmountInput: document.getElementById("loanAmountInput"),
    rateInput: document.getElementById("rateInput"),
    termInput: document.getElementById("termInput"),
    termUnitLabel: document.getElementById("termUnitLabel"),
    startDateInput: document.getElementById("startDateInput"),
    termToggle: document.getElementById("termToggle"),
    heroPayment: document.getElementById("heroPayment"),
    heroInterest: document.getElementById("heroInterest"),
    heroTotal: document.getElementById("heroTotal"),
    statStrip: document.getElementById("statStrip"),
    chartSvg: document.getElementById("chartSvg"),
    tooltip: document.getElementById("tooltip"),
    ledgerToggle: document.getElementById("ledgerToggle"),
    ledgerSub: document.getElementById("ledgerSub"),
    toggleLabel: document.getElementById("toggleLabel"),
    tableWrap: document.getElementById("tableWrap"),
    tableBody: document.getElementById("tableBody"),
    extraPaymentCard: document.getElementById("extraPaymentCard"),
    extraToggle: document.getElementById("extraToggle"),
    extraPaymentText: document.getElementById("extraPaymentText"),
    refinanceCard: document.getElementById("refinanceCard"),
    refiChartWrap: document.getElementById("refiChartWrap"),
    refiChartSvg: document.getElementById("refiChartSvg"),
    refiPaymentsInput: document.getElementById("refiPaymentsInput"),
    refiRateInput: document.getElementById("refiRateInput"),
    refiFeesInput: document.getElementById("refiFeesInput"),
    refinanceText: document.getElementById("refinanceText"),
  };

  let currentSchedule = { rows: [] };

  function render() {
    const schedule = buildSchedule();
    currentSchedule = schedule;
    const loanAmount = parseFormattedNumber(state.loanAmountStr);
    const totalCost = loanAmount + schedule.totalInterest;

    // hero
    el.heroPayment.textContent = schedule.payment ? currency(schedule.payment) : "\u2014";
    el.heroInterest.textContent = schedule.totalInterest ? currency(schedule.totalInterest) : "\u2014";
    el.heroTotal.textContent = totalCost ? currency(totalCost) : "\u2014";

    // stat strip
    const principalPct = schedule.rows.length ? Math.round((loanAmount / totalCost) * 100) : null;
    const interestPct = schedule.rows.length ? Math.round((schedule.totalInterest / totalCost) * 100) : null;
    const stats = [
      ["Number of payments", schedule.rows.length || "\u2014"],
      ["Payoff date", schedule.payoffDate ? formatDate(schedule.payoffDate) : "\u2014"],
      ["Principal / interest split", schedule.rows.length ? `${principalPct}% / ${interestPct}%` : "\u2014"],
      ["Interest overtakes principal", schedule.crossover ? `payment #${schedule.crossover}` : "\u2014", "brass"],
      ["Total cost, as a multiple of what you borrowed", schedule.rows.length && loanAmount > 0 ? `${(totalCost / loanAmount).toFixed(2)}x` : "\u2014"],
    ];
    el.statStrip.innerHTML = stats
      .map(
        ([label, value, cls]) => `
        <div class="stat-cell">
          <div class="stat-label">${label}</div>
          <div class="stat-value num ${cls || ""}">${value}</div>
        </div>`
      )
      .join("");

    // chart
    renderChart(schedule, totalCost, loanAmount);

    // ledger
    el.ledgerSub.textContent = schedule.rows.length
      ? `${schedule.rows.length} payments, ${formatDate(schedule.rows[0].date)} through ${formatDate(schedule.payoffDate)}`
      : "\u2014";
    if (state.tableOpen) renderTable(schedule);

    renderExtraPaymentNote(schedule);
    renderRefinanceNote(schedule);
  }

  function renderExtraPaymentNote(schedule) {
    if (!schedule.rows.length) { el.extraPaymentCard.hidden = true; return; }
    el.extraPaymentCard.hidden = false;

    const P = parseFormattedNumber(state.loanAmountStr);
    const r = (Number(state.rate) || 0) / 100 / 12;
    const scenario = buildScheduleWithExtra(P, r, schedule.payment, state.extraAmt);
    const monthsSaved = schedule.rows.length - scenario.months;
    const interestSaved = schedule.totalInterest - scenario.totalInterest;
    const newPayoffDate = addMonths(new Date(state.startDate), scenario.months);

    if (monthsSaved <= 0) {
      el.extraPaymentText.innerHTML = `An extra ${currency(state.extraAmt)}/mo barely moves this loan \u2014 it's already paying down fast relative to its size.`;
      return;
    }

    const years = Math.floor(monthsSaved / 12);
    const months = monthsSaved % 12;
    const timePhrase = years > 0
      ? `${years} year${years === 1 ? "" : "s"}${months > 0 ? ` ${months} month${months === 1 ? "" : "s"}` : ""}`
      : `${months} month${months === 1 ? "" : "s"}`;

    el.extraPaymentText.innerHTML = `
      Paying an extra <b>${currency(state.extraAmt)}</b>/mo (${currency(schedule.payment + state.extraAmt)}/mo total) pays this off
      <b>${timePhrase} sooner</b> \u2014 by ${formatDate(newPayoffDate)} instead of ${formatDate(schedule.payoffDate)} \u2014
      and saves <b>${currency(interestSaved)}</b> in interest.`;
  }

  function renderRefinanceNote(schedule) {
    if (!schedule.rows.length) { el.refinanceCard.hidden = true; return; }
    el.refinanceCard.hidden = false;

    const refiFees = parseFormattedNumber(el.refiFeesInput.value);
    const result = computeRefinance(schedule, state.refiPaymentsMade, state.refiRate, refiFees);

    if (!result) {
      el.refinanceText.innerHTML = `Set "loan payments already made" below the total number of payments (${schedule.rows.length}) to see a refinance comparison.`;
      renderRefinanceChart(null);
      return;
    }

    const worksOut = result.savings > 0.5;
    el.refinanceText.innerHTML = `
      Refinancing your <b>${currency(result.remainingBalance)}</b> remaining balance at ${Number(state.refiRate) || 0}% APR
      (same ${result.remainingMonths} months left) would change your payment from <b>${currency(result.currentPayment)}</b>
      to <b>${currency(result.newPayment)}</b>/mo, and ${worksOut ? "save" : "cost"}
      <b>${currency(Math.abs(result.savings))}</b> ${refiFees > 0.5 ? "(after fees) " : ""}in interest
      over the ${state.refiPaymentsMade > 0 ? "remaining schedule" : "life of the loan"}.`;

    renderRefinanceChart(result);
  }

  // Same hand-drawn-SVG approach as the main burn-down chart above (line
  // paths + native <title> tooltips, theme-aware colors pulled from the
  // live CSS custom properties since SVG attributes are static) — just two
  // series instead of stacked areas.
  const REFI_CHART = { w: 760, h: 260, padL: 54, padR: 16, padT: 14, padB: 28 };

  function renderRefinanceChart(result) {
    const svg = el.refiChartSvg;
    svg.innerHTML = "";
    if (!result) { el.refiChartWrap.hidden = true; return; }
    el.refiChartWrap.hidden = false;

    const { currentBalances, newBalances, remainingMonths } = result;
    const plotW = REFI_CHART.w - REFI_CHART.padL - REFI_CHART.padR;
    const plotH = REFI_CHART.h - REFI_CHART.padT - REFI_CHART.padB;
    const maxVal = Math.max(
      result.remainingBalance,
      ...currentBalances.map((p) => p.balance),
      ...newBalances.map((p) => p.balance)
    ) * 1.05 || 1;

    const xScale = (m) => REFI_CHART.padL + (m / (remainingMonths || 1)) * plotW;
    const yScale = (v) => REFI_CHART.padT + plotH - (v / maxVal) * plotH;

    const yTicks = 4;
    for (let i = 0; i <= yTicks; i++) {
      const val = (maxVal / yTicks) * i;
      const y = yScale(val);
      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", REFI_CHART.padL);
      line.setAttribute("x2", REFI_CHART.w - REFI_CHART.padR);
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "#EFEAE0");
      svg.appendChild(line);

      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", REFI_CHART.padL - 8);
      label.setAttribute("y", y + 3);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "IBM Plex Mono, monospace");
      label.setAttribute("fill", "#9A9280");
      label.textContent = compactCurrency(val);
      svg.appendChild(label);
    }

    const xTickEvery = Math.max(1, Math.round(remainingMonths / 4));
    for (let m = 0; m <= remainingMonths; m += xTickEvery) {
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", xScale(m));
      label.setAttribute("y", REFI_CHART.h - 8);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "IBM Plex Mono, monospace");
      label.setAttribute("fill", "#9A9280");
      label.textContent = `Mo ${m}`;
      svg.appendChild(label);
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const sageColor = rootStyle.getPropertyValue("--sage").trim() || "#5B7A6A";
    const rustColor = rootStyle.getPropertyValue("--rust").trim() || "#9C4A3D";

    function drawLine(points, color, title) {
      const pts = points.map((p) => [xScale(p.month), yScale(p.balance)]);
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", linePathD(pts));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "2.5");
      const t = document.createElementNS(SVG_NS, "title");
      t.textContent = title;
      path.appendChild(t);
      svg.appendChild(path);
    }

    drawLine(currentBalances, sageColor, `Keep current loan: paid off in ${currentBalances.length - 1} more payments`);
    drawLine(newBalances, rustColor, `Refinance: paid off in ${newBalances.length - 1} payments`);
  }

  function renderTable(schedule) {
    el.tableBody.innerHTML = schedule.rows
      .map(
        (r) => `
        <tr>
          <td class="left num-idx">${r.num}</td>
          <td class="left">${formatDate(r.date)}</td>
          <td>${currency(r.beginBalance)}</td>
          <td>${currency(r.payment)}</td>
          <td class="principal">${currency(r.principal)}</td>
          <td class="interest">${currency(r.interest)}</td>
          <td class="ending">${currency(r.endBalance)}</td>
        </tr>`
      )
      .join("");
  }

  // ---------- chart (hand-drawn SVG, no dependencies) ----------
  const SVG_NS = "http://www.w3.org/2000/svg";
  const CHART = { w: 760, h: 320, padL: 54, padR: 16, padT: 14, padB: 28 };

  function renderChart(schedule, totalCost, loanAmount) {
    const svg = el.chartSvg;
    svg.innerHTML = "";
    if (!schedule.rows.length) return;

    const data = downsample(schedule.rows, 120);
    const maxNum = schedule.rows[schedule.rows.length - 1].num;
    const maxY = Math.max(totalCost, loanAmount);

    const plotW = CHART.w - CHART.padL - CHART.padR;
    const plotH = CHART.h - CHART.padT - CHART.padB;

    const xScale = (num) => CHART.padL + ((num - 1) / (maxNum - 1 || 1)) * plotW;
    const yScale = (val) => CHART.padT + plotH - (val / maxY) * plotH;

    // defs (gradients)
    const defs = document.createElementNS(SVG_NS, "defs");
    defs.innerHTML = `
      <linearGradient id="principalFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#8FA593" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#8FA593" stop-opacity="0.08" />
      </linearGradient>
      <linearGradient id="interestFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#C97B5E" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#C97B5E" stop-opacity="0.08" />
      </linearGradient>`;
    svg.appendChild(defs);

    // gridlines + y labels
    const gridGroup = document.createElementNS(SVG_NS, "g");
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (maxY / yTicks) * i;
      const y = yScale(val);
      const line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", CHART.padL);
      line.setAttribute("x2", CHART.w - CHART.padR);
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "#EFEAE0");
      gridGroup.appendChild(line);

      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", CHART.padL - 8);
      label.setAttribute("y", y + 3);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "IBM Plex Mono, monospace");
      label.setAttribute("fill", "#9A9280");
      label.textContent = compactCurrency(val);
      gridGroup.appendChild(label);
    }
    svg.appendChild(gridGroup);

    // x labels (years)
    const xGroup = document.createElementNS(SVG_NS, "g");
    const totalYears = Math.ceil(maxNum / 12);
    const xTickEvery = Math.max(1, Math.round(totalYears / 6));
    for (let yr = 0; yr <= totalYears; yr += xTickEvery) {
      const num = Math.min(maxNum, yr * 12 + 1);
      const x = xScale(num);
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", x);
      label.setAttribute("y", CHART.h - 8);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "10");
      label.setAttribute("font-family", "IBM Plex Mono, monospace");
      label.setAttribute("fill", "#9A9280");
      label.textContent = `Yr ${yr}`;
      xGroup.appendChild(label);
    }
    svg.appendChild(xGroup);

    // stacked areas: principal (0 -> cumPrincipal), interest (cumPrincipal -> cumPrincipal+cumInterest)
    const principalTop = data.map((r) => [xScale(r.num), yScale(r.cumPrincipal)]);
    const baseline = data.map((r) => [xScale(r.num), yScale(0)]);
    const interestTop = data.map((r) => [xScale(r.num), yScale(r.cumPrincipal + r.cumInterest)]);
    const principalBase = data.map((r) => [xScale(r.num), yScale(r.cumPrincipal)]);

    svg.appendChild(areaPath(principalTop, baseline, "url(#principalFill)", "#5B7A6A"));
    svg.appendChild(areaPath(interestTop, principalBase, "url(#interestFill)", "#9C4A3D"));

    // remaining balance line
    const balancePts = data.map((r) => [xScale(r.num), yScale(r.endBalance)]);
    const linePath = document.createElementNS(SVG_NS, "path");
    linePath.setAttribute("d", linePathD(balancePts));
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", getComputedStyle(document.documentElement).getPropertyValue("--balance-line").trim() || "#1B2129");
    linePath.setAttribute("stroke-width", "2");
    svg.appendChild(linePath);

    // crossover reference line
    if (schedule.crossover) {
      const x = xScale(schedule.crossover);
      const ref = document.createElementNS(SVG_NS, "line");
      ref.setAttribute("x1", x);
      ref.setAttribute("x2", x);
      ref.setAttribute("y1", CHART.padT);
      ref.setAttribute("y2", CHART.h - CHART.padB);
      ref.setAttribute("stroke", "#A8823D");
      ref.setAttribute("stroke-dasharray", "4 3");
      svg.appendChild(ref);

      const refLabel = document.createElementNS(SVG_NS, "text");
      refLabel.setAttribute("x", x);
      refLabel.setAttribute("y", CHART.padT + 10);
      refLabel.setAttribute("text-anchor", x > CHART.w * 0.7 ? "end" : "start");
      refLabel.setAttribute("font-size", "10");
      refLabel.setAttribute("font-family", "IBM Plex Mono, monospace");
      refLabel.setAttribute("fill", "#A8823D");
      refLabel.textContent = `crossover \u00b7 payment ${schedule.crossover}`;
      svg.appendChild(refLabel);
    }

    // hover interaction
    const hoverRect = document.createElementNS(SVG_NS, "rect");
    hoverRect.setAttribute("x", CHART.padL);
    hoverRect.setAttribute("y", CHART.padT);
    hoverRect.setAttribute("width", plotW);
    hoverRect.setAttribute("height", plotH);
    hoverRect.setAttribute("fill", "transparent");
    hoverRect.setAttribute("class", "loan-hover-rect");
    svg.appendChild(hoverRect);

    const hoverLine = document.createElementNS(SVG_NS, "line");
    hoverLine.setAttribute("y1", CHART.padT);
    hoverLine.setAttribute("y2", CHART.h - CHART.padB);
    hoverLine.setAttribute("stroke", "#26221C");
    hoverLine.setAttribute("stroke-opacity", "0.25");
    hoverLine.setAttribute("stroke-width", "1");
    hoverLine.style.display = "none";
    svg.appendChild(hoverLine);

    function nearestRow(num) {
      const clamped = Math.max(1, Math.min(maxNum, num));
      let nearest = schedule.rows[0];
      let bestDiff = Infinity;
      for (const r of schedule.rows) {
        const diff = Math.abs(r.num - clamped);
        if (diff < bestDiff) {
          bestDiff = diff;
          nearest = r;
        }
        if (r.num >= clamped) break;
      }
      return nearest;
    }

    function pointFromEvent(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * CHART.w;
      return Math.round(1 + ((px - CHART.padL) / plotW) * (maxNum - 1));
    }

    function showTooltipForNum(num) {
      const row = nearestRow(num);
      hoverLine.style.display = "block";
      hoverLine.setAttribute("x1", xScale(row.num));
      hoverLine.setAttribute("x2", xScale(row.num));

      const rect = svg.getBoundingClientRect();
      const px = (xScale(row.num) / CHART.w) * rect.width;
      const py = (yScale(row.endBalance) / CHART.h) * rect.height;

      el.tooltip.innerHTML = `
        <div class="t-title">Payment #${row.num} \u00b7 ${formatDate(row.date)}</div>
        <div class="t-row"><span>Principal paid</span><b>${currency(row.cumPrincipal)}</b></div>
        <div class="t-row"><span>Interest paid</span><b>${currency(row.cumInterest)}</b></div>
        <div class="t-row"><span>Remaining balance</span><b>${currency(row.endBalance)}</b></div>`;
      el.tooltip.style.left = `${px}px`;
      el.tooltip.style.top = `${py}px`;
      el.tooltip.classList.add("visible");
      return row;
    }

    svg.addEventListener("mousemove", (evt) => {
      showTooltipForNum(pointFromEvent(evt));
    });

    svg.addEventListener("mouseleave", () => {
      hoverLine.style.display = "none";
      el.tooltip.classList.remove("visible");
    });

    let keyboardNum = 1;
    hoverRect.setAttribute("tabindex", "0");
    hoverRect.setAttribute("role", "slider");
    hoverRect.setAttribute("aria-label", "Chart: loan balance and payoff progress by payment number");
    hoverRect.setAttribute("aria-valuemin", "1");
    hoverRect.setAttribute("aria-valuemax", String(maxNum));
    function showKeyboardTooltip() {
      const row = showTooltipForNum(keyboardNum);
      hoverRect.setAttribute("aria-valuenow", String(row.num));
      hoverRect.setAttribute(
        "aria-valuetext",
        `Payment #${row.num}, ${formatDate(row.date)}. Principal paid ${currency(row.cumPrincipal)}. Interest paid ${currency(row.cumInterest)}. Remaining balance ${currency(row.endBalance)}.`
      );
    }
    hoverRect.addEventListener("focus", showKeyboardTooltip);
    hoverRect.addEventListener("blur", () => {
      hoverLine.style.display = "none";
      el.tooltip.classList.remove("visible");
    });
    hoverRect.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        keyboardNum = Math.min(maxNum, keyboardNum + 1);
        showKeyboardTooltip();
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        keyboardNum = Math.max(1, keyboardNum - 1);
        showKeyboardTooltip();
        e.preventDefault();
      } else if (e.key === "Home") {
        keyboardNum = 1;
        showKeyboardTooltip();
        e.preventDefault();
      } else if (e.key === "End") {
        keyboardNum = maxNum;
        showKeyboardTooltip();
        e.preventDefault();
      }
    });
  }

  function linePathD(points) {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
  }

  function areaPath(topPoints, basePoints, fill, stroke) {
    const top = topPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
    const baseRev = [...basePoints].reverse();
    const bottom = baseRev.map((p) => `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `${top} ${bottom} Z`);
    path.setAttribute("fill", fill);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", "1.5");
    return path;
  }

  // ---------- event wiring ----------
  el.loanAmountInput.addEventListener("input", (e) => {
    state.loanAmountStr = formatNumberInput(e.target.value);
    e.target.value = state.loanAmountStr;
    render();
    saveLcInputs();
  });

  el.rateInput.addEventListener("input", (e) => {
    state.rate = e.target.value;
    render();
    saveLcInputs();
  });

  el.termInput.addEventListener("input", (e) => {
    state.termValue = e.target.value;
    render();
    saveLcInputs();
  });

  el.startDateInput.addEventListener("input", (e) => {
    state.startDate = e.target.value;
    render();
    saveLcInputs();
  });

  el.termToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".seg-btn");
    if (!btn) return;
    const unit = btn.dataset.unit;
    if (unit === state.termUnit) return;
    const v = Number(state.termValue) || 0;
    state.termValue = unit === "months" ? Math.round(v * 12) : Math.round((v / 12) * 100) / 100;
    state.termUnit = unit;
    syncTermUI();
    render();
    saveLcInputs();
  });

  el.extraToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".scenario-btn");
    if (!btn || btn.classList.contains("active")) return;
    state.extraAmt = Number(btn.dataset.amt);
    el.extraToggle.querySelectorAll(".scenario-btn").forEach((b) => b.classList.toggle("active", b === btn));
    render();
    saveLcInputs();
  });

  el.refiPaymentsInput.addEventListener("input", (e) => {
    state.refiPaymentsMade = Number(e.target.value) || 0;
    render();
    saveLcInputs();
  });

  el.refiRateInput.addEventListener("input", (e) => {
    state.refiRate = e.target.value;
    render();
    saveLcInputs();
  });

  el.refiFeesInput.addEventListener("input", (e) => {
    state.refiFeesStr = formatNumberInput(e.target.value);
    e.target.value = state.refiFeesStr;
    render();
    saveLcInputs();
  });

  el.ledgerToggle.addEventListener("click", () => {
    state.tableOpen = !state.tableOpen;
    el.tableWrap.hidden = !state.tableOpen;
    el.ledgerToggle.classList.toggle("open", state.tableOpen);
    el.toggleLabel.textContent = state.tableOpen ? "collapse \u25b2" : "view all \u25be";
    if (state.tableOpen) renderTable(currentSchedule);
  });

  function syncTermUI() {
    el.termInput.value = state.termValue;
    el.termUnitLabel.textContent = state.termUnit;
    el.termToggle.querySelectorAll(".seg-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.unit === state.termUnit);
    });
  }

  // ---------- init ----------
  function init() {
    loadLcInputs();
    el.loanAmountInput.value = state.loanAmountStr;
    el.rateInput.value = state.rate;
    el.startDateInput.value = state.startDate;
    syncTermUI();

    // Default the refinance rate a point below the loan's own rate the
    // first time (nothing saved yet) so the comparison shows something
    // meaningful immediately, instead of an unset field with no signal.
    if (state.refiRate === null) state.refiRate = Math.max(0, (Number(state.rate) || 0) - 1);
    el.refiPaymentsInput.value = state.refiPaymentsMade;
    el.refiRateInput.value = state.refiRate;
    el.refiFeesInput.value = formatNumberInput(state.refiFeesStr || "0");
    el.extraToggle.querySelectorAll(".scenario-btn").forEach((b) => {
      b.classList.toggle("active", Number(b.dataset.amt) === state.extraAmt);
    });

    render();
    window.addEventListener("resize", render);
    // the chart's line/area colors are set as fixed SVG attributes at draw
    // time (not live CSS), so a theme switch needs an explicit redraw
    document.addEventListener("fn-theme-change", render);
  }

  init();
})();
