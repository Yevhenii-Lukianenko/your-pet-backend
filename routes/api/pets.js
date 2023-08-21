const express = require("express");
const router = express.Router();
const {upload, imageProcessing} = require("../../middlewares");

const {authenticate, 
    validateBody
} = require("../../middlewares")
const {schemas} = require("../../models/pets")

const pets = require("../../controllers/pets");

router.get("/", authenticate, pets.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), upload.single("avatarPet"), imageProcessing, pets.add);

// router.post("/:id", authenticate, upload.single("avatarPet"), imageProcessing, pets.addImagePet);

router.delete("/:id", authenticate, pets.remove)


module.exports = router;