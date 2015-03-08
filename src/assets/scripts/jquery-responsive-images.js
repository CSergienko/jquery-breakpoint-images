// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


var breakpointImage = function(target) {
    var source,
        sourceString,
        folder,
        imageSource,
        imageName,
        imageExtension,
        isBackground;

    if($(target).length){
        $(target).each(function() {
            // Different variables based on element type.
            if ($(target).is('img')){
                source = 'src';
                sourceString = $(target).attr(source);
                isBackground = false;
            } else {
                source = 'style';
                sourceString = $(target).attr(source).match(/'([^']+)'/)[1];
                isBackground = true;
            }
            
            // Split source into logical chunks
            folder = sourceString.substring(0, sourceString.lastIndexOf('/') + 1);
            imageSource = sourceString.substring(sourceString.lastIndexOf('/') + 1, sourceString.length);
            imageName = imageSource.substring(0, imageSource.lastIndexOf('-') + 1);
            imageExtension = '.' + imageSource.substring(imageSource.lastIndexOf('.') + 1);
            
            // Replace the image source, depending on element type.
            var setImage = function(size){
                if (isBackground == false){
                    $(target).attr(source, folder + imageName + size + imageExtension);
                } else {
                    $(target).attr(source, "background-image: url('" + folder + imageName + size + imageExtension + "');");
                }
            }

            // Modernizr media queries, which trigger setImage and take the image suffix as a variable.
            var checkWidth = function() {
                if (Modernizr.mq('only screen and (max-width: 480px)')) {
                    setImage('small')
                } else if (Modernizr.mq('only screen and (min-width: 767px) and (max-width: 992px)')) {
                    setImage('medium')
                } else if (Modernizr.mq('only screen and (min-width: 992px) and (max-width: 1200px)')) {
                    setImage('desktop')
                } else if (Modernizr.mq('only screen and (min-width: 1200px)')) {
                    setImage('large')
                }
            }

            // Trigger the media queries on initialisation.
            checkWidth();

            // Debounce on window resize and trigger the image to be swapped.
            var imageSwitch = debounce(function(){
                checkWidth();
            }, 150);

            window.addEventListener('resize', imageSwitch);
        });
    }
}