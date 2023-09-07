$(document).ready(function(){

    //change active nav-item
    $('.nav-item').on('click', function(e){
        $('.active').removeClass('active');
        $(this).addClass('active');
        if($(".navbar-toggler").css("display") != "none"){
            $(".navbar-toggler").click();
        }
    });

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