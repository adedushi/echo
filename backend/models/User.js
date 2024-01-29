const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    echos: [{
        type: Schema.Types.ObjectId,
        ref: 'Echo'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Echo'
    }],
    reverbs: [{
        type: Schema.Types.ObjectId,
        ref: 'Echo'
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);


/*
User Schema {
    username: {
        type: String,
        required: true
    },
    profileImgageUrl: {
        type: string,
        required: true
    },
    email: {
        type: string,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    echos: [<array of references ids to echos>],
    likes: [<array of reference ids to liked echos>],
    reverbs: [<array of reference ids to reposted echos>],
    replies: [<array of references ids to replies>]
}





*/