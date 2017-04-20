$(document).ready(function(){

    window.fbAsyncInit = function() {
        FB.init({
          appId      : '1409954279075055',
          xfbml      : true,
          version    : 'v2.9'
        });
        //FB.AppEvents.logPageView();


      };

    (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

    var giveme = "Give me another random fap !";
    var wait = 'Randomizing your fap... <span class="loader"></span>';
    var baseUrl = 'http://faproulette.win/'
    var urlWatch = baseUrl + 'watch/';

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
                    $(".share-link-modal a.link-video").attr('href', randomVideoUrl);
                    $(".share-link-modal a.link-video").html(randomVideoUrl);
                    $("button.btn-fb-share").attr('data-id', res.id);
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
    });

    $("button.btn-fb-share").on('click', function(e) {
        var self = $(this);
        var urlToShare = baseUrl;
        var videoId = self.attr('data-id');

        if(videoId != undefined) {
            urlToShare = urlWatch + videoId;
        }

        FB.ui({
            method: 'share',
            display: 'popup',
            href: urlToShare,
            quote: "The FapRoulette has choosen for me !"
          }, function(response){});
    });

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
