const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");
const validate = require("../../validates/admin/account.validate");

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  cloudUpload.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  cloudUpload.upload,
  validate.editPatch,
  controller.editPatch
);

module.exports = router;
