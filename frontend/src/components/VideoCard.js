import React from "react";
import { Link } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Thumb from "./Thumb";
import { formatViews, timeAgo } from "../utils";
import "./VideoCard.css";

const VideoCard = ({ video }) => (
  <Link to={`/video/${video._id}`} className="video-card video-tile-link">
    <span className="video-card-media">
      <Thumb title={video.title} sources={[video.previewImage].filter(Boolean)} />
      {video.contentRating && (
        <span className="video-card-badge">
          <span className="sr-only">Age rating </span>
          {video.contentRating}
        </span>
      )}
      <span className="video-card-play" aria-hidden="true">
        <span className="video-card-play-circle">
          <PlayArrowRoundedIcon />
        </span>
      </span>
    </span>
    <span className="video-card-title">{video.title}</span>
    <span className="video-card-meta">
      {video.genre} · {formatViews(video.viewCount)} · {timeAgo(video.releaseDate)}
    </span>
  </Link>
);

export const VideoCardSkeleton = () => (
  <div className="video-card" aria-hidden="true">
    <span className="video-card-media skeleton" />
    <span className="skeleton skeleton-line" style={{ width: "85%" }} />
    <span className="skeleton skeleton-line" style={{ width: "55%" }} />
  </div>
);

export default VideoCard;
