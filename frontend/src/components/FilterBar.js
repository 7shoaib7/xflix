import React from "react";
import { AGE_GROUPS, GENRES } from "../utils";
import "./FilterBar.css";

const AGE_OPTIONS = [{ label: "Any age", value: "" }, ...AGE_GROUPS.map((a) => ({ label: a, value: a }))];

const FilterBar = ({
  counts,
  total,
  genres,
  onToggleGenre,
  onAllGenres,
  age,
  onAgeChange,
  sort,
  onSortChange,
}) => (
  <nav className="filter-bar" aria-label="Filters">
    <div className="chip-row" role="group" aria-label="Genre">
      <button
        type="button"
        className={`chip ${genres.length === 0 ? "is-active" : ""}`}
        aria-pressed={genres.length === 0}
        onClick={onAllGenres}
      >
        All <span className="chip-count">{total}</span>
      </button>
      {GENRES.map((genre) => {
        const active = genres.includes(genre);
        return (
          <button
            key={genre}
            type="button"
            className={`chip ${active ? "is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onToggleGenre(genre)}
          >
            {genre} <span className="chip-count">{counts[genre] || 0}</span>
          </button>
        );
      })}
    </div>

    <div className="filter-tools">
      <div className="segmented" role="group" aria-label="Age group">
        {AGE_OPTIONS.map((option) => {
          const active = age === option.value;
          return (
            <button
              key={option.label}
              type="button"
              className={`segmented-btn ${active ? "is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onAgeChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className="sort">
        <span className="sort-label">Sort by</span>
        <select
          className="sort-select"
          name="sortBy"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option id="release-date-option" value="releaseDate">
            Release date
          </option>
          <option id="view-count-option" value="viewCount">
            Most viewed
          </option>
        </select>
      </label>
    </div>
  </nav>
);

export default FilterBar;
