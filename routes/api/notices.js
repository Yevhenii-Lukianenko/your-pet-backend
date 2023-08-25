const express = require("express");
const router = express.Router();

const {
  authenticate,
  validateBody,
  validNoticeId,
  upload,
  checkFileSize,
} = require("../../middlewares");

const { schemas } = require("../../models/notices");
const notices = require("../../controllers/notices");

router.get("/category/:category", notices.getAll);

router.get("/notice/:noticeId", validNoticeId, notices.getById);

router.patch(
  "/:noticeId/favorite",
  authenticate,
  validNoticeId,
  notices.addToFavorite
);

router.get("/favorite", authenticate, notices.getFavorite);

router.patch(
  "/:noticeId/nofavorite",
  authenticate,
  validNoticeId,
  notices.removeFromFavorite
);

router.post(
  "/",
  authenticate,
  upload.single("avatarURL"),
  checkFileSize,
  validateBody(schemas.addSchema),
  notices.addUserNotice
);

router.get("/", authenticate, notices.getUserNotices);

router.delete("/:noticeId", authenticate, validNoticeId, notices.removeById);

module.exports = router;
