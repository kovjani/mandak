import $ from "jquery";
import { Music } from "../../models/Music"

export function PlayRepertoireMusicList(music_list: Music[], music_index: number): void {
    PlayAudio(music_list[music_index], music_index);

    $(".title").css("color", "black");
    $(".events_music_title").css("color", "black");
    $(`#repertoire_title_${music_index}`).css("color", "#8fb514");

    // Remove handlers.
    $("#audio_player").off();
    $("#playNextButton").off();
    $("#playPreviousButton").off();

    $("#audio_player").on('ended', () => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);

            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#repertoire_title_${music_index}`).css("color", "#8fb514");
        }
    });

    $("#playNextButton").click(() => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);
            
            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#repertoire_title_${music_index}`).css("color", "#8fb514");
        }
    });

    $("#playPreviousButton").click(() => {
        if(music_index > 0){
            music_index--;
            PlayAudio(music_list[music_index], music_index);
            
            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#repertoire_title_${music_index}`).css("color", "#8fb514");
        }
    });
}

export function PlayEventMusicList(music_list: Music[], music_index: number, event_index: number): void {
    PlayAudio(music_list[music_index], music_index);

    $(".title").css("color", "black");
    $(".events_music_title").css("color", "black");
    $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");

    // Remove handlers.
    $("#audio_player").off();
    $("#playNextButton").off();
    $("#playPreviousButton").off();

    $("#audio_player").on('ended', () => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);

            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
        }
    });

    $("#playNextButton").click(() => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);
            
            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
        }
    });

    $("#playPreviousButton").click(() => {
        if(music_index > 0){
            music_index--;
            PlayAudio(music_list[music_index], music_index);
            
            $(".title").css("color", "black");
            $(".events_music_title").css("color", "black");
            $(`#music_${music_index}_${event_index}`).css("color", "#8fb514");
        }
    });
}

function PlayAudio(music: Music, music_index: number): void {
    $('#pauseButton').click();
    $("#audio_player").attr("src", music.getMusicAudio());
    
    $('#playButton').click();

    if(music.getMusicAuthor() !== "") {
        $("#audio_title").text(music.getMusicAuthor() + ": " + music.getMusicTitle());
    }
    else {
        $("#audio_title").text(music.getMusicTitle());
    }

    $("#audio_event").text(`${music.getMusicEventPlace()} (${music.getMusicEventDateStr()})`);
}