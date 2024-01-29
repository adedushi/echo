const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Echo = mongoose.model('Echo');
const { requireUser } = require('../../config/passport');
const validateEchoInput = require('../../validations/echos');

router.get('/', async (req, res) => {
    try {
        const echos = await Echo.find()
            .populate("author", "_id username profileImageUrl")
            .sort({ createdAt: -1 });
        return res.json(echos);
    }
    catch (err) {
        return res.json([]);
    }
});

router.get('/user/:userId', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.userId);
    } catch (err) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const echos = await Echo.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate("author", "_id username profileImageUrl");
        return res.json(echos);
    }
    catch (err) {
        return res.json([]);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const echo = await Echo.findById(req.params.id)
            .populate("author", "_id username profileImageUrl");
        return res.json(echo);
    }
    catch (err) {
        const error = new Error('Echo not found');
        error.statusCode = 404;
        error.errors = { message: "No echo found with that id" };
        return next(error);
    }
});

router.post('/', requireUser, validateEchoInput, async (req, res, next) => {
    try {
        const newEcho = new Echo({
            text: req.body.text,
            author: req.user._id
        });

        let echo = await newEcho.save();
        echo = await echo.populate('author', '_id username');
        return res.json(echo);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;