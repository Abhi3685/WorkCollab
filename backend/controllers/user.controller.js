const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../models/user.model');

// Nodemailer Configuration
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'exampletest469@gmail.com',
        pass: 'qpalwosk1029'
    }
});

// Register User
router.post('/register', async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.json({ err: 'Email Already Exists' });
    } else {
        user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 12);
        await user.save();
        res.json({ msg: 'Registeration Success' });
    }
});

// Login User
router.post('/login', async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.json();
    else {
        let match = await bcrypt.compare(req.body.password, user.password);
        if (!match) res.json({ err: 'Invalid Email or Password' });
        else {
            req.session._id = user._id;
            res.json({ _id: user._id, email: user.email, name: user.name });
        }
    }
});

// Send Forgot Pass Mail
router.post('/forgotpass', async(req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.json({ err: 'No User Found' });
    else {
        let info = await transporter.sendMail({
            from: 'exampletest469@gmail.com',
            to: req.body.email,
            subject: 'Reset Your Password -- WorkCollab',
            html: `Hello ${user.name},<br>We heard you need a password reset. 
            Click the link below and you'll be redirected to a secure site from which you can set a new password.<br>
            <br><a href='http://localhost:4200/reset?id=${user._id}'>Reset Password</a><br>
            <p>If you didn't try to reset your password, feel free to forget this ever happened.</p>`
        });
        res.json({ msg: 'Mail Sent' });
    }
});

// Reset Password
router.post('/resetpass', async(req, res) => {
    let user = await User.findById(req.body.userId);
    if (!user) return res.json({ err: 'No User Found' });
    else {
        let hash = await bcrypt.hash(req.body.password, 12);
        user.password = hash;
        let updatedUser = await user.save();
        res.json({ msg: 'Password Reset!' });
    }
});

// Logout User.
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json();
});

module.exports = router;