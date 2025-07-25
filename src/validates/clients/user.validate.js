module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `Vui lòng nhập lại họ tên`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }

  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập lại email`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập lại mật khẩu`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }
  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập lại email`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập lại mật khẩu`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }
  next();
};

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập lại email`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }
  next();
};

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập lại mật khẩu`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }

  if (!req.body.confirmPassword) {
    req.flash("error", `Vui lòng xác nhận mật khẩu`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }

  if (req.body.confirmPassword != req.body.password) {
    req.flash("error", `Không khớp!!`);
    res.redirect(req.get("referer") || "/admin/accounts");
    return;
  }
  next();
};
