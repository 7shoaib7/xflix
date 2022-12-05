const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const videoService = require("../services/video.service");

/* Sample response that displays list of all videos

HTTP response : 200
{
"videos": [
    {
        "votes": {
            "upVotes": 0,
            "downVotes": 0
        },
        "previewImage": "https://i.ytimg.com/vi/CEg30z7cO-s/mqdefault.jpg",
        "viewCount": 0,
        "videoLink": "youtube.com/embed/CEg30z7cO-s",
        "title": "4,000,000 - Q&A",
        "genre": "Comedy",
        "contentRating": "18+",
        "releaseDate": "31 Jan 2021",
        "id": "602f634c9e9156626412ea71"
    },
    {
      "id": "60211cb602edbc33d4214360",
      "videoLink": "youtube.com/embed/vxxN3_bs6Uo",
      "title": "Crio Fireside chat with Binny Bansal",
      "genre": "Education",
      "contentRating": "7+",
      "releaseDate": "12 Jan 2021",
        "previewImage":  "https://i.ytimg.com/vi/vxxN3_bs6Uo/maxresdefault.jpg",
      "votes": {
        "upVotes": "0",
        "downVotes": "0"
      },
      "viewCount": "0"
   }
]
} */

const getAllVideos = catchAsync(async (req, res) => {
  const videos = await videoService.getAllVideos();
  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) {
    res.status(200).json({ videos: videos });
  } else {
    if (req.query.sortBy) {
      let sortedVideos = await getVideoBySort(videos, req.query.sortBy);
      res.status(200).json({ videos: sortedVideos });
    } else {
      let filters = req.query;
      console.log(filters);
      let filteredVideos = videos.filter((video) => {
        let isValid = true;
        for (key in filters) {
          let gen;
          // let age;
          if (key === "genres") {
            gen = filters[key].split(",");
            isValid = isValid && gen.includes(video["genre"]);
          } else if (key === "contentRating") {
            if (filters[key] === "18+") {
              age = ["18+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "16+") {
              age = ["16+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "12+") {
              age = ["12+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
            if (filters[key] === "7+") {
              age = ["7+"];
              isValid = isValid && age.includes(video["contentRating"]);
            }
          }
          // console.log(key, video[key], filters[key])
          else {
            console.log("----------- Else block------------");
            isValid =
              isValid &&
              video[key].toLowerCase().includes(filters[key].toLowerCase());
          }
        }
        return isValid;
      });
      res.status(200).json({ videos: filteredVideos });
    }
  }
});

const getVideo = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  const video = await videoService.getVideo(uid);
  if (!video) {
    throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id");
  }
  res.status(200).send(video);
});

const addVideo = catchAsync(async (req, res) => {
  const data = await videoService.addVideo(req.body);
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "");
  }
  res.status(201).send(data);
});

const updateVotes = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  const video = await videoService.updateVotes(
    uid,
    req.body.vote,
    req.body.change
  );
  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video Id is not correct");
  }
  res.status(204).send();
});

const updateViews = catchAsync(async (req, res) => {
  let uid = req.params.videoId;
  const video = await videoService.updateViews(uid);
  if (!video) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Video Id is not correct");
  }
  res.status(204).send();
});

const getVideoBySort = (videos, sortby) => {
  if (sortby === "releaseDate") {
    let data = videos.slice().sort((a, b) => b.releaseDate - a.releaseDate);
    return data;
  }
  if (sortby === "viewCount") {
    let data = videos.slice().sort((a, b) => b.viewCount - a.viewCount);
    return data;
  }
};
    
module.exports = { 
  getAllVideos,
  getVideo,
  addVideo,
  updateVotes,
  updateViews,
};
