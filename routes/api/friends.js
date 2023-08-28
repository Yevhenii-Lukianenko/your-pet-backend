const express = require("express");
const router = express.Router();

const friends = require("../../controllers/ourFriends");

router.get("/", friends.getAllFriends);

module.exports = router;
