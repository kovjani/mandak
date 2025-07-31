import $ from "jquery";
import { RepertoireSearch } from "../pages/repertoire";
import { EventsSearch } from "../pages/events";

$(() => {
    // Audio player controls

    const audio = $('#audio_player')[0] as HTMLAudioElement ;
    const seekBar = $('#seekBar');
    const currentTimeDisplay = $('#currentTime');
    const durationDisplay = $('#duration');

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
        let value = (100 / audio.duration) * audio.currentTime;
        seekBar.val(value);

        // Update the styles of the music using CSS letiables
        document.documentElement.style.setProperty('--seek-bar-percentage', value + '%');

        // Update the current time display
        let currentMinutes:number = Math.floor(audio.currentTime / 60);
        let currentSeconds:number = Math.floor(audio.currentTime % 60);
        let currentSecondsStr:string = currentSeconds.toString();
        if (currentSeconds < 10) { currentSecondsStr = '0' + currentSeconds; }
        currentTimeDisplay.text(currentMinutes + ':' + currentSecondsStr);
    };

    // Update the duration display once the audio metadata is loaded
    audio.onloadedmetadata = function() {
        let totalMinutes:number = Math.floor(audio.duration / 60);
        let totalSeconds:number = Math.floor(audio.duration % 60);
        let totalSecondsStr:string = totalSeconds.toString();
        if (totalSeconds < 10) { totalSecondsStr = '0' + totalSeconds; }
        durationDisplay.text(totalMinutes + ':' + totalSecondsStr);
    };

    // Seek to a new position when the seek bar is changed
    seekBar.on('input', function() {
        const val = seekBar.val();
        let seek_bar_val:number = typeof val === 'string' ? Number(val) : 0; 
        let time:number = audio.duration * (seek_bar_val / 100);
        audio.currentTime = time;
    });

    $("#repertoire_search_btn").click(function(){
        let val = $("#repertoire_search_item").val();
        let searched_item: string = val !== undefined ? val.toString() : "";
        RepertoireSearch(searched_item);

        // Show searched item in search bar.
        $("#repertoire_search_item").val(searched_item);
    });

    $("#events_search_btn").click(function(){
        let val = $("#events_search_item").val();
        let searched_item: string = val !== undefined ? val.toString() : "";
        EventsSearch(searched_item);

        // Show searched item in search bar.
        $("#events_search_item").val(searched_item);
    });

    $("#repertoire_search_btn").click();
    $("#events_search_btn").click();
});

$(document).on('keypress', (e) => {
    //enter
    if(e.which == 13){
        $("#repertoire_search_btn").click();
    }
});

let lastScrollTop = 0;
let search_bar_hidden = false;
$(document).on('scroll', (e) => {
   let st = $(document).scrollTop();

   if(st !== undefined){
        if (st > lastScrollTop && !search_bar_hidden){
            // Hide search_bar on downscroll.
            search_bar_hidden = true;
            $(".search_bar_container_outside").stop(true, true).animate({
                top: '-5em'
            });
        } else if (st <= lastScrollTop && search_bar_hidden){
            // Show search_bar on upscroll.
            search_bar_hidden = false;
            $(".search_bar_container_outside").stop(true, true).animate({
                top: 0
            });
        }
        lastScrollTop = st;
   }
   
});