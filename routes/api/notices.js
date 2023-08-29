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
  notices.updateFavoriteNotice
);

router.get("/favorite", authenticate, notices.getFavorite);

router.post(
  "/",
  authenticate,
  upload.single("avatarURL"),
  checkFileSize,
  validateBody(schemas.addSchema),
  notices.addUserNotice
);

router.get("/own", authenticate, notices.getUserNotices);

router.delete("/:noticeId", authenticate, validNoticeId, notices.removeById);

module.exports = router;
