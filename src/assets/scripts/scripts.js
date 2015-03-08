$(document).ready(function() {
    // Works on inline background images!
    //breakpointImage('.demo-image-bg');

    // Works on inline, boring images!
    //breakpointImage('.demo-image-img');

    $('.demo-image-bg, .demo-image-img').breakpointImage();

    $(window).resize(function() {
        $('.demo-image-bg, .demo-image-img').breakpointImage();
    });
});

