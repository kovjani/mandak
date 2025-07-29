$(document).ready(function(){
    $("#repertoire_admin_search_btn").click(function(){
        location.href = `./repertoire?search=${$("#repertoire_admin_search_item").val()}`;
    });

    const urlParams = new URLSearchParams(location.search);
    Search(urlParams.get('search'));
    $("#repertoire_admin_search_item").val(urlParams.get('search'));
});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        location.href = `./repertoire?search=${$("#repertoire_admin_search_item").val()}`;
    }
});

function Search(item){
    $("#repertoire_admin_list").empty();
    $.post("repertoire_data", {search_item: item}, function(repertoire_result){

        let list = $("#repertoire_admin_list");

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
                /*let player = $(` <audio controls id="music_player">
                    Your browser does not support the audio element.
                    </audio> `);*/
                let music_information = $("<div></div>");
                music_information.addClass("music_information");
                let list_item = $("<div></div>");

                let exist = false;

                list_item.addClass("list-item");
                list_item.append(title);
                list_item.append(music_information);

                list.append(list_item);
            
                title.addClass("title");

                if(repertoire_result[i].author !== "" && repertoire_result[i].surname == null){
                    //if surname not selected, set title to red.
                    title.css("color", "red");
                }

                title.click(function () {

                    if(exist){
                        music_information.slideToggle("slow");
                        /*player.each(function(index, audio) {
                            audio.pause();
                        });*/
                    }
                    else{

                        exist = true;

                        $.post("events_to_music", {music_id: repertoire_result[i].id}, function(events_to_music_result){

                            if(events_to_music_result.length > 0){
                                //get the best track from the music which has been recorded during an event
                                $.post("get_best_music", {music: repertoire_result[i].id}, (best_music) => {
                                    ShowMusic(i, music_information, events_to_music_result, repertoire_result, best_music, title);
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

function ShowMusic(i, music_information, events_to_music_result, repertoire_result, best_music, title){

    //select surname for order by
    if(repertoire_result[i].author !== ""){
      let author_names_list = $("<ul></ul>");
      author_names_list.addClass("author_names_list");

      music_information.append(author_names_list);

      author_names_list.append('<p class="radio_buttons_title">Rendezés alapja:</p>');

      let splitted_author = repertoire_result[i].author.split(" ");

      for (let j = 0; j < splitted_author.length; j++) {

        $.post("get_surname", {music: repertoire_result[i].id}, (surname) => {

          let li = $('<li></li>');
          let label = $('<label style="display: flex;"></label>');
          let input_radio = $(`<input type="radio" name="${repertoire_result[i].author}${repertoire_result[i].id}">`);

          if(surname === splitted_author[j]){
            //if surname selected, set title to black.
            title.css("color", "black");
            input_radio.prop('checked', true);
          }
          
          input_radio.click(() => {
            //if surname selected, set title to black.
            title.css("color", "black");
            $.post("insert_surname", {author: repertoire_result[i].author, surname: splitted_author[j]});
          });

          label.append(input_radio);
          label.append(`<p style="margin-bottom: 0.3em;">${splitted_author[j]}</p>`);
          li.append(label);
          author_names_list.append(li);

        });
      }
    }

    

    // select best music

    let music_list = $("<ul></ul>");
    music_list.addClass("music_list");

    music_list.append('<p class="radio_buttons_title">Legjobb felvétel:</p>');

    music_information.append(music_list);

    for (let j = 0; j < events_to_music_result.length; j++) {

        let d = new Date(events_to_music_result[j].date);
        d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
        let date = d.toISOString().split('T')[0];

        let text = `${events_to_music_result[j].place} (${date})`;

        let li = $('<li></li>');
        let label = $('<label style="display: flex;"></label>');
        let input_radio = $(`<input type="radio" name="${repertoire_result[i].id}">`);
        let player = $(`<audio controls>Your browser does not support the audio element.</audio>`);

        if(best_music.length && best_music[0].event === events_to_music_result[j].event_id)
            input_radio.prop('checked', true);

        let track_name
        if(repertoire_result[i].author.length > 0){
            track_name = repertoire_result[i].author + "_" + repertoire_result[i].title + ".mp3";
        }
        else{
            track_name = repertoire_result[i].title + ".mp3";
        }
        player.attr("src", `/events/${events_to_music_result[j].folder}/audio/${track_name}`);
        player.on('play', function() {
            $('audio').not(this).each(function(index, audio) {
                audio.pause();
            });
        });

        input_radio.click(() => {
          $.post("insert_best_music", {event_id: events_to_music_result[j].event_id, music_id: repertoire_result[i].id}, () => {});
        });

        label.append(input_radio);
        label.append(`<p style="margin-bottom: 0.3em;">${text}</p>`);
        li.append(label);
        li.append(player);
        music_list.append(li);
    }
  }