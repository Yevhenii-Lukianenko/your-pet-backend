const express = require("express");
const router = express.Router();
const {authenticate} = require("../../middlewares");

const userAndPets = require("../../controllers/userPets")

router.get("/:id", authenticate, userAndPets.userPets );

module.exports = router;