const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Echo = mongoose.model('Echo');
const { requireUser } = require('../../config/passport');
const validateEchoInput = require('../../validations/echos');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

router.get('/', async (req, res) => {
    try {
        const echos = await Echo.find()
            .populate({
                path: 'author',
                select: '_id username profileImageUrl'
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replyAuthor',
                    select: '_id username profileImageUrl'
                }
            })
            .populate({
                path: 'likes',
                select: '_id username'
            })
            .populate({
                path: 'reverbs',
                select: '_id username'
            })
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
            .populate({
                path: 'author',
                select: '_id username profileImageUrl'
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replyAuthor',
                    select: '_id username profileImageUrl'
                }
            })
            .populate({
                path: 'likes',
                select: '_id username'
            })
            .populate({
                path: 'reverbs',
                select: '_id username'
            })
        return res.json(echos);
    }
    catch (err) {
        return res.json([]);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const echo = await Echo.findById(req.params.id)
            .populate({
                path: 'author',
                select: '_id username profileImageUrl'
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'replyAuthor',
                    select: '_id username profileImageUrl'
                }
            })
        return res.json(echo);
    }
    catch (err) {
        const error = new Error('Echo not found');
        error.statusCode = 404;
        error.errors = { message: "No echo found with that id" };
        return next(error);
    }
});

router.post('/', singleMulterUpload("recording"), requireUser, validateEchoInput, async (req, res, next) => {
    // const audioUrl = await singleFileUpload({ files: req.files, isPublic: true }) 
    const audioUrl = "https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3"
    try {
        const newEcho = new Echo({
            title: req.body.title,
            audioUrl,
            author: req.user._id
        });

        let echo = await newEcho.save();
        echo = await echo.populate("author", "_id username profileImageUrl");
        const userUpdateResult = await User.updateOne({ _id: req.user._id }, { $push: { echos: echo._id } });
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }
        return res.json(echo);
    }
    catch (err) {
        next(err);
    }
});

router.delete('/:echoId', requireUser, async (req, res) => {
    try {
        const result = await Echo.deleteOne({ _id: req.params.echoId })
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Echo not found'})
        }
        const userUpdateResult = await User.updateOne({ _id: req.user._id }, { $pull: { echos: req.params.echoId } });
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }
        return res.json({message: 'Echo deleted successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error'})
    }
})

router.put('/updateTitle/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const { newTitle } = req.body

        const result = await Echo.updateOne({ _id: echoId }, { $set: { title: newTitle } })

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }

        return res.json({ message: 'Title updated successfully' })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/addLike/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const userId = req.user._id
        const result = await Echo.updateOne({ _id: echoId }, { $push: { likes: userId} });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }

        const userUpdateResult = await User.updateOne( { _id: userId }, { $push: { likes: echoId } } );
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }

        return res.json({ message: 'Like has been added' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/removeLike/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const userId = req.user._id
        const result = await Echo.updateOne({ _id: echoId }, { $pull: { likes: userId } });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }

        const userUpdateResult = await User.updateOne({ _id: userId }, { $pull: { likes: echoId } });
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }

        return res.json({ message: 'Like has been removed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/addReply/:echoId', singleMulterUpload("recording"), requireUser, async (req, res) => {
    // const audioUrl = await singleFileUpload({ files: req.files, isPublic: true }) 
    const audioUrl = "https://teamlab-echo.s3.amazonaws.com/public/baby-shark.mp3"
    try {
        const newReply = {
            replyAuthor: req.user._id,
            replyAudioUrl: audioUrl,
            replyText: req.body.text
        }
        const echoId = req.params.echoId
        const result = await Echo.updateOne({ _id: echoId }, { $push: { replies: newReply } });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }
        return res.json({ message: 'Reply has been added' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/removeReply/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const replyId = req.body.replyId
        const result = await Echo.updateOne({ _id: echoId }, { $pull: { replies: { _id: replyId } } });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }
        return res.json({ message: 'Reply has been removed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/likeReply/:echoId/:replyId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const replyId = req.params.replyId
        const userId = req.user._id
        const result = await Echo.updateOne(
            { _id: echoId, 'replies._id': replyId },
            { $push: { 'replies.$.replyLikes': userId } }
        );
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }
        return res.json({ message: 'Reply has been liked' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/unlikeReply/:echoId/:replyId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const replyId = req.params.replyId
        const userId = req.user._id
        const result = await Echo.updateOne(
            { _id: echoId, 'replies._id': replyId },
            { $pull: { 'replies.$.replyLikes': userId } }
        );
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }
        return res.json({ message: 'Reply like has been removed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/addReverb/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const userId = req.user._id
        const result = await Echo.updateOne({ _id: echoId }, { $push: { reverbs: userId } });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }

        const userUpdateResult = await User.updateOne({ _id: userId }, { $push: { reverbs: echoId } });
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }

        return res.json({ message: 'Reverb has been added' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/removeReverb/:echoId', requireUser, async (req, res) => {
    try {
        const echoId = req.params.echoId
        const userId = req.user._id
        const result = await Echo.updateOne({ _id: echoId }, { $pull: { reverbs: userId } });
        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Echo not found or no modifications made' });
        }

        const userUpdateResult = await User.updateOne({ _id: userId }, { $pull: { reverbs: echoId } });
        if (userUpdateResult.nModified === 0) {
            return res.status(404).json({ error: 'User not found or no modifications made' });
        }

        return res.json({ message: 'Reverb has been removed' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


module.exports = router;