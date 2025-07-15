const Cart = require("../../app/models/cart.model");
const Product = require("../../app/models/product.model");

const productHelper = require("../../helpers/product");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // console.log(cart);

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Product.findOne({
        _id: item.product_id,
        deleted: false,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.priceNew = productHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew; // Tính tổng giá trị của sản phẩm trong giỏ hàng
    }
  }

  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  let cart = await Cart.findOne({ _id: cartId });

  // Nếu không tìm thấy giỏ hàng, tạo mới
  if (!cart) {
    cart = await Cart.create({
      products: [],
    });
    res.cookie("cartId", cart._id, { httpOnly: true });
  }

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;

    await Cart.updateOne(
      {
        _id: cart._id,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cart._id,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
  res.redirect(req.get("referer") || "/");
};

// [POST] /cart/update/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Xoá sản phẩm khỏi giỏ hàng thành công!");

  res.redirect(req.get("referer") || "/");
};

// [POST] /cart/update/:productId
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );

  req.flash("success", "Cập nhật số lượng sản phẩm thành công!");

  res.redirect(req.get("referer") || "/");
};
