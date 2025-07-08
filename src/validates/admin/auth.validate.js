module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `Vui lòng nhập lại email`);
    res.redirect(req.get("referer"));
    return;
  }

  if (!req.body.password) {
    req.flash("error", `Vui lòng nhập lại mật khẩu`);
    res.redirect(req.get("referer"));
    return;
  }

  next();
};
