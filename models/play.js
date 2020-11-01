const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const PlaySchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: [true, 'Title is unique']
    },

    description: {
        type: String,
        required: true,
        max: 50
    },

    imageUrl: {
        type: String,
        required: true
    },

    isPublic: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
    },

    usersLiked: [{
        type: ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('Play', PlaySchema);
