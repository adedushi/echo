const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Echo = mongoose.model('Echo');
const { loginUser, restoreUser, requireUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

const DEFAULT_PROFILE_IMAGE_URL = 'https://teamlab-echo.s3.amazonaws.com/public/blank-profile-picture.png';

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find().select('-hashedPassword')
    return res.json(users)
  } catch (err) {
    return res.json([])
  }
});


// router.get('/', function (req, res, next) {
//   res.json({
//     message: "GET /api/users"
//   });
// });

router.post('/register', singleMulterUpload("image"), validateRegisterInput, async (req, res, next) => {
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }]
  });

  if (user) {
    const err = new Error("Validation Error");
    err.statusCode = 400;
    const errors = {};
    if (user.email === req.body.email) {
      errors.email = "A user has already registered with this email";
    }
    if (user.username === req.body.username) {
      errors.username = "A user has already registered with this username";
    }
    err.errors = errors;
    return next(err);
  }

  const profileImageUrl = req.file ?
    await singleFileUpload({ file: req.file, isPublic: true }) :
    DEFAULT_PROFILE_IMAGE_URL;
  const newUser = new User({
    username: req.body.username,
    profileImageUrl,
    email: req.body.email
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(req.body.password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      try {
        newUser.hashedPassword = hashedPassword;
        const user = await newUser.save();
        return res.json(await loginUser(user));
      }
      catch (err) {
        next(err);
      }
    })
  });
});

router.post('/login', singleMulterUpload(""), validateLoginInput, async (req, res, next) => {
  passport.authenticate('local', async function (err, user) {
    if (err) return next(err);
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 400;
      err.errors = { email: "Invalid credentials" };
      return next(err);
    }
    return res.json(await loginUser(user));
  })(req, res, next);
});

router.get('/current', restoreUser, (req, res) => {
  if (!isProduction) {
    const csrfToken = req.csrfToken();
    res.cookie("CSRF-TOKEN", csrfToken);
  }
  if (!req.user) return res.json(null);
  res.json({
    _id: req.user._id,
    username: req.user.username,
    profileImageUrl: req.user.profileImageUrl,
    email: req.user.email
  });
});

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).select('-hashedPassword')
    .populate({
      path: 'likes',
      select: '_id title audioUrl author likes reverbs replies',
      populate: {
        path: 'author',
        select: '_id author username profileImageUrl'
      }
    })
    .populate({
      path: 'reverbs',
      select: '_id title audioUrl author likes reverbs replies',
      populate: {
        path: 'author',
        select: '_id author username profileImageUrl'
      }
    })
    .populate({
      path: 'echos',
      select: '_id title audioUrl likes reverbs replies'
    })
    .populate({
      path: 'followers',
      select: '_id username profileImageUrl'
    })
    .populate({
      path: 'following',
      select: '_id username ProfileImageUrl'
    })

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const userEchos = await Echo.find({ author: req.params.userId })
    .sort({ createdAt: -1 })
    .populate('author', '_id username profileImageUrl');
  const userEchosIds = userEchos.map(echo => echo._id)
  const userReverbEchos = await Echo.find({ _id: { $in: user.reverbs } })
    .sort({ createdAt: -1 })
    .populate('author', '_id username profileImageUrl');

  const reverbEchosWithAttribute = userReverbEchos.map(echo => {
    if (!userEchosIds.includes(echo._id)) {
     return {
        ...echo.toObject(),
        wasReverb: true
      }
    }
  })

  const profileFeed = [...userEchos, ...reverbEchosWithAttribute].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  await User.updateOne(
    { _id: req.params.userId },
    { $push: { profileFeed: profileFeed } },
    { returnNewDocument: true }
    )
  
  user.profileFeed = profileFeed
  // await user.save()
  return res.json(user)
})

router.get('/:userId/feed', async (req, res) => {
    try {
      const userId = req.params.userId
      const userFollowing = await User.findById(userId).select('following')
      if (!userFollowing) {
        return res.status(404).json({ error: 'User is not following anyone' })
      }
      const followingIds = userFollowing.following
      
      const originalEchos = await Echo.find({ author: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .populate('author', '_id username profileImageUrl');
      const reverbEchos = await Echo.find({ 'reverbs': { $in: followingIds } })
        .sort({ createdAt: -1 })
        .populate('author', '_id username profileImageUrl');
        
      const reverbEchosWithAttribute = reverbEchos.map((echo) => ({
        ...echo.toObject(),
        wasReverb: true,
      })).filter((reverbEcho) => {
        if (followingIds.includes(reverbEcho._id.toString())) {
          return false
        } else {
          return true
        }
      });
      const feed = [...originalEchos, ...reverbEchosWithAttribute].sort(
        (a, b) => b.createdAt - a.createdAt
      );
      return res.json(feed)
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put ('/follow/:userId', requireUser, async (req, res) => {
  try {
    const userToFollow = req.params.userId
    const loggedInUser = req.user._id

    await User.updateOne(
      {_id: userToFollow }, 
      {$push: {followers: loggedInUser}}
    )

    const result = await User.findOneAndUpdate(
      { _id: loggedInUser},
      { $push: { following: userToFollow } },
      {returnNewDocument: true}
    )

    return res.json(result)

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.put('/unfollow/:userId', requireUser, async (req, res) => {
  try {
    const userToUnFollow = req.params.userId
    const loggedInUser = req.user._id

    await User.updateOne(
      { _id: userToUnFollow },
      { $pull: { followers: loggedInUser } }
    )

    const result = await User.findOneAndUpdate(
      { _id: loggedInUser },
      { $pull: { following: userToUnFollow } },
      { returnNewDocument: true }
    )

    return res.json(result)

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

// router.get('/:userId/profile', async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Retrieve echos and reverbs of the user
//     const userEchos = await Echo.find({ author: userId })
//       .sort({ createdAt: -1 })
//       .populate('author', '_id username profileImageUrl');

//     // Retrieve reverb echos using the user's reverbs list
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const userReverbEchos = await Echo.find({ _id: { $in: user.reverbs } })
//       .sort({ createdAt: -1 })
//       .populate('author', '_id username profileImageUrl');

//     const reverbEchosWithAttribute = userReverbEchos.map((echo) => ({
//       ...echo.toObject(),
//       wasReverb: true,
//     }));

//     // Combine echos and reverb echos into a single array
//     const profileFeed = [...userEchos, ...reverbEchosWithAttribute].sort(
//       (a, b) => b.createdAt - a.createdAt
//     );

//     return res.json(profileFeed);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




// router.update()
// router.delete()

module.exports = router;