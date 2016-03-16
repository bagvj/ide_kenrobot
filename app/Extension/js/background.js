chrome.app.runtime.onLaunched.addListener(function(launchData) {
	var id = launchData.id;
	if(id == "debug") {
		chrome.app.window.create('debug.html', {
			'id': 'debug',
			'resizable': false,
			'bounds': {
				'width': 480,
				'height': 300,
			}
		});
	} else {
		chrome.app.window.create('burn.html', {
			'id': 'burn',
			'resizable': false,
			'bounds': {
				'width': 340,
				'height': 200,
			}
		});
	}
});

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
	if(message && message == "isInstalled") {
		sendResponse({
			action: "isInstalled",
			result: true,
		});
	}
});