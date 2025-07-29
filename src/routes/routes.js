// Get calls 
module.exports = function (app, fs) {

    app.get('/', function(req, res, next){
        //res.render('karbantartas');
        // let files = fs.readdirSync('./public/img/gallery/');
        // res.render('main', {user_id: req.session.user_id, files: files});
        res.render('main/main');
        return next();
    });
    
    /*app.get('/titok', function(req, res, next){
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('home', {user_id: req.session.user_id, files: files});
        return next();
    });*/

    /*app.get('/home', function(req, res, next){
        res.render('home');
        return next();
    });
    app.get('/events', (req, res, next) => {
        res.render('events');
        return next();
    });
    app.get('/repertoire', (req, res, next) => {
        res.render('repertoire');
        return next();
    });
    app.get('/villa', (req, res, next) => {
        res.render('villa');
        return next();
    });
    app.get('/gallery', (req, res, next) => {
        let files = fs.readdirSync('./public/img/gallery/');
        res.render('gallery', {files: files});
        return next();
    });

    app.get('/login', (req, res, next) => {
        res.render('login');
        return next();
    });*/
    
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