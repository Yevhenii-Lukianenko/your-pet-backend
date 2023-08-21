const express = require('express');
const router = express.Router();

const {authenticate, validateBody, validNoticeId} = require('../../middlewares');
const {schemas} = require('../../models/notices');
const notices = require('../../controllers/notices');

router.get('/category/:category', notices.getAll);

router.get('/:noticeId', validNoticeId, notices.getById);

router.patch('/:noticeId/favorite', authenticate, validNoticeId, notices.addFavorite);

router.patch('/:noticeId/nofavorite', authenticate, validNoticeId, notices.removeFavorite);

router.post("/", authenticate, validateBody(schemas.addSchema), notices.add);

module.exports = router;