const express = require("express");
const router = express.Router();

const {authenticate, validateBody} = require("../../middlewares")
const {schemas} = require("../../models/pets")

const pets = require("../../controllers/pets");



router.post("/", authenticate, validateBody(schemas.addSchema), pets.add)


module.exports = router;