const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/my-account.controller");

const validate = require("../../validates/admin/auth.validate");
const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  cloudUpload.upload,
  controller.editPatch
);

module.exports = router;
