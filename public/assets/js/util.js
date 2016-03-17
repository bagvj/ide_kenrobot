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

	function confirm(args) {
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

		var template = '<div class="x-confirm x-confirm-' + type + '">\
			<div class="x-confirm-title">' + title + '</div>\
			<div class="x-confirm-close">&times;</div>\
			<div class="x-confirm-content">' + text + '</div>\
			<div class="x-confirm-btns">' +
				(type == "confirm" ? '<button class="x-confirm-btn cancel">' + cancel + '</button>' : '') + '<button class="x-confirm-btn confirm">' + ok + '</button>\
			</div>\
		</div>';
		var dialog = $(template);
		if(args.cls) {
			dialog.addClass(args.cls);
		}

		if(args.contentCls) {
			$('.x-confirm-content', dialog).addClass(args.contentCls);
		}

		var doClose = function() {
			dialog.slideUp(200, function() {
				dialog.remove();
				$('.dialog-layer').removeClass("active");
			});
		}

		$('.x-confirm-btns .confirm', dialog).on('click', function(){
			doClose();
			okFunc && okFunc();
		});	

		$('.x-confirm-close,.x-confirm-btns .cancel', dialog).on('click', function(){
			doClose();
			cancelFunc && cancelFunc();
		});

		dialog.appendTo($('.dialog-layer')).css({
			top: -dialog.height(),
		}).show().animate({
			top: 200,
		}, 400, "swing");
		$('.dialog-layer').addClass("active");
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
		confirm: confirm,
		toggleActive: toggleActive,
	}
});