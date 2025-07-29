const urlParams = new URLSearchParams(location.search);
let galleryBackBtn = $('<button class="navigatebtn" onclick="GalleryBack()"><</button>');
let galleryNextBtn = $('<button class="navigatebtn" onclick="GalleryNext()">></button>');
let gallery_pictures_i = 0;
let images;
let event = parseInt(urlParams.get('event'));

$.post("/get_local_images", {event_id: event}, (res) => {
    images = res;

    GallerySetPicture(urlParams.get('image'));

    $("#gallery_buttons_container").append(galleryBackBtn);

    if (images.length <= 10){
        for (let j = 0; j < images.length; j++) {
            let new_image_btn = $("<img>");
            new_image_btn.attr("src", images[j].image);
            new_image_btn.attr("alt", images[j].name);
            new_image_btn.addClass("imgbtn");
            new_image_btn.click(function(){
                i = j;
                GallerySetPicture(images[i].image);
            });
            $("#gallery_buttons_container").append(new_image_btn);
        }
    }

    $("#gallery_buttons_container").append(galleryNextBtn);
});

function GalleryNext(){
    gallery_pictures_i++;
    if(gallery_pictures_i > images.length - 1) gallery_pictures_i = 0;

    GallerySetPicture(images[gallery_pictures_i].image);
}

function GalleryBack(){
    gallery_pictures_i--;
    if(gallery_pictures_i < 0) gallery_pictures_i = images.length - 1;                
    
    GallerySetPicture(images[gallery_pictures_i].image);
}

function GallerySetPicture(image){
    $("#gallery_picture").attr("src", image);
    $("#gallery_picture").attr("alt", image);
}