const express = require("express");
const videoController = require("../../controllers/video.controller");
const videoValidation = require("../../validations/video.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.get("/", videoController.getAllVideos);

router.get(
  "/:videoId",
  validate(videoValidation.getVideo),
  videoController.getVideo
);


router.post("/", videoController.addVideo);

router.patch(
  "/:videoId/votes",
  validate(videoValidation.getVideo),
  videoController.updateVotes
);

router.patch(
  "/:videoId/views",
  validate(videoValidation.getVideo),
  videoController.updateViews
);

module.exports = router;
