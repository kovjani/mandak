// import { plainToInstance } from 'class-transformer';
// import { isNumber, validate } from 'class-validator';
// import { Request, Response } from "express";
// import { Event } from "../models/Event";
// import { Music } from '../models/Music';

// module.exports = function (app, mysql) {
//     app.post('/events_data', function(req: Request, res: Response) {

//         if(req.body.search_item === undefined){
//             res.end();
//             return;
//         }

//         let author, title;

//         var db = mysql.createConnection({
//             host: '127.0.0.1',
//             user: 'everybody',
//             password: '',
//             database: 'mandak'
//         });

//         //author: title
//         if(req.body.search_item.includes(':')){
//             let splitted_search_item = req.body.search_item.split(':');
//             author = splitted_search_item[0].trim();
//             title = splitted_search_item[1].trim();

//             title = '%' + title + '%';
//             author = '%' + author + '%';

//             db.query(`SELECT DISTINCT events.* FROM events
//                     LEFT OUTER JOIN music_to_events
//                     ON  music_to_events.event = events.id
//                     LEFT OUTER JOIN repertoire
//                     ON  music_to_events.music = repertoire.id
//                     WHERE repertoire.title LIKE ?
//                     AND repertoire.author LIKE ?
//                     ORDER BY events.date DESC, events.place`,
//             [title, author],
//             function (err, result, fields){
//                 if(err) throw err;
//                 res.send(result);

//                 let events:Event[] = [];
                

//                 db.end();
//             });
//         }
//         else{
//             let search_item = '%' + req.body.search_item + '%';

//             db.query(`SELECT DISTINCT events.* FROM events
//                     LEFT OUTER JOIN music_to_events
//                     ON  music_to_events.event = events.id
//                     LEFT OUTER JOIN repertoire
//                     ON  music_to_events.music = repertoire.id
//                     WHERE events.place LIKE ?
//                     OR events.event LIKE ?
//                     OR events.date LIKE ?
//                     OR repertoire.title LIKE ?
//                     OR repertoire.author LIKE ?
//                     ORDER BY events.date DESC, events.place`,
//             [search_item, search_item, search_item, search_item, search_item],
//             function (err, result, fields){
//                 if(err) throw err;
//                 res.send(result);
//                 db.end();
//             });
//         }
//     });

//     app.post('/music_to_event', async function(req: Request, res: Response){

//         let event_id = req.body.event_id;
//         if(event_id === undefined){
//             res.end();
//             return;
//         }

//         var db = mysql.createConnection({
//             host: '127.0.0.1',
//             user: 'everybody',
//             password: '',
//             database: 'mandak'
//         });

//         db.query(`SELECT repertoire.id AS music_id, repertoire.title AS music_title, repertoire.author AS music_author FROM repertoire
//                     LEFT OUTER JOIN music_to_events
//                     ON music_to_events.music = repertoire.id
//                     WHERE music_to_events.event = ?
//                     ORDER BY repertoire.author, repertoire.title`,
//         [parseInt(event_id)],
//         function (err, result, fields){
//             if(err) throw err;
//             // response.send(result);

//             let music_result:Music[] = [];
            


//             // Continue as validation passed
//             res.status(200).json(modelObj);
//             db.end();
//         });
//     });
// }