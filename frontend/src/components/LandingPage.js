import { config } from "../App";
import {
  CircularProgress,
  Grid,
  TextField,
  Stack,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Box } from "@mui/system";
import axios from "axios";
import VideoCard from "./VideoCard";
import Header from "./Header";
import GenreList from "./GenreList";
import ContentRatingList from "./ContentRatingList";
import "./LandingPage.css";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const allGenres = [
  { label: "All", value: "All" },
  { label: "Education", value: "Education" },
  { label: "Sports", value: "Sports" },
  { label: "Comedy", value: "Comedy" },
  { label: "Lifestyle", value: "Lifestyle" },
  { label: "Movies", value: "Movies" },
];

const allContentRatings = [
  { label: "All Age Group", value: "Anyone" },
  { label: "7+", value: "7%2B" },
  { label: "12+", value: "12%2B" },
  { label: "16+", value: "16%2B" },
  { label: "18+", value: "18%2B" },
];

const LandingPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [timerId, setTimerId] = useState(null);
  const [searchValid, setIfSearchValid] = useState("true");
  const [videos, setVideos] = useState([]);
  const [genres, setGenres] = useState(["All"]);
  const [selectedContentRatings, setSelectedContentRatings] = useState(
    "Anyone"
  );
  const [isLoading, setLoading] = useState(false);

  // const fetchVideoData = async () => {
  //   const URL =  `${config.endpoint}/videos?genres=${genres.join(",")}`
  //   console.log("Fetch Called with", URL);
  //   try{
  //       const response = await axios.get(URL);
  //       const data = response.data.videos;
  //       console.log(data);
  //         setVideos(data);
  //       setIfSearchValid(true)
  //   }
  //  catch(e){
  //       setIfSearchValid(false)
  //   }

  // };

  // const performSearch = async (queryString = "") => {
  //   let url = `${config.endpoint}/videos`;

  //   if (queryString.length) {
  //     url += `?title=${queryString}`;
  //   }
  //   try{
  //   const response = await axios.get(url);
  //   const data = response.data.videos;
  //   console.log(data);
  //     setVideos(data);
  //   }
  //   catch(e){
  //     if (e.response && e.response.data) {
  //       enqueueSnackbar(e.response.data.message, { variant: "error" });
  //     } else {
  //       enqueueSnackbar(
  //         "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
  //         { variant: "error" }
  //       );
  //     }
  //     }
  // };

  // const fetchContentRating = async(selectedContentRatings) =>{
  //   let url = `${config.endpoint}/videos`;

  //   if (selectedContentRatings.length && selectedContentRatings !=="Anyone") {
  //     url += `?contentRating=${selectedContentRatings}`;
  //   }
  //   try{
  //     const response = await axios.get(url);
  //     const data = response.data.videos;
  //     console.log(data);
  //       setVideos(data);
  //     }
  //     catch(e){
  //       if (e.response && e.response.data) {
  //         enqueueSnackbar(e.response.data.message, { variant: "error" });
  //       } else {
  //         enqueueSnackbar(
  //           "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
  //           { variant: "error" }
  //         );
  //       }
  //       }
  // };

  const performAPICall = async (URL) => {
    // console.log(URL);
    setLoading(true);
    try {
      const response = await axios.get(URL);
      console.log(response.data);
      setVideos(response.data.videos);
      setLoading(false);
      // setIfSearchValid(true)
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
      setLoading(false);
      // setIfSearchValid(false)
    }
  };

  const performSearch = async (value, genres, selectedContentRatings) => {
    let URL = `${config.endpoint}/videos?`;
    if (value.length) {
      URL += `title=${value}`;
    }
    if (genres.length) {
      if (genres.length && !genres.includes("All")) {
        const param = genres.join(",");
        URL[URL.length - 1] === "?"
          ? (URL += `genres=${param}`)
          : (URL += `&genres=${param}`);
      }
    }
    if (selectedContentRatings.length && selectedContentRatings !== "Anyone") {
      URL[URL.length - 1] === "?"
        ? (URL += `contentRating=${selectedContentRatings}`)
        : (URL += `&contentRating=${selectedContentRatings}`);
    }
    //console.log(URL);
    performAPICall(URL);
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    if (timerId) {
      clearTimeout(timerId);
    }
    const debounceTimeoutId = setTimeout(
      () => performSearch(value, genres, selectedContentRatings),
      debounceTimeout
    );
    setTimerId(debounceTimeoutId);
  };

  const toggleValueInList = (array, value) => {
    if (array.includes(value)) {
      //If true, remove the value and update the state
      const newArray = array.filter((e) => e !== value);
      return newArray;
    } else {
      //Else Add the selected value and update the state
      const newArray = [...array, value];
      return newArray;
    }
  };

  const handleGenreChange = (genre) => {
    const all = "All";
    const newGenreValue = genre.value;

    if (newGenreValue === all) {
      setGenres([all]);
    } else {
      //return us the array of genres without "All" in it
      const genreWithoutAll = genres.filter((item) => item !== all);

      const nextGenres = toggleValueInList(genreWithoutAll, newGenreValue);
      setGenres(nextGenres);

      if (nextGenres.length === 0) {
        setGenres([all]);
      }
    }
  };

  const handleContentRatingChange = (contentRating) => {
    setSelectedContentRatings(contentRating.value);
  };

  useEffect(() => {
    const URL = `${config.endpoint}/videos`;
    performAPICall(URL);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    performSearch("", genres, selectedContentRatings);
    // eslint-disable-next-line
  }, [genres, selectedContentRatings]);

  // useEffect(() => {
  //   fetchVideoData();
  // }, [genres]);

  // useEffect(() => {
  //   console.log(selectedContentRatings)
  //   fetchContentRating(selectedContentRatings)
  // }, [selectedContentRatings]);

  // useEffect(() => {
  //   console.log(genres)
  // }, [genres]);

  return (
    <>
      <Box className="header-box" sx={{ height: "10vh", bgcolor: "#202020" }}>
        <Header
          fetchVideos={performAPICall}
          genres={allGenres}
          contentRatings={allContentRatings}
        >
          {/* Search view for desktop */}
          <TextField
            className="search-desktop"
            size="small"
            inputProps={{ style: { fontFamily: "Arial", color: "white" } }}
            InputProps={{
              className: "search",
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            name="search"
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            onChange={(event) => debounceSearch(event, 500)}
          />
        </Header>
      </Box>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        inputProps={{ style: { fontFamily: "Arial", color: "white" } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(event) => debounceSearch(event, 500)}
        placeholder="Search"
        name="search"
        // value={search}
        // onChange={(e) => setSearch(e.target.value)}
      />

      <GenreList
        allGenres={allGenres}
        selectedGenres={genres}
        handleGenreChange={handleGenreChange}
        setVideos={setVideos}
      />

      <ContentRatingList
        allContentRatings={allContentRatings}
        selectedContentRatings={selectedContentRatings}
        handleContentRatingChange={handleContentRatingChange}
      />

      {searchValid ? (
        <Grid
          container
          paddingY="1rem"
          marginTop="0.6rem"
          paddingX="2rem"
          spacing={3}
        >
          {!isLoading ? (
            videos.map((video) => (
              <Grid item xs={12} sm={6} md={3} key={video._id}>
                <Link
                  to={`/video/${video._id}`}
                  className="video-tile-link"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <VideoCard video={video} />
                </Link>
              </Grid>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "75vh", width: "100%" }}
            >
              <Box>
                <CircularProgress />
                {/* <p>Loading Videos...</p>  */}
              </Box>
            </Box>
          )}
        </Grid>
      ) : (
        <Box className="loading">
          <SentimentDissatisfied />
          <p>No videos found</p>
        </Box>
      )}
    </>
  );
};

export default LandingPage;
