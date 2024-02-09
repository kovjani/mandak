//Middleware declarations (paths) 
//const Connection = require('mysql/lib/Connection');
var renderMW = require('../middlewares/generic/renderMW');


// ObjectRepositiory declaration
// Get calls 
module.exports = function (app, fs) {
    var objectRepository = {};
    
    app.get('/', function(req, res, next){
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('home', {user_id: req.session.user_id, files: files});
        next();
    });
    app.get('/events', (req, res, next) => {
        res.render('events');
        next();
    });
    app.get('/repertoire', (req, res, next) => {
        res.render('repertoire');
        next();
    });
    app.get('/login',
        renderMW(objectRepository, 'login')
    );
    app.get('/kantorkepzo',
        renderMW(objectRepository, 'kantorkepzo')
    );
    app.get('/gallery', (req, res, next) => {
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('gallery', {files: files});
        next();
    });
    app.get('/synchronize_google_drive', (req, res, next) => {
        if(req.session.admin){
            res.render('google_drive');
        }
        else{
            res.redirect("/");
        }
        next();
    });
};