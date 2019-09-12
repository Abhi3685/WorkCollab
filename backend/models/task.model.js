const mongoose = require('mongoose');
const moment = require('moment');

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listId: {
        type: Number,
        required: true
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format('MMM DD')
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    labels: {
        type: Array,
        default: []
    },
    commentCount: Number,
    attachmentCount: Number
});

module.exports = mongoose.model('Task', TaskSchema);