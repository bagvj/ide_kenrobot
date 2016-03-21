define(['jquery', './upload'], function($, upload) {
	var connectionId;
	var uploadProgress;

	function init() {
		chrome.runtime.onMessageExternal.addListener(onMessageExternal);
	}

	function ensureConnect(callback) {
		try {
			var count = 0;
			var onDisconnect = function(result) {
				if(count > 0) {
					count--;
				} else {
					callback();
				}
			}
			chrome.serial.getConnections(function(connections) {
				count = connections.length;
				if(count > 0) {
					for(var i = 0; i < count; i++) {
						var connectionInfo = connections[i];
						chrome.serial.disconnect(connectionInfo.connectionId, onDisconnect);
					}
				} else {
					callback();
				}
			});
		} catch(ex) {
			callback();
		}
	}

	function onMessageExternal(message, sender, sendResponse) {
		if(!message || !message.action) {
			return;
		}

		var action = message.action;
		if(action == "serial.getDevices") {
			chrome.serial.getDevices(function(ports) {
				sendResponse(ports);
			});
			return true;
		} else if(action == "serial.connect") {
			connectionId = null;
			uploadProgress = 0;
			ensureConnect(function() {
				try {
					chrome.serial.connect(message.portPath, {
						bitrate: message.bitRate,
					}, function(connectionInfo) {
						if(connectionInfo && connectionInfo.connectionId) {
							connectionId = connectionInfo.connectionId;
							sendResponse(connectionId);
						} else {
							sendResponse(false);
						}
					});
				} catch(ex) {
					sendResponse(false);
				}
			});
			return true;
		} else if(action == "serial.disconnect") {
			connectionId = null;
			uploadProgress = 0;
			try {
				chrome.serial.disconnect(message.connectionId, function(result){
					sendResponse(result);
				});
			} catch(ex) {
				sendResponse(true);
			}
			return true;
		} else if(action == "serial.getInfo") {
			chrome.serial.getInfo(message.connectionId, function(connectionInfo) {
				if(connectionInfo && connectionInfo.connectionId) {
					sendResponse(true);
				} else {
					sendResponse(false);
				}
			});
			return true;
		} else if(action == "upload") {
			$.ajax({
				url: message.url,
			}).done(function(hexData) {
				uploadProgress = 5;
				upload.exec(connectionId, hexData, message.delay, function(success) {
					sendResponse(success);
				}, function(progress) {
					uploadProgress = progress;
				});
			}).fail(function() {
				sendResponse(false);
			});
			return true;
		} else if(action == "upload.progress") {
			sendResponse(uploadProgress);
		}
	}

	return {
		init: init,
	};
});