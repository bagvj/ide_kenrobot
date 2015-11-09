define(['eventcenter', 'jquery', 'jquery-ui'], function(eventcenter, $) {
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
		if (mode) showCover();
		initDialog(callback);

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
			var rowTitle = $("<span></span>").css({
				"color": (oneContent.titleColor) ? oneContent.titleColor : "#000",
				"font-weight": "bold"
			}).text(oneContent.title + " : ");
			dialogBody.append(rowTitle);

			// 根据inputType类型配置显示
			if (oneContent.inputType == "text") {
				var inputText = $("<input type='text'>").css({
					"width": (tmpWidth * 0.6) + "px",
					"padding": "3px"
				}).addClass("dialog_input_save");
				inputText.attr("placeholder", oneContent.inputHolder);
				inputText.attr("data-item", oneContent.inputKey).val(oneContent.inputInitValue);
				dialogBody.append(inputText);
			} else if (oneContent.inputType == "textarea") {
				var inputTextArea = $("<textarea rows=5>").css({
					"width": (tmpWidth * 0.8) + "px",
					"padding": "3px",
					"border-color": "#cccccc",
				}).addClass("dialog_input_save");
				inputTextArea.attr("placeholder", oneContent.inputHolder);
				inputTextArea.attr("data-item", oneContent.inputKey).val(oneContent.inputInitValue);
				dialogBody.append(inputTextArea);
			} else if (oneContent.inputType == "select") {
				var inputSelect = $("<select></select>").css({
					"width": (tmpWidth * 0.5) + "px",
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
		callback && callback(data);
		hide();
	}

	/**
	 * @desc initial a new dialog
	 * @param string callback 回调函数
	 */
	function initDialog(callback) {
		var floatDiv = $("<div></div>").css({
			"z-index": 1000,
			"position": "absolute",
			"width": (dialogParams.width) ? (dialogParams.width + "px") : "250px",
			"height": (dialogParams.height) ? (dialogParams.height + "px") : "auto",
			"top": (dialogParams.top) ? (dialogParams.top + "px") : "100px",
			"left": (dialogParams.left) ? (dialogParams.left + "px") : "100px",
			"border-radius": "5px",
			"-webkit-border-radius": "5px",
			"-moz-border-radius": "5px"
		}).attr("id", "param_set_div");

		var headerDiv = $("<div></div>").css({
			"position": "relative",
			"top": "0px",
			"left": "0px",
			"width": (dialogParams.width) ? ((dialogParams.width - 2) + "px") : "248px",
			"height": "20px",
			"padding": "10px",
			"background-color": "#6dd526",
			"color": "#FFF",
			"border-top-right-radius": "5px",
			"border-top-left-radius": "5px",
			"-moz-border-top-right-radius": "5px",
			"-moz-border-top-left-radius": "5px",
			"-webkit-border-top-right-radius": "5px",
			"-webkit-border-top-left-radius": "5px"
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
			"width": (dialogParams.width) ? ((dialogParams.width - 2) + "px") : "248px",
			"height": "auto",
			"padding": "5px 10px",
			"background-color": "#FFF"
		}).addClass("param_set_div_body");
		floatDiv.append(bodyDiv);

		var footerDiv = $("<div></div>").css({
			"position": "relative",
			"top": "0px",
			"left": "0px",
			"width": (dialogParams.width) ? ((dialogParams.width - 2) + "px") : "248px",
			"height": "auto",
			"padding": "5px 10px",
			"background-color": "#6dd526",
			"border-bottom-right-radius": "5px",
			"border-bottom-left-radius": "5px",
			"-moz-border-bottom-right-radius": "5px",
			"-moz-border-bottom-left-radius": "5px",
			"-webkit-border-bottom-right-radius": "5px",
			"-webkit-border-bottom-left-radius": "5px"
		});
		var confirmBtn = $("<span></span>").css({
			"border-radius": "5px",
			"-moz-border-radius": "5px",
			"-webkit-border-radius": "5px",
			"width": "28px",
			"padding": "3px 20px",
			"background-color": "#FCF8E3",
			"margin": "auto",
			"cursor": "pointer",
			"color": "#000"
		}).hover(
			function() {
				$(this).css({
					"background-color": "#DFF0D8"
				});
			},
			function() {
				$(this).css({
					"background-color": "#FCF8E3"
				});
			}
		).html("保存").click(function(e) {
			callSave(callback);
		});
		var cancelBtn = $("<span></span>").css({
			"border-radius": "5px",
			"-moz-border-radius": "5px",
			"-webkit-border-radius": "5px",
			"width": "28px",
			"padding": "3px 20px",
			"background-color": "#F2DEDE",
			"margin": "auto",
			"cursor": "pointer",
			"color": "#000"
		}).hover(
			function() {
				$(this).css({
					"background-color": "#DFF0D8"
				});
			},
			function() {
				$(this).css({
					"background-color": "#F2DEDE"
				});
			}
		).html("取消").click(function(e) {
			hide();
		});
		var tmpDiv = $("<div></div>").css({
			"width": "120px",
			"margin": "auto"
		});
		tmpDiv.append(confirmBtn).append(" ").append(cancelBtn);
		footerDiv.append(tmpDiv);
		floatDiv.append(footerDiv);

		$("body").append(floatDiv);
		dialog = floatDiv;
	}

	/**
	 * @desc modal dialog展示时候的遮罩
	 */
	function showCover() {
		cover = $("<div></div>").css({
			"filter": "alpha(opacity:50)",
			"-moz-opacity": 0.5,
			"opacity": 0.5,
			"background-color": "#EAEAEA",
			"z-index": "999",
			"position": "absolute",
			"top": "0px",
			"left": "0px"
		});
		$("body").append(cover);
		cover.width($(window).width()).height($(window).height());
	}

	/**
	 * @desc 隐藏并毁灭窗口
	 */
	function hide() {
		if (cover != null) cover.remove();
		if (dialog != null) dialog.remove();
	}

	return {
		"show": show,
		"hide": hide
	};
});