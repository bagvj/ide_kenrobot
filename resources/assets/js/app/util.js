define(['jquery'], function($){
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
		messageDiv.appendTo($("body")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, duration, "swing").delay(2000).fadeOut(duration, function(){
			$(this).remove();
		});
	}

	function dialogOld(args) {
		args = typeof args == "string" ? {text: args} : args;
		var type = args.type || "confirm";
		var title = args.title;
		if(!title) {
			title = type == "confirm" ? "确认" : "信息提示";
		}

		var text = args.text;
		var ok = args.ok || "确 认";
		var cancel = args.cancel || "取 消";
		var okFunc = args.okFunc;
		var cancelFunc = args.cancelFunc;
		var closeFunc = args.closeFunc;

		var btnTemplate = ""
		if(type == "confirm") {
			btnTemplate = '<div class="x-dialog-btns"><button class="x-dialog-btn cancel">' + cancel + '</button><button class="x-dialog-btn confirm">' + ok + '</button></div>';
		} else if(type == "info") {
			btnTemplate = '<div class="x-dialog-btns"><button class="x-dialog-btn confirm">' + ok + '</button></div>';
		}
		var template = '<div class="x-dialog x-dialog-' + type + '">\
			<div class="x-dialog-title">' + title + '</div>\
			<div class="x-dialog-close">&times;</div>\
			<div class="x-dialog-content">' + text + '</div>'
			+ btnTemplate + 
		'</div>';
		var dialogWin = $(template);
		if(args.cls) {
			dialogWin.addClass(args.cls);
		}

		if(args.contentCls) {
			$('.x-dialog-content', dialogWin).addClass(args.contentCls);
		}

		var doClose = function() {
			dialogWin.slideUp(200, function() {
				dialogWin.remove();
				$('.dialog-layer').removeClass("active");
				closeFunc && closeFunc();
			});
		}

		$('.x-dialog-btns .confirm', dialogWin).on('click', function(){
			doClose();
			okFunc && okFunc();
		});	

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).on('click', function(){
			doClose();
			cancelFunc && cancelFunc();
		});

		dialogWin.appendTo($('.dialog-layer').addClass("active")).css({
			top: -dialogWin.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");

		return dialogWin;
	}

	function dialog(args) {
		args = typeof args == "string" ? {selector: args}: args;
		var selector = args.selector;
		var dialogWin = $(selector);
		if(!dialogWin || !dialogWin.hasClass("x-dialog")) {
			console.log("Can not find " + selector + " or it is not a x-dialog");
			return false;
		}

		var okFunc = args.okFunc;
		var cancelFunc = args.cancelFunc;
		var closeFunc = args.closeFunc;

		var dialogLayer = $('.dialog-layer').addClass("active");
		var doClose = function() {
			dialogWin.slideUp(200, function() {
				dialogWin.hide();
				dialogLayer.removeClass("active");
				closeFunc && closeFunc();
			});
		}

		$('.x-dialog-btns .confirm', dialogWin).off('click').on('click', function(){
			doClose();
			okFunc && okFunc();
		});	

		$('.x-dialog-close,.x-dialog-btns .cancel', dialogWin).off('click').on('click', function(){
			doClose();
			cancelFunc && cancelFunc();
		});

		dialogWin.css({
			top: -dialogWin.height(),
		}).show().animate({
			top: 200,
		}, 300, "swing");

		return dialogWin;
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
		toggleActive: toggleActive,
	}
});