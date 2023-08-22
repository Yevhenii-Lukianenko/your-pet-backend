const express = require("express");
const router = express.Router();

const friends = require("../../controllers/ourFriends");

router.get("/", friends.getAllFriends)

router.get("/:id", friends.getInfo)

module.exports = router;