const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const echoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    audioUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    replies: [{
        replyAuthor: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        replyAudioUrl: {
            type: String,
            validate: {
                validator: function () {
                    return !this.text; // Validation only if text is not present
                },
                message: 'audioUrl is required if text is not present'
            }
        },
        replyText: {
            type: String,
            validate: {
                validator: function () {
                    return !this.audioUrl; // Validation only if audioUrl is not present
                },
                message: 'text is required if audioUrl is not present'
            }
        },
        replyLikes: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    reverbs: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Echo', echoSchema);



/*
ECHO SCHEMA {
    Author: {
        type: reference id,
        ref: User
    },
    audioUrl: {
        type: String,
        required: true
    },
    title: {
        type: string,
        required: true
    },
    replies: [
        {
            Author: {
                type: reference id,
                ref: User
            },
            audioUrl: {
                type: string,
                required: false (only if text is true)
            },
            text: {
                type: string,
                required: false (only if audio is true)
            },
            likes: [<array of user ids>]
        }
    ],
    likes: [<array of user ids>],
    reverbs: [<array of users that have reposted this echo>]
}
*/