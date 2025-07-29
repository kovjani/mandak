import $ from "jquery";
import { Music } from "../../models/Music";
import { Event } from "../../models/Event";
import { PlayMusicList } from "../main/audio_player"

export function RepertoireSearch(item: string){
    $.post("repertoire_data", {search_item: item}, function(repertoire_result){
        
        $(document).scrollTop(0);
        $("#repertoire_list").empty();

        let list = $("#repertoire_list");

        //Store the i variable of repertoire_result in order to play next music on ended.
        let music_index = 0;

        let music_list: Music[] = [];

        for (let i = 0; i < repertoire_result.length; i++) {
            let item = repertoire_result[i];
            let event = new Event(item.place, item.date, item.local_folder);
            if(item.author !== "") {
                music_list.push(new Music(item.id, item.title, event, item.author));
            } else {
                music_list.push(new Music(item.id, item.title, event, item.author));
            }
        }

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
            for (let music_index = 0; music_index < repertoire_result.length; music_index++) {

                let title;
                if(repertoire_result[music_index].author != ""){
                    title = $(`<p id='repertoire_title_${music_index}'></p>`).text(repertoire_result[music_index].author + ": " + repertoire_result[music_index].title);
                }
                else{
                    title = $(`<p id='repertoire_title_${music_index}'></p>`).text(repertoire_result[music_index].title);
                }

                let d = new Date(repertoire_result[music_index].date);
                d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
                let date = d.toISOString().split('T')[0];
                title.append(`<div style="color:grey; margin-bottom: 0">${repertoire_result[music_index].place} (${date})<div>`);

                let list_item = $("<div></div>");

                list_item.addClass("list-item");
                list_item.append(title);

                list.append(list_item);
            
                title.addClass("title");
                title.click(function () {
                    $(".audio_player_container").css("display", "flex");
                    $("footer").css({
                        "height": "30em",
                        "z-index": "1"
                    });
                    PlayMusicList(music_list, music_index);
                });
            }
            /*$("#audio_player").on('ended', () => {
                PlayAudio(repertoire_result, ++music_index);
            });

            $("#playPreviousButton").click(() => {
                if(music_index > 0)
                    PlayAudio(repertoire_result, --music_index);
            });

            $("#playNextButton").click(() => {
                if(music_index < repertoire_result.length - 1)
                    PlayAudio(repertoire_result, ++music_index);
            });*/
        }
    });
}

/*function PlayAudio(music_list, music_index){
    // In repretoire there is a column best_music_event contains an event id where the best audio recorded.
    // The repertoire table and events table connected to each other through best_music_event using inner join.
    // We can achieve the folder of the event (and audio file) where the best audio was recorded.

    let music_name;
    if(repertoire_result[music_index].author.length > 0){
        music_name = repertoire_result[music_index].author + "_" + repertoire_result[music_index].title + ".mp3";
    }
    else{
        music_name = repertoire_result[music_index].title + ".mp3";
    }

    $("#audio_player").trigger("pause");
    $("#audio_player").attr("src", `/events/${repertoire_result[music_index].local_folder}/audio/${music_name}`);
    $("#audio_player").trigger("play");

    $('#playButton').hide();
    $('#pauseButton').show();

    $(".title").css("color", "black");
    $(`#repertoire_title_${music_index}`).css("color", "#8fb514");

    if(music_index. !== ""){
        $("#audio_title").text(repertoire_result[music_index].author + ": " + repertoire_result[music_index].title);
        let d = new Date(repertoire_result[music_index].date);
        //d.setDate(d.getDate() + 1); //For some reason the date is one day less in the respond, while it's correct in the database.
        let date = d.toISOString().split('T')[0];
        $("#audio_event").text(`${repertoire_result[music_index].place} (${date})`);
    }
    else{
        $("#audio_title").text(repertoire_result[music_index].title);
        let d = new Date(repertoire_result[music_index].date);
        //d.setDate(d.getDate() + 1); //For some reason the date is one day less in the respond, while it's correct in the database.
        let date = d.toISOString().split('T')[0];
        $("#audio_event").text(`${repertoire_result[music_index].place} (${date})`);
    }
}*/