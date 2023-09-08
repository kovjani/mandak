module.exports = function (app, mysql, bcrypt) {
    app.post('/auth/login', function(request, response, next){

        var username = request.body.username;
        var user_password = request.body.password;

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        if(username && user_password)
        {
            db.query("SELECT * FROM users WHERE username = ?", [username], function(error, data){

                if(data.length > 0)
                {
                    for(var count = 0; count < data.length; count++)
                    {
                        bcrypt.compare(user_password, data[count].password, function(err, result){

                            if(result)
                            {
                                if(data[count-1].approved === 1){
                                    request.session.user_id = data[count-1].id;
                                    request.session.admin = data[count-1].admin;
                                    response.redirect("/");
                                }
                                else{
                                    response.send('<script>alert("Ez a fiók jóváhagyásra vár."); history.back();</script>');
                                }
                                db.end();
                            }
                            else{
                                response.send('<script>alert("Hibás jelszó."); history.back();</script>');
                                db.end();
                            }
                        });
                    }
                }
                else{
                    response.send('<script>alert("Hibás felhasználónév."); history.back();</script>');
                    db.end();
                }
            });
        }
        else{
            response.send('<script>alert("Hiányzó adatok."); history.back();</script>');
            db.end();
        }

    });
    
    app.get('/logout', function(request, response, next){

        request.session.destroy();
        response.redirect("/");
        
    });
    
};
