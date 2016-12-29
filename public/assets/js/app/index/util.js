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
			return false;
		}

		dialogWin.clearQueue("fadeIn");
		dialogWin.clearQueue("fadeOut");

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
		var doClose = function(callback) {
			dialogWin.removeClass("dialog-in").addClass("dialog-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				dialogWin.hide().removeClass("dialog-fadeOut");
				dialogLayer.removeClass("active");
				onClose && onClose();
				callback && callback();
			});
			dialogWin.dequeue("fadeOut");
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose(onConfirm);
			} 
		});	

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function(){
			if(!onClosing || onClosing() != false) {
				doClose(onCancel);
			} 
		});

		onShow && onShow();
		dialogWin.show().addClass("dialog-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("dialog-in").removeClass("dialog-fadeIn");
		});
		dialogWin.dequeue("fadeIn");

		return dialogWin;
	}

	function isInDialog() {
		return $('.dialog-layer').hasClass("active");
	}

	function toggleActive(target, collapseMode, cls) {
		cls = cls || "active";
		if(collapseMode) {
			if(target.hasClass(cls)) {
				target.removeClass(cls);
				return false;
			} else {
				target.siblings("." + cls).removeClass(cls);
				target.addClass(cls);
				return true;
			}
		} else {
			if (target.hasClass(cls)) {
				return false;
			}

			target.siblings("." + cls).removeClass(cls);
			target.addClass(cls);

			return true;
		}
	}

	function aspectReset(aspect) {
		var origin = aspect._advisor.orig;
		aspect._advisor.remove();
		return origin;
	}

	function parseJson(data) {
		try {
			return JSON.parse(data);
		} catch(ex) {

		}
	}

	function showDialog(args) {
		args = typeof args == "string" ? {
			selector: args
		} : args;

		var dialogWin = $(args.selector);
		var beforeClose = args.beforeClose;
		var onClose = args.onClose;
		var afterClose = args.afterClose;

		if (!dialogWin || !dialogWin.hasClass("a-dialog")) {
			return;
		}

		var dialogLayer = $('.dialog-layer').addClass("active");

		dialogWin.clearQueue("fadeIn").clearQueue("fadeOut");
		$('.dialog-close', dialogWin).off('click').on('click', function() {
			if(beforeClose && beforeClose() === false) {
				return;
			}

			dialogWin.removeClass("dialog-in").addClass("dialog-fadeOut").delay(300, "fadeOut").queue("fadeOut", function() {
				onClose && onClose();
				dialogLayer.removeClass("active");
				dialogWin.hide().removeClass("dialog-fadeOut");
				afterClose && afterClose();
			}).dequeue("fadeOut");
		});

		dialogWin.show().addClass("dialog-fadeIn").delay(300, "fadeIn").queue("fadeIn", function() {
			dialogWin.addClass("dialog-in").removeClass("dialog-fadeIn");
		}).dequeue("fadeIn");
	}

	return {
		message: message,
		dialog: dialog,
		isInDialog: isInDialog,
		toggleActive: toggleActive,
		aspectReset: aspectReset,
		parseJson: parseJson,
		showDialog: showDialog,
	}
});