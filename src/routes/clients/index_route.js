const productRouters = require("./product_routes");
const homeRouters = require("./home_route");
const categoryMiddleware = require("../../middlewares/clients/category.middleware");
const searchRouters = require("./search.route");
const cartMiddleware = require("../../middlewares/clients/cart.middleware");
const userMiddleware = require("../../middlewares/clients/user.middleware");
const settingMiddleware = require("../../middlewares/clients/setting.middleware");
const cartRouters = require("./cart.route");
const checkoutRouters = require("./checkout.route");
const userRouters = require("./user.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.SettingGeneral);

  app.use("/", cartMiddleware.cartId, homeRouters);

  app.use("/products", cartMiddleware.cartId, productRouters);

  app.use("/cart", cartMiddleware.cartId, cartRouters);

  app.use("/checkout", cartMiddleware.cartId, checkoutRouters);

  app.use("/user", cartMiddleware.cartId, userRouters);

  app.use("/search", cartMiddleware.cartId, searchRouters);
};
