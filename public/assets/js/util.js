define(['jquery', 'jquery-ui'], function($) {
	/**
	 * windowParams用于初始化窗口信息
	 * top:??px
	 * left:??px
	 * title:窗口名
	 * width:窗口宽度
	 * height:窗口高度
	 * isSplit:0/1
	 * contents:[
	 *		{
	 *			title 			显示标题
	 *			,titleColor		标题颜色
	 *			,inputType		类型：text（输入框）\select（选择框）\none（文本显示）
	 *			,inputKey		当inputType为text/select等输入模块的时候（输入模块必须）
	 *			,inputInitValue	inputType为text/select等输入模块的时候的初始值（输入模块必须）
	 *			,inputHolder	inputType为text时，为预设展示值字符串；为select时，为下拉选项数组（输入模块必须）
	 *			,fontColor		当inputType为none等非输入模块时的文本显示的文本颜色（显示模块必须）
	 *			,showText		当inputType为none等非输入模块时的文本显示内容（显示模块必须）
	 *		}
	 *	]
	 */
	var dialogParams = {};
	var cover = null;
	var dialog = null;

	/**
	 * @desc add modal dialog cover
	 * @param boolean mode 1:modal dialog;0:normal dialog
	 * @param json params
	 * @param string callback 回调函数
	 */
	function show(mode, params, callback) {
		if (params != null || params.length == 0) dialogParams = params;
		showCover();
		var div = initDialog(callback);

		var tmpWidth = (dialogParams.width) ? dialogParams.width : 250;

		dialogBody = $(".param_set_div_body", $("#param_set_div"));
		for (var i = 0; i < dialogParams.contents.length; i++) {
			if (i > 0) {
				if (dialogParams.isSplit) {
					dialogBody.append($("<hr>").css({
						"margin": "8px 0px"
					}));
				} else {
					dialogBody.append($("<hr>").css({
						"margin": "8px 0px",
						"border": "white"
					}));
				}
			}
			var oneContent = dialogParams.contents[i];
			if (oneContent.title == null || oneContent.title == undefined) continue;
			if(oneContent.title != "") {
				var rowTitle = $("<span></span>").css({
					"color": (oneContent.titleColor) ? oneContent.titleColor : "#000",
					"font-weight": "bold"
				}).text(oneContent.title + " : ");
				dialogBody.append(rowTitle);
			}

			// 根据inputType类型配置显示
			if (oneContent.inputType == "text") {
				var inputText = $("<input type='text'>").css({
					"width": (tmpWidth * 0.65) + "px",
					"padding": "3px"
				}).addClass("dialog_input_save");
				inputText.attr("placeholder", oneContent.inputHolder);
				inputText.attr("data-item", oneContent.inputKey).val(oneContent.inputInitValue);
				dialogBody.append(inputText);
			} else if (oneContent.inputType == "textarea") {
				var inputTextArea = $("<textarea rows=5>").css({
					"width": (tmpWidth * (oneContent.title == "" ? 0.95 : 0.8)) + "px",
					"padding": "3px",
					"border-color": "#cccccc",
				}).addClass("dialog_input_save");
				inputTextArea.attr("placeholder", oneContent.inputHolder);
				inputTextArea.attr("data-item", oneContent.inputKey).val(oneContent.inputInitValue);
				dialogBody.append(inputTextArea);
			} else if (oneContent.inputType == "select") {
				var inputSelect = $("<select></select>").css({
					"width": (tmpWidth * 0.68) + "px",
					"padding": "3px"
				}).addClass("dialog_input_save");
				for (var j = 0; j < oneContent.inputHolder.length; j++) {
					var optionObj = $('<option value="' + oneContent.inputHolder[j].value + '">' + oneContent.inputHolder[j].text + '</options>');
					inputSelect.append(optionObj);
				}
				inputSelect.attr("data-item", oneContent.inputKey).val(oneContent.inputInitValue);
				dialogBody.append(inputSelect);
			} else {
				var staticShow = $("<span></span>").css({
					"color": (oneContent.fontColor) ? oneContent.fontColor : "#000"
				}).html(oneContent.showText);
				dialogBody.append(staticShow);
			}
		}
		$("input:first", dialogBody).focus();
		return div;
	}

	/**
	 * @desc 显示框上保存按钮点击时候激活的处理
	 * @param string callback 回调函数
	 */
	function callSave(callback) {
		dialogBody = $(".param_set_div_body", $("#param_set_div"));
		var data = {};
		$(".dialog_input_save", dialogBody).each(function(i, o) {
			data[$(this).attr("data-item")] = $(this).val();
		});
		var needHide = true;
		if(callback) {
			needHide = callback(data) != false;
		}
		if(needHide)
			hide();
	}

	/**
	 * @desc initial a new dialog
	 * @param string callback 回调函数
	 */
	function initDialog(callback) {
		var width = dialogParams.width || 250;
		var floatDiv = $('<div class="no-select"></div>').css({
			"z-index": 9999,
			"position": "absolute",
			"width": width,
			"height": dialogParams.height || "auto",
		}).attr("id", "param_set_div");

		var headerDiv = $("<div></div>").css({
			"position": "relative",
			"top": "0px",
			"left": "0px",
			"width": width - 2,
			"height": "20px",
			"padding": "10px",
			"background-color": "#4a5044",
			"color": "#FFF",
		}).text(dialogParams.title || "流程元素").addClass("param_set_div_header");

		var closeSpan = $("<span></span>").css({
			"font-size": "28px",
			"color": "#FFF",
			"position": "absolute",
			"top": "0px",
			"right": "10px",
			"cursor": "pointer"
		}).text("×").hover(
			function() {
				$(this).css({
					"color": "#FF0"
				});
			},
			function() {
				$(this).css({
					"color": "#FFF"
				});
			}
		).click(function(e) {
			hide();
		});
		headerDiv.append(closeSpan);
		floatDiv.append(headerDiv);

		var bodyDiv = $("<div></div>").css({
			"position": "relative",
			"top": "0px",
			"left": "0px",
			"width": width - 2,
			"height": "auto",
			"padding": "5px 10px",
			"background-color": "#FFF"
		}).addClass("param_set_div_body");
		floatDiv.append(bodyDiv);

		var footerDiv = $("<div></div>").css({
			"position": "relative",
			"top": "0px",
			"left": "0px",
			"width": width - 2,
			"height": "auto",
			"padding": "5px 10px",
			"background-color": "#fff",
		});
		var confirmBtn = $("<span></span>").css({
			"width": "28px",
			"padding": "3px 16px",
			"background-color": "#4a5044",
			"margin": "auto",
			"cursor": "pointer",
			"color": "#fff"
		}).hover(
			function() {
				$(this).css({
					"background-color": "#41473c"
				});
			},
			function() {
				$(this).css({
					"background-color": "#4a5044"
				});
			}
		).html(dialogParams.okLabel || "保存").click(function(e) {
			callSave(callback);
		});
		var cancelBtn = $("<span></span>").css({
			"width": "28px",
			"padding": "3px 16px",
			"background-color": "#4a5044",
			"margin": "auto",
			"cursor": "pointer",
			"color": "#fff"
		}).hover(
			function() {
				$(this).css({
					"background-color": "#41473c"
				});
			},
			function() {
				$(this).css({
					"background-color": "#4a5044"
				});
			}
		).html(dialogParams.cancelLabel || "取消").click(function(e) {
			hide();
		});
		var tmpDiv = $("<div></div>").css({
			"width": "120px",
			"margin": "auto"
		});
		tmpDiv.append(confirmBtn).append(" ").append(cancelBtn);
		footerDiv.append(tmpDiv);
		floatDiv.append(footerDiv);
		var top = dialogParams.top;
		var left = dialogParams.left;
		var height = floatDiv.height() || 150;
		if(!top) {
			top = ($(window).height() - height) / 2;
		}
		if(!left) {
			left = ($(window).width() - width - 60) / 2;
		}
		floatDiv.css({
			"top": top,
			"left": left
		});

		$("body").append(floatDiv);
		dialog = floatDiv;

		floatDiv.draggable({
			handle: headerDiv
		});

		return floatDiv;
	}

	/**
	 * @desc modal dialog展示时候的遮罩
	 */
	function showCover() {
		cover = $('<div class="no-select"></div>').css({
			"filter": "alpha(opacity:50)",
			"-moz-opacity": 0.5,
			"opacity": 0.5,
			"background-color": "#EAEAEA",
			"z-index": 9999,
			"position": "absolute",
			"top": 0,
			"left": 0
		});
		$("body").append(cover);
		cover.width($(window).width()).height($(window).height());
		$(window).resize(function(e) {
			cover.width($(window).width()).height($(window).height());
		});
	}

	/**
	 * @desc 隐藏并毁灭窗口
	 */
	function hide() {
		if (cover != null) cover.remove();
		if (dialog != null) dialog.remove();
	}

	function message(args) {
		$("div.message").stop(true).fadeOut(400, function() {
			$(this).remove();
		});

		args = typeof args == "Object" ? args : {text: args};
		var messageDiv = $('<div class="message"><div class="message-icon"></div><div class="message-content"></div><div class="message-close"></div></div>');
		$(".message-content", messageDiv).text(args.text);
		$(".message-close", messageDiv).click(function() {
			messageDiv.fadeOut(400, function() {
				$(this).remove();
			});
		});
		messageDiv.appendTo($("body")).css({
			left: ($(window).width() - messageDiv.width()) / 2,
			top: -messageDiv.height(),
		}).animate({
			top: 150,
		}, null, "easeOutExpo").delay(2000).fadeOut(400, function() {
			$(this).remove();
		});
	}

	return {
		show: show,
		hide: hide,
		message: message,
	};
});