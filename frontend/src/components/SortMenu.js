import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import "./SortMenu.css";

let uid = 0;

// Custom listbox for "Sort by": matches the XFlix dark theme, works with the keyboard
// (arrows, Home/End, Enter/Space, Escape, type-ahead) and is announced as a listbox.
const SortMenu = ({ label = "Sort by", options, value, onChange }) => {
  const id = useRef(`sort-${++uid}`).current;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];
  const SelectedIcon = selected.icon;

  const openMenu = () => {
    setActive(selectedIndex);
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };
  const choose = (index) => {
    onChange(options[index].value);
    close();
  };

  // Move focus synchronously so fast key presses go to the open list.
  useLayoutEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onListKey = (e) => {
    const last = options.length - 1;
    const keys = {
      ArrowDown: () => setActive((i) => (i >= last ? 0 : i + 1)),
      ArrowUp: () => setActive((i) => (i <= 0 ? last : i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: () => close(),
    };
    if (keys[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      keys[e.key]();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const match = options.findIndex((o, i) => i > active && o.label.toLowerCase().startsWith(k));
      const first = options.findIndex((o) => o.label.toLowerCase().startsWith(k));
      if (match !== -1 || first !== -1) setActive(match !== -1 ? match : first);
    }
  };

  return (
    <div className={`sort-menu ${open ? "is-open" : ""}`} ref={rootRef}>
      <span className="sort-menu-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        className="sort-menu-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu();
          }
        }}
      >
        {SelectedIcon && <SelectedIcon className="sort-menu-lead" fontSize="inherit" />}
        <span id={`${id}-value`} className="sort-menu-value">
          {selected.label}
        </span>
        <ExpandMoreRoundedIcon className="sort-menu-chevron" fontSize="inherit" />
      </button>
      {open && (
        <ul
          ref={listRef}
          className="sort-menu-list"
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const OptionIcon = o.icon;
            return (
              <li
                key={o.value}
                id={o.id || `${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                className={`sort-menu-option ${i === active ? "is-active" : ""} ${isSelected ? "is-selected" : ""}`}
                onPointerMove={() => i !== active && setActive(i)}
                onClick={() => choose(i)}
              >
                <span className="sort-menu-icon">{OptionIcon && <OptionIcon fontSize="inherit" />}</span>
                <span className="sort-menu-text">
                  {o.label}
                  {o.hint && <span className="sort-menu-hint">{o.hint}</span>}
                </span>
                {isSelected && <CheckRoundedIcon className="sort-menu-check" fontSize="inherit" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SortMenu;
