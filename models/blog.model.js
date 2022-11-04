const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tags: {
        type: String
    },
    author: {
        type: String
    },
    timestamp: {
        type: String
    },
    state: {
        type: String,
        required: true,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        required: true,
        default: 0
    },
    reading_time: {
        type: String,
        required: true,
        default: "0s"
    },
    body: {
        type: String,
        required: true
    },
    user:
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
})

const blogModel = mongoose.model('blogs', blogSchema)

module.exports = {blogModel}