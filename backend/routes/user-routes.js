const express = require('express');
const router = express.Router();

const controller = require("../controllers/user-controller.js");
const { requireAuth, populateClerkUser } = require("../middleware/clerkAuth.js");

router.post("/", requireAuth, populateClerkUser, controller.createUser);
router.get("/:clerkId", requireAuth, populateClerkUser, controller.getUserById);
router.put("/", requireAuth, populateClerkUser, controller.updateUser);
router.get("/me", requireAuth, controller.getUserFromClerk);


module.exports = router;

