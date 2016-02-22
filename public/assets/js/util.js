define(['jquery'], function($){
	function message(args) {
		var duration = 400;
		$("div.x-message").stop(true).fadeOut(duration / 2, function(){
			$(this).remove();
		});

		args = typeof args == "Object" ? args : {text: args};
		var messageDiv = $('<div class="x-message"><div class="message-icon"></div><div class="message-content"></div><div class="message-close"></div></div>');
		$(".message-content", messageDiv).text(args.text);
		$(".message-close", messageDiv).on('click', function() {
			messageDiv.stop(true).fadeOut(duration / 2, function() {
				$(this).remove();
			});
		});
		messageDiv.appendTo($("body")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function(){
			$(this).remove();
		});
	}

	function dialog(args) {
		
	}

	return {
		message: message,
		dialog: dialog,
	}
});