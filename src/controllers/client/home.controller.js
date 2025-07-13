const Product = require("../../app/models/product.model");

const productHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy danh sách sản phẩm nổi bật
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: true,
  })
    .sort({ position: "desc" })
    .limit(4);

  // Tính giá mới cho sản phẩm
  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

  // Lay danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(4);

  const newProductsNew = productHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
