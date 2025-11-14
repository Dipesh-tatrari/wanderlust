const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//we are configuring cloudinary with our account details
cloudinary.config({//by default it will look for the variables in the process.env and the name given to them id by default
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

//we are setting up the storage engine for multer to use cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',//this is the folder name in cloudinary where all the images will be stored
        allowedFormats: ['jpg', 'png', 'jpeg'], // supports promises as well
    },
});

module.exports = { cloudinary, storage };