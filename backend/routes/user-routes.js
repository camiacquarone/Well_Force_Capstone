const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller.js");
const {requireAuth, populateClerkUser} = require('../middleware/clerkAuth');

router.post("/", requireAuth, populateClerkUser, controller.createUser);
router.get("/:clerkId", requireAuth, populateClerkUser, controller.getUserById);
router.put("/:clerkId", requireAuth, populateClerkUser, controller.updateUser);

module.exports = router;