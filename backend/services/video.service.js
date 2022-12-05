const Videos = require("../models/video.model");
const  ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getAllVideos = async () => {
    const videos = await Videos.find({});
    return videos
  };
  
const getVideo = async (id) => {
  return await Videos.findById(id)
}

const addVideo = async (data) => {
  let newVideo = await Videos.create({
    videoLink : data.videoLink,
    title : data.title,
    genre: data.genre,
    contentRating: data.contentRating,
    releaseDate: data.releaseDate,
    previewImage: data.previewImage
  })
  if (!newVideo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Video Upload failed!"
    );
  }
  newVideo = await newVideo.save()
  return newVideo
}

const updateVotes = async(id, vote, change) => {
  let data = await Videos.findById(id)

  if(!data){
    throw new ApiError(httpStatus.BAD_REQUEST, "VideoId must be a valid Id")
  }
  if(vote==="upVote" && change==="increase"){
    data.votes.upVotes = data.votes.upVotes + 1
  }
  if(vote=="downVote" && change=="increase"){
    data.votes.downVotes++
  }
  if(vote=="upVote" && change=="decrease"){
    data.votes.upVotes--
  }
  if(vote=="downVote" && change=="decrease"){
    data.votes.downVotes--
  }

  data = await data.save()
  return data
}

const updateViews = async(id) => {

  let data = await Videos.findById(id)
  if(!data){
    throw new ApiError(httpStatus.BAD_REQUEST, "VideoId must be a valid Id")
  }
    data.viewCount++
    data = await data.save()
    return data
  }

module.exports = {
    getAllVideos,
    getVideo,
    addVideo,
    updateVotes,
    updateViews,
}  