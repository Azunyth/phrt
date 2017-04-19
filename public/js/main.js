$(document).ready(function(){

    var giveme = "Give me another random fap !";
    var wait = 'Randomizing your fap... <span class="loader"></span>';
    var urlWatch = 'http://faproulette.win/watch/';

    $("div.btn-launch").on("click", function(e) {
        $(this).siblings('img').eq(0).css({
            animationDuration: '0.5s'
        });

        setTimeout(function() {
            $.ajax({
                method: 'GET',
                url: '/random-video'
            }).then(function(res) {
                if(res.iframe) {
                    $("div.wheel-container, div.wheel-wrapper").addClass('collapse-wheel');
                    changeIframe(res.iframe);
                    $('<button class="btn btn-danger btn-lg btn-reload">'+giveme+'</button>').appendTo("div.iframe-container");
                    $("div.iframe-wrapper").toggle();
                    var randomVideoUrl = urlWatch + res.id;
                    $(".share-link-modal a.link-video").attr('src', randomVideoUrl);
                    $(".share-link-modal a.link-video").html(randomVideoUrl);
                }
            })
        }, 1000)

    });

    $("div.iframe-container").on('click', 'button.btn-reload', function() {
        var self = $(this);
        self.attr('disabled', 'disabled');

        self.html(wait);

        setTimeout(function() {
            $.ajax({
                method: 'GET',
                url: '/random-video'
            }).then(function(res) {
                self.removeAttr('disabled');
                self.html(giveme);
                changeIframe(res.iframe);
            });
        }, 600);
    })

    var changeIframe = function(iframe) {
        $("div.iframe-wrapper").empty().append($.parseHTML(checkIFrame(iframe)));
    }

    var checkIFrame = function(iframe) {
        var reg = /^"(.*)"$/;
        var iframeOk = iframe;

        if(reg.test(iframe)) {
            iframeOk = reg.exec(iframe)[1];
        }

        return iframeOk;
    }
})
