import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import Header from "./Header";
import FilterBar from "./FilterBar";
import Hero, { HeroSkeleton } from "./Hero";
import VideoRow, { VideoRowSkeleton } from "./VideoRow";
import VideoCard, { VideoCardSkeleton } from "./VideoCard";
import { errorMessage, fetchVideos } from "../api";
import { GENRES, byNewest, byViews } from "../utils";
import "./LandingPage.css";

const SLOW_MS = 3000;
const ROW_SIZE = 10;

const SlowNotice = () => (
  <p className="notice" role="status">
    Waking up the server. On the free plan the first load can take up to a minute.
  </p>
);

const LandingPage = () => {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const initialQuery = new URLSearchParams(location.search).get("q") || "";

  const [allVideos, setAllVideos] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [results, setResults] = useState([]);
  const [resultsFor, setResultsFor] = useState(null);
  const [slow, setSlow] = useState(false);

  const [search, setSearch] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery.trim());
  const [genres, setGenres] = useState([]);
  const [age, setAge] = useState("");
  const [sort, setSort] = useState("releaseDate");
  const [showAll, setShowAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestRef = useRef(0);

  const loadAll = useCallback(async () => {
    setLoadingAll(true);
    setLoadFailed(false);
    const timer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      setAllVideos(await fetchVideos());
    } catch (e) {
      setLoadFailed(true);
      enqueueSnackbar(errorMessage(e), { variant: "error" });
    } finally {
      clearTimeout(timer);
      setSlow(false);
      setLoadingAll(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Debounce typing in the search box.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const isFiltered = Boolean(query || genres.length || age);
  // Identifies the filter combination; results are only shown once they match it.
  const filterKey = JSON.stringify([query, genres, age, refreshKey]);

  // Filtering is done by the API; sorting is applied here so it always respects the filters.
  useEffect(() => {
    if (!isFiltered) return;
    const id = (requestRef.current += 1);
    const params = {};
    if (query) params.title = query;
    if (genres.length) params.genres = genres.join(",");
    if (age) params.contentRating = age;

    const timer = setTimeout(() => setSlow(true), SLOW_MS);
    fetchVideos(params)
      .then((videos) => {
        if (id === requestRef.current) setResults(videos);
      })
      .catch((e) => {
        if (id !== requestRef.current) return;
        setResults([]);
        enqueueSnackbar(errorMessage(e), { variant: "error" });
      })
      .finally(() => {
        clearTimeout(timer);
        if (id === requestRef.current) {
          setSlow(false);
          setResultsFor(filterKey);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const browsing = !isFiltered && sort === "releaseDate" && !showAll;

  const counts = useMemo(
    () => allVideos.reduce((acc, v) => ({ ...acc, [v.genre]: (acc[v.genre] || 0) + 1 }), {}),
    [allVideos]
  );
  const newest = useMemo(() => [...allVideos].sort(byNewest), [allVideos]);
  const mostViewed = useMemo(() => [...allVideos].sort(byViews).slice(0, 4), [allVideos]);
  const gridVideos = useMemo(() => {
    const source = isFiltered ? results : allVideos;
    return [...source].sort(sort === "viewCount" ? byViews : byNewest);
  }, [isFiltered, results, allVideos, sort]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const showGenre = (genre) => {
    setGenres([genre]);
    scrollTop();
  };
  const toggleGenre = (genre) =>
    setGenres((current) => (current.includes(genre) ? current.filter((g) => g !== genre) : [...current, genre]));
  const allGenres = () => {
    setGenres([]);
    setShowAll(false);
  };
  const clearAll = () => {
    setSearch("");
    setQuery("");
    setGenres([]);
    setAge("");
    setSort("releaseDate");
    setShowAll(false);
  };
  const handleUploaded = () => {
    loadAll();
    setRefreshKey((k) => k + 1);
  };

  const rows = [
    { title: "New releases", videos: newest.slice(1, ROW_SIZE + 1), onSeeAll: () => { setShowAll(true); scrollTop(); } },
    ...GENRES.map((genre) => ({
      title: genre,
      videos: newest.filter((v) => v.genre === genre).slice(0, ROW_SIZE),
      onSeeAll: () => showGenre(genre),
    })),
  ].filter((row) => row.videos.length > 0);

  let heading = "All videos";
  if (query) heading = `Results for “${query}”`;
  else if (genres.length) heading = genres.join(", ");
  const typing = search.trim() !== query;
  const loadingGrid = typing || (isFiltered ? resultsFor !== filterKey : loadingAll);
  const canClear = isFiltered || showAll || sort !== "releaseDate";

  return (
    <>
      <Header search={search} onSearchChange={setSearch} onUploaded={handleUploaded} />
      <div className="filter-wrap">
        <FilterBar
          counts={counts}
          total={allVideos.length}
          genres={genres}
          onToggleGenre={toggleGenre}
          onAllGenres={allGenres}
          age={age}
          onAgeChange={setAge}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <main className="page" id="main">
        {loadFailed && allVideos.length === 0 ? (
          <div className="state-box" role="alert">
            <h2>We couldn't load the videos</h2>
            <p>The server may be waking up or temporarily unavailable.</p>
            <button type="button" className="btn btn-accent" onClick={loadAll}>
              Try again
            </button>
          </div>
        ) : browsing ? (
          loadingAll ? (
            <>
              {slow && <SlowNotice />}
              <HeroSkeleton />
              <VideoRowSkeleton />
              <VideoRowSkeleton />
            </>
          ) : newest.length === 0 ? (
            <div className="state-box">
              <h2>No videos yet</h2>
              <p>Be the first to upload one.</p>
            </div>
          ) : (
            <>
              <Hero featured={newest[0]} mostViewed={mostViewed} onGenre={showGenre} />
              {rows.map((row) => (
                <VideoRow key={row.title} title={row.title} videos={row.videos} onSeeAll={row.onSeeAll} />
              ))}
            </>
          )
        ) : (
          <section className="results" aria-labelledby="results-title">
            <div className="results-head">
              <div className="results-heading">
                <h1 id="results-title" className="section-title results-title">
                  {heading}
                </h1>
                <span className="results-count" aria-live="polite">
                  {loadingGrid ? "Loading…" : `${gridVideos.length} ${gridVideos.length === 1 ? "video" : "videos"}`}
                  {age ? ` · ${age}` : ""}
                  {sort === "viewCount" ? " · most viewed first" : ""}
                </span>
              </div>
              {canClear && (
                <button type="button" className="btn btn-ghost" onClick={clearAll}>
                  Clear filters
                </button>
              )}
            </div>
            {slow && loadingGrid && <SlowNotice />}
            {loadingGrid ? (
              <div className="video-grid">
                {Array.from({ length: 8 }, (_, i) => (
                  <VideoCardSkeleton key={i} />
                ))}
              </div>
            ) : gridVideos.length ? (
              <div className="video-grid">
                {gridVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="state-box">
                <h2>No videos match</h2>
                <p>Try a different search, or clear the filters to see everything.</p>
                <button type="button" className="btn btn-accent" onClick={clearAll}>
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default LandingPage;
