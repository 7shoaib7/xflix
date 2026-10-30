import React from "react";
import { AGE_GROUPS, GENRES } from "../utils";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import SortMenu from "./SortMenu";
import "./FilterBar.css";

const AGE_OPTIONS = [{ label: "Any age", value: "" }, ...AGE_GROUPS.map((a) => ({ label: a, value: a }))];

const SORT_OPTIONS = [
  { value: "releaseDate", label: "Release date", hint: "Newest first", icon: ScheduleRoundedIcon, id: "release-date-option" },
  { value: "viewCount", label: "Most viewed", hint: "Highest views first", icon: LocalFireDepartmentRoundedIcon, id: "view-count-option" },
];

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

      <SortMenu options={SORT_OPTIONS} value={sort} onChange={onSortChange} />
    </div>
  </nav>
);

export default FilterBar;
