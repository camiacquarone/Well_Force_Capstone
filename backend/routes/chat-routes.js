const express = require('express');
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const controller = require('../controllers/chat-controller.js');

// Route: GET /api/meals/personalized/:userId
router.get("/personalized", requireAuth(), controller.getPersonalizedMeals);

module.exports = router;
