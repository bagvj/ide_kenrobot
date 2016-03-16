define(function() {
	var hanlderMap = {};

	function getEventName(target, type) {
		return target + "_" + type;
	}

	function bind(target, type, callback) {
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			hanlders = [];
			hanlderMap[name] = hanlders;
		}
		hanlders.push(callback);
	}

	function unbind(target, type, callback) {
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			return;
		}

		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i];
			if(handler == callback) {
				hanlders.splice(i, 1);
				break;
			}
		}
	}

	function trigger(target, type, args) {
		var name = getEventName(target, type);
		var hanlders = hanlderMap[name];
		if(!hanlders) {
			return;
		}

		for(var i = 0; i < hanlders.length; i++) {
			var handler = hanlders[i];
			handler(args);
		}
	}

	return {
		bind: bind,
		unbind: unbind,
		trigger: trigger,
	}
});