const multer = require("multer");
const path = require("path");

module.exports = () => {
  const uploadDir = path.join(__dirname, "../public/upload"); // Đường dẫn tuyệt đối
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir); // Sử dụng đường dẫn tuyệt đối
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  });
  return storage;
};
