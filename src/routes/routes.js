// Get calls 
module.exports = function (app, fs) {
    
    app.get('/', function(req, res, next){
        //res.render('karbantartas');
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('home', {user_id: req.session.user_id, files: files});
        return next();
    });
    /*app.get('/titok', function(req, res, next){
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('home', {user_id: req.session.user_id, files: files});
        return next();
    });*/
    app.get('/fellepesek', (req, res, next) => {
        res.render('events');
        return next();
    });
    app.get('/repertoar', (req, res, next) => {
        res.render('repertoire');
        return next();
    });
    app.get('/kantorkepzo', (req, res, next) => {
        res.render('kantorkepzo');
        return next();
    });
    app.get('/galeria', (req, res, next) => {
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('gallery', {files: files});
        return next();
    });

    app.get('/login', (req, res, next) => {
        res.render('login');
        return next();
    });
    
    app.get('/synchronize_google_drive', (req, res, next) => {
        if(req.session.admin){
            res.render('google_drive');
        }
        else{
            res.redirect("/");
        }
        return next();
    });
};