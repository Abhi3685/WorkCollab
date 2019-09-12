const express = require('express');
const router = express.Router();

const Comment = require('../models/comment.model');

// Add Comment.
router.post('/add', async(req, res) => {
    var comment = new Comment({
        taskId: req.body.taskId,
        projectId: req.body.projectId,
        assignedUser: req.session._id,
        comment: req.body.comment
    });
    await comment.save();
    res.json({ msg: 'Comment Added Successfully' });
});

// Get Task Comments.
router.get('/:taskId', async(req, res) => {
    let comments = await Comment.find({ taskId: req.params.taskId }).populate('assignedUser');
    res.json(comments);
});

// Delete Comment.
router.delete('/:commentId', async(req, res) => {
    await Comment.findByIdAndRemove(req.params.commentId);
    res.json({ msg: 'Comment Deleted!' });
});

module.exports = router;