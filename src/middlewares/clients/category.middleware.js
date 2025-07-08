const ProductCategory = require("../../app/models/products-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const categories = await ProductCategory.find({ deleted: false });

  const records = createTreeHelper.tree(categories);
  res.locals.categories = records;
  next();
};
