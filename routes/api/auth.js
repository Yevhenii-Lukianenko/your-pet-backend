const express = require("express");
const router = express.Router();

const user = require("../../controllers/auth");
const {
  authenticate,
  validateBody,
  upload,
  imageProcessing,
} = require("../../middlewares");

const { schemas } = require("../../models/user");

router.post("/register", validateBody(schemas.registerSchema), user.register);

router.post("/login", validateBody(schemas.loginSchema), user.login);

router.get("/current", authenticate, user.getCurrent);

router.post("/logout", authenticate, user.logout);

router.patch(
  "/profile",
  authenticate,
  validateBody(schemas.updateSchema),
  user.updateProfile
);

router.patch(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  imageProcessing,
  user.updateAvatar
);

module.exports = router;
