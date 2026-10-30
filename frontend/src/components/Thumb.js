import React, { useEffect, useState } from "react";
import { posterColour, shortTitle } from "../utils";
import "./VideoCard.css";

// Thumbnail image that steps through fallback sources, ending in a coloured poster.
const Thumb = ({ title = "", sources = [], className = "" }) => {
  const key = sources.join("|");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [key]);

  const src = sources[index];
  if (!src) {
    return (
      <span
        className={`thumb thumb-poster ${className}`}
        style={{ backgroundColor: posterColour(title) }}
        aria-hidden="true"
      >
        <span className="thumb-poster-text">{shortTitle(title) || "XFlix"}</span>
      </span>
    );
  }

  return (
    <img
      className={`thumb ${className}`}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setIndex((i) => i + 1)}
    />
  );
};

export default Thumb;
