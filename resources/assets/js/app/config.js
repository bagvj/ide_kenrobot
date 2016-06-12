define(function() {
	return {
		//引导配置
		guide: {
			showIfFirstVisit: true,
			autoNextDelay: 3000,
		},

		project: {
			maxCodeLength: 10 * 1024 * 1024,
		},

		//chrome扩展app配置
		extension: {
			//Chrome app id
			appId: "hhgmonhbodfiplppmcangkmlfkcnilpd",

			nameReg : /(arduino)|(\/dev\/cu\.usbmodem)/i,

			//烧写速度
			uploadDelay: 150,

			//串口接收速度
			serialReceiveDelay: 100,

			interpreterBitRate: 115200,
		},
	};
});