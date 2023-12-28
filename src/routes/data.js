const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

module.exports = function (app, mysql, fs) {

    var renderMW = require('../middlewares/generic/renderMW');

    // Google drive

    const { google } = require('googleapis');
    
    // Set up Google Drive API credentials
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));
    const token = JSON.parse(fs.readFileSync('token.json'));
    
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    
    // Set up Google Drive API
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });


    app.post('/repertoire', function(request, response) {

        if(request.body.search_item === undefined){
            response.end();
            return;
        }

        let author, title, query;

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        //author: title
        if(request.body.search_item.includes(':')){
            let splitted_search_item = request.body.search_item.split(':');
            author = splitted_search_item[0].trim();
            title = splitted_search_item[1].trim();
            query = `SELECT * FROM repertoire
            WHERE author LIKE ?
            AND title LIKE ?
            ORDER BY author, title`;
        }
        else{
            author = request.body.search_item;
            title = request.body.search_item;
            query = `SELECT * FROM repertoire
            WHERE author LIKE ?
            OR title LIKE ?
            ORDER BY author, title`;
        }

        author = '%' + author + '%';
        title = '%' + title + '%';

        db.query(query, [author, title], function (err, result){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });

    app.post('/events', function(request, response) {

        if(request.body.search_item === undefined){
            response.end();
            return;
        }

        let author, title;

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        //author: title
        if(request.body.search_item.includes(':')){
            let splitted_search_item = request.body.search_item.split(':');
            author = splitted_search_item[0].trim();
            title = splitted_search_item[1].trim();

            title = '%' + title + '%';
            author = '%' + author + '%';

            db.query(`SELECT DISTINCT events.*, FROM events
                    LEFT OUTER JOIN music_to_events
                    ON  music_to_events.event = events.id
                    LEFT OUTER JOIN repertoire
                    ON  music_to_events.music = repertoire.id
                    WHERE repertoire.title LIKE ?
                    AND repertoire.author LIKE ?
                    ORDER BY events.date DESC, events.place`,
            [title, author],
            function (err, result, fields){
                if(err) throw err;
                response.send(result);
                db.end();
            });
        }
        else{
            let search_item = '%' + request.body.search_item + '%';

            db.query(`SELECT DISTINCT events.* FROM events
                    LEFT OUTER JOIN music_to_events
                    ON  music_to_events.event = events.id
                    LEFT OUTER JOIN repertoire
                    ON  music_to_events.music = repertoire.id
                    WHERE events.place LIKE ?
                    OR events.event LIKE ?
                    OR events.date LIKE ?
                    OR repertoire.title LIKE ?
                    OR repertoire.author LIKE ?
                    ORDER BY events.date DESC, events.place`,
            [search_item, search_item, search_item, search_item, search_item],
            function (err, result, fields){
                if(err) throw err;
                response.send(result);
                db.end();
            });
        }
    });

    app.post('/events_to_music', function(request, response){

        if(request.body.music_id === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT events.id AS event_id, events.date, events.place, music_to_events.audio FROM events
                    LEFT OUTER JOIN music_to_events
                    ON music_to_events.event = events.id
                    WHERE music_to_events.music = ?
                    ORDER BY events.place, events.date`,
        [parseInt(request.body.music_id)],
        function (err, result, fields){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });

    app.post('/music_to_events', function(request, response){

        if(request.body.event === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT repertoire.id AS music_id, repertoire.author, repertoire.title, music_to_events.audio FROM repertoire
                    LEFT OUTER JOIN music_to_events
                    ON music_to_events.music = repertoire.id
                    WHERE music_to_events.event = ?
                    ORDER BY repertoire.author, repertoire.title`,
        [parseInt(request.body.event)],
        function (err, result, fields){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });

    //get the best track from the music which has been recorded during an event
    app.post('/get_best_music', (request, response) => {

        if(request.body.music === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT best_music_event AS event FROM  repertoire 
                    WHERE id = ?`,
            [parseInt(request.body.music)], 
            function (err, res, fields){
                if(err) throw err;
                response.send(res);
                db.end();
            }
        );
    });

    app.post('/get_images', (request, response) => {

        if(request.body.event_id === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'admin',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT image FROM images_to_events 
                    WHERE event = ?`,
            [parseInt(request.body.event_id)], 
            function (err, res, fields){
                if(err) throw err;
                response.send(res);
                db.end();
            }
        );
    });

    app.post('/insert_best_music', (request, response) => {

        if(!request.session.admin || request.body.event_id === undefined || request.body.music_id === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'admin',
            password: '',
            database: 'mandak'
        });

        let music_id = request.body.music_id;
        let event_id = request.body.event_id;

        db.query(`UPDATE repertoire
                SET best_music_event = ?
                WHERE id = ?`,
            [parseInt(event_id), parseInt(music_id)], (err, res) => {
                if(err) throw err;
                response.send(res);
                db.end();
            }
        );
    });

    app.post('/insert_best_image', (request, response) => {

        if(!request.session.admin || request.body.event_id === undefined || request.body.cover_image === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'admin',
            password: '',
            database: 'mandak'
        });

        let cover_image = request.body.cover_image;
        let event_id = request.body.event_id;

        db.query(`UPDATE events
                SET cover_image = ?
                WHERE id = ?`,
            [cover_image, parseInt(event_id)], (err, res) => {
                if(err) throw err;
                response.send(res);
                db.end();
            }
        );

    });

    app.post('/synchronize_google_drive', async function(request, response){

        if(!request.session.admin){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'admin',
            password: '',
            database: 'mandak'
        });

        db.query('SELECT * FROM events', async (err, events) => {
            if(err) throw err;

            //update repertoire, images, music_to_events and images_to_events tables

            await DBQuery(db, "DELETE FROM music_to_events", []);
            await DBQuery(db, "DELETE FROM images_to_events", []);

            for (let i = 0; i < events.length; i++) {
                if(events[i].folder !== null && events[i].folder !== undefined){
            
                    let folderId = events[i].folder.replace("https://drive.google.com/drive/folders/", "").split('?')[0];

                    //audio var

                    //console.log(events[i].folder);
                    let audio_folder = await ListDriveFolderContent(folderId, 'audio');
                    let track_list;
                    try{
                        track_list = await ListDriveFolderContent(audio_folder[0].id, '');
                    }catch(e){
                        console.log(events[i].id);
                        continue;
                    }
                    let author, title;

                    //images var

                    let images_folder = await ListDriveFolderContent(folderId, 'images');
                    let image_list;
                    try{
                        image_list = await ListDriveFolderContent(images_folder[0].id, '');
                    }catch(e){
                        continue;
                    }

                    //audio db

                    for(let j=0; j<track_list.length; j++){
                        //if there is no _
                        if(track_list[j].name.includes('_')){
                            let author_title = track_list[j].name.split('_');

                            author = author_title[0];
                            title = author_title[1];

                            author = author.trim();
                        }
                        else{
                            author = "";
                            title = track_list[j].name;
                        }

                        title = title.replace(".mp3", "");
                        title = title.replace(".m4a", "");
                        title = title.replace(".mp4", "");
                        title = title.replace(".wma", "");
                        title = title.replace(".wav", "");
                        title = title.replace(".ogg", "");
                        title = title.trim();

                        await DBQuery(db, 
                            `INSERT INTO repertoire (author, title)
                            SELECT ?, ?
                            FROM dual
                            WHERE NOT EXISTS (
                                SELECT 1
                                FROM repertoire
                                WHERE author LIKE ?
                                AND title LIKE ?
                            )`,
                            [author, title, author, title]
                        ).catch((err) => {throw err});

                        await DBQuery(db, 
                            `SELECT id FROM repertoire
                            WHERE author LIKE ?
                            AND title LIKE ?`, 
                            [author, title]
                        ).then(async (selected_music) => {
                            await DBQuery(db, 
                                `DELETE FROM music_to_events
                                WHERE music = ?
                                AND event = ?
                                AND audio NOT LIKE ?`,
                                [selected_music[0].id, events[i].id, `https://docs.google.com/uc?export=download&id=${track_list[j].id}`]
                            ).catch((err) => {throw err});

                            await DBQuery(db, 
                                `INSERT INTO music_to_events (music, event, audio)
                                SELECT ?, ?, ?
                                FROM dual
                                WHERE NOT EXISTS (
                                    SELECT 1
                                    FROM music_to_events
                                    WHERE music = ?
                                    AND event = ?
                                )`,
                                [selected_music[0].id, events[i].id, `https://docs.google.com/uc?export=download&id=${track_list[j].id}`, selected_music[0].id, events[i].id]
                            );
                        }).catch((err) => {throw err});
                    }

                    // images db
                    for(let j=0; j<image_list.length; j++){

                        await DBQuery(db, 
                            `INSERT INTO images_to_events (event, image)
                            SELECT ?, ?
                            FROM dual
                            WHERE NOT EXISTS (
                                SELECT 1
                                FROM images_to_events
                                WHERE event = ?
                                AND image LIKE ?
                            )`,
                            [events[i].id, `https://drive.google.com/uc?export=view&id=${image_list[j].id}`, events[i].id, `https://drive.google.com/uc?export=view&id=${image_list[j].id}`]
                        );
                    }
                }
            }
            response.send(`<script>alert("Sikeres szinkronizálás."); history.back();</script>`);

            db.end();
        });
    });

    async function ListDriveFolderContent(folderId, fileName){
        let drive_response = await drive.files.list({
            q: `'${folderId}' in parents and name contains '${fileName}'`,
            fields: 'nextPageToken, files(id, name)',
        });
        return drive_response.data.files;
    }

    function DBQuery(db, query, parameters){
        return new Promise((resolve, reject) => {
            db.query(query, parameters, (err, res) => {
                if(err) reject(err);
                else resolve(res);
            });
        });
    }
};