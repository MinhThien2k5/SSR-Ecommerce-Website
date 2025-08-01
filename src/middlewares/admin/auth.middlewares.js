const systemConfig = require("../../config/db/system");

const Account = require("../../app/models/account.model.js");
const Role = require("../../app/models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(systemConfig.prefixAdmin + "/auth/login");
  } else {
    const user = await Account.findOne({
      token: req.cookies.token,
    }).select("-password");
    if (!user) {
      res.redirect(systemConfig.prefixAdmin + "/auth/login");
      console.log(user);
    } else {
      const role = await Role.findOne({
        _id: user.role_id,
      });

      res.locals.user = user;
      res.locals.role = role;
      res.locals.permissions = role?.permissions || [];

      next();
    }
  }
};
