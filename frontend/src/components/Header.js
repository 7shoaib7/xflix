import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import UploadDialog from "./UploadDialog";
import "./Header.css";

// When `onSearchChange` is given the search is live (landing page);
// otherwise pressing Enter takes the visitor to the landing page with the query.
const Header = ({ search, onSearchChange, onUploaded }) => {
  const history = useHistory();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const live = typeof onSearchChange === "function";
  const value = live ? search : draft;

  const handleChange = (event) => {
    if (live) onSearchChange(event.target.value);
    else setDraft(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (live) return;
    const q = draft.trim();
    history.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <header className="site-header">
      <Link to="/" className="logo" aria-label="XFlix home">
        <span className="logo-x" aria-hidden="true">X</span>
        <span aria-hidden="true">Flix</span>
      </Link>

      <form role="search" className="search" onSubmit={handleSubmit}>
        <SearchRoundedIcon className="search-icon" fontSize="small" aria-hidden="true" />
        <label htmlFor="site-search" className="sr-only">
          Search videos
        </label>
        <input
          id="site-search"
          type="search"
          placeholder="Search titles"
          autoComplete="off"
          value={value}
          onChange={handleChange}
        />
      </form>

      <button
        id="upload-btn"
        type="button"
        className="btn btn-accent upload-btn"
        aria-label="Upload video"
        onClick={() => setUploadOpen(true)}
      >
        <FileUploadOutlinedIcon fontSize="small" aria-hidden="true" />
        <span className="upload-btn-label">Upload</span>
      </button>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={onUploaded}
      />
    </header>
  );
};

export default Header;
