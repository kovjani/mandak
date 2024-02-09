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


    app.post('/repertoire_data', function(request, response) {

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
            ORDER BY surname, author, title`;
        }
        else{
            author = request.body.search_item;
            title = request.body.search_item;
            query = `SELECT * FROM repertoire
            WHERE author LIKE ?
            OR title LIKE ?
            ORDER BY surname, author, title`;
        }

        author = '%' + author + '%';
        title = '%' + title + '%';

        db.query(query, [author, title], function (err, result){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });

    app.post('/events_data', function(request, response) {

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

        db.query(`SELECT events.id AS event_id, events.date, events.place, events.local_folder AS folder, music_to_events.audio FROM events
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

        db.query(`SELECT repertoire.best_music_event AS event, events.local_folder AS folder FROM repertoire
                    INNER JOIN events ON repertoire.best_music_event = events.id
                    WHERE repertoire.id = ?`,
            [parseInt(request.body.music)],
            function (err, res, fields){
                if(err) throw err;
                response.send(res);
                db.end();
            }
        );
    });

    //get the author's surname (for order)
    app.post('/get_surname', (request, response) => {

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

        db.query(`SELECT surname FROM repertoire
                    WHERE id = ?`,
            [parseInt(request.body.music)],
            function (err, res, fields){
                if(err) throw err;
                response.send(res[0].surname);
                db.end();
            }
        );
    });

    app.post('/insert_surname', (request, response) => {

        let author = request.body.author;
        let surname = request.body.surname;

        if(!request.session.admin || author === undefined || surname === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'admin',
            password: '',
            database: 'mandak'
        });

        db.query(`UPDATE repertoire
                SET surname = ?
                WHERE author = ?`,
            [surname, author], (err, res) => {
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

    app.post('/get_images_drive_folder', (request, response) => {

        if(request.body.event_id === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        let event_id = request.body.event_id;

        db.query(`SELECT images_drive_folder FROM events WHERE id = ?`,
            [parseInt(event_id)], async (err, res) => {
                if(err) throw err;

                // let folderId = res[0].folder.replace("https://drive.google.com/drive/folders/", "").split('?')[0];
                // let images_folder = await ListDriveFolderContent(folderId, 'images');

                response.send(res);
                db.end();
            }
        );
    });

    app.post('/get_local_images', (request, response) => {

        if(request.body.event_id === undefined){
            response.end();
            return;
        }

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        let event_id = request.body.event_id;

        db.query(`SELECT local_folder FROM events WHERE id = ?`,
            [parseInt(event_id)], async (err, images_folder) => {
                if(err) throw err;

                if(images_folder[0].local_folder === null){
                    response.end();
                    db.end();
                    return;
                }

                // let folderId = res[0].folder.replace("https://drive.google.com/drive/folders/", "").split('?')[0];
                // let images_folder = await ListDriveFolderContent(folderId, 'images');

                let images = [];
                let folder = `./public/events_folder/${images_folder[0].local_folder}/images/`;

                await fs.readdirSync(folder).forEach(file => {
                    images.push({
                        "image": `/events_folder/${images_folder[0].local_folder}/images/${file}`,
                        "name": file
                    });
                });

                response.send(images);
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
            database: 'mandak',
            multipleStatements: true
        });

        let all_music_in_google_drive = new Set();

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

                    //images folder url to db

                    // TODO --- It's only necessary when the image folder is not empty ---

                    let images_folder = await ListDriveFolderContent(folderId, 'images');
                    let images_folder_url = `https://drive.google.com/drive/folders/${images_folder[0].id}`;

                    await DBQuery(db,
                        `UPDATE events SET images_drive_folder = ? WHERE id = ? AND (images_drive_folder <> ? OR images_drive_folder IS NULL);`,
                        [images_folder_url, events[i].id, images_folder_url]
                    ).catch((err) => {throw err});

                    //Save folders name
                    let folder_name = await GetDriveFolderName(folderId);

                    await DBQuery(db,
                        `UPDATE events SET local_folder = ? WHERE id = ? AND (local_folder <> ? OR local_folder IS NULL);`,
                        [folder_name, events[i].id, folder_name]
                    ).catch((err) => {throw err});

                    /*let image_list;
                    try{
                        image_list = await ListDriveFolderContent(images_folder[0].id, '');
                    }catch(e){
                        continue;
                    }*/

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
                        /*title = title.replace(".m4a", "");
                        title = title.replace(".mp4", "");
                        title = title.replace(".wma", "");
                        title = title.replace(".wav", "");
                        title = title.replace(".ogg", "");*/
                        title = title.trim();

                        all_music_in_google_drive.add(author + title);

                        await db.query( `INSERT INTO repertoire (author, title)
                            SELECT ?, ?
                            FROM dual
                            WHERE NOT EXISTS (
                                SELECT 1
                                FROM repertoire
                                WHERE author LIKE ?
                                AND title LIKE ?
                            )`, [author, title, author, title], async (err, res) => {
                                if(err) throw err;
                                
                                if(res.insertId){
                                    //set default best music event to last inserted repertoire music
                                    await DBQuery(db,
                                        `UPDATE repertoire
                                            SET best_music_event = ?
                                            WHERE id = ?`,
                                        [events[i].id, res.insertId]
                                    ).catch((err) => {throw err});
                                }
                            }
                        );

                        //If author's surname has been already selected at least in one record, update in all records.

                        await DBQuery(db,
                            `UPDATE repertoire
                                SET surname = (
                                    SELECT surname
                                        FROM repertoire
                                        WHERE author LIKE ?
                                            AND surname NOT LIKE "" AND surname IS NOT NULL
                                        LIMIT 1
                                    )
                                WHERE author LIKE ?;`,
                            [author, author]
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
                                [selected_music[0].id, events[i].id, `https://drive.google.com/file/d/${track_list[j].id}/preview?usp=sharing`]
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
                                [selected_music[0].id, events[i].id, `https://drive.google.com/file/d/${track_list[j].id}/preview?usp=sharing`, selected_music[0].id, events[i].id]
                            );
                        }).catch((err) => {throw err});
                    }

                    // images db
                    /*for(let j=0; j<image_list.length; j++){

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
                    }*/
                }
            }

            //If there is a music in database and not in google drive, delete it.
            db.query(`SELECT id, author, title FROM repertoire`, async (err, all_music_in_database) => {
                if(err) console.log(err);
                for (let j = 0; j < all_music_in_database.length; j++) {
                    let database_value = all_music_in_database[j].author + all_music_in_database[j].title;
                    if(!all_music_in_google_drive.has(database_value)){
                        await db.query(`DELETE FROM repertoire WHERE id = ?;
                                        ALTER TABLE repertoire AUTO_INCREMENT = 1;`, [all_music_in_database[j].id]);
                    }
                }
                response.send(`<script>alert("Sikeres szinkronizálás."); location.href = "/";</script>`);
                db.end();
            });
        });
    });

    async function ListDriveFolderContent(folderId, fileName){
        let drive_response = await drive.files.list({
            q: `'${folderId}' in parents and name contains '${fileName}'`,
            fields: 'nextPageToken, files(id, name)',
        });
        return drive_response.data.files;
    }

    async function GetDriveFolderName(folderId){
        let drive_response =  await drive.files.get({ fileId: folderId })
        return drive_response.data.name;
    }

    function DBQuery(db, query, parameters){
        return new Promise((resolve, reject) => {
            db.query(query, parameters, (err, res) => {
                if(err) reject(err);
                else resolve(res);
            });
        });
    }

    /*app.post('/get_images', (request, response) => {

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
    });*/

    
};