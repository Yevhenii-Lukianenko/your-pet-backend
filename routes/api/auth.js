const express = require("express");
const router = express.Router();

const user = require("../../controllers/auth");
const { authenticate, upload, avatarProcessing } = require("../../middlewares");

router.post("/register", user.register);

router.post("/login", user.login);

router.get("/current", authenticate, user.getCurrent);

router.post("/logout", authenticate, user.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  avatarProcessing,
  user.updateAvatar
);

module.exports = router;
