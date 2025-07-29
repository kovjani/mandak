let files;

$(document).ready(function(){
    files = "<%= files %>".split(',');

    ShowCookieContent();

    //change active nav-item
    $('.nav-item').on('click', function(e){
        $('.active').removeClass('active');
        $(this).addClass('active');
        if($(".navbar-toggler").css("display") != "none"){
            $(".navbar-toggler").click();
        }
    });


    $("#home_header_image_container").css("background-image", `url("/img/gallery/${files[0]}")`);
    
    for (let i = 0; i < files.length; i++) {
            
        let header_image = $("<div></div>");
        header_image.addClass("header-image");
        header_image.css("background-image", `url("/img/gallery/${files[i]}")`);
        header_image.attr("id", `${i}header-image`)

        $("#home_header_image_container").append(header_image);
    }

    /*$("#home_header_image_container").click(function(){
        location.href = `/galeria`;
    });*/
    setInterval(HomeNext, 5000);


    // let change_nav_item_while_scrolling = true;
    // // Initialize Tooltip
    // $('[data-toggle="tooltip"]').tooltip(); 
    
    // // Add smooth scrolling to all links in navbar + footer link
    // $(".nav-link, footer a[href='#myPage']").on('click', function(event) {
    //     change_nav_item_while_scrolling = false;
    //     // Make sure this.hash has a value before overriding default behavior
    //     if (this.hash !== "") {

    //         // Prevent default anchor click behavior
    //         event.preventDefault();

    //         // Store hash
    //         var hash = this.hash;

    //         // Using jQuery's animate() method to add smooth page scroll
    //         // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
    //         $('html, body').animate({
    //             scrollTop: $(hash).offset().top - 90
    //         }, 900, function(){
            
    //             // Add hash (#) to URL when done scrolling (default click behavior)
    //             window.location.hash = hash;
    //             change_nav_item_while_scrolling = true;
    //         });
    //     } // End if
    // });

    // //change active nav-item while scrolling
    // $window = $(window);

    // $window.scroll(function() {
    //     if(change_nav_item_while_scrolling){
    //         if ( $window.scrollTop() + 90 >= $('#gallery').offset().top ) {
    //             // if nav-link has reached the top
    //             $('.active').removeClass('active');
    //             $('#gallery-nav-item').addClass('active');
    //         }
    //         else if ( $window.scrollTop() + 90 >= $('#about').offset().top ) {
    //             // if nav-link has reached the top
    //             $('.active').removeClass('active');
    //             $('#about-nav-item').addClass('active');
    //         }
    //         else if ( $window.scrollTop() + 90 >= $('#home').offset().top ) {
    //             // if nav-link has reached the top
    //             $('.active').removeClass('active');
    //             $('#home-nav-item').addClass('active');
    //         }
    //     }
    // });
});

function ShowCookieContent(){
    if(localStorage.getItem("cookies_accepted")){
        //s$('#home_video').append(`<iframe width="1280" height="720" src="https://www.youtube.com/embed/1TntYnv5ApA" title="&#39;Október a reformáció hónapja&#39; nyitó istentisztelet - Mandák Kórus" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
    }
}

let home_pictures_i = 1;
function HomeNext(){
    $(`.header-image`).css({"z-index": 0});
    $(`#${home_pictures_i}header-image`).css({"z-index": 1});
    $(`#${home_pictures_i}header-image`).animate({
        left: '0px'
    }, 1000, () => {
        if(home_pictures_i === 0)
            $(`#${files.length - 1}header-image`).css("left", "100vw");
        else
            $(`#${home_pictures_i-1}header-image`).css("left", "100vw");
        home_pictures_i++;
        if(home_pictures_i === files.length) home_pictures_i = 0;
    });
}