import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Header from "./Header";
import Thumb from "./Thumb";
import { addView, errorMessage, fetchVideo, fetchVideos, vote } from "../api";
import { byNewest, byViews, formatDate, formatViews, readVotes, saveVote, timeAgo } from "../utils";
import "./VideoPage.css";

const UP_NEXT_SIZE = 8;

const UpNextItem = ({ video }) => (
  <li>
    <Link to={`/video/${video._id}`} className="up-next-item">
      <span className="up-next-thumb">
        <Thumb title={video.title} sources={[video.previewImage].filter(Boolean)} />
      </span>
      <span className="up-next-text">
        <span className="up-next-title">{video.title}</span>
        <span className="up-next-meta">
          {video.genre} · {video.contentRating}
        </span>
        <span className="up-next-meta">
          {formatViews(video.viewCount)} · {timeAgo(video.releaseDate)}
        </span>
      </span>
    </Link>
  </li>
);

const VideoPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [voted, setVoted] = useState(null);
  const [voting, setVoting] = useState(false);
  const counted = useRef(new Set());

  // Load the video and count one view per visit to this page.
  useEffect(() => {
    let active = true;
    setVideo(null);
    setVoted(readVotes()[id] || null);
    window.scrollTo(0, 0);

    fetchVideo(id)
      .then((data) => {
        if (!active) return;
        setVideo(data);
        if (!counted.current.has(id)) {
          counted.current.add(id);
          addView(id)
            .then(() => {
              if (!active) return;
              setVideo((current) =>
                current && current._id === id
                  ? { ...current, viewCount: (Number(current.viewCount) || 0) + 1 }
                  : current
              );
            })
            .catch(() => {});
        }
      })
      .catch((e) => {
        if (!active) return;
        enqueueSnackbar(errorMessage(e), { variant: "error" });
        history.replace("/");
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchVideos()
      .then(setAllVideos)
      .catch(() => {});
  }, []);

  const upNext = useMemo(() => {
    if (!video) return [];
    const others = allVideos.filter((v) => v._id !== video._id);
    const sameGenre = others.filter((v) => v.genre === video.genre).sort(byNewest);
    const rest = others.filter((v) => v.genre !== video.genre).sort(byViews);
    return [...sameGenre, ...rest].slice(0, UP_NEXT_SIZE);
  }, [allVideos, video]);

  const handleVote = async (type) => {
    if (voted || voting || !video) return;
    setVoting(true);
    try {
      await vote(video._id, type);
      const key = type === "upVote" ? "upVotes" : "downVotes";
      setVideo((current) => ({
        ...current,
        votes: { ...current.votes, [key]: (Number(current.votes && current.votes[key]) || 0) + 1 },
      }));
      saveVote(video._id, type);
      setVoted(type);
    } catch (e) {
      enqueueSnackbar(errorMessage(e), { variant: "error" });
    } finally {
      setVoting(false);
    }
  };

  const upVotes = (video && video.votes && Number(video.votes.upVotes)) || 0;
  const downVotes = (video && video.votes && Number(video.votes.downVotes)) || 0;

  return (
    <>
      <Header />
      <main className="page watch" id="main">
        <div className="watch-main">
          <Link to="/" className="back-link">
            <ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
            Back to browse
          </Link>

          <div className="player">
            {video ? (
              <iframe
                title={video.title}
                src={`https://${video.videoLink}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="skeleton player-skeleton" aria-label="Loading video" />
            )}
          </div>

          {video ? (
            <div className="watch-info">
              <div className="watch-text">
                <h1 className="watch-title">{video.title}</h1>
                <div className="watch-meta">
                  <span className="tag">{video.genre}</span>
                  <span className="tag tag-outline">
                    <span className="sr-only">Age rating </span>
                    {video.contentRating}
                  </span>
                  <span>{formatViews(video.viewCount)}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Released {formatDate(video.releaseDate)} ({timeAgo(video.releaseDate)})
                  </span>
                </div>
              </div>

              <div className="vote-group" role="group" aria-label="Rate this video">
                <button
                  type="button"
                  className={`vote-btn upvote-pill ${voted === "upVote" ? "is-active" : ""}`}
                  aria-pressed={voted === "upVote"}
                  disabled={Boolean(voted) || voting}
                  onClick={() => handleVote("upVote")}
                >
                  {voted === "upVote" ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
                  <span>{upVotes}</span>
                  <span className="sr-only">upvotes, like this video</span>
                </button>
                <span className="vote-divider" aria-hidden="true" />
                <button
                  type="button"
                  className={`vote-btn downvote-pill ${voted === "downVote" ? "is-active" : ""}`}
                  aria-pressed={voted === "downVote"}
                  disabled={Boolean(voted) || voting}
                  onClick={() => handleVote("downVote")}
                >
                  {voted === "downVote" ? (
                    <ThumbDownIcon fontSize="small" />
                  ) : (
                    <ThumbDownOutlinedIcon fontSize="small" />
                  )}
                  <span>{downVotes}</span>
                  <span className="sr-only">downvotes, dislike this video</span>
                </button>
              </div>
              {voted && (
                <p className="vote-thanks" role="status">
                  Thanks for voting!
                </p>
              )}
            </div>
          ) : (
            <div className="watch-info" aria-hidden="true">
              <span className="skeleton skeleton-line" style={{ width: "60%", height: 28 }} />
              <span className="skeleton skeleton-line" style={{ width: "40%" }} />
            </div>
          )}
        </div>

        <aside className="up-next" aria-labelledby="up-next-title">
          <h2 id="up-next-title" className="up-next-heading">
            Up next
          </h2>
          <ol className="up-next-list">
            {upNext.map((v) => (
              <UpNextItem key={v._id} video={v} />
            ))}
          </ol>
        </aside>
      </main>
    </>
  );
};

export default VideoPage;
