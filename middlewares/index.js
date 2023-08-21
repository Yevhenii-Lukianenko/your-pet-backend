const authenticate = require("./authenticate");
const upload = require("./upload");
const imageProcessing = require("./imageProcessing");
const validateBody = require("./validateBody");
const validNoticeId = require("./validNoticeId");

module.exports = { authenticate, upload, imageProcessing, validateBody, validNoticeId };
