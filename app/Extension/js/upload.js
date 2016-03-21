define(function() {
	var connectionId;
	var hexData;
	var completeCallback;
	var progressCallback;

	var timer;
	var burnCount;
	var burnTotal;

	var DTRRTSOn = {dtr: true, rts: true}; 
	var DTRRTSOff = {dtr: false, rts: false};
	var command = {
		"Sync_CRC_EOP" : 0x20,
		"GET_SYNC" : 0x30,
		"GET_SIGN_ON" : 0x31,
		"SET_PARAMETER" : 0x40,
		"GET_PARAMETER" : 0x41,
		"SET_DEVICE" : 0x42,
		"SET_DEVICE_EXT" : 0x45,
		"ENTER_PROGMODE" : 0x50,
		"LEAVE_PROGMODE" : 0x51,
		"CHIP_ERASE" : 0x52,
		"CHECK_AUTOINC" : 0x53,
		"LOAD_ADDRESS" : 0x55,
		"UNIVERSAL" : 0x56,
		"UNIVERSAL_MULTI" : 0x57,
		"PROG_FLASH" : 0x60,
		"PROG_DATA" : 0x61,
		"PROG_FUSE" : 0x62,
		"PROG_LOCK" : 0x63,
		"PROG_PAGE" : 0x64,
		"PROG_FUSE_EXT" : 0x65,
		"READ_FLASH" : 0x70,
		"READ_DATA" : 0x71,
		"READ_FUSE" : 0x72,
		"READ_LOCK" : 0x73,
		"READ_PAGE" : 0x74,
		"READ_SIGN" : 0x75,
		"READ_OSCCAL" : 0x76,
		"READ_FUSE_EXT" : 0x77,
		"READ_OSCCAL_EXT" : 0x78
	};

	function exec(connId, data, burnDelay, complete, progress) {
		connectionId = connId;
		timer = 0;
		completeCallback = complete;
		progressCallback = progress;
		burnTotal = 0;
		burnCount = 0;

		try {
			//准备数据
			prepare(data);
			updateProgress(10);

			//先关，等50ms后再开。然后200ms后正式发送数据
			chrome.serial.setControlSignals(connectionId, DTRRTSOff, function(result) {
				setTimeout(function() {
					chrome.serial.setControlSignals(connectionId, DTRRTSOn, function(result) {
						setTimeout(function() {
							doUpload(burnDelay);
						}, 200);
					});
				}, 50);
			});
		} catch(ex) {
			console.dir(ex);
			doComplete(false);
		}
	}

	function prepare(data) {
		hexData = "";
		var buffer = data.split("\n");
		for (var x = 0; x < buffer.length; x++) {
			var size = parseInt(buffer[x].substr(1, 2), 16);
			if (size == 0) {
				break;
			}
			for (var y = 0; y < (size * 2); y = y + 2) {
				hexData += String.fromCharCode(parseInt(buffer[x].substr(y + 9, 2), 16));
			}
		}
	}

	function doUpload(burnDelay) {
		updateProgress(15);
		var blockSize = 128;
		var count = Math.ceil(hexData.length / blockSize);
		burnTotal = 1 + count * 2;

		transmitPacket(d2b(command.ENTER_PROGMODE) + d2b(command.Sync_CRC_EOP), 50);
		var address = 0;
		for (var i = 0; i < count; i++) {
			var block = hexData.substr(blockSize * i, blockSize);
			transmitPage(address, block, burnDelay);
			address += 64;
		}
		timer = 0;
	}

	function updateProgress(value) {
		progressCallback && progressCallback(value);
	}

	function doComplete(value) {
		completeCallback && completeCallback(value);
	}

	function transmitPage(address, block, delay) {
		address = hexPad16(address.toString(16));
		address = address[2] + address[3] + address[0] + address[1];
		address = String.fromCharCode(parseInt(address[0] + address[1], 16)) + String.fromCharCode(parseInt(address[2] + address[3], 16));
		transmitPacket(d2b(command.LOAD_ADDRESS) + address + d2b(command.Sync_CRC_EOP), delay);
		transmitPacket(d2b(command.PROG_PAGE) + d2b(0x00) + d2b(block.length) + d2b(0x46) + block + d2b(command.Sync_CRC_EOP), delay);
	}

	function transmitPacket(msg, delay) {
		setTimeout(function() {
			chrome.serial.send(connectionId, stringToBuffer(msg), checkComplete);
		}, delay + timer);
		timer = timer + delay;
	}

	function checkComplete() {
		burnCount++;
		if(burnCount == burnTotal) {
			updateProgress(100);
			doComplete(true);
		} else {
			updateProgress(15 + Math.round((burnCount / burnTotal) * 85));
		}
	}

	function bufferToString(buf) {
		var bufView = new Uint8Array(buf);
		var encodedString = String.fromCharCode.apply(null, bufView);
		return decodeURIComponent(escape(encodedString));
	};

	function stringToBuffer(str) {
		var encodedString = str;
		var bytes = new Uint8Array(encodedString.length);
		for (var i = 0; i < encodedString.length; ++i) {
			bytes[i] = encodedString.charCodeAt(i);
		}
		return bytes.buffer;
	};

	function d2b(number) {
		return String.fromCharCode(number);
	}

	function hexPad16(num, size) {
		var size = 4;
		var s = "0000" + num;
		return s.substr(s.length - size);
	}

	return {
		exec: exec,
	};
});