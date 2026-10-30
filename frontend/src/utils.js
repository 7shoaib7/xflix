import moment from "moment";

export const GENRES = ["Education", "Sports", "Comedy", "Lifestyle", "Movies"];
export const AGE_GROUPS = ["7+", "12+", "16+", "18+"];

export const timeAgo = (date) => (date ? moment(date).fromNow() : "");
export const formatDate = (date) => (date ? moment(date).format("D MMM YYYY") : "");
export const yearOf = (date) => (date ? moment(date).format("YYYY") : "");

export const formatViews = (count) => {
  const n = Number(count) || 0;
  return `${n.toLocaleString("en-IN")} ${n === 1 ? "view" : "views"}`;
};

export const byNewest = (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate);
export const byViews = (a, b) => (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0);

// Poster colour used when a thumbnail fails to load.
const POSTER_COLOURS = ["#24425F", "#5A2A3A", "#2B4A3B", "#6A4A1E", "#3A2E5E", "#1F4A52", "#5C3424", "#33405A"];
export const posterColour = (text = "") => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return POSTER_COLOURS[hash % POSTER_COLOURS.length];
};

export const shortTitle = (title = "") => title.replace(/^Top 10 Facts - /, "");

// Accepts youtube.com/embed/ID, youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID.
export const youtubeId = (input = "") => {
  const match = input
    .trim()
    .match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?(?:.*&)?v=|shorts\/|v\/)|youtu\.be\/)([\w-]{11})/i);
  return match ? match[1] : null;
};

export const embedLink = (id) => `youtube.com/embed/${id}`;
export const thumbnailFor = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

// Higher-resolution YouTube thumbnail for large surfaces, falling back to the stored one.
export const largeThumbnails = (previewImage = "") => {
  const big = previewImage.replace(/\/(mq|hq|sd)default\.jpg$/, "/maxresdefault.jpg");
  return Array.from(new Set([big, previewImage].filter(Boolean)));
};

// Remembers which videos this browser has voted on.
const VOTES_KEY = "xflix-votes";
export const readVotes = () => {
  try {
    return JSON.parse(window.localStorage.getItem(VOTES_KEY)) || {};
  } catch (e) {
    return {};
  }
};
export const saveVote = (id, type) => {
  try {
    const votes = readVotes();
    votes[id] = type;
    window.localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch (e) {
    // Storage can be unavailable (private mode); voting still works for this visit.
  }
};
