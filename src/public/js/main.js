$(document).ready(function(){
    SetStyle();
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
        $("#nav-logo").addClass("dark_logo");
        $("#facebook-footer-icon").addClass("dark-facebook");
        $("#youtube-footer-icon").addClass("dark-youtube");
    }
    else{
        $("nav").removeClass("dark_mode");
        $("footer").removeClass("dark_mode");
        $("#nav-logo").removeClass("dark_logo");
        $("#facebook-footer-icon").removeClass("dark-facebook");
        $("#youtube-footer-icon").removeClass("dark-youtube");
    }
}