define(function(){
	
	function message(args) {
		var duration = 400;
		$("div.x-message").stop(true).fadeOut(duration / 2, function(){
			$(this).remove();
		});

		args = typeof args == "string" ? {text: args} : args;
		var type = args.type || "info";
		var text = args.text;
		var template = '<div class="x-message alert alert-' + type + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + text + '</div>';
		var messageDiv = $(template);
		messageDiv.appendTo($(".message-layer")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function(){
			$(this).remove();
		});
	}

	function dialog(args) {
		args = typeof args == "string" ? {selector: args}: args;
		var selector = args.selector;
		var dialogWin = $(selector);
		if(!dialogWin || !dialogWin.hasClass("x-dialog")) {
			// console.log("Can not find " + selector + " or it is not a x-dialog");
			return false;
		}

		var onConfirm = args.onConfirm;
		var onCancel = args.onCancel;
		var onClosing = args.onClosing;
		var onClose = args.onClose;
		var onShow = args.onShow;

		var content = args.content;
		if(content) {
			$('.x-dialog-content', dialogWin).text(content);
		}

		var dialogLayer = $('.dialog-layer').addClass("active");
		var doClose = function() {
			dialogWin.slideUp(200, function() {
				dialogWin.hide().removeClass("active");
				dialogLayer.removeClass("active");
				onClose && onClose();
			});
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose();
				onConfirm && onConfirm();
			} 
		});	

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose();
				onCancel && onCancel();
			} 
		});

		dialogWin.css({
			top: -dialogWin.height(),
		});

		(function() {
			onShow && onShow();
			dialogWin.show().addClass("active").animate({
				top: 200,
			}, 300, "swing");
		})();

		return dialogWin;
	}

	function isInDialog() {
		return $('.dialog-layer').hasClass("active");
	}

	function toggleActive(target, tag, collapseMode) {
		tag = tag || "li";
		if(collapseMode) {
			if(target.hasClass("active")) {
				target.removeClass("active");
				return false;
			} else {
				target.parent().find(tag + ".active").removeClass("active");
				target.addClass("active");
				return true;
			}
		} else {
			if (target.hasClass("active")) {
				return false;
			}

			target.parent().find(tag + ".active").removeClass("active");
			target.addClass("active");

			return true;
		}
	}

	return {
		message: message,
		dialog: dialog,
		isInDialog: isInDialog,
		toggleActive: toggleActive,
	}
});