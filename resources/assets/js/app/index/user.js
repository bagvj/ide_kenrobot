define(['vendor/jquery', './util', './EventManager', './userApi'], function($1, util, EventManager, userApi) {
	var userInfo;

	var dialogWin;
	var loginTabs;
	var switchs;

	var qrcode;
	var qrcodeKey;
	var qrcodeTimeout = 5 * 60 * 1000;
	var qrcodeTimeoutTimer;

	var loginCheckTimer;
	var loginCallback;
	var scanTimerId;
	var dialogMode;
	var loginType;

	function init() {
		dialogWin = $('.login-dialog');

		//登录、注册切换
		$('.tab-login .switch-register, .tab-register .switch-login').on('click', onSwitchDialogMode);

		//登录切换
		switchs = $('.tab-login .switch li', dialogWin).on('click', onSwitchLoginType);
		loginTabs = $('.tab-login .tabs', dialogWin);

		//登录
		$('.tab-account .login', dialogWin).on('click', onLoginClick);

		//回车
		$('.tab-account .username, .tab-account .password', dialogWin).on('keyup', onLoginEnter);

		qrcode = $('.tab-quick .qrcode', dialogWin);
		qrcodeKey = $('.tab-quick .qrcode-key', dialogWin);

		//二维码过期，刷新
		$('.tab-quick .refresh', dialogWin).on('click', onRefreshQrcodeClick);

		//注册
		$('.tab-register .register', dialogWin).on('click', onRegisterClick);

		refreshWeixinQrcode();

		$('.user-login li').on('click', onShowLogin);
		var user = $('.user');
		var userMenu = $('.user-menu', user);

		var hideMenu = function() {
			userMenu.hide();
		}

		userMenu.on('mouseleave', hideMenu);
		user.on('mouseleave', hideMenu);

		$('.user-info', user).on('mouseover', function() {
			userMenu.show();
		});

		$('ul > li', userMenu).on('click', onMenuClick);

		if(user.hasClass("active")) {
			$('.top-menu').css({
				'margin-right': user.width(),
			});
		}
	}

	function getUserId() {
		return userInfo ? userInfo.uid : 0;
	}

	function getUserInfo() {
		return userInfo;
	}

	function getUserName() {
		return userInfo ? userInfo.name : "";
	}

	function authCheck(show) {
		var promise = $.Deferred();
		userApi.authCheck().done(function(result){
			if(result.status == 0) {
				userInfo = result.data;
				promise.resolve();
			} else {
				userInfo = null;
				show && showLoginDialog();
				promise.reject();
			}
		});

		return promise;
	}

	function showLoginDialog(callback, type, isRegister) {
		onShow({
			mode: isRegister ? "register" : "login",
			type: type,
			callback: callback,
		});
	}

	function onShow(args) {
		args = args || {};

		loginCallback = args.callback;

		switchDialogMode(args.mode || "login");
		switchLoginType(args.type || "quick");

		$('.reset-field', dialogWin).val('');

		refreshWeixinQrcode();
		setTimeout(onQrcodeTimeout, qrcodeTimeout);

		util.showDialog({
			selector: dialogWin,
			afterClose: onAfterClose,
		});
	}

	function onAfterClose() {
		loginCallback = null;
		clearTimeout(onQrcodeTimeout);
		qrcodeTimeoutTimer = null;

		setWeixinLoginCheck(false);
	}

	function switchDialogMode(mode) {
		dialogMode = mode;

		$('.title .mode', dialogWin).text(dialogMode == "login" ? "登录" : "注册");

		var tab = $('.tab-' + dialogMode, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var titleHeight = $('.title', dialogWin).height();
		var height = tab.height();
		tab.parent().height(height);
		dialogWin.height(height + titleHeight);

		setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
		$('.reset-field', dialogWin).val('');
	}

	function switchLoginType(type) {
		loginType = type;

		switchs.filter('[data-action="' + loginType + '"]').addClass("active").siblings().removeClass("active");

		var tab = $('.tab-login .tab-' + loginType, dialogWin);

		tab.siblings(".active").removeClass("x-fadeIn").removeClass("active").addClass("x-fadeOut");
		tab.removeClass("x-fadeOut").addClass("active").addClass("x-fadeIn");

		var index = tab.index();
		var x = index == 0 ? "0" : (0 - index * tab.width()) + "px";
		loginTabs.css("transform", "translateX(" + x + ")");

		if(loginType == "account") {
			$('.tab-login .username', dialogWin).focus();
		}

		setWeixinLoginCheck(dialogMode == "login" && loginType == "quick");
		$('.reset-field', dialogWin).val('');
	}

	function onSwitchDialogMode(e) {
		var mode = $(this).data("action");
		switchDialogMode(mode);
	}

	function onSwitchLoginType(e) {
		var li = $(this);
		if(li.hasClass("active")) {
			return;
		}
		
		var type = li.data("action");
		switchLoginType(type);
	}

	function onRefreshQrcodeClick(e) {
		refreshWeixinQrcode();
	}

	function onLoginClick() {
		var $username = $('.tab-account .username', dialogWin);
		var $password = $('.tab-account .password', dialogWin);
		var username = $.trim($username.val());
		var password = $.trim($password.val());

		if(username == "") {
			showError($username, "请输入帐号");
			return;
		}

		if(password == "") {
			showError($password, "请输入密码");
			return;
		}

		var remember = $('.tab-account .remember', dialogWin).is(":checked");
		userApi.login(username, password, remember).done(onAccountLogin);
	}

	function onLoginEnter(e) {
		e.keyCode == 13 && onLoginClick();
	}

	function setWeixinLoginCheck(value) {
		clearInterval(loginCheckTimer);
		loginCheckTimer = null;

		if (!value) {
			return;
		}

		loginCheckTimer = setInterval(function() {
			userApi.weixinLogin(qrcodeKey.val()).done(onWeixinLogin);
		}, 3000);
	}

	function onAccountLogin(result) {
		if (result.status == 0) {
			userInfo = result.data;
			//登录成功
			closeDialog();
			doUpdateUser();
			EventManager.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {
			doUpdateUser();
			doLoginCallback();
		} else {
			showError($(".tab-account .password"), result.message);
		}
	}

	function onWeixinLogin(result) {
		if (result.status == 0) {
			//登录成功
			setWeixinLoginCheck(false);
			closeDialog();
			doUpdateUser();
			EventManager.trigger("user", "login");
			doLoginCallback();
		} else if (result.status == 1) {
			//已经登录
			setWeixinLoginCheck(false);
			doUpdateUser();
		} else if(result.status == -3) {
			refreshWeixinQrcode();
		} else {
			//登录失败
		}
	}

	function onQrcodeTimeout() {
		setWeixinLoginCheck(false);
		qrcode.addClass("timeout");
		qrcodeTimeoutTimer = null;
	}

	function closeDialog() {
		$('.dialog-close', dialogWin).click();
	}

	function onRegisterClick(e) {
		var $email = $('.tab-register .email', dialogWin);
		var $username = $('.tab-register .username', dialogWin);
		var $password = $('.tab-register .password', dialogWin);
		var $confirmPassword = $('.tab-register .confirm-password', dialogWin);

		var email = $.trim($email.val());
		var username = $.trim($username.val());
		var password = $.trim($password.val());
		var confirmPassword = $.trim($confirmPassword.val());

		if(email == "") {
			showError($email, "请输入邮箱");
			return;
		}

		if(username == "") {
			showError($username, "请输入帐号");
			return;
		}

		if(password == "") {
			showError($password, "请输入密码");
			return;
		}

		if(confirmPassword == "") {
			showError($confirmPassword, "请再次输入密码");
			return;
		}

		if(password != confirmPassword) {
			showError($confirmPassword, "请确认密码");
			return;
		}

		userApi.register({
			email: email,
			username: username,
			password: password,
		}).done(onRegisterSuccess);
	}

	function onRegisterSuccess(result) {
		if(result.status == 0) {
			userInfo = result.data;
			closeDialog();
			doUpdateUser();
			EventManager.trigger("user", "login");
		} else {
			showError($(".tab-register .username"), result.message);
		}
	}

	function showError(target, message) {
		var error = target.siblings(".error");
		error.addClass("active").text(message).delay(2000).queue(function() {
			error.removeClass("active").text('').dequeue();
		});
	}

	function refreshWeixinQrcode() {
		userApi.weixinQrcode(true).done(function(result){
			if (result.status != 0) {
				return;
			}

			qrcodeKey.val(result.data.login_key);
			qrcode.attr('src', result.data.qrcodeurl);

			qrcode.removeClass("timeout");
			clearTimeout(onQrcodeTimeout);
			qrcodeTimeoutTimer = setTimeout(onQrcodeTimeout, qrcodeTimeout);
		});
	}

	function doLoginCallback() {
		loginCallback && loginCallback();
	}

	function onShowLogin(e) {
		var action = $(this).data('action');
		showLoginDialog(null, "quick", action == "register");
	}

	function onMenuClick(e) {
		var li = $(this);
		var action = li.data('action');
		switch(action) {
			case "share":
				EventManager.trigger("project", "share");
				break;
			case "logout":
				window.location.href = "/logout";
				break;
		}
	}

	function doUpdateUser() {
		var user = $('.user');
		var topMenu = $('.top-menu');

		if(userInfo) {
			user.addClass("active");
			$(".photo img", user).attr("src", userInfo.avatar_url || "assets/image/default-user.png");
			$(".name", user).text(userInfo.name);

			topMenu.css({
				'margin-right': user.width(),
			});
		} else {
			user.removeClass("active");
			$(".name", user).text("");
			$(".photo img", user).attr("src", "#");

			topMenu.css({
				'margin-right': 0,
			});
		}
	}

	return {
		init: init,
		getUserId: getUserId,
		getUserInfo: getUserInfo,
		getUserName: getUserName,
		authCheck: authCheck,
		showLoginDialog: showLoginDialog,
	};
});