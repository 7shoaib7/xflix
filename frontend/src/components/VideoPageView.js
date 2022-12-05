import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import { config } from "../App";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import VideoPlayerView from "./VideoPlayerView";
import "./VideoPage.css";
import XFlixLogo from "./XFlix.svg";

const VideoPageView = () => {
  const params = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [video, setVideo] = useState({});
  const [allVideoList, setAllVideoList] = useState([]);

  useEffect(() => {
    getVideoData(params.id);
    getAllVideos();
    // eslint-disable-next-line
  }, [params.id]);

  const getAllVideos = async () => {
    let response;
    try {
      response = await axios.get(`${config.endpoint}/videos`);
      setAllVideoList(response.data.videos);
    } catch (e) {
      handleError(e);
    }
  };

  const getVideoData = async (id) => {
    try {
      const response = await axios.get(`${config.endpoint}/videos/${id}`);
      console.log(response.data);
      setVideo(response.data);
    } catch (e) {
      handleError(e);
      history.push("/");
    }
  };

  const handleError = (e) => {
    if (e.response) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  // const handleVoteChange = async (videoId, requestObj) => {
  //     // console.log(videoId,requestObj)
  //   try {
  //     await axios.patch(`${config.endpoint}/videos/${videoId}/votes`, requestObj);
  //     getVideoData(params.id);
  //   } catch (e) {
  //     handleError(e);
  //   }
  // };

  return (
    <>
      <Box className="header-box" sx={{ height: "10vh", bgcolor: "#202020" }}>
        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          sx={{ paddingX: "1rem" }}
        >
          <Box className="header-title" marginTop="1rem">
            <Link to="/">
              <img src={XFlixLogo} alt="XFlix-icon" />
            </Link>
          </Box>
        </Box>
      </Box>

      <Grid container paddingY="1rem" paddingX="2rem" spacing={3}>
        {video ? (
          <Grid item xs={12}>
            <VideoPlayerView
              video={video}
              // handleVoteChange={handleVoteChange}
              getVideoData={getVideoData}
            />
          </Grid>
        ) : (
          <div style={{ color: "#fff" }}>Loading...</div>
        )}

        {allVideoList.map((video) => (
          <Grid item xs={12} sm={6} md={3} key={video._id}>
            <Link
              to={`/video/${video._id}`}
              className="video-tile-link"
              style={{ textDecoration: "none", color: "white" }}
            >
              <VideoCard video={video} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default VideoPageView;
