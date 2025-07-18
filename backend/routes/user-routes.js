const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller.js");

router.post("/", controller.createUser);
router.get("/:id", controller.getUserById);
// router.put("/:id", controller.updateUser);

module.exports = router;