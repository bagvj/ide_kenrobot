define(['jquery', 'eventcenter', 'html2canvas', 'hljs', 'genC'], function($, eventcenter, _, hljs, genC) {
    function initNavSecond() {
        $(".nav-second>ul>li .category").click(function() {
            var li = $(this).parent();
            if (li.hasClass("active")) {
                li.removeClass("active");  
            } else {
                // li.parent().find(".active").removeClass("active");
                li.addClass("active");
            }
        }).each(function(i, o) {
            $(this).parent().addClass("active");
        });
    }

    function initTabs() {
        $('.tabs li').click(function() {
            if ($(this).hasClass("active")) {
                return;
            }

            $(this).parent().find(".active").removeClass("active");
            $(this).addClass("active");

            var index = $(this).index();
            var selector;
            if (index == 0) {
                selector = "#flowchart-container";
            } else {
                selector = "#hardware-container";
            }
            html2canvas($(selector), {
                profile: true,
                allowTaint: true,
                onrendered: function(canvas) {
                    $('#thumbnailCanvas').html(canvas);
                    if ($(canvas).attr("width") != 0) {
                        $("#thumbnailCanvas canvas").css({
                            width: "100%",
                            height: "100%"
                        });
                    }

                    $('.mod').css({visibility : "hidden"});
                    $('.mod:eq(' + index + ')').css({visibility : "visible"});

                    if (index == 0) {
                        eventcenter.delaytrigger('hardware', 'init_container');
                    } else {
                        eventcenter.delaytrigger('flowchart', 'init_container');
                    }
                }
            });
        });
    }

    function initLogin() {
        $('.login li a.loginBtn').click(function(e) {
            $('#login_dialog').dialog({
                draggable: false,
                modal: true,
                resizable: false,
                show: {
                    effect: "blind",
                    duration: 200
                },
                hide: {
                    effect: "blind",
                    duration: 200
                },
                close: function(event, ui) {
                    $('.login li a.loginBtn').blur();
                    $('#use_weixin').removeClass("active");
                }
            });
        });

        $('.qrLoginBtn, .baseLoginBtn').click(function(e) {
            var action = $(this).attr("data-action");
            if (action == "qrLogin") {
                $(".qrLoginBtn, .qrLogin").removeClass("active");
                $(".baseLoginBtn, .baseLogin").addClass("active");
                $(".qrLoginBtn").css({
                    display: "none"
                });
                $(".baseLoginBtn").css({
                    display: "block"
                });
            } else {
                $(".baseLoginBtn, .baseLogin").removeClass("active");
                $(".qrLoginBtn, .qrLogin").addClass("active");
                $(".baseLoginBtn").css({
                    display: "none"
                });
                $(".qrLoginBtn").css({
                    display: "block"
                });
            }

            var time1 = setInterval(function() {
                var key = $('#qrcode_key').val();
                $.get('/weixinlogin?key=' + key, function(result) {
                    console.log(result.message);
                    if (result.code == 0) {
                        //登录成功
                        clearInterval(time1);
                        window.location.href = "/";
                    } else if(result.code == 1) {
                        //已经登录
                        clearInterval(time1);
                    } else {
                        //登录失败
                    }
                });
            }, 3000);
        });

        $('#login_dialog .closeBtn').click(function(e) {
            $('#login_dialog').dialog('close');
        });


        $('.submitBtn').click(function() {
            $.post('/snspostlogin', {
                    email: $('#email').val(),
                    password: $('#password').val()
                },
                function(result) {
                    if (result.code == 0) {
                        //登录成功
                        window.location.href = "/";
                    } else if(result.code == 1 ) {

                    } else {
                        $('.baseLogin .message span')
                            .html(result.message)
                            .delay(2000)
                            .queue(function(){
                                $(this).fadeOut().dequeue();
                            });
                    }
                });
        });

        $('.qrLogin .qrcode').hover(function(e){
            var top = $(this).offset().top;
            var left = $(this).offset().left;
            if(!$('#use_weixin').is(":animated")){
                $('#use_weixin')
                    .addClass("active")
                    .css({top: top - 160, left: left + 50, opacity: 0})
                    .animate({
                        left: left + 260,
                        opacity: 1,
                    }, 500);
            }
        }, function(e) {
            var left = $(this).offset().left;
            if(!$('#use_weixin').is(":animated")){
                $('#use_weixin')
                    .animate({
                        left: left + 420,
                        opacity: 0,
                    }, 500, null, function(){
                        $(this).removeClass("active");
                    });
            }
        })
    }

    //缩略图
    function initThumbnail() {
        var scaleTip = $('.thumbnail .scaleTip');
        var wrap = $('.thumbnail .canvas-wrap');

        var wrapWidth = 0;
        var wrapHeight = 0;
        var wrapLeft = 0;
        $('.thumbnail .foldBtn').click(function(e) {
            if (wrap.attr("data-action") == "show") {
                wrapLeft = wrap.position().left;
                wrapWidth = wrap.width();
                wrapHeight = wrap.height();
                $(this).removeClass("active");
                wrap.stop().animate({
                    width: 0,
                    height: 0,
                    left: wrapLeft + wrapWidth,
                }, 300);
                wrap.attr("data-action", "hide");
            } else {
                wrapLeft = wrap.position().left;
                $(this).addClass("active")
                wrap.stop().animate({
                    width: wrapWidth,
                    height: wrapHeight,
                    left: wrapLeft - wrapWidth,
                }, 300);
                wrap.attr("data-action", "show");
            }
        });

        var thumbnail = $('.thumbnail').draggable({
            containment: "window",
            handle: ".canvas-wrap",
            opacity: 0.5,
        });

        wrap.resizable({
            handles: "sw",
            autoHide: true,
            aspectRatio: true,
        });
        wrap.resize(function(e) {
            var wrapHeight = wrap.height();
            var wrapLeft = wrap.position().left
            scaleTip.css({
                left: wrapLeft + 2,
                top: wrapHeight - scaleTip.height()
            });
        })

        $(window).resize(function(e) {
            if(e.target == wrap[0]) {
                return
            }
            var windowWidth = $(window).width();
            var width = thumbnail.width();
            thumbnail.css({
                top: 60,
                left: windowWidth - 242 - width,
            });
        });
    }

    function initCode(){
        $('#code-more .closeBtn').click(function(e) {
            $('#code-more').dialog("close");
        });

        $('.code-side .code_view').click(function(e) {
            $('#code-more .code').html($('#c_code_input').html())
            $('#code-more').dialog({
                draggable: false,
                modal: true,
                resizable: false,
            });
        });
    }
    
    function init() {
        $(document).ready(function() {
            initTabs();
            initNavSecond();
            initLogin();
            initThumbnail();
            initCode();

            eventcenter.delaytrigger('hardware', 'init_container');
            eventcenter.delaytrigger('flowchart', 'init_container');
            $('.tabs li:first-child').click();
        });
    }

    return {
        init: init,
    }
});
