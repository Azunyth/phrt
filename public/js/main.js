$(document).ready(function(){

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
                    $("div.iframe-wrapper").append($.parseHTML(res.iframe));

                    $('<a href="/" class="btn btn-danger btn-lg">Give me another random fap !</a>').appendTo("div.iframe-container");

                    $("div.iframe-wrapper").toggle();
                }
            })
        }, 1500)

    });
})
