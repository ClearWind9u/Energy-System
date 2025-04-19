const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');

router.post("/",notificationController.addNotification)
router.get("/getAll",notificationController.getAllNotificationById)
router.delete("/delete",notificationController.deleteNotificationById)
module.exports = router;