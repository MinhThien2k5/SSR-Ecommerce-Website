const Product = require("../../app/models/product.model");
const productHelper = require("../../helpers/product");

const productCategory = require("../../app/models/products-category.model");
const productCategoryHelper = require("../../helpers/productCategory");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
    };

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await productCategory.findOne({
        id: product.product_category_id,
        deleted: false,
        status: "active",
      });

      if (category) {
        product.category = category;
      }
    }

    product.priceNew = productHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active",
      slug: req.params.slugCategory,
    };

    const category = await productCategory.findOne(find);

    const listSubCategories = await productCategoryHelper.getSubCategories(
      category.id
    );

    const listCategoryIds = listSubCategories.map(
      (subCategory) => subCategory.id
    );

    const products = await Product.find({
      deleted: false,
      product_category_id: { $in: [category.id, ...listCategoryIds] },
      status: "active",
    }).sort({ position: "desc" });

    // console.log(products);

    const newProducts = productHelper.priceNewProducts(products);
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
