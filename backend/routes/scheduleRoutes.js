const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/analyze', scheduleController.analyzeSchedule);

module.exports = router;
