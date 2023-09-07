//change active navbar item
$(document).ready(function(){
    $('.active').removeClass('active');
    $('#donate-nav-item').addClass('active');
    $("nav").removeClass("dark_mode");
});