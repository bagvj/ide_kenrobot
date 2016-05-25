chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'resizable': false,
		'bounds': {
			'width': 680,
			'height': 440,
		}
	});
});

chrome.runtime.onMessageExternal.addListener(function(message, sender, sendResponse) {
	if(message && message == "ping") {
		sendResponse({
			action: "ping",
			result: "pong",
		});
	}
});