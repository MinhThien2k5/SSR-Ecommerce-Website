const Cart = require("../../app/models/cart.model");

module.exports.cartId = async (req, res, next) => {
  const expiresTime = 1000 * 60 * 60 * 24 * 365;
  let cartId = req.session.cartId || req.cookies.cartId;
  let cart;

  if (!cartId) {
    cart = new Cart();
    await cart.save();
    cartId = cart._id.toString();

    req.session.cartId = cartId;
    res.cookie("cartId", cartId, { maxAge: expiresTime });

    console.log("✅ Created new cart:", cartId);
  }

  try {
    cart = await Cart.findById(cartId);

    if (!cart) {
      cart = new Cart();
      await cart.save();

      cartId = cart._id.toString();
      req.session.cartId = cartId;
      res.cookie("cartId", cartId, { maxAge: expiresTime });

      console.log("✅ Recreated new cart:", cartId);
    }

    // 🔥 Đảm bảo mảng products tồn tại
    if (!Array.isArray(cart.products)) cart.products = [];

    // ✅ Tính lại totalQuantity
    cart.totalQuantity = cart.products.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // ✅ Gán miniCart vào locals
    res.locals.miniCart = cart;
  } catch (err) {
    console.error("❌ Error in cartId middleware:", err);
    res.locals.miniCart = { products: [], totalQuantity: 0 }; // fallback an toàn
  }

  next();
};
