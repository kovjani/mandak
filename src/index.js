const http = require('http');
const https = require('https');
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

// Let's Encrypt certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

//authenticate google using a web browser
//require('./routes/google')();

require('./routes/routes')(app, fs);
require('./routes/data')(app, mysql, fs);
require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(app, mysql, bcrypt);

app.use(express.static('public'));
app.set('view engine', 'ejs');

const hostname = '127.0.0.1';
 
http.createServer(app).listen(80, () => {
  console.log(`Server running at http://${hostname}:80/`);
});

https.createServer(credentials, app).listen(443, () => {
    console.log(`Server running at http://${hostname}:443/`);
  });