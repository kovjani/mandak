$(document).ready(function(){
    SetStyle();
    CookieWarning();
});
function Dark_mode(){
    if(localStorage.getItem("nav_style") === "dark"){
        localStorage.setItem("nav_style", "burgundy");
    }
    else{
        localStorage.setItem("nav_style", "dark");
    }
    SetStyle();
}
function SetStyle(){
    if(localStorage.getItem("nav_style") === "dark"){
        $("nav").addClass("dark_mode");
        $("footer").addClass("dark_mode");
        $('.audio_player_container').addClass("dark_mode");
        $("#nav-logo").addClass("dark_logo");
        $("#facebook-footer-icon").addClass("dark-facebook");
        $("#youtube-footer-icon").addClass("dark-youtube");
    }
    else{
        $("nav").removeClass("dark_mode");
        $("footer").removeClass("dark_mode");
        $('.audio_player_container').removeClass("dark_mode");
        $("#nav-logo").removeClass("dark_logo");
        $("#facebook-footer-icon").removeClass("dark-facebook");
        $("#youtube-footer-icon").removeClass("dark-youtube");
    }
}

function CookieWarning(){
    if(!localStorage.getItem("cookies_accepted")){
        $('#cookie_warning').css('display', 'flex');
        $('.audio_player_container').addClass("bigger_player");
        $('footer').addClass("bigger_footer");
    }
}

function AcceptCookies(){
    localStorage.setItem("cookies_accepted", 'true');
    $('#cookie_warning').hide();
    $('.audio_player_container').removeClass("bigger_player");
    $('footer').removeClass("bigger_footer");
    $('#video').append(`<iframe width="1280" height="720" src="https://www.youtube.com/embed/1TntYnv5ApA" title="&#39;Október a reformáció hónapja&#39; nyitó istentisztelet - Mandák Kórus" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
}