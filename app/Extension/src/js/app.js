define(['jquery', './encoding', './upload'], function($, _, upload) {
	var connectionId;
	var uploadProgress;
	var serialDatas;
	var encoder;
	var decoder;
	var DTR_RTS_ON = {dtr: true, rts: true}; 
	var DTR_RTS_OFF = {dtr: false, rts: false};

	function init() {
		chrome.runtime.onMessageExternal.addListener(onMessageExternal);
		chrome.serial.onReceive.addListener(onReceive);
		chrome.serial.onReceiveError.addListener(onReceiveError);

		serialDatas = [];
		encoder = new TextEncoder();
		decoder = new TextDecoder();
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
			serialDatas = [];
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
			serialDatas = [];
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
		} else if(action == "serial.reset") {
			chrome.serial.setControlSignals(connectionId, DTR_RTS_OFF, function(a) {
				setTimeout(function() {
					chrome.serial.setControlSignals(connectionId, DTR_RTS_ON, function(b) {
						sendResponse(true);
					});
				}, 50);
			});
			return true;
		} else if(action == "serial.send") {
			if(!connectionId) {
				sendResponse(false);
				return;
			}
			var bytes = encoder.encode(message.data);
			chrome.serial.send(connectionId, bytes.buffer, function(sendInfo) {
				sendResponse(sendInfo);
			});
			return true;
		} else if(action == "serial.flush") {
			if(!connectionId) {
				sendResponse(false);
				return;
			}
			chrome.serial.flush(connectionId, function(result) {
				sendResponse(result);
			});
			return true;
		} else if(action == "serial.receive") {
			if(!connectionId) {
				sendResponse(false);
				return;
			}
			var result = serialDatas;
			serialDatas = [];
			sendResponse(result);
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

	function onReceive(info) {
		if(connectionId && info.connectionId == connectionId) {
			var str = decoder.decode(new Uint8Array(info.data));
			serialDatas.push(str);
		}
	}

	function onReceiveError(info) {
		connectionId = null;
		uploadProgress = 0;
		serialDatas = [];

		try {
			chrome.serial.disconnect(connectionId, function(){});
		} catch(ex) {

		}
	}

	return {
		init: init,
	};
});