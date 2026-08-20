import React, { useMemo, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const currency = (n, opts = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(n);

const compactCurrency = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

function addMonths(date, months) {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
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

export default function LoanLedger() {
  const [loanAmountStr, setLoanAmountStr] = useState("500,000");
  const [rate, setRate] = useState(6.5);
  const [termUnit, setTermUnit] = useState("years"); // "years" | "months"
  const [termValue, setTermValue] = useState(30);
  const [startDate, setStartDate] = useState("2026-08-08");
  const [tableOpen, setTableOpen] = useState(false);

  const loanAmount = useMemo(() => parseFormattedNumber(loanAmountStr), [loanAmountStr]);

  const handleLoanAmountChange = (e) => {
    setLoanAmountStr(formatNumberInput(e.target.value));
  };

  const switchTermUnit = (unit) => {
    if (unit === termUnit) return;
    const v = Number(termValue) || 0;
    if (unit === "months") {
      setTermValue(Math.round(v * 12));
    } else {
      setTermValue(Math.round((v / 12) * 100) / 100);
    }
    setTermUnit(unit);
  };

  const termYears = termUnit === "years" ? Number(termValue) || 0 : (Number(termValue) || 0) / 12;

  const schedule = useMemo(() => {
    const P = Number(loanAmount) || 0;
    const n = Math.round((Number(termYears) || 0) * 12);
    const r = (Number(rate) || 0) / 100 / 12;
    if (P <= 0 || n <= 0) return { rows: [], payment: 0, totalInterest: 0, crossover: null };

    const payment =
      r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n));

    let balance = P;
    let cumPrincipal = 0;
    let cumInterest = 0;
    let crossover = null;
    const rows = [];
    const base = new Date(startDate);

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
        totalPaid: cumPrincipal + cumInterest,
      });
    }

    return {
      rows,
      payment,
      totalInterest: cumInterest,
      crossover,
      payoffDate: rows.length ? rows[rows.length - 1].date : null,
    };
  }, [loanAmount, rate, termYears, startDate]);

  const totalCost = (Number(loanAmount) || 0) + schedule.totalInterest;

  // Downsample for the chart so 360+ points still render crisply
  const chartData = useMemo(() => {
    const rows = schedule.rows;
    if (rows.length <= 120) return rows;
    const step = Math.ceil(rows.length / 120);
    const out = rows.filter((_, i) => i % step === 0 || i === rows.length - 1);
    return out;
  }, [schedule.rows]);

  const crossoverRow = schedule.crossover
    ? schedule.rows.find((r) => r.num === schedule.crossover)
    : null;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#F6F3EC",
        minHeight: "100%",
        color: "#26221C",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .ll-num { font-family: 'IBM Plex Mono', monospace; font-variant-numeric: tabular-nums; }
        .ll-input {
          font-family: 'IBM Plex Mono', monospace;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #C9BFA8;
          outline: none;
          font-size: 1.05rem;
          padding: 4px 2px;
          width: 100%;
          color: #26221C;
          transition: border-color 0.15s ease;
        }
        .ll-input:focus { border-bottom-color: #A8823D; }
        .ll-row:hover { background: #FBF9F4 !important; }
        .ll-table-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .ll-table-scroll::-webkit-scrollbar-thumb { background: #D8CFB9; border-radius: 4px; }
        .ll-toggle:hover { opacity: 0.8; }
      `}</style>

      {/* HERO */}
      <div style={{ background: "#1B2129", color: "#F6F3EC", padding: "56px 24px 64px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#A8823D",
              marginBottom: 14,
            }}
          >
            Amortization &middot; Ledger No. 001
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "clamp(2.1rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            What this loan really costs you.
          </h1>
          <p
            style={{
              maxWidth: 560,
              marginTop: 16,
              fontSize: "1.02rem",
              lineHeight: 1.55,
              color: "#C9C2B4",
            }}
          >
            Adjust the terms below. Every payment, every dollar of interest, laid
            out month by month &mdash; the same way a bank sees it.
          </p>

          <div
            style={{
              marginTop: 40,
              display: "flex",
              gap: "clamp(24px, 6vw, 64px)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8C8672" }}>
                Monthly payment
              </div>
              <div
                className="ll-num"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#EFE9DA", marginTop: 4 }}
              >
                {schedule.payment ? currency(schedule.payment) : "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8C8672" }}>
                Total interest
              </div>
              <div className="ll-num" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#C97B5E", marginTop: 4 }}>
                {schedule.totalInterest ? currency(schedule.totalInterest) : "—"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8C8672" }}>
                Total cost of loan
              </div>
              <div className="ll-num" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#8FA593", marginTop: 4 }}>
                {totalCost ? currency(totalCost) : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* INPUTS */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4DFD3",
            borderRadius: 10,
            padding: "28px 28px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px 32px",
            marginTop: -80,
            boxShadow: "0 12px 32px -18px rgba(27,33,41,0.35)",
            position: "relative",
          }}
        >
          <label>
            <div style={{ fontSize: "0.78rem", color: "#79725F", marginBottom: 6 }}>Loan amount</div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span className="ll-num" style={{ color: "#A8823D", marginRight: 2 }}>$</span>
              <input
                className="ll-input"
                type="text"
                inputMode="decimal"
                value={loanAmountStr}
                onChange={handleLoanAmountChange}
                placeholder="0"
              />
            </div>
          </label>

          <label>
            <div style={{ fontSize: "0.78rem", color: "#79725F", marginBottom: 6 }}>Annual interest rate</div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <input
                className="ll-input"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                step="0.05"
              />
              <span className="ll-num" style={{ color: "#A8823D", marginLeft: 2 }}>%</span>
            </div>
          </label>

          <label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "#79725F" }}>Loan period</div>
              <div
                style={{
                  display: "flex",
                  border: "1px solid #E4DFD3",
                  borderRadius: 999,
                  overflow: "hidden",
                  fontSize: "0.68rem",
                }}
              >
                {["years", "months"].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => switchTermUnit(u)}
                    className="ll-num"
                    style={{
                      border: "none",
                      cursor: "pointer",
                      padding: "3px 10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: termUnit === u ? "#1B2129" : "transparent",
                      color: termUnit === u ? "#F6F3EC" : "#9A9280",
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}
                  >
                    {u === "years" ? "Yrs" : "Mos"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <input
                className="ll-input"
                type="number"
                value={termValue}
                onChange={(e) => setTermValue(e.target.value)}
                min={termUnit === "years" ? "0.5" : "1"}
                step={termUnit === "years" ? "1" : "1"}
              />
              <span className="ll-num" style={{ color: "#A8823D", marginLeft: 6, fontSize: "0.85rem" }}>
                {termUnit}
              </span>
            </div>
          </label>

          <label>
            <div style={{ fontSize: "0.78rem", color: "#79725F", marginBottom: 6 }}>Start date</div>
            <input
              className="ll-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div>

        {/* STAT STRIP */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 1,
            background: "#E4DFD3",
            marginTop: 20,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #E4DFD3",
          }}
        >
          {[
            ["Number of payments", schedule.rows.length || "—", "#26221C"],
            ["Payoff date", schedule.payoffDate ? formatDate(schedule.payoffDate) : "—", "#26221C"],
            [
              "Principal / interest split",
              schedule.rows.length
                ? `${Math.round(((Number(loanAmount) || 0) / totalCost) * 100)}% / ${Math.round(
                    (schedule.totalInterest / totalCost) * 100
                  )}%`
                : "—",
              "#26221C",
            ],
            [
              "Interest overtakes principal",
              schedule.crossover
                ? `payment #${schedule.crossover}`
                : "—",
              "#A8823D",
            ],
          ].map(([label, value], i) => (
            <div key={i} style={{ background: "#FFFFFF", padding: "18px 20px" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9280" }}>
                {label}
              </div>
              <div className="ll-num" style={{ fontSize: "1.15rem", marginTop: 6, color: value ? "#26221C" : "#26221C" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* SIGNATURE CHART */}
        <div
          style={{
            marginTop: 40,
            background: "#FFFFFF",
            border: "1px solid #E4DFD3",
            borderRadius: 10,
            padding: "26px 20px 12px",
          }}
        >
          <div style={{ padding: "0 8px", marginBottom: 4 }}>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              The burn-down
            </div>
            <p style={{ color: "#79725F", fontSize: "0.88rem", marginTop: 4, maxWidth: 620 }}>
              Your balance falls in a straight-looking line, but what you're actually
              paying down shifts underneath it &mdash; mostly interest at first, mostly
              principal by the end.
            </p>
          </div>
          <div style={{ width: "100%", height: 320, marginTop: 12 }}>
            <ResponsiveContainer>
              <ComposedChart data={chartData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="principalFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8FA593" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#8FA593" stopOpacity={0.08} />
                  </linearGradient>
                  <linearGradient id="interestFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C97B5E" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#C97B5E" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EFEAE0" vertical={false} />
                <XAxis
                  dataKey="num"
                  tickFormatter={(v) => `Yr ${Math.round(v / 12)}`}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11, fill: "#9A9280", fontFamily: "IBM Plex Mono, monospace" }}
                  axisLine={{ stroke: "#E4DFD3" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => compactCurrency(v)}
                  tick={{ fontSize: 11, fill: "#9A9280", fontFamily: "IBM Plex Mono, monospace" }}
                  axisLine={false}
                  tickLine={false}
                  width={54}
                />
                <Tooltip
                  formatter={(v, name) => [currency(v), name]}
                  labelFormatter={(v) => `Payment #${v}`}
                  contentStyle={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    border: "1px solid #E4DFD3",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="cumPrincipal"
                  name="Principal paid"
                  stackId="a"
                  stroke="#5B7A6A"
                  fill="url(#principalFill)"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="cumInterest"
                  name="Interest paid"
                  stackId="a"
                  stroke="#9C4A3D"
                  fill="url(#interestFill)"
                  strokeWidth={1.5}
                />
                <Line
                  type="monotone"
                  dataKey="endBalance"
                  name="Remaining balance"
                  stroke="#1B2129"
                  strokeWidth={2}
                  dot={false}
                />
                {crossoverRow && (
                  <ReferenceLine
                    x={crossoverRow.num}
                    stroke="#A8823D"
                    strokeDasharray="4 3"
                    label={{
                      value: `crossover · payment ${crossoverRow.num}`,
                      position: "top",
                      fill: "#A8823D",
                      fontSize: 11,
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", padding: "4px 8px 18px", fontSize: "0.8rem", color: "#79725F" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#5B7A6A", borderRadius: 2, marginRight: 6 }} />Principal paid</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#9C4A3D", borderRadius: 2, marginRight: 6 }} />Interest paid</span>
            <span><span style={{ display: "inline-block", width: 10, height: 2, background: "#1B2129", marginRight: 6, position: "relative", top: -3 }} />Remaining balance</span>
          </div>
        </div>

        {/* LEDGER TABLE */}
        <div
          style={{
            marginTop: 40,
            background: "#FFFFFF",
            border: "1px solid #E4DFD3",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            className="ll-toggle"
            onClick={() => setTableOpen((o) => !o)}
            style={{
              cursor: "pointer",
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: tableOpen ? "1px solid #E4DFD3" : "none",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.25rem" }}>
                Payment schedule
              </div>
              <div style={{ color: "#79725F", fontSize: "0.85rem", marginTop: 2 }}>
                {schedule.rows.length} payments, {formatDate(schedule.rows[0]?.date || new Date())} through{" "}
                {schedule.payoffDate ? formatDate(schedule.payoffDate) : "—"}
              </div>
            </div>
            <div className="ll-num" style={{ fontSize: "0.85rem", color: "#A8823D" }}>
              {tableOpen ? "collapse ▲" : "view all ▾"}
            </div>
          </div>

          {tableOpen && (
            <div className="ll-table-scroll" style={{ maxHeight: 480, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                <thead style={{ position: "sticky", top: 0, background: "#1B2129", color: "#C9C2B4", zIndex: 1 }}>
                  <tr>
                    {["No.", "Date", "Beginning", "Payment", "Principal", "Interest", "Ending"].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          textAlign: i === 0 || i === 1 ? "left" : "right",
                          padding: "10px 16px",
                          fontWeight: 500,
                          fontSize: "0.72rem",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.rows.map((r) => (
                    <tr
                      key={r.num}
                      className="ll-row"
                      style={{
                        background: r.num % 2 ? "#FBF9F4" : "#FFFFFF",
                        borderBottom: "1px solid #F0ECE1",
                      }}
                    >
                      <td className="ll-num" style={{ padding: "8px 16px", color: "#9A9280" }}>{r.num}</td>
                      <td className="ll-num" style={{ padding: "8px 16px" }}>{formatDate(r.date)}</td>
                      <td className="ll-num" style={{ padding: "8px 16px", textAlign: "right" }}>{currency(r.beginBalance)}</td>
                      <td className="ll-num" style={{ padding: "8px 16px", textAlign: "right" }}>{currency(r.payment)}</td>
                      <td className="ll-num" style={{ padding: "8px 16px", textAlign: "right", color: "#5B7A6A" }}>{currency(r.principal)}</td>
                      <td className="ll-num" style={{ padding: "8px 16px", textAlign: "right", color: "#9C4A3D" }}>{currency(r.interest)}</td>
                      <td className="ll-num" style={{ padding: "8px 16px", textAlign: "right", fontWeight: 600 }}>{currency(r.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 36, fontSize: "0.78rem", color: "#9A9280" }}>
          Figures are estimates &middot; assumes fixed rate, no extra payments, no fees.
        </div>
      </div>
    </div>
  );
}
