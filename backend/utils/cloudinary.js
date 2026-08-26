const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = 'civix') => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder,
    });
    // Delete local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });
    return response;
  } catch (e) {
    // Always clean up local file even on failure
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, () => {});
    }
    console.error('Cloudinary upload error:', e.message);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.error('Cloudinary delete error:', e.message);
    return null;
  }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };
