//change active navbar item
$(document).ready(function(){
    $('.active').removeClass('active');
    $('#repertoire-nav-item').addClass('active');

    $("#search-btn").click(function(){
        location.href = `./repertoar?search=${$("#search_item").val()}`;
    });

    const urlParams = new URLSearchParams(location.search);
    Search(urlParams.get('search'));

    //show searched item in search bar from url params
    $("#search_item").val(urlParams.get('search'));
});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        location.href = `./repertoar?search=${$("#search_item").val()}`;
    }
});

function Search(item){
    $("#list").empty();
    $.post("repertoire_data", {search_item: item}, function(repertoire_result){

        let list = $("#list");

        //Store the i variable of repertoire_result in order to play next track on ended.
        let track_index = 0;

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
                    title = $(`<p id='title_${i}'></p>`).text(repertoire_result[i].author + ": " + repertoire_result[i].title);
                }
                else{
                    title = $(`<p id='title_${i}'></p>`).text(repertoire_result[i].title);
                }
                let list_item = $("<div></div>");

                list_item.addClass("list-item");
                list_item.append(title);

                list.append(list_item);
            
                title.addClass("title");
                title.click(function () {
                    track_index = i;    //Important!
                    PlayTrack(repertoire_result, track_index);
                });
            }
            $("#audio_player").on('ended', () => {
                PlayTrack(repertoire_result, ++track_index);
            });
        }
    });
}

function PlayTrack(repertoire_result, track_index){
    //get the best track from the music which has been recorded during an event
    $.post("get_best_music", {music: repertoire_result[track_index].id}, (best_music) => {
        if(best_music.length > 0){
            let track_name;
            if(repertoire_result[track_index].author.length > 0){
                track_name = repertoire_result[track_index].author + "_" + repertoire_result[track_index].title + ".mp3";
            }
            else{
                track_name = repertoire_result[track_index].title + ".mp3";
            }

            $("#audio_player").trigger("pause");
            $("#audio_player").attr("src", `/events/${best_music[0].folder}/audio/${track_name}`);
            $("#audio_player").trigger("play");

            $(".title").css("color", "black");
            $(`#title_${track_index}`).css("color", "#8fb514");
        }
    });
}