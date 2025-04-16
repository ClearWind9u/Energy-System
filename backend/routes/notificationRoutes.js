const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification')
router.post("/",notificationController.addNotification)
module.exports = router;