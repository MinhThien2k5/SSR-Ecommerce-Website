const express = require("express");
const multer = require("multer");

const router = express.Router();

const controller = require("../../controllers/admin/settings.controller");
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
const validate = require("../../validates/admin/product.validate");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  cloudUpload.upload,
  controller.generalPatch
);

module.exports = router;
