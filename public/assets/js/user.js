define(['jquery', 'EventManager', 'util'], function($, EventManager, util) {
	var userInfo;
	var loginCheckTimer;

	function init() {
		initLoginDialog();

		initUserDialog();
	}

	function getUserId() {
		return userInfo ? userInfo.id : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function authCheck(callback) {
		$.ajax({
			type: 'GET',
			url: '/auth/check',
			dataType: 'json',
		}).done(function(result){
			var success = result.code == 0;
			userInfo = success ? result.user : null;
			callback && callback(success);
		});
	}

	function showLoginDialog(callback, index) {
		var dialog = $('#login_dialog');
		$('.qrLoginBtn, .baseLoginBtn', dialog).off('click').on('click', function(e) {
			var action = $(this).data("action");
			if (action == "qrLogin") {
				$(".qrLoginBtn, .qrLogin").removeClass("active");
				$(".baseLoginBtn, .baseLogin").addClass("active");
				$(".qrLoginBtn").css({
					display: "none"
				});
				$(".baseLoginBtn").css({
					display: "block"
				});
				$('#use_weixin').removeClass("active");

				setWeixinLoginCheck(false);
			} else {
				$(".baseLoginBtn, .baseLogin").removeClass("active");
				$(".qrLoginBtn, .qrLogin").addClass("active");
				$(".baseLoginBtn").css({
					display: "none"
				});
				$(".qrLoginBtn").css({
					display: "block"
				});

				setWeixinLoginCheck(true, callback);
			}
		});

		$('.btn-login', dialog).off('click').on('click', function() {
			$.ajax({
				type: 'POST',
				url: '/snspostlogin',
				dataType: 'json',
				data: {
					email: $('.email', dialog).val(),
					password: $('.password', dialog).val()
				},
			}).done(function(result){
				if (result.code == 0) {
					//登录成功
					util.message(result.message);
					$('#login_dialog .close-btn').click();

					callback && callback();
				} else if (result.code == 1) {

				} else {
					$('.baseLogin .message span').show().html(result.message).delay(2000).queue(function() {
						$(this).fadeOut().dequeue();
					});
				}
			});
		});

		index = index || 0;
		if(index == 0) {
			$('.qrLoginBtn').click();
		} else {
			$('.baseLoginBtn').click();
		}

		dialog.css({
			top: -dialog.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");
		$('.dialog-layer').addClass("active");
	}

	function initLoginDialog() {
		var dialog = $('#login_dialog');
		var use_weixin = $('#use_weixin');
		$('.close-btn', dialog).on('click', function(e) {
			dialog.slideUp(100, function(event, ui) {
				use_weixin.removeClass("active");
				$('.dialog-layer').removeClass("active");
			});
			setWeixinLoginCheck(false);
		});

		$('.qrLogin .qrcode').hover(function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			if (!use_weixin.is(':animated')) {
				use_weixin.addClass("active").show()
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					});
			}
		}, function(e) {
			var left = $(this).offset().left;
			if (!use_weixin.is(':animated')) {
				use_weixin.animate({
					left: left + 420,
					opacity: 0,
				}, null, null, function() {
					use_weixin.removeClass("active").hide();
				});
			}
		});

		$('form', dialog).on('keyup', function(e){
			if(e.keyCode == 13) {
				if($('.baseLogin', dialog).hasClass("active")){
					$(".btn-login", dialog).trigger("click");
				}
			}
		});
	}

	function initUserDialog() {
		var user = $('.user');
		var dialog = $('.dialog', user);
		var indent = $('.indent', user);
		var back = $('.software .back');
		$('.close-btn', dialog).on('click', function() {
			dialog.slideUp(200, function(e) {
				indent.show();
			});
			back.removeClass("active");
		});

		indent.on('click', function() {
			dialog.slideDown(400, function() {
				indent.hide();
			});
			back.addClass("active");
		});
	}

	function setWeixinLoginCheck(value, callback) {
		clearInterval(loginCheckTimer);
		if (value) {
			loginCheckTimer = setInterval(function() {
				var key = $('#qrcode_key').val();
				$.ajax({
					url: '/weixinlogin?key=' + key,
					dataType: 'json',
				}).done(function(result) {
					if (result.code == 0) {
						//登录成功
						userInfo = result.data;
						setWeixinLoginCheck(false);
						util.message(result.message);
						$('#login_dialog .close-btn').click();
						doUpdateUser();
						//回调
						callback && callback();
						EventManager.trigger("user", "login");
					} else if (result.code == 1) {
						//已经登录
						userInfo = result.data;
						setWeixinLoginCheck(false);
						doUpdateUser();
					} else {
						//登录失败

					}
				});
			}, 3000);
		}
	}

	function doUpdateUser() {
		var user = $('.user');
		var back = $('.software .back');
		if(userInfo) {
			user.addClass("active");
			back.addClass("active");
			$(".photo img", user).attr("src", userInfo.avatar_url);
			$(".name", user).text(userInfo.name);
		} else {
			user.removeClass("active");
			back.removeClass("active");
			$(".name", user).text("");
			$(".photo img", user).attr("src", "#");
		}
	}

	return {
		init: init,
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		authCheck: authCheck,
		showLoginDialog: showLoginDialog,
	};
});
