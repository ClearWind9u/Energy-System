const express = require('express');
const router = express.Router();
const manageDeviceController = require('../controllers/manageDeviceControllers')
router.get("/",manageDeviceController.getAllDevices)
router.post("/addDevice",manageDeviceController.addDevices)
router.get("/getMaxValue", manageDeviceController.getMaxValue);
router.post("/addRecord", manageDeviceController.addRecord)
router.get("/records", manageDeviceController.getRecordsByFilter)
router.post("/editDevice",manageDeviceController.editDevices)
router.post("/set-power",manageDeviceController.setPower)
router.delete("/deleteDevice",manageDeviceController.deleteDevices)
// router.post("/ai-recommendation",manageDeviceController.getAiRecommendation)
module.exports = router;