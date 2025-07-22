const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller.js");
const {requireAuth, populateClerkUser} = require('../middleware/clerkAuth');

router.post("/", requireAuth, populateClerkUser, controller.createUser);
router.get("/me",requireAuth(), controller.getUserFromClerk);
router.get("/:clerkId", requireAuth, populateClerkUser, controller.getUserById);


module.exports = router;