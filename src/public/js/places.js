//const res = require("express/lib/response");

//change active navbar item
$(document).ready(function(){
    $('.active').removeClass('active');
    $('#places-nav-item').addClass('active');

    $("#search-btn").click(function(){
        location.href = `./places?search=${$("#search_item").val()}`;
    });

    const urlParams = new URLSearchParams(location.search);
    Search(urlParams.get('search'));
    $("#search_item").val(urlParams.get('search'));
});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        location.href = `./places?search=${$("#search_item").val()}`;
    }
});

function Search(item){
    $.post("events", {search_item: item}, function(events_result){ 

        $("#list").empty();
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

            $("#list").append(new_list_item);
        }
        //else
        //setTimeout(ShowContent(events_result, 0));

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
    
    let cover_image = $("<div></div>");
    cover_image.addClass("cover_image");
    new_list_item.append(cover_image);

    let img_link = $("<a></a>");
    let img = $("<img>");

    if(events_result[i].cover_image !== null){
        cover_image.css("background-image", `url(\"${events_result[i].cover_image}\"`);
        img_link.attr("href", events_result[i].cover_image);
        img.attr("src", events_result[i].cover_image);
    }else
    {
        cover_image.css("background-image", `url(\"/img/default_cover.jpg\")`);
        img_link.attr("href", `/img/default_cover.jpg`);
        img.attr("src", `/img/default_cover.jpg`);
    }

    let event = $("<div></div>").text(events_result[i].event);
    event.addClass("title");
    new_list_item.append(event);

    let place_date = $("<div></div>");
    place_date.addClass("place_date");
    place_date.addClass("d-lg-flex");
    place_date.addClass("justify-content-lg-between");
    place_date.addClass("align-items-lg-center");
    new_list_item.append(place_date);

    let place = $("<div></div>").text(events_result[i].place);
    //console.log(events_result[i]);
    place.addClass("time");
    place_date.append(place);

    let time = $("<div></div>");
    let d = new Date(events_result[i].date);
    d.setDate(d.getDate() + 1); //For some reason the date is one day less in the respond, while it's correct in the database.
    time.text(d.toISOString().split('T')[0]);
    time.addClass("time");
    place_date.append(time);

    new_list_item.append(details);

    let image_and_description = $("<div></div>");
    image_and_description.addClass("image_and_description");

    let description = $("<p></p>");
    description.html(events_result[i].description.replace('\n', '<br>'));
    description.addClass("description");
    image_and_description.append(description);
    
    img_link.addClass('img_link');
    image_and_description.prepend(img_link);

    img.addClass("image");
    img_link.append(img);

    details.append(image_and_description);
    

    let exist = false;

    event.click(async function () {
        if(!exist){
            exist = true;
            
            await $.post('get_images', {event_id: events_result[i].id}, function(images_to_events_result){
                if(images_to_events_result.length > 0){

                    let images_container = $("<div></div>");
                    images_container.addClass("images_container");
                    images_container.addClass("container");
                    details.append(images_container);

                    for (let j = 0; j < images_to_events_result.length; j++) {

                        let row = $(`<div></div>`);
                        row.addClass("row");

                        for (let k = 0; k < 5 && j < images_to_events_result.length; k++, j++) {
                            let image_div = $(`<div></div>`);

                            image_div.addClass("col");
                            image_div.addClass("image_div");
                            image_div.css("background-image", `url("${images_to_events_result[j].image}")`);

                            row.append(image_div);
                        }
                    
                        images_container.append(row);
                    }
                }
            });

            await $.post('music_to_events', {event: events_result[i].id}, function(music_to_events_result){
                if(music_to_events_result.length > 0){

                    let label = $("<h6></h6>");
                    label.text("Művek:");
                    label.addClass("label");
                    details.append(label);

                    let music_list = $("<ul></ul>");
                    music_list.addClass("music_list");
                    details.append(music_list);

                    for (let j = 0; j < music_to_events_result.length; j++) {
                    
                        let player = $(` <audio controls id="music_player">
                            Your browser does not support the audio element.
                            </audio> `);
                        player.each(function(index, audio) {
                            audio.pause();
                        });
                        player.on('play', () => {
                            $("audio").not(player).each(function(index, audio) {
                                audio.pause();
                            });
                        });
                        let text = music_to_events_result[j].author + ": " + music_to_events_result[j].title;
                        let li = $("<li></li>");
                        //let a = $(`<a href= '/repertoire?search=${text}' ></a>`);

                        player.attr("src", music_to_events_result[j].audio);
                            
                        li.append(`<p style="margin-bottom: 0.3em;">${text}</p>`);
                        //li.append(a);
                        li.append(player);
                        music_list.append(li);
                    }
                }
            });
        }

        details.slideToggle("slow");

    });

    cover_image.click(function(){event.click();});
    place_date.click(function(){event.click();});

    $("#list").append(new_list_item);

    // i++;
    // if(i < events_result.length)
    //     setTimeout(ShowContent(events_result, i));
}