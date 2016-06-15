define(['vendor/jquery'], function() {

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