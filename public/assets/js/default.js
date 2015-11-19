define(['jquery', 'eventcenter', 'html2canvas', 'hljs', 'genC'], function($, eventcenter, _, hljs, genC) {
    var showGuide = null;

    function setShowGuid(show) {
        showGuide = show;
    }

    function initNavSecond() {
        $(".nav-second li").click(function() {
            if ($(this).attr("class").indexOf("active") == -1) {
                $(this).parent().find(".active").removeClass("active");
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });
    }

    function initTabs() {
        $('.tabs li').click(function() {
            var className = $(this).attr("class");
            if (className && className.indexOf("active") > -1) {
                return false;
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
                onrendered: function(canvas) {
                    $('#thumbnailCanvas').html(canvas);
                    if ($(canvas).attr("width") != 0) {
                        $("#thumbnailCanvas canvas").css({
                            width: "100%",
                            height: "100%"
                        });
                    }

                    $('.mod').css({display: "none"});
                    $('.mod:eq(' + index + ')').css({display: "block"});

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
        });

        var time1 = setInterval(function() {
            var key = $('#qrcode_key').val();
            $.get('/weixinlogin?key=' + key, function(result) {
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

    function initThumbnail() {
        $('.thumbnail .foldBtn').click(function(e) {
            var wrap = $('.thumbnail .canvas-wrap');
            if (wrap.attr("data-action") == "show") {
                $(this).removeClass("active");
                wrap.stop().animate({
                    width: "0%",
                    height: "0%"
                }, 300);
                wrap.attr("data-action", "hide");
            } else {
                $(this).addClass("active")
                wrap.stop().animate({
                    width: "100%",
                    height: "100%"
                }, 300);
                wrap.attr("data-action", "show");
            }
        });

        $('.thumbnail').draggable({
            containment: "window",
            handle: ".canvas-wrap"
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
        setShowGuid: setShowGuid
    }
});
