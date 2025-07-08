module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", `Vui lòng nhập tiêu đề`);
    res.redirect(req.get("referer") || "/admin/products");
    return;
  }

  if (req.body.title.length < 4) {
    req.flash("error", `Vui lòng nhập nhiều hơn 4 ký tự`);
    res.redirect(req.get("referer") || "/admin/products");
    return;
  }

  next();
};
