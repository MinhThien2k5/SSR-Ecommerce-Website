const express = require("express");
const multer = require("multer");

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();

const controller = require("../../controllers/admin/products.controller");
const validate = require("../../validates/admin/product.validate");

const cloudUpload = require("../../middlewares/admin/cloudUpload.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

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

router.get("/detail/:id", controller.detail);

module.exports = router;
