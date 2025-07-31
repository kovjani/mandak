module.exports = function (app, mysql) {
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

            db.query(`SELECT DISTINCT events.* FROM events
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

    app.post('/music_to_event', function(request, response){

        if(request.body.event_id === undefined ){
            response.end();
            return;
        }

        const event_id = parseInt(request.body.event_id);

        var db = mysql.createConnection({
            host: '127.0.0.1',
            user: 'everybody',
            password: '',
            database: 'mandak'
        });

        db.query(`SELECT repertoire.id, repertoire.title, repertoire.author FROM repertoire
                    LEFT OUTER JOIN music_to_events
                    ON music_to_events.music = repertoire.id
                    WHERE music_to_events.event = ?
                    ORDER BY repertoire.author, repertoire.title`,
        [event_id],
        function (err, result, fields){
            if(err) throw err;
            response.send(result);
            db.end();
        });
    });
}