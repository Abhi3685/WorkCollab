const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Project = require('../models/project.model');
const Task = require('../models/task.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Attachment = require('../models/attachment.model');

// Add new project.
router.post('/add', async(req, res) => {
    let projectObject = new Project({
        name: req.body.name,
        ownerId: req.session._id,
        users: [mongoose.Types.ObjectId(req.session._id)]
    });
    let project = await projectObject.save();
    let updatedUser = await User.findByIdAndUpdate(req.session._id, { $push: { projects: project._id } });
    res.json({ msg: 'Project Created', _id: project._id });
});

// Get Particular Project.
router.get('/:projectId', async(req, res) => {
    let project = await Project.findById(req.params.projectId).populate('users');
    res.json(project);
});

// Get User Projects.
router.get('/', async(req, res) => {
    let user = await User.findById(req.session._id);
    if (user.projects.length == 0) return res.json([]);
    else {
        let userProjects = [];
        user.projects.forEach(projectId => {
            Project.findById(projectId).then(project => {
                userProjects.push(project);
                if (user.projects.length == userProjects.length) res.json(userProjects.sort());
            }).catch(err => console.log(err));
        });
    }
});

// Update Project
router.patch('/:projectId', async(req, res) => {
    let project = await Project.findByIdAndUpdate(req.params.projectId, { $set: req.body }, { new: true }).populate('users');
    res.json(project);
});

// Delete Project
router.delete('/:projectId', async(req, res) => {
    // 1. Delete Project & Update User
    var project = await Project.findByIdAndRemove(req.params.projectId);
    var pdelete = new Promise((resolve, reject) => {
        var count = 0;
        project.users.forEach(userId => {
            User.findById(userId).then(user => {
                var index = user.projects.indexOf(req.params.projectId);
                user.projects.splice(index, 1);
                user.save();
                if (++count == project.users.length) resolve();
            }).catch(err => {
                console.log(err);
                reject();
            });
        });
    });
    // 2. Delete Tasks, Comments & Attachments
    pdelete.then(async() => {
        await Task.deleteMany({ projectId: req.params.projectId });
        await Comment.deleteMany({ projectId: req.params.projectId });
        await Attachment.deleteMany({ projectId: req.params.projectId });
        res.json();
    });
});

// Add Project Member.
router.post('/adduser', async(req, res) => {
    var user = await User.findOne({ email: req.body.userEmail });
    if (!user) res.json({ msg: 'No User Found!' });
    else if (user.projects.indexOf(req.body.projectId) > -1) {
        res.json({ msg: 'User Already A Member' });
    } else {
        user.projects.push(mongoose.Types.ObjectId(req.body.projectId));
        var user = await user.save();
        var project = await Project.findById(req.body.projectId);
        project.users.push(mongoose.Types.ObjectId(user._id));
        await project.save();
        res.json({ msg: 'Member Added Successfully', _id: user._id });
    }
});

// Remove Project Member.
router.post('/removeuser', async(req, res) => {
    var user = await User.findById(req.body.userId);
    var pindex = user.projects.indexOf(req.body.projectId);
    if (pindex > -1) user.projects.splice(pindex, 1);
    await user.save();
    var project = await Project.findById(req.body.projectId);
    var uindex = project.users.indexOf(req.body.userId);
    if (uindex > -1) project.users.splice(uindex, 1);
    await project.save();
    res.json({ msg: 'Member Removed Successfully' });
});

// Leave Project
router.post('/leave', async(req, res) => {
    let project = await Project.findById(req.body.projectId);
    let index = project.users.indexOf(req.session._id);
    project.users.splice(index, 1);
    await project.save();
    let user = await User.findById(req.session._id);
    let index2 = user.projects.indexOf(req.body.projectId);
    user.projects.splice(index2, 1);
    await user.save();
    res.json();
});

// Project Users.
router.post('/users', async(req, res) => {
    var users = [];
    req.body.userIds.forEach(async userId => {
        let user = await User.findById(userId);
        users.push(user);
        if (users.length == req.body.userIds.length) res.json(users);
    });
});

module.exports = router;