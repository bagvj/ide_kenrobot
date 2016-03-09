chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'id': 'kenrobot',
		'resizable': false,
		'bounds': {
			'width': 480,
			'height': 300,
		}
	});
});