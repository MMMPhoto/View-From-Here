const exifr = require("exifr");

const exifOptions = {
  ifd0: false,
  exif: {
    pick: ["CreateDate", "OffsetTime"],
  },
  gps: false,
};

const getGpsData = async (filePath) => {
  const gpsData = await exifr.gps(filePath);
  return gpsData;
};

const getCustomExifData = async (filePath, options) => {
  const thumbnail = await exifr.parse(filePath, options);
  return thumbnail;
};

module.exports = { getGpsData, getCustomExifData, exifOptions };
