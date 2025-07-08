const Product = require("../../app/models/product.model");
const productHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regrex = new RegExp(keyword, "i");

    const products = await Product.find({
      title: regrex,
      status: "active",
      deleted: false,
    });

    newProducts = productHelper.priceNewProducts(products);
  }

  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
