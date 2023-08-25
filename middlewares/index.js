const authenticate = require("./authenticate");
const upload = require("./upload");
const checkFileSize = require("./checkFileSize");
const validateBody = require("./validateBody");
const validNoticeId = require("./validNoticeId");

module.exports = {
  authenticate,
  upload,
  checkFileSize,
  validateBody,
  validNoticeId,
};
