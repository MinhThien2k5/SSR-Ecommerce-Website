const Cart = require("../../app/models/cart.model");
const Product = require("../../app/models/product.model");
const Order = require("../../app/models/order.model");

const productHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
  const cardId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cardId,
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

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }
  console.log(products);

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(orderInfo);
  order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productHelper.priceNewProduct(product);

    product.totalPrice = product.quantity * product.priceNew;
  }

  order.totalPrice = order.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
