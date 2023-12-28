const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.tpl = {};
    res.tpl.error = [];
    return next();
});

app.use(session({
    secret : 'mandakkorus',
    resave : true,
    saveUninitialized : true
}));

app.use(function(req, res, next) {
    res.locals.user_id = req.session.user_id;
    res.locals.admin = req.session.admin;
    next();
});

//authenticate google using a web browser
//require('./routes/google')();

require('./routes/routes')(app, fs);
require('./routes/data')(app, mysql, fs);
require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(app, mysql, bcrypt);

app.use(express.static('public'));
app.set('view engine', 'ejs');

const hostname = '127.0.0.1';
const port = 3000;
 
const server = http.createServer(app);
 
server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});