const   { objectId } = require("./custom.validation")
const Joi = require("joi")

/**
 * Example url: `/v1/videos/:videoId`
 * Validate the "videoId" url *params* field. "videoId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */

const getVideo = {
    params: Joi.object().keys({
      videoId: Joi.string().custom(objectId),
    }),
  };
  
  module.exports = {
    getVideo,
  };
  