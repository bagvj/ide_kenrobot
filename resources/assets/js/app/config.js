define(function() {
	return {
		//引导配置
		guide: {
			showIfFirstVisit: true,
			autoNextDelay: 3000,
		},

		encrypt: {
			publicKey: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7Jat1/19NDxOObrFpW8USTia6\nuHt34Sac1Arm6F2QUzsdUEUmvGyLIOIGcdb+F6pTdx4ftY+wZi7Aomp4k3vNqXmX\nT0mE0vpQlCmsPUcMHXuUi93XTGPxLXIv9NXxCJZXSYI0JeyuhT9/ithrYlbMlyNc\nwKB/BwSpp+Py2MTT2wIDAQAB\n-----END PUBLIC KEY-----"
		},

		greet: "     __ __           ____        __          __ \n    / //_/__  ____  / __ \\\____  / /_  ____  / /_\n   / ,< / _ \\\/ __ \\\/ /_/ / __ \\\/ __ \\\/ __ \\\/ __/\n  / /| /  __/ / / / _, _/ /_/ / /_/ / /_/ / /_  \n /_/ |_\\\___/_/ /_/_/ |_|\\\____/_.___/\____/\\\__/  \n\n啃萝卜是一款在线硬件编程学习平台\n我们的目标是：让机器人编程变得更容易，让学习变得更简单！\n加入啃萝卜，享受硬件编程的乐趣",

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