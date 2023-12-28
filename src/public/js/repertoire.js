//change active navbar item
$(document).ready(function(){
    $('.active').removeClass('active');
    $('#repertoire-nav-item').addClass('active');

    $("#search-btn").click(function(){
        location.href = `./repertoire?search=${$("#search_item").val()}`;
    });

    const urlParams = new URLSearchParams(location.search);
    Search(urlParams.get('search'));
    $("#search_item").val(urlParams.get('search'));
});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        location.href = `./repertoire?search=${$("#search_item").val()}`;
    }
});

function Search(item){
    $("#list").empty();
    $.post("repertoire", {search_item: item}, function(repertoire_result){

        let list = $("#list");

        if(repertoire_result.length == 0){

            let list_item = $("<div id='no_result_container'></div>");
            list_item.addClass("d-lg-flex");
            list_item.addClass("justify-content-lg-between");
            list_item.addClass("align-items-lg-center");

            let no_result = $("<p id='no_result'></p>").text("A keresésnek nincsen eredménye.");
            list_item.append(no_result);

            list.append(list_item);
        }
        else {
            for (let i = 0; i < repertoire_result.length; i++) {

                let title;
                if(repertoire_result[i].author != ""){
                    title = $("<p></p>").text(repertoire_result[i].author + ": " + repertoire_result[i].title);
                }
                else{
                    title = $("<p></p>").text(repertoire_result[i].title);
                }
                let player = $(` <audio controls id="music_player">
                    Your browser does not support the audio element.
                    </audio> `);
                let music_information = $("<div></div>");
                music_information.addClass("music_information");
                let list_item = $("<div></div>");

                let exist = false;

                list_item.addClass("list-item");
                list_item.append(title);
                list_item.append(music_information);

                list.append(list_item);
            
                title.addClass("title");
                title.click(function () {
                    if(exist){
                        music_information.slideToggle("slow");
                        player.each(function(index, audio) {
                            audio.pause();
                        });
                    }
                    else{

                        exist = true;

                        $.post("events_to_music", {music_id: repertoire_result[i].id}, function(events_to_music_result){

                            if(events_to_music_result.length > 0){
                                //get the best track from the music which has been recorded during an event
                                $.post("get_best_music", {music: repertoire_result[i].id}, (best_music) => {
                                    ShowMusic(i, music_information, events_to_music_result, repertoire_result, best_music);
                                    music_information.slideToggle("slow");
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}