import $ from "jquery";
import { Music } from "../../models/Music";
import { Event } from "../../models/Event";
import { PlayMusicList } from "../main/audio_player"

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        $("#events_search_btn").click();
    }
});

export function EventsSearch(item: string){
    $.post("/events_data", {search_item: item}, function(events_result){ 

        $("#events_list").empty();
        //if there is no events_result
        if(events_result.length == 0){
            let new_list_item = $("<div></div>");
            new_list_item.css('padding', '1em');
            new_list_item.css('padding-left', '0');

            let title = $("<p></p>").text("A keresésnek nincsen eredménye.");
            title.addClass("mr-auto");
            title.addClass("d-block");
            title.css({
                color: 'grey',
                'font-weight': 'bold',
                margin: 'inherit',
                'text-align': 'center !important'
                });
            new_list_item.append(title);

            $("#events_list").append(new_list_item);
        }

        for (let i = 0; i < events_result.length; i++) {
            EventsShowContent(events_result, i);
        }
    });
}

function EventsShowContent(events_result: any, event_index: number){
    let event = events_result[event_index];


    let new_list_item = $("<div></div>");
    new_list_item.addClass("list-item");

    let details = $("<div></div>");
    details.addClass("details");
    
    let cover = $("<div></div>");
    cover.addClass("cover");
    new_list_item.append(cover);

    let title_place_date = $("<div></div>");

    if(event.cover_image !== null && event.cover_image !== "" && event.cover_image !== "default"){
        cover.css({
            "background-image": `url("${event.cover_image}")`,
            "height": "15em"
        });
        title_place_date.css({
            "padding-top": "2em",
            "background": "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
            "border-top-left-radius": "0",
            "border-top-right-radius": "0"
        });
    }

    title_place_date.addClass("title_place_date");
    cover.append(title_place_date);

    let event_title = $("<div></div>").text(event.event);
    event_title.addClass("event_title");
    title_place_date.append(event_title);

    let place_date = $("<div></div>");
    place_date.addClass("place_date");
    place_date.addClass("d-lg-flex");
    place_date.addClass("justify-content-lg-between");
    place_date.addClass("align-items-lg-center");
    title_place_date.append(place_date);

    let place = $("<div></div>").text(event.place);
    place.addClass("time");
    place.css("padding-right", "0.5em");
    place_date.append(place);

    let time = $("<div></div>");
    let d = new Date(event.date);
    // d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
    time.text(d.toISOString().split('T')[0]);
    time.addClass("time");
    place_date.append(time);

    new_list_item.append(details);

    let exist = false;
    let details_empty = true;

    let description;
    if(event.description !== null && event.description.length > 0){
        details_empty = false;
        description = $("<p></p>");
        description.html(event.description.replace('\n', '<br>'));
        description.addClass("description");
        description.addClass("margin_top");
        details.append(description);
    }

    cover.click(async function () {
        if(!exist){
            exist = true;
            
            let images_empty = true;
            //let images_container = $("<a target='_blank'></a>");

            let audio_player = $("<audio controls></audio>");
            audio_player.addClass("audio_player");
            let images_container = $("<div></div>");

            await $.post('/get_local_images', {event_id: event.id}, function(images_folder){

                console.log(images_folder)

                if(images_folder.length > 0){

                    details_empty = false;
                    images_empty = false;

                    
                    images_container.addClass("images_container");
                    images_container.addClass("container");

                    let row = $(`<div></div>`);
                    row.addClass("row");

                    for (let j = 0; j < images_folder.length; j++) {
                        let image_link = $(`<a href="/galeria?event=${event.id}&image=${images_folder[j].image}"></a>`);
                        let image_div = $(`<div></div>`);
            
                        image_link.addClass("image_link");

                        image_div.addClass("col");
                        image_div.addClass("image_div");
            
                        image_div.css("background-image", `url("${images_folder[j].image}")`);

                        image_div.append(image_link);
                        
                        row.append(image_div);
                    }
                    
                    images_container.append(row);
                    details.append(images_container);
                }
            });


            // if(!images_empty){
            //     //if images folder is not empty, append google drive link and images
            //     await $.post('/get_images_drive_folder', {event_id: events_result[i].id}, (drive_images_folder) => {
            //        if(drive_images_folder.length > 0){
            //             let drive_images_link_div = $("<div></div>");
            //             drive_images_link_div.addClass("margin_top");

            //             let drive_images = $("<a class='drive_images_link' target='_blank' ><i class='fas'>&#xf302;</i> Képek megtekintése</a>");
            //             //drive_images.attr("href", `/galeria?event=${events_result[i].id}&image=${images_folder[j].image}`);
            //             //images_container.attr("href", drive_images_folder[0].images_drive_folder);

            //             drive_images_link_div.append(drive_images);

            //             details.append(drive_images_link_div);
            //             details.append(images_container);
            //        }
            //    });
            // }

            // await $.post('/music_to_events', {event: events_result[i].id}, function(music_to_events_result){
            //     if(music_to_events_result.length > 0){
    
            //         details_empty = false;
    
            //         let label = $(`<h6><i class='fas'>&#xf001;</i> Művek</h6>`);
                    
            //         label.addClass("label");
            //         label.addClass("margin_top");
            //         details.append(label);
    
            //         let music_list = $("<ul></ul>");
            //         music_list.addClass("music_list");
            //         details.append(music_list);
    
            //         //Store the j variable of repertoire_result in order to play next music on ended.
            //         let music_index = 0;
    
            //         for (let j = 0; j < music_to_events_result.length; j++) {
                    
            //             let li = $("<li></li>");
            //             let text, music;
    
            //             if(music_to_events_result[j].author.length > 0){
            //                 text = music_to_events_result[j].author + ": " + music_to_events_result[j].title;
            //             }
            //             else{
            //                 text = music_to_events_result[j].title;
            //             }
    
            //             music = $(`<p id="music_${j}_${i}" style="margin-bottom: 0.3em;">${text}</p>`);
            //             music.addClass("events_music_title");
    
            //             music.click(function () {
            //                 music_index = j;    //Important!
            //                 EventsPlaymusic(audio_player, music_to_events_result, music_index, events_result[i].local_folder, i);
            //             });
    
            //             li.append(music);
            //             music_list.append(li);
            //         }
            //         audio_player.on('ended', () => {
            //             EventsPlaymusic(audio_player, music_to_events_result, ++music_index, events_result[i].local_folder, i);
            //         });

            //         details.append(audio_player);
            //     }
            // });

            await $.post('/get_local_audio', {event_id: event.id}, function(audio_folder){
                if(audio_folder.length > 0){
    
                    details_empty = false;
    
                    let label = $(`<h6><i class='fas'>&#xf001;</i> Művek</h6>`);
                    
                    label.addClass("label");
                    label.addClass("margin_top");
                    details.append(label);
    
                    let music_list = $("<ul></ul>");
                    music_list.addClass("music_list");
                    details.append(music_list);
    
                    //Store the j variable of repertoire_result in order to play next music on ended.
                    let music_index = 0;
    
                    for (let music_index = 0; music_index < audio_folder.length; music_index++) {
                    
                        let li = $("<li></li>");
                        let text, music_p;

                        let author, title;

                        if(audio_folder[music_index].name.includes("_")){
                            let splitted = audio_folder[music_index].name.split("_");
                            author = splitted[0];
                            title = splitted[1];

                            text = author + ": " + title;
                        }
                        else{
                            text = audio_folder[music_index].name;
                        }
    
                        music_p = $(`<p id="events_${event.id}_music_${music_index}_${i}" style="margin-bottom: 0.3em;">${text}</p>`);
                        music_p.addClass("events_music_title");
    
                        music_p.click(function () {
                            let music_list: Music[] = [];

                            for (let i = 0; i < audio_folder.length; i++) {
                                let item = audio_folder[i];
                                let music_event = new Event(event.place, event.date, event.local_folder);
                                if(item.author !== "") {
                                    music_list.push(new Music(item.id, item.title, music_event, item.author));
                                } else {
                                    music_list.push(new Music(item.id, item.title, music_event, item.author));
                                }
                            }

                            PlayMusicList(music_list);
                        });
    
                        li.append(music_p);
                        music_list.append(li);
                    }
                    audio_player.on('ended', () => {
                        EventsPlaymusic(audio_player, audio_folder, ++music_index, i);
                    });

                    details.append(audio_player);
                }
            });
        }

        //if details tag is not empty, show that and set some css to it. 
        if(!details_empty){
            details.slideToggle("fast");
            cover.toggleClass("hide_bottom_radius");
            title_place_date.toggleClass("hide_bottom_radius");
        }
    });

    $("#events_list").append(new_list_item);

}

/*function EventsPlaymusic(audio_player, audio_folder, music_index, event_index){
    //get the best music from the music which has been recorded during an event

    audio_player.on('play', function() {
        $('audio').not(this).each(function(index, audio) {
            audio.pause();
        });
    });

    audio_player.trigger("pause");
    audio_player.attr("src", audio_folder[music_index].audio);
    audio_player.trigger("play");

    $(".events_music_title").css("color", "black");
    $(`#events_${events_result[i].id}_music_${music_index}_${event_index}`).css("color", "#8fb514");

}*/
