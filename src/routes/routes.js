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
    app.get('/places',
        renderMW(objectRepository, 'places')
    );
    app.get('/repertoire',
        renderMW(objectRepository, 'repertoire')
    );
    app.get('/login',
        renderMW(objectRepository, 'login')
    );
    // app.get('/registration',
    //     renderMW(objectRepository, 'registration')
    // );
    app.get('/kantorkepzo',
        renderMW(objectRepository, 'kantorkepzo')
    );
    app.get('/donate',
        renderMW(objectRepository, 'donate')
    );
    app.get('/gallery', (req, res, next) => {
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('gallery', {files: files});
        next();
    });
};