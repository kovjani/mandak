//Middleware declarations (paths) 
//const Connection = require('mysql/lib/Connection');
var renderMW = require('../middlewares/generic/renderMW');


// ObjectRepositiory declaration
// Get calls 
module.exports = function (app, path, fs) {
    var objectRepository = {};
    
    app.get('/', function(req, res, next){
        res.render('home', {user_id: req.session.user_id});
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
    app.get('/registration',
        renderMW(objectRepository, 'registration')
    );
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

    //letsencrypt
    app.get('/.well-known/acme-challenge/-cJfQcDzz8-VyfYH4Wl1lNAdICEN4d3-_ZtTHYHOVgw', function(request, response){
        const options = {
            root: path.join('../.well-known/acme-challenge/')
        };
    
        const fileName = '-cJfQcDzz8-VyfYH4Wl1lNAdICEN4d3-_ZtTHYHOVgw';
        response.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
            } else {
                //console.log('Sent:', fileName);
            }
        });
    });
};