import $ from "jquery";
import { Music } from "../../models/Music";
import { Event } from "../../models/Event";
import { PlayEventMusicList } from "../main/audio_player"
import { GallerySetPicture } from "./gallery";


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
            let event = new Event(events_result.place, events_result.date, events_result.local_folder);
            EventsShowContent(events_result, i);
        }
    });
}

function EventsShowContent(events_result:any, event_index: number){
    
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

    cover.hover(
        function() {
            // mouse enters, add style
            event_title.css('text-decoration', 'underline');
        },
        function() {
            // mouse leaves, remove style
            event_title.css('text-decoration', 'none');
        }
    );

    let place_date = $("<div></div>");
    place_date.addClass("place_date");
    place_date.addClass("d-lg-flex");
    place_date.addClass("justify-content-lg-between");
    place_date.addClass("align-items-lg-center");
    title_place_date.append(place_date);

    let place = $("<div></div>").text(event.place);
    place.addClass("place");
    place_date.append(place);

    let time = $("<div></div>");
    let d = new Date(event.date);
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
        details.append(description);
    }

    cover.click(async function () {
        if(!exist){
            exist = true;
            
            let images_empty = true;
            //let images_container = $("<a target='_blank'></a>");

            let images_container = $("<div></div>");

            await $.post('/get_local_images', {event_id: event.id}, function(images_folder){

                if(images_folder.length > 0){

                    details_empty = false;
                    images_empty = false;


                    let ilabel = $(`<h6>Képek</h6>`);
                    
                    ilabel.addClass("label");

                    
                    images_container.addClass("images_container");
                    images_container.addClass("container");

                    let row = $(`<div></div>`);
                    row.addClass("row");

                    row.append(ilabel);

                    let images_list:string[] = [];

                    for (let j = 0; j < images_folder.length; j++) {
                        images_list.push(images_folder[j].image);
                    }

                    for (let j = 0; j < images_folder.length; j++) {
                        //let image_link = $(`<a href="/galeria?event=${event.id}&image=${images_folder[j].image}"></a>`);
                        let image_div = $(`<div></div>`);

                        image_div.addClass("col");
                        image_div.addClass("image_div");
            
                        image_div.css("background-image", `url("${images_folder[j].image}")`);

                        image_div.click(() => {
                            $("#gallery-nav-item").click();
                            GallerySetPicture(images_folder[j].image, images_list, j);
                        });
                        
                        row.append(image_div);
                    }
                    
                    images_container.append(row);
                    details.append(images_container);
                }
            });

            await $.post('/music_to_event', {event_id: event.id}, function(music_to_events_result){
                if(music_to_events_result.length > 0){
    
                    details_empty = false;
    
                    let label = $(`<h6>Művek</h6>`);
                    label.addClass("label");
    
                    let music_list_html = $("<ul></ul>");
                    music_list_html.addClass("music_list");
                    music_list_html.append(label);
                    details.append(music_list_html);
    
                    let music_list: Music[] = [];

                    for (let i = 0; i < music_to_events_result.length; i++) {
                        let res = music_to_events_result[i];
                        let ievent = new Event(event.place, event.date, event.local_folder);
                        if(res.author !== "") {
                            music_list.push(new Music(res.id, res.title, ievent, res.author));
                        } else {
                            music_list.push(new Music(res.id, res.title, ievent, res.author));
                        }
                    }
    
                    for (let music_index = 0; music_index < music_to_events_result.length; music_index++) {
                    
                        let li = $("<li></li>");
                        let text, music;
    
                        if(music_to_events_result[music_index].author.length > 0){
                            text = music_to_events_result[music_index].author + ": " + music_to_events_result[music_index].title;
                        }
                        else{
                            text = music_to_events_result[music_index].title;
                        }
    
                        music = $(`<p id="music_${music_index}_${event_index}" style="margin-bottom: 0.3em;">${text}</p>`);
                        music.addClass("events_music_title");
    
                        music.click(function () {
                            $(".audio_player_container").css("display", "flex");
                            /*$("footer").css({
                                "height": "30em",
                                "z-index": "1"
                            });*/
                            PlayEventMusicList(music_list, music_index, event_index);
                        });
    
                        li.append(music);
                        music_list_html.append(li);
                    }
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