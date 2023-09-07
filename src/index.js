const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const process = require('process');
var bodyParser = require('body-parser');

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/mandak.ddns.net/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

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
    next();
});


require('./routes/routes')(app, path, fs);
require('./routes/data')(app, mysql, fs, path, process);
require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(app, mysql, bcrypt);

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
	console.log('HTTPS Server running on port 443');
});