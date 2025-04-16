const express = require('express');
const router = express.Router();
const manageDeviceController = require('../controllers/manageDeviceControllers')
router.get("/",manageDeviceController.getAllDevices)
router.post("/addDevice",manageDeviceController.addDevices)
router.post("/addRecord", manageDeviceController.addRecord);
router.post("/editDevice",manageDeviceController.editDevices)
router.post("/set-power",manageDeviceController.setPower)
router.delete("/deleteDevice",manageDeviceController.deleteDevices)
module.exports = router;