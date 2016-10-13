define(function() {
	var d2b = String.fromCharCode;

	var COMMAND = {
		SYNC_CRC_EOP: 0x20,
		GET_SYNC: 0x30,
		GET_SIGN_ON: 0x31,
		SET_PARAMETER: 0x40,
		GET_PARAMETER: 0x41,
		SET_DEVICE: 0x42,
		SET_DEVICE_EXT: 0x45,
		ENTER_PROG_MODE: 0x50,
		LEAVE_PROG_MODE: 0x51,
		CHIP_ERASE: 0x52,
		CHECK_AUTOINC: 0x53,
		LOAD_ADDRESS: 0x55,
		UNIVERSAL: 0x56,
		UNIVERSAL_MULTI: 0x57,
		PROG_FLASH: 0x60,
		PROG_DATA: 0x61,
		PROG_FUSE: 0x62,
		PROG_LOCK: 0x63,
		PROG_PAGE: 0x64,
		PROG_FUSE_EXT: 0x65,
		READ_FLASH: 0x70,
		READ_DATA: 0x71,
		READ_FUSE: 0x72,
		READ_LOCK: 0x73,
		READ_PAGE: 0x74,
		READ_SIGN: 0x75,
		READ_OSCCAL: 0x76,
		READ_FUSE_EXT: 0x77,
		READ_OSCCAL_EXT: 0x78
	};

	var completeCallback;
	var progressCallback;
	var packageCount;
	var packageTotal;
	var timers = [];

	function exec(args) {
		var delay = args.delay || 250;
		var hexRaw = args.data;
		var send = args.send;
		completeCallback = args.onComplete;
		progressCallback = args.onProgress;

		var packages = convertHex(hexRaw);
		packageTotal = packages.length;
		packageCount = 0;

		try {
			var time = doSend(send, packages[0], 50);
			for (var i = 1; i < packages.length; i++) {
				time = doSend(send, packages[i], time + delay);
			}
		} catch (ex) {
			doComplete(false, ex);
		}
	}

	function doSend(send, message, delay) {
		var timer = setTimeout(function() {
			send(message, onSendComplete);
		}, delay);
		timers.push(timer);

		return delay;
	}

	function onSendComplete() {
		packageCount++;
		if (packageCount == packageTotal) {
			updateProgress(100);
			doComplete(true);
		} else {
			updateProgress(Math.round(100 * packageCount / packageTotal));
		}
	}

	function updateProgress(value) {
		progressCallback && progressCallback(value);
	}

	function doComplete(value) {
		timers.forEach(clearTimeout);
		timers = [];

		packageTotal = 0;
		packageCount = 0;
		progressCallback = null;

		completeCallback && completeCallback(value);
		completeCallback = null;
	}

	function convertHex(hexRaw) {
		var result = [];

		var hexData = "";
		hexRaw.split("\n").forEach(function(line) {
			var size = parseInt(line.substr(1, 2), 16);
			if (size == 0) {
				return true;
			}

			for (var i = 0; i < 2 * size; i += 2) {
				hexData += d2b(parseInt(line.substr(i + 9, 2), 16));
			}
		});

		var blockSize = 128;
		var count = Math.ceil(hexData.length / blockSize);

		result.push(d2b(COMMAND.ENTER_PROG_MODE) + d2b(COMMAND.SYNC_CRC_EOP));

		for (var i = 0; i < count; i++) {
			var block = hexData.substr(blockSize * i, blockSize);
			var address = i * blockSize >> 1;
			address = convertAddress(address);
			result.push(d2b(COMMAND.LOAD_ADDRESS) + address + d2b(COMMAND.SYNC_CRC_EOP));
			result.push(d2b(COMMAND.PROG_PAGE) + d2b(0x00) + d2b(block.length) + d2b(0x46) + block + d2b(COMMAND.SYNC_CRC_EOP));
		}

		return result;
	}

	function convertAddress(address) {
		address = "0000" + address.toString(16);
		address = address.substr(address.length - 4);
		address = address[2] + address[3] + address[0] + address[1];
		address = d2b(parseInt(address[0] + address[1], 16)) + d2b(parseInt(address[2] + address[3], 16));

		return address;
	}

	return {
		exec: exec,
		convertHex: convertHex,
	};
});