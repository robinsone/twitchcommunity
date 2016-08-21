// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('body').on('click', '.page-scroll a', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function () {
    $("body").on("input propertychange", ".floating-label-form-group", function (e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function () {
    $('.navbar-toggle:visible').click();
});

// Show our element, then call our callback
$('.tabbable div a').click(function (e) {
    console.log($(this).attr('data-src'));
	var stream_src = $(this).attr('data-src');
	var channel_name = /\?.*channel=([^&]+)/.exec(stream_src)[1];
    $('.video-container').html("<iframe id='stream-video' src='" + stream_src + "' frameborder='0' scrolling='no' allowfullscreen=''></iframe><iframe id='chat_embed' frameborder='0' scrolling='no' src='http://www.twitch.tv/" + channel_name + "/chat'></iframe>");
});

$('#streamers').children().each(function() {
	$(this).find("h2").after('\
	<h3>\
		<svg class="svg-glyph_live" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">\
			<path clip-rule="evenodd" d="M11,14H5H2v-1l3-3h2L5,8V2h6v6l-2,2h2l3,3v1H11z" fill-rule="evenodd"></path>\
		</svg>\
		<span class="viewers"></span>\
		<svg class="svg-glyph_followers" height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px">\
			<path style="fill: #a49fad;" clip-rule="evenodd" d="M8,13.5L1.5,7V4l2-2h3L8,3.5L9.5,2h3l2,2v3L8,13.5z" fill-rule="evenodd"></path>\
		</svg>\
		<span class="followers"></span>\
	</h3>');
});

function isLive() {
    console.log("isLIVE");
    $('#streamers').children().each(function (index, item) {
        $.getJSON('https://api.twitch.tv/kraken/channels/' + item.getAttribute('data-src')).done(function (data) {
            item.getElementsByTagName('img')[0].setAttribute('src', data.video_banner);
            if (data.stream) {
                $('img').attr('src', data.video_banner);

            } else {
                $('img').attr('src', data.video_banner);
            }
            console.log(data.stream ? 'LIVE NOW' : 'OFFLINE');
        });

    });
    // isSorted();
}

function highlights() {
    $('#streamers').children.each(function () {
        var list = $(this).find('div');
        console.log(list);
        list.each(function (index, li) {
            $.getJSON('https://api.twitch.tv/kraken/channels/' + $(li).attr('data-src') + '/videos?limit=3').done(function (data) {
                $.each(data.videos, function (i, item) {
                    if (item.preview.toLowerCase().search("archive") == -1) {
                        console.log('Video Title: ' + item.title);
                        var value = item.preview; // value = 9.61 use $("#text").text() if you are not on select box...
                        value = value.replace("320x240.jpg", "256x144.jpg"); // value = 9:61
                        $('#highlights-container').append('<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a class="thumbnail" data-sort="' + item.created_at + '" href="' + item.url + '"><img class="img-responsive" src="' + value + '"></a></div>');
                        isHighlightSorted();
                    }
                });
            });

        });
        // isSorted();
    });
}

function Images() {
  console.log('Images');
        var list = $('#streamers').children('div');
        console.log(list);
        list.each(function (index, listItem) {
          console.log('data-src: ' + $(listItem).attr('data-src'));
            $.getJSON('https://api.twitch.tv/kraken/channels/' + $(listItem).attr('data-src')).done(function (data) {
                console.log('img: ' + data.logo);
                $(listItem).find('img').attr('src', data.logo);
				$(listItem).find('h3 span.followers').html(data.followers);
            });

            $.getJSON('https://api.twitch.tv/kraken/streams/' + $(listItem).attr('data-src')).done(function (data) {
              if (data.stream) {
                //$(listItem).find('a').append('<span>Live</span>');
				$(listItem).addClass('live').find('h3 span.viewers').html(data.stream.viewers);
              } else {
				$(listItem).find('h3 span.viewers').html('<span style="color:#bbb">Offline</span>');
			  }
              isSorted();
            });

            $.getJSON('https://api.twitch.tv/kraken/channels/' + $(listItem).attr('data-src') + '/videos?limit=3').done(function (data) {
                $.each(data.videos, function (i, item) {
                    if (item.preview.toLowerCase().search("archive") == -1) {
                        console.log('Video Title: ' + item.title);
                        var value = item.thumbnails[item.thumbnails.length - 1].url; // value = 9.61 use $("#text").text() if you are not on select box...
                        value = value.replace("320x240.jpg", "256x144.jpg"); // value = 9:61
                        $('#highlights-container').append('<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a class="thumbnail" data-sort="' + item.created_at + '" href="' + item.url + '"><img class="img-responsive" src="' + value + '"></a></div>');
                        isHighlightSorted();
                    }
                });
            });

        });
}

function isSorted() {
    console.log('Before Sorting!!');
    tinysort('#streamers>div', {
        selector: 'a',
        attr: 'data-sort'
    });
    console.log('Sorted!!');
}

function isHighlightSorted() {
    console.log('Before Sorting highlights!!');
    tinysort('div#highlights-container>div', {
        selector: 'a',
        attr: 'data-sort',
        order: 'desc'
    });
    console.log('Sorted highlights!!');
}

function TextBlock() {

    $("h2")
        .wrapInner("<span>")

    $("h2 br")
        .before("<span class='spacer'>")
        .after("<span class='spacer'>");
}

$(document).ready(function () {
    console.log('Document Ready');

    // highlights();
    // TextBlock();
    // isLive();
   Images();
});
