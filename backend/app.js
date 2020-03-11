const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');

const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);
require('./socket')(io);

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use(express.static('uploads'));
app.use(session({
    secret: 'mysecretkey',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ url: 'mongodb+srv://root:rootpass@cluster0-ovgxm.mongodb.net/appdb' })
}));
mongoose.set('useFindAndModify', false);

const AuthCheck = function(req, res, next) {
    if (!req.session._id) return res.json({ err: 'Unauthorized Access' });
    next();
};

var attachmentController = require('./controllers/attachment.controller');
var userController = require('./controllers/user.controller');
var projectController = require('./controllers/project.controller');
var taskController = require('./controllers/task.controller');
var commentController = require('./controllers/comment.controller');
app.use('/attachment', AuthCheck, attachmentController);
app.use('/user', userController);
app.use('/project', AuthCheck, projectController);
app.use('/task', AuthCheck, taskController);
app.use('/comment', AuthCheck, commentController);

const mongoDB = 'mongodb+srv://root:rootpass@cluster0-ovgxm.mongodb.net/appdb';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
    server.listen(8000);
    console.log("Server started!");
});