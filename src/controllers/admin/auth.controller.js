const md5 = require("md5");

const Account = require("../../app/models/account.model");
const Role = require("../../app/models/roles.model");

const systemConfig = require("../../config/db/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập",
    });
  }
  try {
    const user = await Account.findOne({ token });

    if (user) {
      // Token hợp lệ, chuyển hướng đến dashboard
      return res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
      // Token không hợp lệ, xóa cookie và hiển thị trang đăng nhập
      res.clearCookie("token");
      return res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập",
      });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra token:", error);
    return res.status(500).send("Lỗi hệ thống");
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  }).select("+password");

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect(req.get("referer"));
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect(req.get("referer"));
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect(req.get("referer"));
    return;
  }

  res.cookie("token", user.token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  req.session.destroy();
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
