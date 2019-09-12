const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Task = require('../models/task.model');
const Comment = require('../models/comment.model');
const Attachment = require('../models/attachment.model');

// Add Task.
router.post('/add', async(req, res) => {
    var task = new Task({
        name: req.body.name,
        description: req.body.desc,
        projectId: mongoose.Types.ObjectId(req.body.pId),
        listId: req.body.listId
    });
    await task.save();
    res.json({ msg: 'Task Created Successfully' });
});

// Get Task.
router.get('/:taskId', async(req, res) => {
    let task = await Task.findById(req.params.taskId).populate('assignedUser');
    res.json(task);
});

// Update Task.
router.patch('/:taskId', async(req, res) => {
    let task = await Task.findById(req.params.taskId);
    if (req.body.assignedUser && !req.body.assignedUser.name) {
        req.body.assignedUser = mongoose.Types.ObjectId(req.body.assignedUser);
    } else if (!req.body.assignedUser) {
        req.body.assignedUser = undefined;
    }
    task.description = req.body.description;
    task.name = req.body.name;
    if (req.body.listId) task.listId = req.body.listId;
    task.assignedUser = req.body.assignedUser;
    task.labels = req.body.labels;
    await task.save();
    res.json({ msg: 'Task Updated!' });
});

// Delete Task.
router.delete('/:taskId', async(req, res) => {
    await Task.findByIdAndRemove(req.params.taskId);
    res.json({ msg: 'Task Deleted!' });
});

// Get Project Tasks.
router.get('/project/:projectId', async(req, res) => {
    var tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedUser');
    var taskCount = tasks.length,
        currCount = 0;
    if (taskCount == currCount) res.json([]);
    tasks.forEach(async task => {
        var comments = await Comment.find({ taskId: task._id });
        task.commentCount = comments.length;
        var attachments = await Attachment.find({ taskId: task._id });
        task.attachmentCount = attachments.length;
        if (taskCount == ++currCount) res.json(tasks);
    });
});

module.exports = router;