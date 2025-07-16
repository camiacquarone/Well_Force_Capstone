const express = require('express')
const router = express.Router()
const controller = require("../controllers/")

router.post("/", controller.createUser);
router.get("/:id", controller.getUser);
router.put("/:id", controller.updateUser);

module.exports = router;