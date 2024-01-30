const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { loginUser, restoreUser } = require('../../config/passport');
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
        select: '_id author username'
      }
    })
    .populate({
      path: 'reverbs',
      select: '_id title audioUrl author likes reverbs replies',
      populate: {
        path: 'author',
        select: '_id author username'
      }
    })
    .populate({
      path: 'echos',
      select: '_id title audioUrl likes reverbs replies'
    })
  return res.json(user)
})

// router.update()
// router.delete()

module.exports = router;