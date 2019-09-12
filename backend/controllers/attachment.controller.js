const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const Attachment = require('../models/attachment.model');

// Multer Configuration.
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});
var upload = multer({ storage: storage });

// Add Attachment.
router.post('/add', upload.single('uploadFile'), (req, res) => {
    if (!req.file)
        return res.json({ err: 'No File Found!' });
    var attachment = new Attachment({
        name: req.file.originalname,
        fileUrl: 'http://localhost:8000/' + req.file.filename,
        taskId: req.body.taskId,
        projectId: req.body.projectId
    });
    attachment.save().then(attachment => {
        res.json(attachment);
    }).catch(err => console.log(err));
});

// Get All Attachments.
router.get('/:taskId', (req, res) => {
    Attachment.find({ taskId: req.params.taskId }).then(attachments => {
        res.json(attachments);
    }).catch(err => console.log(err));
});

// Delete Attachment.
router.delete('/:attachmentId', (req, res) => {
    Attachment.findByIdAndRemove({ _id: req.params.attachmentId }).then(attachment => {
        fs.unlinkSync('./uploads/' + attachment.fileUrl.replace('http://localhost:8000/', ''));
        res.json({ msg: 'Attachment Deleted!' });
    }).catch(err => console.log(err));
});

module.exports = router;