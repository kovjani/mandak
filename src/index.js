const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const session = require('express-session');
const app = express();
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
/*const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/fullchain.pem', 'utf8');*/


const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate
	// ca: ca
};

//authenticate google using a web browser
//require('./routes/google')();

require('./routes/routes')(app, fs);
require('./routes/data')(app, mysql, fs);
require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(app, mysql, bcrypt);

app.use(express.static('public'));
app.set('view engine', 'ejs');

/*const hostname = '127.0.0.1';
 
http.createServer(app).listen(80, () => {
  console.log(`Server running at http://${hostname}:80/`);
});

https.createServer(credentials, app).listen(443, () => {
    console.log(`Server running at http://${hostname}:443/`);
});*/

// HTTP szerver létrehozása és átirányítás HTTPS-re
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
});

const httpsServer = https.createServer(credentials, app);

// HTTP szerver indítása
httpServer.listen(80, () => {
  console.log('HTTP szerver fut a 80-as porton és átirányít HTTPS-re');
});

// HTTPS szerver indítása
httpsServer.listen(443, () => {
  console.log('HTTPS szerver fut a 443-as porton');
});
