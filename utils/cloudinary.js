const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
require("dotenv").config(); // Safe to include here too

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", public_id: `blogs/${filename.split(".")[0]}` },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    readable.pipe(uploadStream);
  });
};
