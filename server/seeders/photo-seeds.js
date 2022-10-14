const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require("path");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const {
  uploadImage,
  getAssetInfo,
  createImageTag,
  uploadOptions,
} = require("../utils/cloudinary.js");
const { getGpsData, getCustomExifData, exifOptions } = require("../utils/exifr.js");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
console.log(cloudinary.config);

// File Path variables
const moveFrom = "./server/seeders/rawPhotos";
const moveTo = "./server/seeders/parsed-photos/.";

// Get photos
const rawPhotos = fs.readdirSync(moveFrom);
console.log(rawPhotos);
// Pull .gitkeep file out of array
rawPhotos.shift();
console.log(rawPhotos);

const seedFunction = async () => {
  try {
    console.log(rawPhotos);

    const photoDataArray = [];

    for (const photo of rawPhotos) {
      // Get file paths
      const fromPath = path.join(moveFrom, photo);
      const toPath = path.join(moveTo, photo);

      // Get GPS data from photo
      const gpsData = await getGpsData(fromPath);
      console.log(gpsData);

      // Get custom Exif data
      const exifData = await getCustomExifData(fromPath, exifOptions);
      // exifData.OffsetTime = parseInt(exifData.OffsetTime);
      console.log(exifData);

      // Upload image to Cloudinary
      const uploadPhotoData = await uploadImage(fromPath, uploadOptions);
      console.log(uploadPhotoData);

      // Get unique cloudinary photo ID
      const photoUrl = uploadPhotoData. secure_url;
      const publicId = uploadPhotoData.public_id;

      // Build object for database
      const photoData = {
        ...gpsData,
        ...exifData,
      };
      photoData.url = photoUrl;
      photoData.public_id = publicId;
      console.log(photoData);

      // Push to array for JSON data file
      photoDataArray.push(photoData);

      // Write photos to new location so we know they have been processed
      await fsPromises.rename(fromPath, toPath);
      console.log("Wrote file");
    };

    // Write GPS data to JSON file
    const jsonData = JSON.stringify(photoDataArray);
    fs.writeFile('./server/seeders/json-photo-data.json', jsonData, 'utf8', (err, data) => {
        err ? console.error(err) : console.log('File written!');
    });

  } catch (error) {
    console.error(error);
  }
};

seedFunction();
