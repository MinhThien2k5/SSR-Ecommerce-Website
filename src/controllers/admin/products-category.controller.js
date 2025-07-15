const ProductCategory = require("../../app/models/products-category.model");

const systemConfig = require("../../config/db/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  // console.log(records);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật thành công!");

  res.redirect(req.get("referer") || "/admin/products-category");
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  // console.log(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.permissions;
  if (permissions.includes("products-category_create")) {
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } else {
    req.flash("error", "Bạn không có quyền thực hiện chức năng này!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });

    if (!data) {
      req.flash("error", "Danh mục không tồn tại!");
      return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }

    const records = await ProductCategory.find({ deleted: false });
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data,
      records: newRecords,
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu danh mục:", error);
    req.flash("error", "Đã xảy ra lỗi khi tải trang.");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body.position || isNaN(req.body.position)) {
      const count = await ProductCategory.countDocuments({ deleted: false });
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    await ProductCategory.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(req.get("referer"));
  }
};

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { deleted: true });
    req.flash("success", "Xóa danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    req.flash("error", "Xóa danh mục thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
