import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { config } from "../App";
import "./VideoPage.css";
import moment from "moment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Button, Stack } from "@mui/material";

const VideoPlayerView = ({ video, handleVoteChange, getVideoData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  //  console.log(video.videoLink)
  // console.log(video.votes.upVotes)
  // console.log(video["votes"]["upVotes"])
  const [votesChange, setVotesChange] = useState({
    upVote: false,
    downVote: false,
  });

  const performPatchCall = async (URL, data = {}) => {
    try {
      if (data) {
        await axios.patch(URL, data);
      } else {
        await axios.patch(URL);
      }
      return true;
      // console.log(response.data);
      //debugger;
    } catch (e) {
      if (e.response && e.response.data.message) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      }
    }
  };

  const updateVote = async (name, id) => {
    const URL = `${config.endpoint}/videos/${id}/votes`;
    const data = {
      vote: name,
      change: "increase",
    };
    let response = await performPatchCall(URL, data);
    console.log("Patch response", response);
    console.log("VoteUpdated", votesChange);
    if (response) {
      setVotesChange({ ...votesChange, [name]: true });
      getVideoData(id);
    }
    console.log(data, id, URL);
  };
  
  const increaseViewCount = async (id) => {
    const URL = `${config.endpoint}/videos/${id}/views`;
    //console.log(URL);
    await performPatchCall(URL);
  };
  
  useEffect(() => {
    //console.log(video._id)
    //console.log(video);
    // console.log("videoId",video._id);
    if (video._id) {
      //console.log(video);
      console.log("Video Id", video._id);
      console.log("id", id);
      increaseViewCount(video._id); 
    }
  }, [video]);


  return (
    <>
      <div className="container">
        <div className="iframe-parent">
          <iframe
            title="video"
            src={`https://${video.videoLink}`}
            allow="autoplay; encripted-media"
            allowFullScreen
            frameBorder="0"
            className="iframe-main"
          ></iframe>
        </div>
      </div>

      <div className="container ">
        <div className="video-bar ">
          <div>
            <p className="playing-title">{video.title}</p>
            <div className={"line"}>
              <span className={"tag views-tag"}>
                {video.viewCount} views
                </span>
              <div className={"dot"}></div>
              <span className={"tag content-rating-tag"}>
                {video.contentRating}
              </span>
              <div className={"dot"}></div>
              <span className={"tag release-date-tag"}>
                {moment(video.releaseDate).fromNow()}
              </span>
            </div>
          </div>

          <div className="vote-container">
            <Stack direction="row" spacing={2} my={1}>
              <Button
                className="vote-pill upvote-pill"
                variant="contained"
                startIcon={<ThumbUpIcon />}
                name="upVote"
                // onClick={() =>
                //   handleVoteChange(video._id, {
                //     vote: "upVote",
                //     change: "increase"
                //   })
                // }

                onClick={(e) => {
                  updateVote("upVote", video._id);
                }}
              >
                {video.votes ? video["votes"]["upVotes"] : null}
                {/* <Stack direction="row" spacing={1}>
                 <ThumbUpIcon />
                 <span>0</span>
              </Stack> */}
                {/* <span>{video.votes.upVotes}</span> */}
              </Button>
              <Button
                className="vote-pill downvote-pill"
                variant="contained"
                startIcon={<ThumbDownIcon />}
                name="downVote"
                // onClick={() =>
                //   handleVoteChange(video._id, {
                //     vote: "downVote",
                //     change: "increase"
                //   })
                // }
                onClick={(e) => {
                  updateVote("downVote", video._id);
                }}
              >
                {video.votes ? video["votes"]["downVotes"] : null}
                {/* <Stack direction="row" spacing={1}>
                 <ThumbDownIcon />
                 <span>0</span>
                </Stack>      */}
                {/* <span>{video.votes.downVotes}</span> */}
              </Button>
            </Stack>
          </div>
        </div>
      </div>

      <div className="Line"></div>
    </>
  );
};

export default VideoPlayerView;
