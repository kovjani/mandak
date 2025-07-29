const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const path = require('path');
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

//authenticate google using a web browser
//require('./routes/google')();

require('./routes/routes')(app, fs);
require('./routes/data')(app, mysql, fs);
// require('./routes/registration')(app, mysql, bcrypt);
require('./routes/login')(app, mysql, bcrypt);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/styles', express.static(path.join(__dirname, 'public', 'styles')));
app.use(express.static(path.join(__dirname, 'public')));

// HTTPS ////////////////////////////////////////////////////

// HTTPS needs certificate
/* const privateKey = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/mandak.hu/fullchain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate
};

// HTTP server and redirect to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
  res.end();
});

// HTTPS server
const httpsServer = https.createServer(credentials, app);

// start HTTP
httpServer.listen(80, () => {
  console.log('HTTP server on 80 and redirect to HTTPS.');
});

// start HTTPS
httpsServer.listen(443, () => {
  console.log('HTTPS server on 443.');
});*/

//////////////////////////////////////////////////////////////



// Only HTTP /////////////////////////////////////////////////

http.createServer(app).listen(80, () => {
  console.log(`Server running at http://127.0.0.1:80/`);
});

///////////////////////////////////////////////////////////////