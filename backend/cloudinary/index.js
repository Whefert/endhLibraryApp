const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// TODO:Enable when go live
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LibraryApp",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

cloudinary.removeImage = (filename) => {
  if (filename !== "No_Book_Cover_Available_yacu9t") {
    cloudinary.uploader.destroy(filename).then((result) => {
      console.log("RESULTS:", result);
    });
  }
};

module.exports = { cloudinary, storage };
