const mongoose = require('mongoose');
const moment = require('moment');

const AttachmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    taskId: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format('MMM DD')
    }
});

module.exports = mongoose.model('Attachment', AttachmentSchema);