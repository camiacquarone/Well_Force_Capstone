const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller.js");
const { requireAuth } = require("@clerk/express");
const { getMe } = controller;

router.post("/", controller.createUser);
router.get("/me",requireAuth(), controller.getUserFromClerk);
router.get("/:id", controller.getUserById);

// router.put("/:id", controller.updateUser);

module.exports = router;