const express = require('express');
const router = express.Router();
const userController = require("../controllers/userControllers");
router.get("/get-user", userController.getUsers);
router.post("/create-user", userController.createUser);
router.post("/login", userController.handleLogin);
router.get("/get-user/:id", userController.getUserById);
router.patch("/update-user/:id", userController.updateUserById);
module.exports = router;
