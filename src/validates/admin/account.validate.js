module.exports.createPost = (req, res, next) => {
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

module.exports.editPatch = (req, res, next) => {
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

  next();
};
