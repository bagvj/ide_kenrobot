define(['vendor/jquery', 'vendor/jsencrypt', './config'], function($1, JSEncrypt, config) {

	function authCheck() {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/check',
			data: {
				id: 0
			},
			dataType: 'json',
		});
	}

	function login(username, password) {
		var encrypt = new JSEncrypt.JSEncrypt();
		encrypt.setPublicKey(config.encrypt.publicKey);

		return $.ajax({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: {
				username: username,
				password: encrypt.encrypt(password)
			},
		});
	}

	function weixinLogin(login_key) {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/weixin/login',
			data: {
				login_key: login_key,
			},
			dataType: 'json',
		});
	}

	function weixinQrcode(refresh) {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/weixin/qrcode',
			data: {
				refresh: refresh || false,
			},
			dataType: 'json',
		});
	}

	function register(fields) {
		var promise = $.Deferred();

		var encrypt = new JSEncrypt.JSEncrypt();
		encrypt.setPublicKey(config.encrypt.publicKey);

		$.ajax({
			type: 'POST',
			url: '/api/user/register',
			dataType: 'json',
			data: {
				email: fields.email,
				username: fields.username,
				password: encrypt.encrypt(fields.password),
				login: true,
			},
		}).done(function(result) {
			if(result.status == 0) {
				userInfo = result.data;
			}
			promise.resolve(result);
		});

		return promise;
	}



	return {
		authCheck: authCheck,
		login: login,
		weixinLogin: weixinLogin,
		weixinQrcode: weixinQrcode,
		register: register,
	};
});