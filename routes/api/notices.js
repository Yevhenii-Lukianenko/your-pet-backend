const express = require("express");
const router = express.Router();

const {
  authenticate,
  validateBody,
  validNoticeId,
  upload,
  imageProcessing,
} = require("../../middlewares");

const { schemas } = require("../../models/notices");
const notices = require("../../controllers/notices");

router.get("/:category", notices.getAll);

router.get('/notice/:noticeId', validNoticeId, notices.getById);

router.patch('/:noticeId/favorite', authenticate, validNoticeId, notices.addToFavorite);

router.patch('/:noticeId/nofavorite', authenticate, validNoticeId, notices.removeFromFavorite);

router.post(
  "/",
  authenticate,
  upload.single("avatarURL"),
  imageProcessing,
  validateBody(schemas.addSchema),
  notices.add
);

module.exports = router;
