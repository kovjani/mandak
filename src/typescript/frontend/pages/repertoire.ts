import $ from "jquery";
import { Music } from "../../models/Music";
import { Event } from "../../models/Event";
import { PlayRepertoireMusicList } from "../main/audio_player"

export function RepertoireSearch(item: string){
    $.post("repertoire_data", {search_item: item}, function(repertoire_result){
        
        $(document).scrollTop(0);
        $("#repertoire_list").empty();

        let list = $("#repertoire_list");

        let music_list: Music[] = [];

        for (let i = 0; i < repertoire_result.length; i++) {
            let res = repertoire_result[i];
            let event = new Event(res.place, res.date, res.local_folder);
            if(res.author !== "") {
                music_list.push(new Music(res.id, res.title, event, res.author));
            } else {
                music_list.push(new Music(res.id, res.title, event, res.author));
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
                

                let list_item = $("<div></div>");

                list_item.addClass("list-item");
                list_item.append(title);
                list_item.append(`<div class="repertoire_place">${repertoire_result[music_index].place} (${date})<div>`);

                list_item.hover(
                    function() {
                        // mouse enters, add style
                        title.css('text-decoration', 'underline');
                    },
                    function() {
                        // mouse leaves, remove style
                        title.css('text-decoration', 'none');
                    }
                );

                list.append(list_item);
            
                title.addClass("title");
                list_item.click(function () {
                    $(".audio_player_container").css("display", "flex");
                    /*$("footer").css({
                        "height": "30em",
                        "z-index": "1"
                    });*/
                    PlayRepertoireMusicList(music_list, music_index);
                });
            }
        }
    });
}