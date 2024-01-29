const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const echoSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrls: {
        type: [String],
        required: false
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Echo', echoSchema);