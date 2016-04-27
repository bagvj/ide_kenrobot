define(['vendor/jquery'], function() {

	function authCheck() {
		return $.ajax({
			type: 'GET',
			url: '/api/auth/check',
			dataType: 'json',
		});
	}

	function login(username, password) {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/login',
			dataType: 'json',
			data: {
				email: username,
				password: password
			},
		});
	}

	function weixinLogin(key) {
		return $.ajax({
			type: 'POST',
			url: '/api/auth/login/weixin',
			data: {
				key: key,
			},
			dataType: 'json',
		});
	}

	return {
		authCheck: authCheck,
		login: login,
		weixinLogin: weixinLogin,
	};
});