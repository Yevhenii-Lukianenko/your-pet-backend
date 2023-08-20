const express = require('express');
const router = express.Router();

const {authenticate, validateBody} = require('../../middlewares');
const {schemas} = require('../../models/notices');
const notices = require('../../controllers/notices');

router.get('/:category', notices.getAll);

router.post("/", authenticate, validateBody(schemas.addSchema), notices.add);

module.exports = router;