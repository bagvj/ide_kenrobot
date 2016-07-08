define(function() {
	return {
		//引导配置
		guide: {
			showIfFirstVisit: true,
			autoNextDelay: 3000,
		},

		greet: "啃萝卜是一款在线硬件编程学习平台\n我们的目标是：让机器人编程变得更容易，让学习变得更简单！\n加入啃萝卜，享受硬件编程的乐趣",

		project: {
			maxCodeLength: 10 * 1024 * 1024,
		},

		serial: {
			baudRate: 115200,

			nameReg : /(USB-SERIAL)|(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 250,

			//串口接收速度
			receiveDelay: 100,
		},

		//chrome扩展app配置
		extension: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			nameReg : /(USB-SERIAL)|(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 250,

			//串口接收速度
			serialReceiveDelay: 100,

			interpreterBitRate: 115200,
		},
	};
});