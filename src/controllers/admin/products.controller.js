const Product = require("../../app/models/product.model");

const systemConfig = require("../../config/db/system");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const mongoose = require("mongoose");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../app/models/products-category.model");
const Account = require("../../app/models/account.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelpers(req.query);

  let find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm
  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regrex) {
    find.title = objectSearch.regrex;
  }

  // Phân trang
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  // Sort (Sắp xếp sản phẩm theo tiêu chí khác nhau)
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // (Lấy thông tin người dùng từ bảng tài khoản)
  for (const product of products) {
    // lấy thông tin người tạo từ bảng tài khoản
    const user = await Account.findOne({ _id: product.createdBy.account_id });

    if (user) {
      product.accountFullName = user.fullName;
    }

    // lấy thông tin người cập nhật từ bảng tài khoản
    const updatedBy = product.updatedBy.slice(-1)[0]; // Lấy thông tin cập nhật cuối cùng
    if (updatedBy) {
      const updatedUser = await Account.findOne({
        _id: updatedBy.account_id,
      });

      if (updatedUser) {
        product.accountFullName = updatedUser.fullName;
      }
    }
  }

  // Render products
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products,
    filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    messages: req.flash(),
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const udatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: udatedBy } }
  );

  req.flash("success", "Cập nhật thành công!");

  res.redirect(req.get("referer") || "/admin/products");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  const ids = req.body.ids
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id !== "");

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() },
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        // console.log(id);
        // console.log(position);
        await Product.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
      }
      req.flash("success", `Đổi vị trí thành công ${ids.length} sản phẩm!`);
      break;
    default:
      break;
  }

  res.redirect(req.get("referer") || "/admin/products");
};

// [DELETE] /admin/products/delete
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id: id });

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() },
    }
  );

  req.flash("success", `Xóa sản phẩm!`);
  res.redirect(req.get("referer") || "/admin/products");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};

// [PATCH] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // if (req.file && req.file.filename) {
  //   req.body.thumbnail = `/upload/${req.file.filename}`;
  // }

  req.body.createdBy = {
    account_id: res.locals.user.id,
    createdAt: new Date(),
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  if (req.file && req.file.filename) {
    req.body.thumbnail = `/upload/${req.file.filename}`;
  }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      { ...req.body, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", `Cập nhật thành công sản phẩm!!!`);
  } catch (error) {
    req.flash("error", `Cập nhật sản phẩm thất bại!!!`);
  }

  res.redirect(req.get("referer") || "/admin/products");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
