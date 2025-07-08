const productCategory = require("../app/models/products-category.model");

module.exports.getSubCategories = async (categoryId) => {
  const getCategories = async (categoryId) => {
    const subCategories = await productCategory.find({
      deleted: false,
      parent_id: categoryId,
      status: "active",
    });

    let allSub = [...subCategories];

    for (const subCategory of subCategories) {
      const subSubCategories = await getCategories(subCategory.id);
      allSub = allSub.concat(subSubCategories);
    }

    return allSub;
  };

  const result = await getCategories(categoryId);
  return result;
};
