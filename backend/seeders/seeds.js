const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Echo = require('../models/Echo');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 10;
const NUM_SEED_ECHOS = 30;

const DEFAULT_PROFILE_IMAGE_URL = 'https://teamlab-echo.s3.amazonaws.com/public/blank-profile-picture.png';
const DEFAULT_AUDIO_URL = 'https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3'

const addLikes = () => {
    likes = []
    for (let i = 0; i < 5; i++) {
        likes.push(users[i]._id)
    }
    return likes
}

const addReplies = () => {
    replies = []
    for (let i = 0; i < 2; i++) {
        replies.push({
            replyAuthor: users[i]._id,
            replyAudioUrl: DEFAULT_AUDIO_URL,
            replyText: undefined
        })
    }
    return replies
}

const addReverbs = () => {
    const reverbs = []
    for (let i = 0; i < 2; i++) {
        reverbs.push(users[i]._id)
    }
    return reverbs
}

const users = [];

users.push(
    new User({
        username: 'demo-user',
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10)
    })
)

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    users.push(
        new User({
            username: faker.internet.userName(firstName, lastName),
            email: faker.internet.email(firstName, lastName),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
            profileImageUrl: DEFAULT_PROFILE_IMAGE_URL
        })
    )
}

const echos = [];

for (let i = 0; i < NUM_SEED_ECHOS; i++) {
    echos.push(
        new Echo({
            title: faker.hacker.phrase(),
            author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id,
            audioUrl: DEFAULT_AUDIO_URL,
            replies: addReplies(),
            likes: addLikes(),
            reverbs: addReverbs()
        })
    )
}



mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
        insertSeeds();
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    });

const insertSeeds = () => {
    console.log("Resetting db and seeding users and echos...");

    User.collection.drop()
        .then(() => Echo.collection.drop())
        .then(() => User.insertMany(users))
        .then(() => Echo.insertMany(echos))
        .then(() => {
            console.log("Done!");
            mongoose.disconnect();
        })
        .catch(err => {
            console.error(err.stack);
            process.exit(1);
        });
}

// const initializeImagesAndAudio = async () => {
//     console.log("Initializing profile avatars...");
//     await User.updateMany({}, { profileImageUrl: DEFAULT_PROFILE_IMAGE_URL });

//     console.log("Initializing Echo image URLs...");
//     await Echo.updateMany({}, { audioUrl: DEFAULT_AUDIO_URL });

//     console.log("Done!");
//     mongoose.disconnect();
// }