const multer = require("multer");
const path = require("path");

// 🔥 STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.fieldname + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// 🔥 FILE FILTER
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "photo" ||
    file.fieldname === "signature"
  ) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
  }

  if (
    file.fieldname === "marksheet" ||
    file.fieldname === "provisional" ||
    file.fieldname === "community"
  ) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF allowed"), false);
    }
  }

  cb(null, true);
};

// 🔥 SIZE LIMITS
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1MB max
  },
});

module.exports = upload;