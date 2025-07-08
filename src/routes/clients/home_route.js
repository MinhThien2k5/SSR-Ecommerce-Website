const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/home.controller");

router.get("/home", controller.index);
router.get("/", controller.index);

module.exports = router;
