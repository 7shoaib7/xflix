const express = require("express");
const videoRoute = require("./video.routes");


const router = express.Router();

router.use("/videos", videoRoute);


module.exports = router;
