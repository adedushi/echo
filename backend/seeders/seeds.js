const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const Echo = require('../models/Echo');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const NUM_SEED_USERS = 7;
const NUM_SEED_ECHOS = 30;

const DEFAULT_PROFILE_IMAGE_URL = 'https://teamlab-echo.s3.amazonaws.com/public/blank-profile-picture.png';
const DEFAULT_AUDIO_URL = 'https://teamlab-echo.s3.amazonaws.com/public/stomps.mp3'

const users = [];
const echos = [];

users.push(
    new User({
        username: 'demo-user',
        email: 'demo-user@appacademy.io',
        hashedPassword: bcrypt.hashSync('starwars', 10),
        profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
    })
)

users.push(
    new User({
        username: 'zuck',
        email: 'mark@zuckerberg.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/zuckerberg.webp',
    })
);

users.push(
    new User({
        username: 'darth',
        email: 'darth@vader.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/vader.webp',
    })
);

users.push(
    new User({
        username: 'drakeOVO6',
        email: 'drake@drake.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/drake.webp',
    })
);

users.push(
    new User({
        username: 'Elon',
        email: 'elon@musk.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/musk.webp',
    })
);

users.push(
    new User({
        username: 'tswift',
        email: 'taylor@swift.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/swift.webp',
    })
);

users.push(
    new User({
        username: 'jeff',
        email: 'jeff@bezos.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/bezos.webp',
    })
);

users.push(
    new User({
        username: 'cardi',
        email: 'cardi@b.com',
        hashedPassword: bcrypt.hashSync('password', 10),
        profileImageUrl: 'https://teamlab-echo.s3.amazonaws.com/public/cardi.webp',
    })
);

// for (let i = 6; i < NUM_SEED_USERS; i++) {
//     const firstName = faker.name.firstName();
//     const lastName = faker.name.lastName();

//     const newUser = new User({
//         username: faker.internet.userName(firstName, lastName),
//         email: faker.internet.email(firstName, lastName),
//         hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
//         profileImageUrl: DEFAULT_PROFILE_IMAGE_URL,
//     })
//     users.push(newUser)
// }


const addEchoLikes = () => {
    const likes = []
    while (likes.length < 2) {
        const id = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        if (!likes.includes(id)) {
            likes.push(id)
        }
    }
    return likes
}

const addEchoReplies = () => {
    const replies = []
    for (let i = 0; i < 2; i++) {
        const newReply = {
            replyAuthor: users[i]._id,
            replyAudioUrl: DEFAULT_AUDIO_URL,
            replyText: undefined,
            replyLikes: [],
        }

        while (newReply.replyLikes.length < 3) {
            console.log(users);
            const id = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
            if (!newReply.replyLikes.includes(id)) {
                newReply.replyLikes.push(id)
            }
        }

        replies.push(newReply)
    }
    return replies
}

const addEchoReverbs = () => {
    const reverbs = []
    while (reverbs.length < 2) {
        const id = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        if (!reverbs.includes(id)) {
            reverbs.push(id)
        }
    }
    return reverbs
}

const echoLikes = addEchoLikes()
const echoReplies = addEchoReplies()
const echoReverbs = addEchoReverbs()


// for (let i = 0; i < NUM_SEED_ECHOS; i++) {
//     const echoLikes = addEchoLikes()
//     const echoReplies = addEchoReplies()
//     const echoReverbs = addEchoReverbs()

//     echos.push(
//         new Echo({
//             title: faker.hacker.phrase(),
//             author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id,
//             audioUrl: DEFAULT_AUDIO_URL,
//             replies: echoReplies,
//             likes: echoLikes,
//             reverbs: echoReverbs
//         })
//     )
// }

echos.push(
    new Echo({
        title: 'feeling great',
        author: users[1]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/zuckerberg.mp3',
        replies: echoReplies,
        likes: echoLikes,
        reverbs: echoReverbs
    })
);

echos.push(
    new Echo({
        title: 'This is too bright!',
        author: users[2]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/vader.mp3',
        replies: echoReplies,
        likes: echoLikes,
        reverbs: echoReverbs
    })
);

echos.push(
    new Echo({
        title: 'Soon',
        author: users[3]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/drake.mp3',
        replies: echoReplies,
        likes: echoLikes,
        reverbs: echoReverbs
    })
);

echos.push(
    new Echo({
        title: 'Offer you cannot refuse',
        author: users[4]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/musk.mp3',
        replies: echoReplies,
        likes: echoLikes,
        reverbs: echoReverbs
    })
);

echos.push(
    new Echo({
        title: 'Grammy Night',
        author: users[5]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/swift.mp3',
        replies: [{
            replyAuthor: users[7]._id,
            replyAudioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/cardi.mp3',
            replyText: undefined,
            replyLikes: [],
        }],
        likes: echoLikes,
        reverbs: echoReverbs
    })
);

echos.push(
    new Echo({
        title: 'CEO Entrepreneur',
        author: users[6]._id,
        audioUrl: 'https://teamlab-echo.s3.amazonaws.com/public/bezos.mp3',
        replies: echoReplies,
        likes: echoLikes,
        reverbs: echoReverbs
    })
);





for (let i = 0; i < users.length; i++) {
    const user = users[i]
    const userId = user._id;
    user.echos = echos.filter(echo => echo.author === userId);
    user.likes = []
    for (let i = 0; i < echos.length; i++) {
        const echo = echos[i]
        if (echo.likes.includes(userId)) {
            user.likes.push(echo._id)
        }
    }
    user.reverbs = []
    for (let i = 0; i < echos.length; i++) {
        const echo = echos[i]
        if (echo.reverbs.includes(userId)) {
            user.reverbs.push(echo._id)
        }
    }
    user.followers = []
    while (user.followers.length <= 3) {
        const id = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        if (!user.followers.includes(id) && id !== userId) {
            user.followers.push(id)
        }
    }
    user.following = []
    while (user.following.length <= 3) {
        const id = users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
        if (!user.following.includes(id) && id !== userId) {
            user.following.push(id)
        }
    }

    // user.likes = echos.filter(echo => echo.likes.includes(userId))
    // user.reverbs = echos.filter(echo => echo.reverbs.includes(userId));
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