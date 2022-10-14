const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
console.log(cloudinary.config);

// Upload Options
  const uploadOptions = {
    use_filename: false,
    unique_filename: true,
    overwrite: true,
    upload_preset: "view-from-here-general",
    // folder: 'view-from-here'
  };

  // Upload image to Cloudinary
  const uploadImage = async (imagePath, options) => {
    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  // Get details of uploaded image
  const getAssetInfo = async (publicId) => {
    // Return colors in the response
    const options = {
      colors: true,
    };

    try {
      // Get details about the asset
      const result = await cloudinary.api.resource(publicId, options);
      console.log(result);
      return result.colors;
    } catch (error) {
      console.error(error);
    }
  };

  // Create image tag
  const createImageTag = (publicId, ...colors) => {
    // Set the effect color and background color
    const [effectColor, backgroundColor] = colors;

    // Create an image tag with transformations applied to the src URL
    let imageTag = cloudinary.image(publicId, {
      transformation: [
        { width: 250, height: 250, gravity: "faces", crop: "thumb" },
        { radius: "max" },
        { effect: "outline:10", color: effectColor },
        { background: backgroundColor },
      ],
    });

    return imageTag;
  };
  
module.exports = { uploadImage, getAssetInfo, createImageTag, uploadOptions };
