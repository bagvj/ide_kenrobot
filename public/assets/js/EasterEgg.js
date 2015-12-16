define(["jquery"], function($) {
	//彩蛋列表
	var list = [{
		//上上下下左右左右BABA
		keys: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 66, 65],
		callback: function() {
			alert("我不是魂斗罗，你也没有30条命");
		},
	}];

	function init() {
		var record = [];
		for(var i = 0; i < list.length; i++) {
			record[i] = 0;
		}

		$(document).keydown(function(e){
			var keyCode = e.keyCode;
			for(var i = 0; i < list.length; i++) {
				var egg = list[i];
				var keys = egg.keys;
				var pos = record[i];
				if(e.keyCode == keys[pos]) {
					pos++;
				} else {
					pos = 0;
				}
				if(pos == keys.length) {
					var callback = egg.callback;
					callback && callback();
					record[i] = 0;
				} else {
					record[i] = pos;
				}
			}
		});
	}

	return {
		init: init
	}
});