$(document).ready(function(){
    // Audio player controls

    var audio = $('#audio_player')[0];
    var seekBar = $('#seekBar');
    var currentTimeDisplay = $('#currentTime');
    var durationDisplay = $('#duration');

    $('#playButton').click(function() {
        audio.play();
        $('#playButton').hide();
        $('#pauseButton').show();
    });

    $('#pauseButton').click(function() {
        audio.pause();
        $('#pauseButton').hide();
        $('#playButton').show();
    });

    // Update the seek bar and timer as the audio plays
    audio.ontimeupdate = function() {
        var value = (100 / audio.duration) * audio.currentTime;
        seekBar.val(value);

        // Update the styles of the track using CSS variables
        document.documentElement.style.setProperty('--seek-bar-percentage', value + '%');

        // Update the current time display
        var currentMinutes = Math.floor(audio.currentTime / 60);
        var currentSeconds = Math.floor(audio.currentTime % 60);
        if (currentSeconds < 10) { currentSeconds = '0' + currentSeconds; }
        currentTimeDisplay.text(currentMinutes + ':' + currentSeconds);
    };

    // Update the duration display once the audio metadata is loaded
    audio.onloadedmetadata = function() {
        var totalMinutes = Math.floor(audio.duration / 60);
        var totalSeconds = Math.floor(audio.duration % 60);
        if (totalSeconds < 10) { totalSeconds = '0' + totalSeconds; }
        durationDisplay.text(totalMinutes + ':' + totalSeconds);
    };

    // Seek to a new position when the seek bar is changed
    seekBar.on('input', function() {
        var time = audio.duration * (seekBar.val() / 100);
        audio.currentTime = time;
    });



    $("#repertoire_search_btn").click(function(){
        let searched_item = $("#repertoire_search_item").val();
        RepertoireSearch(searched_item);
        // Show searched item in search bar.
        $("#repertoire_search_item").val(searched_item);
    });

});

$(document).on('keypress', function(e){
    //enter
    if(e.which == 13){
        $("#repertoire_search_btn").click();
    }
});

function RepertoireSearch(item){
    $("#repertoire_list").empty();
    console.log(item)
    $.post("repertoire_data", {search_item: item}, function(repertoire_result){
        

        let list = $("#repertoire_list");

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
                    title = $(`<p id='repertoire_title_${i}'></p>`).text(repertoire_result[i].author + ": " + repertoire_result[i].title);
                }
                else{
                    title = $(`<p id='repertoire_title_${i}'></p>`).text(repertoire_result[i].title);
                }

                let d = new Date(repertoire_result[i].date);
                d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
                let date = d.toISOString().split('T')[0];
                title.append(`<div style="color:grey; margin-bottom: 0">${repertoire_result[i].place} (${date})<div>`);

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
                    track_index = i;    //Important!
                    PlayAudio(repertoire_result, track_index);
                });
            }
            $("#audio_player").on('ended', () => {
                PlayAudio(repertoire_result, ++track_index);
            });

            $("#playPreviousButton").click(() => {
                if(track_index > 0)
                    PlayAudio(repertoire_result, --track_index);
            });

            $("#playNextButton").click(() => {
                if(track_index < repertoire_result.length - 1)
                    PlayAudio(repertoire_result, ++track_index);
            });
        }
    });
}

function PlayAudio(track_list, track_index){
    // In repretoire there is a column best_music_event contains an event id where the best audio recorded.
    // The repertoire table and events table connected to each other through best_music_event using inner join.
    // We can achieve the event's folder (and audio file) where the best audio was recorded.

    let track_name;
    if(repertoire_result[track_index].author.length > 0){
        track_name = repertoire_result[track_index].author + "_" + repertoire_result[track_index].title + ".mp3";
    }
    else{
        track_name = repertoire_result[track_index].title + ".mp3";
    }

    $("#audio_player").trigger("pause");
    $("#audio_player").attr("src", `/events/${repertoire_result[track_index].local_folder}/audio/${track_name}`);
    $("#audio_player").trigger("play");

    $('#playButton').hide();
    $('#pauseButton').show();

    $(".title").css("color", "black");
    $(`#repertoire_title_${track_index}`).css("color", "#8fb514");

    if(repertoire_result[track_index].author != ""){
        $("#audio_title").text(repertoire_result[track_index].author + ": " + repertoire_result[track_index].title);
        let d = new Date(repertoire_result[track_index].date);
        d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
        let date = d.toISOString().split('T')[0];
        $("#audio_event").text(`${repertoire_result[track_index].place} (${date})`);
    }
    else{
        $("#audio_title").text(repertoire_result[track_index].title);
        let d = new Date(repertoire_result[track_index].date);
        d.setDate(d.getDate() /*+ 1*/); //For some reason the date is one day less in the respond, while it's correct in the database.
        let date = d.toISOString().split('T')[0];
        $("#audio_event").text(`${repertoire_result[track_index].place} (${date})`);
    }
}