import React from "react";
import { Link } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Thumb from "./Thumb";
import { formatViews, largeThumbnails, timeAgo, yearOf } from "../utils";
import "./Hero.css";

const Hero = ({ featured, mostViewed, onGenre }) => (
  <section className="hero" aria-labelledby="hero-title">
    <div className="hero-feature">
      <Thumb title={featured.title} sources={largeThumbnails(featured.previewImage)} className="hero-img" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-tags">
          <span className="tag tag-accent">Newest</span>
          <span>{featured.genre}</span>
          <span aria-hidden="true">·</span>
          <span>{featured.contentRating}</span>
          <span aria-hidden="true">·</span>
          <span>{yearOf(featured.releaseDate)}</span>
        </div>
        <h1 id="hero-title" className="hero-title">
          {featured.title}
        </h1>
        <p className="hero-meta">
          {formatViews(featured.viewCount)} · released {timeAgo(featured.releaseDate)}
        </p>
        <div className="hero-actions">
          <Link to={`/video/${featured._id}`} className="btn btn-light">
            <PlayArrowRoundedIcon aria-hidden="true" />
            Watch now
          </Link>
          <button type="button" className="btn btn-outline" onClick={() => onGenre(featured.genre)}>
            More {featured.genre}
          </button>
        </div>
      </div>
    </div>

    <aside className="most-viewed" aria-labelledby="most-viewed-title">
      <h2 id="most-viewed-title" className="most-viewed-title">
        Most viewed
      </h2>
      <ol className="most-viewed-list">
        {mostViewed.map((video, index) => (
          <li key={video._id}>
            <Link to={`/video/${video._id}`} className="most-viewed-item">
              <span className="most-viewed-rank" aria-hidden="true">
                {index + 1}
              </span>
              <span className="most-viewed-thumb">
                <Thumb title={video.title} sources={[video.previewImage].filter(Boolean)} />
              </span>
              <span className="most-viewed-text">
                <span className="most-viewed-name">{video.title}</span>
                <span className="most-viewed-views">{formatViews(video.viewCount)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  </section>
);

export const HeroSkeleton = () => (
  <div className="hero" aria-hidden="true">
    <div className="hero-feature skeleton" />
    <div className="most-viewed skeleton" style={{ minHeight: 320 }} />
  </div>
);

export default Hero;
