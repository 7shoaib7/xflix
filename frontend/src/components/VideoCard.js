import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import moment from "moment";

const VideoCard = ({ video }) => {
  return (
    <>
      <Box className="video-tile" display="flex" flexDirection="column">
        <img src={video.previewImage} alt="thumbnail" class="video-img" />
        <Box marginTop="0.4rem">
          <Typography gutterBottom variant="body1" component="div">
            {video.title}
          </Typography>
          <Typography gutterBottom variant="subtitle2" sx={{ opacity: "0.4" }}>
            {moment(video.releaseDate).fromNow()}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default VideoCard;

// contentRating: "12+"
// genre: "Movies"
// previewImage: "https://i.ytimg.com/vi/nx2-4l4s4Nw/mqdefault.jpg"
// releaseDate: "18 Jan 2021"
// title: "Consumed by the Apocalypse"
// videoLink: "youtube.com/embed/nx2-4l4s4Nw"
// viewCount: 83
