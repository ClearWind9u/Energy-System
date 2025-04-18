const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification')
router.post("/",notificationController.addNotification)
router.get("/",notificationController.getAllNotificationById)
module.exports = router;