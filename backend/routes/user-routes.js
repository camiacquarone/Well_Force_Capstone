const express = require('express');
const router = express.Router();

const controller = require("../controllers/user-controller.js");
const { requireAuth, populateClerkUser } = require("../middleware/clerkAuth.js");

router.post("/", requireAuth, populateClerkUser, controller.createUser);
router.put("/", requireAuth, populateClerkUser, controller.updateUser);
router.get("/me", requireAuth, controller.getUserFromClerk);
router.get("/me/preferences", requireAuth, controller.getUserPreferences);
router.get("/current_user_snack", requireAuth, controller.getCurrentUser);
router.get("/:clerkId", requireAuth, populateClerkUser, controller.getUserById);



module.exports = router;

