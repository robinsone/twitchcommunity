

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Show our element, then call our callback
$('.tabbable ul li a').click(function(e) {
    console.log($(this).attr('data-src'));
    $('.video-container').html("<iframe  src='" + $(this).attr('data-src') +"' frameborder='0' scrolling='no' allowfullscreen=''></iframe>")
});

function isLive() {
    $('#streamers').each(function () {
        var list = $(this).find('li');
        console.log(list);
        list.each(function(index, li){
            $.getJSON('https://api.twitch.tv/kraken/streams/'+ $(li).attr('data-src')).done(function(data){
                if (data.stream){
                    $('a', li).prepend('<span class="glyphicon glyphicon-play-circle" aria-hidden="true"></span> ');
                    $('a', li).attr('data-sort', 'a')
                    
                }else{
                    $('a', li).attr('data-sort', 'b')
                }
                
                console.log(data.stream?'LIVE NOW':'OFFLINE');
            });
            
        })
        // isSorted();
    });
}

function isSorted() {
    console.log('Before Sorting!!');
    tinysort('#streamers>li',{selector:'a',attr:'data-sort'});
    console.log('Sorted!!');
}

var sortVideos = function() {
    console.log('Video Sorting!!');
    tinysort('#videos',{selector:'div',attr:'data-sort'});
    console.log('Video Sorted!!');
}

var getHighlights = function() {
    var def = $.Deferred();
     $('#streamers').each(function () {
        var list = $(this).find('li');
        console.log(list);
        list.each(function(index, li){
            
            $.getJSON('https://api.twitch.tv/kraken/channels/'+ $(li).attr('data-src')+'/videos').done(function(data){
                
                $.each(data.videos, function(index, element) {
                    // <div class="col-lg-3 col-md-4 col-xs-6 thumb">
                    //     <a class="thumbnail" href="#">
                    //         <img class="img-responsive" src="http://placehold.it/400x225" alt="">
                    //     </a>
                    // </div>
                    console.log(element.title);
                    $('#videos').append('<div class="col-lg-3 col-md-4 col-xs-6 thumb" data-sort="'+ element._id +'"><a class="thumbnail" href="'+ element.url +'"><img class="img-responsive" src="'+ element.preview +'" alt=""></a></div>');
                    
                });
                
                
            });
            
        });
        def.resolve();
    });  
    return def;
}

$(document).ready(function() {
    console.log('Document Ready');
    isLive();
    isSorted();
    getHighlights().done(sortVideos());
});