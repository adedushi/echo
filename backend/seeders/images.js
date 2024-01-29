const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Echo = require('../models/Echo');

const DEFAULT_PROFILE_IMAGE_URL = 'https://teamlab-echo.s3.amazonaws.com/public/blank-profile-picture.png';

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
        initializeImages();
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });

const initializeImages = async () => {
    console.log("Initializing profile avatars...");
    await User.updateMany({}, { profileImageUrl: DEFAULT_PROFILE_IMAGE_URL });

    console.log("Initializing Echo image URLs...");
    await Echo.updateMany({}, { imageUrls: [] });

    console.log("Done!");
    mongoose.disconnect();
}