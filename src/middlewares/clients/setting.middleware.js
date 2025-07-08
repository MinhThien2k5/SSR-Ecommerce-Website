const SettingGeneral = require("../../app/models/setting.model");

module.exports.SettingGeneral = async (req, res, next) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.locals.settingGeneral = settingGeneral;
  next();
};
