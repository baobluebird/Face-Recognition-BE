const express = require('express');
const router = express.Router();
const detectionController = require('../../controllers/detection.controllers');
const {  authUserMiddleware  } = require('../../middleware/authMiddleware');

router.get('/get-latest-image', detectionController.getLatestImage);
router.get('/get-latest-image-for-warning', detectionController.getLatestImageForWaring);

module.exports = router;  