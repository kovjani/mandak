// module.exports = function (app, mysql, bcrypt) {
//     app.post("/auth/registration", (req, res) => {    
//         const { name, username, password, password_confirm, voice } = req.body
    
//         var db = mysql.createConnection({
//             host: '127.0.0.1',
//             user: 'everybody',
//             password: '',
//             database: 'mandak'
//         });

//         db.query('SELECT username FROM users WHERE username = ?', [username], async (error, result) => {
//             if(error){
//                 console.log(error);
//             }
//             res.setHeader('Content-Type', 'text/html');
//             if( result.length > 0 ) {
//                 res.send('<script>alert("Ez a felhasználónév már foglalt."); history.back();</script>');
//                 db.end();
//             } else if(password !== password_confirm) {
//                 res.send('<script>alert("A jelszavak nem egyeznek."); history.back();</script>');
//                 db.end();
//             }
//             else{
//                 let hashedPassword = await bcrypt.hash(password, 8);

//                 db.query('INSERT INTO users SET?', {name: name, username: username, password: hashedPassword, voice: voice}, (error, result) => {
//                     if(error) {
//                         console.log(error);
//                     } else {
//                         res.send('<script>alert("Sikeres regisztáció."); location.href = "/login"; </script>');
//                         db.end();
//                     }
//                 });
//             }
//         });
//     });
// };
