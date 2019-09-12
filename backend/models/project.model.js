const mongoose = require('mongoose');
const moment = require('moment');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: String,
        default: moment(new Date()).format('MMM DD')
    }
});

module.exports = mongoose.model('Project', ProjectSchema);