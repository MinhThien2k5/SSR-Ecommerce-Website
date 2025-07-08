const Cart = require("../../app/models/cart.model");

module.exports.cartId = async (req, res, next) => {
  let cartId = req.session.cartId || req.cookies.cartId;

  if (!cartId) {
    const newCart = new Cart();
    await newCart.save();

    cartId = newCart._id.toString();
    req.session.cartId = cartId;
    res.cookie("cartId", cartId, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 năm
    });

    console.log("✅ Created new cart:", cartId);
    res.locals.miniCart = newCart;
    return next();
  }

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      // Cart ID không hợp lệ --> tạo cart mới
      const newCart = new Cart();
      await newCart.save();

      cartId = newCart._id.toString();
      req.session.cartId = cartId;
      res.cookie("cartId", cartId, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      res.locals.miniCart = newCart;
    } else {
      // Cart hợp lệ --> dùng lại
      req.session.cartId = cartId;
      cart.totalQuantity = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      res.locals.miniCart = cart;
    }
  } catch (err) {
    console.error("❌ Error in cartId middleware:", err);
  }

  next();
};
