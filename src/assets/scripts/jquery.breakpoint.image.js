// Borrowed debounce function from Dave Walsh
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


// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'breakpointImage',
        defaults = {
            source: 'src'
        },
        $target,
        source,
        sourceString,
        folder,
        imageSource,
        imageName,
        imageExtension;

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
        this.checkWidth();

    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            $target = $(this.element);

            if ($($target).is('img')){
                source = this.options.source;
                sourceString = $($target).attr(source);
                isBackground = false;
            } else {
                source = 'style';
                sourceString = $($target).attr(source).match(/'([^']+)'/)[1];
                isBackground = true;
            }

            // Split source into logical chunks
            folder = sourceString.substring(0, sourceString.lastIndexOf('/') + 1);
            imageSource = sourceString.substring(sourceString.lastIndexOf('/') + 1, sourceString.length);
            imageName = imageSource.substring(0, imageSource.lastIndexOf('-') + 1);
            imageExtension = '.' + imageSource.substring(imageSource.lastIndexOf('.') + 1);

            console.log(source + ' ' + sourceString + ' ' + isBackground + ' ' + folder + ' ' + imageSource + ' ' + imageName + ' ' + imageExtension);
        },

        setImage: function(size){
            console.log(size);
            if (isBackground == false){
                $($target).attr(source, folder + imageName + size + imageExtension);
            } else {
                $($target).attr(source, "background-image: url('" + folder + imageName + size + imageExtension + "');");
            }
        },

        checkWidth: function() {
            if (Modernizr.mq('only screen and (max-width: 480px)')) {
                this.setImage('small');
            } else if (Modernizr.mq('only screen and (min-width: 767px) and (max-width: 992px)')) {
                this.setImage('medium');
            } else if (Modernizr.mq('only screen and (min-width: 992px) and (max-width: 1200px)')) {
                this.setImage('desktop');
            } else if (Modernizr.mq('only screen and (min-width: 1200px)')) {
                this.setImage('large');
            }
        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


/*var _old_breakpointImage = function(target) {
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
}*/