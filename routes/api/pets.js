const express = require("express");
const router = express.Router();

const {authenticate, validateBody} = require("../../middlewares")
const {schemas} = require("../../models/pets")

const pets = require("../../controllers/pets");

router.get("/", authenticate, pets.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), pets.add);

router.delete("/:id", authenticate, pets.remove)


module.exports = router;