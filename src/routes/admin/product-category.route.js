const express = require("express");
const multer = require("multer");

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
const validate = require("../../validates/admin/products-category.validate");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");
const controller = require("../../controllers/admin/products-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.post(
  "/create",
  upload.single("thumbnail"),
  cloudUpload.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  cloudUpload.upload,
  validate.createPost,
  controller.editPatch
);

router.delete("/delete/:id", controller.delete);

module.exports = router;
