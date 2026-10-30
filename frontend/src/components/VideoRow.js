import React, { useEffect, useRef, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";
import "./VideoRow.css";

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const VideoRow = ({ title, videos, onSeeAll }) => {
  const trackRef = useRef(null);
  const [overflows, setOverflows] = useState(false);
  const headingId = `row-${slug(title)}`;

  // Only offer scroll arrows when the row is wider than the screen.
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (track) setOverflows(track.scrollWidth > track.clientWidth + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [videos.length]);

  const scroll = (direction) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="video-row" aria-labelledby={headingId}>
      <div className="video-row-head">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
        <div className="video-row-actions">
          {onSeeAll && (
            <button type="button" className="link-btn" onClick={onSeeAll}>
              See all<span className="sr-only"> {title}</span>
            </button>
          )}
          {overflows && (
            <>
              <button
                type="button"
                className="icon-btn video-row-arrow"
                aria-label={`Scroll ${title} back`}
                onClick={() => scroll(-1)}
              >
                <ChevronLeftRoundedIcon />
              </button>
              <button
                type="button"
                className="icon-btn video-row-arrow"
                aria-label={`Scroll ${title} forward`}
                onClick={() => scroll(1)}
              >
                <ChevronRightRoundedIcon />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="video-row-track" ref={trackRef}>
        {videos.map((video) => (
          <div className="video-row-item" key={video._id}>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
};

export const VideoRowSkeleton = () => (
  <div className="video-row" aria-hidden="true">
    <span className="skeleton skeleton-line" style={{ width: 180, height: 22 }} />
    <div className="video-row-track">
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="video-row-item" key={i}>
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

export default VideoRow;
