import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import moment from "moment";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import "./DatePicker.css";

const pad = (n) => String(n).padStart(2, "0");
// Dates are kept as local "YYYY-MM-DD" strings so time zones never shift the day.
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (key) => {
  const [y, m, d] = (key || "").split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
};
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
const sameDay = (a, b) => a && b && toKey(a) === toKey(b);

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = moment.monthsShort();
const POP_WIDTH = 320;
const GAP = 8;

const DatePicker = ({ id, value, onChange, max, invalid, describedBy, placeholder = "Pick a date" }) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const maxDate = fromKey(max);
  const selected = fromKey(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("days");
  const [cursor, setCursor] = useState(selected || today);
  const [pos, setPos] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const popRef = useRef(null);
  const gridRef = useRef(null);

  const isDisabled = (d) => Boolean(max && toKey(d) > max);
  const afterMax = (y, m) => Boolean(maxDate && (y > maxDate.getFullYear() || (y === maxDate.getFullYear() && m > maxDate.getMonth())));

  const place = useCallback(() => {
    const t = triggerRef.current?.getBoundingClientRect();
    const pop = popRef.current;
    if (!t || !pop) return;
    const h = pop.offsetHeight;
    const width = Math.min(POP_WIDTH, window.innerWidth - GAP * 2);
    const left = Math.min(Math.max(GAP, t.left), window.innerWidth - width - GAP);
    const below = window.innerHeight - t.bottom - GAP;
    const above = t.top - GAP;
    const top = below >= h || below >= above ? Math.min(t.bottom + GAP, window.innerHeight - h - GAP) : Math.max(GAP, t.top - GAP - h);
    setPos({ top: Math.max(GAP, top), left, width });
  }, []);

  const show = () => {
    setCursor(selected || (maxDate && today > maxDate ? maxDate : today));
    setView("days");
    setPos(null);
    setOpen(true);
  };
  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };
  const pick = (d) => {
    if (isDisabled(d)) return;
    onChange(toKey(d));
    close();
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open, view, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false);
    };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, place]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep keyboard focus on the highlighted day (or month/year), once the popover is placed.
  const placed = Boolean(pos);
  useLayoutEffect(() => {
    if (!open || !placed) return;
    if (view === "days") gridRef.current?.querySelector('[data-cursor="true"]')?.focus();
    else popRef.current?.querySelector(".dp-cell.is-current:not(:disabled), .dp-cell:not(:disabled)")?.focus();
  }, [open, placed, view, cursor]);

  const onGridKey = (e) => {
    const moves = {
      ArrowLeft: () => addDays(cursor, -1),
      ArrowRight: () => addDays(cursor, 1),
      ArrowUp: () => addDays(cursor, -7),
      ArrowDown: () => addDays(cursor, 7),
      Home: () => addDays(cursor, -cursor.getDay()),
      End: () => addDays(cursor, 6 - cursor.getDay()),
      PageUp: () => addMonths(cursor, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(cursor, e.shiftKey ? 12 : 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      const next = moves[e.key]();
      setCursor(maxDate && next > maxDate ? maxDate : next);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(cursor);
    }
  };

  const onPopKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't close the upload dialog too
      if (view !== "days") setView("days");
      else close();
    }
  };

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const start = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const decade = Math.floor(year / 12) * 12;

  const header = {
    days: {
      title: moment(cursor).format("MMMM YYYY"),
      label: "Choose month and year",
      onTitle: () => setView("years"),
      prev: () => setCursor(addMonths(cursor, -1)),
      next: () => setCursor(addMonths(cursor, 1)),
      nextDisabled: afterMax(month === 11 ? year + 1 : year, (month + 1) % 12),
      unit: "month",
    },
    months: {
      title: String(year),
      label: "Choose year",
      onTitle: () => setView("years"),
      prev: () => setCursor(addMonths(cursor, -12)),
      next: () => setCursor(addMonths(cursor, 12)),
      nextDisabled: afterMax(year + 1, 0),
      unit: "year",
    },
    years: {
      title: `${decade} – ${decade + 11}`,
      label: "Back to days",
      onTitle: () => setView("days"),
      prev: () => setCursor(addMonths(cursor, -144)),
      next: () => setCursor(addMonths(cursor, 144)),
      nextDisabled: afterMax(decade + 12, 0),
      unit: "12 years",
    },
  }[view];

  return (
    <div className={`dp ${open ? "is-open" : ""}`} ref={rootRef} onKeyDown={open ? onPopKey : undefined}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={`dp-trigger ${invalid ? "is-invalid" : ""} ${selected ? "" : "is-empty"}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={describedBy}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            show();
          }
        }}
      >
        <CalendarTodayRoundedIcon className="dp-trigger-icon" fontSize="inherit" />
        <span className="dp-trigger-text">{selected ? moment(selected).format("ddd, D MMM YYYY") : placeholder}</span>
        <ExpandMoreRoundedIcon className="dp-trigger-chevron" fontSize="inherit" />
      </button>

      {open && (
        <div
          ref={popRef}
          className="dp-pop"
          role="dialog"
          aria-modal="false"
          aria-label="Choose release date"
          style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { opacity: 0, top: 0, left: 0 }}
        >
          <div className="dp-head">
            <button type="button" className="dp-title" onClick={header.onTitle} aria-label={`${header.title}. ${header.label}`}>
              {header.title}
              <ExpandMoreRoundedIcon className={`dp-title-chevron ${view !== "days" ? "is-up" : ""}`} fontSize="inherit" />
            </button>
            <div className="dp-nav">
              <button type="button" className="dp-nav-btn" onClick={header.prev} aria-label={`Previous ${header.unit}`}>
                <ChevronLeftRoundedIcon fontSize="inherit" />
              </button>
              <button
                type="button"
                className="dp-nav-btn"
                onClick={header.next}
                disabled={header.nextDisabled}
                aria-label={`Next ${header.unit}`}
              >
                <ChevronRightRoundedIcon fontSize="inherit" />
              </button>
            </div>
          </div>

          {view === "days" && (
            <div className="dp-days" role="grid" aria-label={moment(cursor).format("MMMM YYYY")} ref={gridRef} onKeyDown={onGridKey}>
              <div className="dp-week dp-weekdays" role="row">
                {WEEKDAYS.map((w) => (
                  <span key={w} role="columnheader" className="dp-weekday">
                    {w}
                  </span>
                ))}
              </div>
              {[0, 1, 2, 3, 4, 5].map((row) => (
                <div className="dp-week" role="row" key={row}>
                  {days.slice(row * 7, row * 7 + 7).map((d) => {
                    const isCursor = sameDay(d, cursor);
                    const classes = [
                      "dp-day",
                      d.getMonth() !== month && "is-outside",
                      sameDay(d, today) && "is-today",
                      sameDay(d, selected) && "is-selected",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <span role="gridcell" key={toKey(d)} aria-selected={sameDay(d, selected)}>
                        <button
                          type="button"
                          className={classes}
                          tabIndex={isCursor ? 0 : -1}
                          data-cursor={isCursor}
                          disabled={isDisabled(d)}
                          aria-label={moment(d).format("dddd, D MMMM YYYY") + (sameDay(d, today) ? ", today" : "")}
                          aria-current={sameDay(d, today) ? "date" : undefined}
                          onClick={() => pick(d)}
                        >
                          {d.getDate()}
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {view === "months" && (
            <div className="dp-grid3">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  className={`dp-cell ${i === month ? "is-current" : ""}`}
                  disabled={afterMax(year, i)}
                  onClick={() => {
                    setCursor(addMonths(cursor, i - month));
                    setView("days");
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {view === "years" && (
            <div className="dp-grid3">
              {Array.from({ length: 12 }, (_, i) => decade + i).map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`dp-cell ${y === year ? "is-current" : ""}`}
                  disabled={afterMax(y, 0)}
                  onClick={() => {
                    const next = addMonths(cursor, (y - year) * 12);
                    setCursor(maxDate && next > maxDate ? maxDate : next);
                    setView("months");
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          <div className="dp-foot">
            <button
              type="button"
              className="dp-link"
              onClick={() => {
                onChange("");
                close();
              }}
            >
              Clear
            </button>
            <button type="button" className="dp-today" disabled={isDisabled(today)} onClick={() => pick(today)}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
