define(function($){
	function message(args) {
		var duration = 0.2;
		$("div.message").each(function(item){
			item.stop(true).fadeOut(duration, function() {
				item.remove();
			});
		});

		args = typeof args == "Object" ? args : {text: args};
		var messageDiv = $('<div class="message"><div class="message-icon"></div><div class="message-content"></div><div class="message-close"></div></div>');
		$(".message-content", messageDiv).text(args.text);
		$(".message-close", messageDiv).on('click', function() {
			messageDiv.fadeOut(duration, function() {
				messageDiv.remove();
			});
		});
		messageDiv.appendTo($("body")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, {
			duration: duration,
			easing: "easeOut",
		});

		setTimeout(function() {
			messageDiv.fadeOut(duration, function() {
				messageDiv.remove();
			});
		}, 2000);
	}

	return {
		message: message,
	}
}, {
	requires: ['node']
});