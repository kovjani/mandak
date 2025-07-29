import $ from "jquery";
import { Music } from "../../models/Music"

export function PlayMusicList(music_list: Music[], music_index: number): void {
    PlayAudio(music_list[music_index], music_index);

    // Remove handlers.
    $("#audio_player").off();
    $("#playNextButton").off();
    $("#playPreviousButton").off();

    $("#audio_player").on('ended', () => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);
        }
    });

    $("#playNextButton").click(() => {
        if(music_index < music_list.length - 1){
            music_index++;
            PlayAudio(music_list[music_index], music_index);
        }
    });

    $("#playPreviousButton").click(() => {
        if(music_index > 0){
            music_index--;
            PlayAudio(music_list[music_index], music_index);
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

    $(".title").css("color", "black");
    $(`#repertoire_title_${music_index}`).css("color", "#8fb514");
}