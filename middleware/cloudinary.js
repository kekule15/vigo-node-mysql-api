
require("dotenv").config();
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CloudinaryName,
    api_key: process.env.CloudinaryAPIKey,
    api_secret: process.env.CloudinaryAPISecrete
});

module.exports = cloudinary