const mongoose = require('mongoose');
const moment = require('moment');

const CommentSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format('MMM DD')
    }
});

module.exports = mongoose.model('Comment', CommentSchema);