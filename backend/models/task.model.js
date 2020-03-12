const mongoose = require('mongoose');

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
        required: true
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentCount: Number,
    attachmentCount: Number
});

module.exports = mongoose.model('Task', TaskSchema);