const mongoose = require("mongoose");
const config = require("../config/config");

const videoSchema = mongoose.Schema(
  {
    videoLink: {
      type: String,
      required: [true, "video link is required."],
      // validate: {
      //   validator: function (v) {
      //     return /youtube.com\/embed\/*/.test(v);
      //   },
      //   message: (props) => `${props.value} is not a valid youtube embed link.`,
      // },
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true
    },
    genre: {
      type: String,
      required: [true, "Genre is required."],
      trim: true
    },
    contentRating: {
      type: String,
      required: [true, "ContentRating is required."],
      trim: true
    },
    previewImage: {
      type: String,
      required: [true, "Preview Image is required."]
    },
    releaseDate: {
      type: Date,
      required: [true, "Release Date is required."],
      default: Date.now
    },
    viewCount: {
      type: Number,
      default: config.default_view_count,
    },
    votes: {
      upVotes: {
        type: Number,
        default: 0,
      },
      downVotes: {
        type: Number,
        default: 0,
      },
    },
  },
);


const Video =  mongoose.model('Video',videoSchema)
module.exports = Video;