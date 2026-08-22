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
  };

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
    linePath.setAttribute("stroke", "#1B2129");
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
    svg.appendChild(hoverRect);

    const hoverLine = document.createElementNS(SVG_NS, "line");
    hoverLine.setAttribute("y1", CHART.padT);
    hoverLine.setAttribute("y2", CHART.h - CHART.padB);
    hoverLine.setAttribute("stroke", "#26221C");
    hoverLine.setAttribute("stroke-opacity", "0.25");
    hoverLine.setAttribute("stroke-width", "1");
    hoverLine.style.display = "none";
    svg.appendChild(hoverLine);

    function pointFromEvent(evt) {
      const rect = svg.getBoundingClientRect();
      const px = ((evt.clientX - rect.left) / rect.width) * CHART.w;
      const num = Math.round(1 + ((px - CHART.padL) / plotW) * (maxNum - 1));
      const clamped = Math.max(1, Math.min(maxNum, num));
      // nearest row in full-resolution schedule
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

    svg.addEventListener("mousemove", (evt) => {
      const row = pointFromEvent(evt);
      if (!row) return;
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
    });

    svg.addEventListener("mouseleave", () => {
      hoverLine.style.display = "none";
      el.tooltip.classList.remove("visible");
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
  });

  el.rateInput.addEventListener("input", (e) => {
    state.rate = e.target.value;
    render();
  });

  el.termInput.addEventListener("input", (e) => {
    state.termValue = e.target.value;
    render();
  });

  el.startDateInput.addEventListener("input", (e) => {
    state.startDate = e.target.value;
    render();
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
    el.loanAmountInput.value = state.loanAmountStr;
    el.rateInput.value = state.rate;
    el.startDateInput.value = state.startDate;
    syncTermUI();
    render();
    window.addEventListener("resize", render);
  }

  init();
})();
