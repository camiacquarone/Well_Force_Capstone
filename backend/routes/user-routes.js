const express = require('express');
const router = express.Router();

const controller = require("../controllers/user-controller.js");
const { requireAuth, populateClerkUser } = require("../middleware/clerkAuth.js");

// POST /api/users — Create a new user (requires auth and Clerk user population)
router.post("/", requireAuth, populateClerkUser, controller.createUser);

// GET /api/users/me — Get the current user based on Clerk ID
router.get("/me", requireAuth, controller.getUserFromClerk);

// GET /api/users/:clerkId — Get user by Clerk ID (requires auth and Clerk user population)
router.get("/:clerkId", requireAuth, populateClerkUser, controller.getUserById);

module.exports = router;
