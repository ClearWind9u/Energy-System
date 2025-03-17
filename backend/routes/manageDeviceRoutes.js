const express = require('express');
const router = express.Router();
const manageDeviceController = require('../controllers/manageDeviceControllers')
router.get("/",manageDeviceController.getAllDevices)
router.post("/addDevice",manageDeviceController.addDevices)
router.post("/editDevice",manageDeviceController.editDevices)
module.exports = router;