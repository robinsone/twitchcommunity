

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
                isSorted();
                console.log(data.stream?'LIVE NOW':'OFFLINE');
            });
            
        });
        // isSorted();
    });
}

function highlights() {
    $('#streamers').each(function () {
        var list = $(this).find('li');
        console.log(list);
        list.each(function(index, li){
            $.getJSON('https://api.twitch.tv/kraken/channels/'+ $(li).attr('data-src') + '/videos?limit=3').done(function(data){
                    $.each(data.videos, function(i, item) {
                        if (item.preview.toLowerCase().search("archive") == -1){
                        console.log('Video Title: ' + item.title);
                        var value = item.preview; // value = 9.61 use $("#text").text() if you are not on select box...
                        value = value.replace("320x240.jpg", "256x144.jpg"); // value = 9:61
                        $('#highlights-container').append('<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a class="thumbnail" data-sort="'+ item.created_at +'" href="'+ item.url +'"><img class="img-responsive" src="'+ value +'"></a></div>');
                        isHighlightSorted();
                        }
                    });
            });
            
        });
        // isSorted();
    });
}

function isSorted() {
    console.log('Before Sorting!!');
    tinysort('#streamers>li',{selector:'a',attr:'data-sort'});
    console.log('Sorted!!');
}

function isHighlightSorted() {
    console.log('Before Sorting highlights!!');
    tinysort('div#highlights-container>div',{selector:'a',attr:'data-sort', order:'desc'});
    console.log('Sorted highlights!!');
}

$(document).ready(function() {
    console.log('Document Ready');
    isLive();
    highlights();
});