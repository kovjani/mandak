import $ from "jquery";
export function GallerySetPicture(image_name:string, image_list:string[], image_index:number){
    $(document).scrollTop(0);

    $("#gallery_picture").attr("src", image_name);
    $("#gallery_picture").attr("alt", image_name);

    // Remove handles set before.
    $("#gallery_back_btn").off();
    $("#gallery_next_btn").off();

    $("#gallery_back_btn").click(() => {
        if(image_index > 0){
            image_index--;

            $("#gallery_picture").attr("src", image_list[image_index]);
            $("#gallery_picture").attr("alt", image_list[image_index]);
        }
    });

    $("#gallery_next_btn").click(() => {
        if(image_index < image_list.length - 1){
            image_index++;

            $("#gallery_picture").attr("src", image_list[image_index]);
            $("#gallery_picture").attr("alt", image_list[image_index]);
        }
    });
}