const mongoose = require('mongoose')
const Schema = mongoose.Schema
const postSchema = Schema({
    user: {},
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        require: require
    },
    body: {
        type: String,
        required: true
    },
    file: {
        type: String,
    }
})

module.exports = mongoose.model('Post', postSchema)