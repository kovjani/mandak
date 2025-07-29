$(document).ready(function(){

    $("#events_admin_search_btn").click(function(){
        location.href = `/events?search=${$("#events_admin_search_item").val()}`;
    });

    const urlParams = new URLSearchParams(location.search);
    Search(urlParams.get('search'));

    //show searched item in search bar from url params
    $("#events_admin_search_item").val(urlParams.get('search'));
});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        location.href = `/events?search=${$("#events_admin_search_item").val()}`;
    }
});

function Search(item){
    $.post("/events_data", {search_item: item}, function(events_result){ 

        $("#events_admin_list").empty();
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

            $("#events_admin_list").append(new_list_item);
        }

        for (let i = 0; i < events_result.length; i++) {
            ShowContent(events_result, i);
        }
    });
}

function ShowContent(events_result, i){
    let new_list_item = $("<div></div>");
    new_list_item.addClass("list-item");

    let details = $("<div></div>");
    details.addClass("details");
    
    let cover = $("<div></div>");
    cover.addClass("cover");
    new_list_item.append(cover);

    //let img_link = $("<a></a>");
    //let img = $("<img>");

    let title_place_date = $("<div></div>");

    //There is a default setting in css for cover and if the database store a cover_image, change some css.
    if(events_result[i].cover_image !== null && events_result[i].cover_image !== "" && events_result[i].cover_image !== "default"){
        cover.css({
            "background-image": `url("${events_result[i].cover_image}")`,
            "height": "15em"
        });
        title_place_date.css({
            "padding-top": "2em",
            "background": "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
            "border-top-left-radius": "0",
            "border-top-right-radius": "0"
        });
        //img_link.attr("href", events_result[i].cover_image);
        //img.attr("src", events_result[i].cover_image);
    }

    title_place_date.addClass("title_place_date");
    cover.append(title_place_date);

    let event_title = $("<div></div>").text(events_result[i].event);
    event_title.addClass("event_title");
    title_place_date.append(event_title);

    let place_date = $("<div></div>");
    place_date.addClass("place_date");
    place_date.addClass("d-lg-flex");
    place_date.addClass("justify-content-lg-between");
    place_date.addClass("align-items-lg-center");
    title_place_date.append(place_date);

    let place = $("<div></div>").text(events_result[i].place);
    place.addClass("time");
    place.css("padding-right", "0.5em");
    place_date.append(place);

    let time = $("<div></div>");
    let d = new Date(events_result[i].date);
    d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
    time.text(d.toISOString().split('T')[0]);
    time.addClass("time");
    place_date.append(time);

    new_list_item.append(details);

    //let image_and_description = $("<div></div>");
    //image_and_description.addClass("image_and_description");
    

    //img_link.addClass('img_link');
    //image_and_description.prepend(img_link);

    //img.addClass("image");
    //img_link.append(img);

    //details.append(image_and_description);
    

    let exist = false;
    let details_empty = true;

    let description;
    if(events_result[i].description.length > 0){
        details_empty = false;
        description = $("<p></p>");
        description.html(events_result[i].description.replace('\n', '<br>'));
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

            await $.post('/get_local_images', {event_id: events_result[i].id}, function(images_folder){

                details_empty = false;

                if(images_folder.length > 0)
                    images_empty = false;

                
                images_container.addClass("images_container");
                images_container.addClass("container");

                let row = $(`<div></div>`);
                row.addClass("row");

                for (let j = -1; j < images_folder.length; j++) {
                    let image_div = $(`<div></div>`);
                    let input_radio = $(`<input type="radio" name="${events_result[i].id}">`);

                    image_div.addClass("col");
                    image_div.addClass("image_div");

                    if(j === -1){
                        //default cover image

                        image_div.css("background-image", `url("/img/default_cover.jpg")`);

                        if(events_result[i].cover_image === null || events_result[i].cover_image === "" || events_result[i].cover_image === "default")
                            input_radio.prop('checked', true);

                        input_radio.click(() => {
                            $.post("/insert_best_image", {event_id: events_result[i].id, cover_image: "default"}, () => {});
                            input_radio.prop('checked', true);

                            cover.css({
                                "background-image": `url("/img/default_cover.jpg")`,
                                "height": "fit-content"
                            });
                            title_place_date.css({
                                "padding-top": "0",
                                "background": "rgba(0, 0, 0, 0.5)",
                                "border-radius": "1em",
                                "padding": "1em"
                            });
                        });

                        image_div.click(() => {
                            $.post("/insert_best_image", {event_id: events_result[i].id, cover_image: "default"}, () => {});
                            input_radio.prop('checked', true);

                            cover.css({
                                "background-image": `url("/img/default_cover.jpg")`,
                                "height": "fit-content"
                            });
                            title_place_date.css({
                                "padding-top": "0",
                                "background": "rgba(0, 0, 0, 0.5)",
                                "border-radius": "1em",
                                "padding": "1em"
                            });
                        });
                    }
                    else{
                        //other cover images

                        image_div.css("background-image", `url("${images_folder[j].image}")`);
        
                        if(events_result[i].cover_image === images_folder[j].image)
                            input_radio.prop('checked', true);

                        input_radio.click(() => {
                            $.post("/insert_best_image", {event_id: events_result[i].id, cover_image: images_folder[j].image}, () => {});
                            input_radio.prop('checked', true);cover.css({
                                "background-image": `url("${images_folder[j].image}")`,
                                "height": "15em"
                            });
                            title_place_date.css({
                                "padding-top": "2em",
                                "background": "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
                                "border-top-left-radius": "0",
                                "border-top-right-radius": "0"
                            });
                        });

                        image_div.click(() => {
                            $.post("/insert_best_image", {event_id: events_result[i].id, cover_image: images_folder[j].image}, () => {});
                            input_radio.prop('checked', true);cover.css({
                                "background-image": `url("${images_folder[j].image}")`,
                                "height": "15em"
                            });
                            title_place_date.css({
                                "padding-top": "2em",
                                "background": "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8))",
                                "border-top-left-radius": "0",
                                "border-top-right-radius": "0"
                            });
                        });
                    }

                    image_div.append(input_radio);
                    row.append(image_div);
                }
                
                images_container.append(row);
                details.append(images_container);
            });

            // if(!images_empty){
            //     //if images folder not empty, append google drive link and images
            //     await $.post('/get_images_drive_folder', {event_id: events_result[i].id}, (drive_images_folder) => {
            //        if(drive_images_folder.length > 0){
            //             let drive_images_link_div = $("<div></div>");
            //             drive_images_link_div.addClass("margin_top");

            //             let drive_images = $("<a class='drive_images_link' target='_blank' ><i class='fas'>&#xf302;</i> Képek megtekintése</a>");
            //             drive_images.attr("href", drive_images_folder[0].images_drive_folder);
            //             //images_container.attr("href", drive_images_folder[0].images_drive_folder);

            //             drive_images_link_div.append(drive_images);

            //             details.append(drive_images_link_div);
            //        }
            //    });
            // }

            await $.post('/get_local_audio', {event_id: events_result[i].id}, function(audio_folder){
                if(audio_folder.length > 0){
    
                    details_empty = false;
    
                    let label = $(`<h6><i class='fas'>&#xf001;</i> Művek</h6>`);
                    
                    label.addClass("label");
                    label.addClass("margin_top");
                    details.append(label);
    
                    let music_list = $("<ul></ul>");
                    music_list.addClass("music_list");
                    details.append(music_list);
    
                    //Store the j variable of repertoire_result in order to play next track on ended.
                    let track_index = 0;
    
                    for (let j = 0; j < audio_folder.length; j++) {
                    
                        let li = $("<li></li>");
                        let text, track;

                        let author, title;

                        if(audio_folder[j].name.includes("_")){
                            let splitted = audio_folder[j].name.split("_");
                            author = splitted[0];
                            title = splitted[1];

                            text = author + ": " + title;
                        }
                        else{
                            text = audio_folder[j].name;
                        }
    
                        track = $(`<p id="events_admin_${events_result[i].id}_track_${j}_${i}" style="margin-bottom: 0.3em;">${text}</p>`);
                        track.addClass("events_track_title");
    
                        track.click(function () {
                            track_index = j;    //Important!
                            PlayTrack(audio_player, audio_folder, track_index, i);
                        });
    
                        li.append(track);
                        music_list.append(li);
                    }
                    audio_player.on('ended', () => {
                        PlayTrack(audio_player, audio_folder, ++track_index, i);
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

    $("#events_admin_list").append(new_list_item);

}
function PlayTrack(audio_player, audio_folder, track_index, event_index){
    //get the best track from the music which has been recorded during an event

    audio_player.on('play', function() {
        $('audio').not(this).each(function(index, audio) {
            audio.pause();
        });
    });

    audio_player.trigger("pause");
    audio_player.attr("src", audio_folder[track_index].audio);
    audio_player.trigger("play");

    $(".events_track_title").css("color", "black");
    $(`#events_admin_${events_result[i].id}_track_${track_index}_${event_index}`).css("color", "#8fb514");

}