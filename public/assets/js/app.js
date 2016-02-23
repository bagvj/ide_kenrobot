define(['jquery', 'bootstrap', 'typeahead', 'ace', 'ace-ext-language-tools', 'util', 'hardware', 'EventManager', 'code'], function($, _, _, _, _, util, hardware, EventManager, code) {
	//默认代码
	var platformConfig;

	var editor;
	var loginCheckTimer;
	var board;
	var isSourceEditMode;

	function init() {
		requestPlatformConfig();
		initAjax();
		initEditor();
		initLogin();

		$('.sidebar .bar ul > li').on('click', onSidebarClick).eq(0).click();
		$('.project .list .view > div').on('click', onProjectFileClick);
		$('.project .list .title').on('click', onProjectTitleClick).eq(0).click();
		$('.board .list > li').on('click', onBoardClick);
		$('.library .list > li').on('click', onLibraryClick);

		$('.component .items .list > li').on('click', onComponentClick);
		$('.hardware .tools li').on('click', onToolsClick);

		$('.software .menu li').on('click', onMenuClick);

		$('.software .doEdit li').on('click', onDoEditClick);

		initEvent();

		// $(window).bind('beforeunload', function(){
		// 	return '您输入的内容尚未保存，确定离开此页面吗？';
		// });
	}

	function requestPlatformConfig() {
		$.ajax({
			url: '/config',
			dataType: 'json',
		}).done(onRequestConfigSuccess);
	}

	function onRequestConfigSuccess(result) {
		platformConfig = result;
		editor.setValue(platformConfig.defaultCode, 1);

		hardware.init('hardware-container', {
			boards: platformConfig.boards,
			components: platformConfig.components,
		});

		$('.board .list > li').eq(0).click();

		initSearch();
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function initEditor() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
		});
		editor.setReadOnly(true);
		editor.setHighlightActiveLine(false);
		editor.setHighlightSelectedWord(false);
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.setTheme("ace/theme/dark");
		editor.session.setMode("ace/mode/arduino");
		// editor.commands.addCommand({
		// 	name: "save",
		// 	bindKey: {win: "Ctrl-s", mac: "Command-s"},
		// 	exec: function() {
		// 		onSaveClick();
		// 	}
		// });
	}

	function initLogin() {
		$('.qrLoginBtn, .baseLoginBtn').on('click', function(e) {
			var action = $(this).attr("data-action");
			if (action == "qrLogin") {
				$(".qrLoginBtn, .qrLogin").removeClass("active");
				$(".baseLoginBtn, .baseLogin").addClass("active");
				$(".qrLoginBtn").css({
					display: "none"
				});
				$(".baseLoginBtn").css({
					display: "block"
				});
				$('#use_weixin').removeClass("active");
			} else {
				$(".baseLoginBtn, .baseLogin").removeClass("active");
				$(".qrLoginBtn, .qrLogin").addClass("active");
				$(".baseLoginBtn").css({
					display: "none"
				});
				$(".qrLoginBtn").css({
					display: "block"
				});
			}
		});

		$('#login_dialog .closeBtn').on('click', function(e) {
			$('#login_dialog').slideUp(100, function(event, ui) {
				$('#use_weixin').removeClass("active");
			});
			setLoginCheck(false);
		});


		$('.submitBtn').on('click', function() {
			$.ajax({
				url: '/snspostlogin',
				data: {
					email: $('#email').val(),
					password: $('#password').val()
				},
			}).done(function(result){
				if (result.code == 0) {
					//登录成功
					util.message(result.message);
					$('#login_dialog .closeBtn').fire('click');
				} else if (result.code == 1) {

				} else {
					$('.baseLogin .message span')
						.html(result.message)
						.delay(2000)
						.queue(function() {
							$(this).fadeOut().dequeue();
						});
				}
			});
		});

		$('.qrLogin .qrcode').hover(function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.is(':animated')) {
				use_weixin.addClass("active").show()
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					});
			}
		}, function(e) {
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.is(':animated')) {
				use_weixin.animate({
					left: left + 420,
					opacity: 0,
				}, null, null, function() {
					use_weixin.removeClass("active").hide();
				});
			}
		});
	}

	function initSearch() {
		var components = platformConfig.components;
		var sources = [];
		for(var key in components) {
			sources.push(components[key]);
		}
		$('.search .key').typeahead({
			source: sources,
			displayText: function(item) {
				return typeof item !== 'undefined' && typeof item.label != 'undefined' && item.label || item;
			},
			updater: function(item) {
				$('.component .items .list > li[data-component-name="' + item.name + '"').click();
				return item;
			}
		});
	}

	function initEvent() {
		EventManager.bind("hardware", "showNameDialog", onShowNameDialog);
		EventManager.bind("hardware", "changeInteractiveMode", onChangeInteractiveMode);
		EventManager.bind("hardware", "switchToSoftware", onSwitchToSoftware);
	}

	function onMenuClick(e) {
		var node = $(this);
		var action = node.data('action');
		switch (action) {
			case 'save':
				onSaveClick(node, e);
				break;
			case 'download':
				onDownloadClick(node, e);
				break;
			case 'share':
				onShareClick(node, e);
				break;
			case 'includeLibrary':
				onIncludeLibraryClick(node, e);
				break;
			case 'selectBoard':
				onSelectBoardClick(node, e);
				break;
			case 'changeTheme':
				onChangeThemeClick(node, e);
				break;
		}
	}

	function onSaveClick() {
		$.ajax({
			type: 'GET',
			url: '/auth/check',
			dataType: 'json',
		}).done(function(result){
			if (result.code == 0) {
				var projectData = {
					source: getSource(),
					boardName: board.name,
				}
				$.ajax({
					type: 'POST',
					url: '/project/save',
					data: {
						data: JSON.stringify(projectData),
						user_id: result.user.id,
					},
					dataType: 'json',
				}).done(function(res) {
					util.message(res.msg);
					$(window).unbind('beforeunload');
				});
			} else {
				showLoginDialog();
			}
		});
	}

	function onDownloadClick() {
		var project = "Arduino";
		var buildType = "Arduino";
		var userId = 1;

		$.ajax({
			type: "POST",
			url: "/build",
			data: {
				source: JSON.stringify(getSource()),
				user_id: userId,
				project: project,
				build_type: "Arduino",
				board: board.board_type,
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.msg);
			if (result.code == 0 && result.url) {
				window.open(result.url);
			}
		});
	}

	function onShareClick() {

	}

	function onLibraryClick(e) {
		if(!isSourceEditMode) {
			util.message("未启用源码编辑模式");
			return;
		}

		var li = $(this);
		var name = li.data('library');
		var libraries = platformConfig.libraries;
		var library = libraries[name];

		if (!library) {
			return
		}

		code.addLibrary(library.code);
		var source = code.gen();
		editor.setValue(source, 1);
	}

	function onBoardClick(e) {
		var li = $(this);
		var boards = platformConfig.boards;
		var name = li.data("board");
		board = boards[name];
		toggleActive(li);
	}

	function onChangeThemeClick(node, e) {
		if (toggleActive(node)) {
			var newTheme = node.data('theme');
			var oldTheme = $('body').data('theme');
			$('body').removeClass('theme-' + oldTheme).addClass('theme-' + newTheme).data('theme', newTheme);
			editor.setTheme("ace/theme/" + newTheme);
		}
	}

	function onProjectTitleClick(e) {
		var li = $(this).parent();
		var operation = $('.sidebar .project .list').data('operation');
		if(operation == "delete") {

		} else {
			toggleActive(li, null, true);
			var divs = li.find(".view > div");
			if(divs.filter(".active").length == 0) {
				divs.eq(0).click();
			}
		}
	}

	function onProjectFileClick(e) {
		var div = $(this);
		$('.project .list .view div.active').removeClass("active");
		toggleActive(div, 'div')
		var index = div.index();
		var list = $('.sidebar .bar ul > li');
		if(index == 0) {
			list.filter('[data-action="board"],[data-action="component"]').removeClass("hide");
			list.filter('[data-action="library"]').addClass("hide");
		} else {
			list.filter('[data-action="board"],[data-action="component"]').addClass("hide");
			list.filter('[data-action="library"]').removeClass("hide");
		}
		$('.content .tabs .tab').removeClass("active").eq(index).addClass("active");
	}

	function onHeaderTabClick(e) {
		var li = $(this);
		var index = li.index();
		if(index == 1) {
			var source = code.gen();
			editor.setValue(source, 1);
		} else if(index == 0) {
			if(isSourceEditMode) {
				//启用的源码编辑模式
				util.message("已启用源码编辑模式，不能再进行硬件连接和设置。")
				return;
			}
		}
		if (toggleActive(li)) {
			$('.content .tabs .tab').removeClass("active").eq(index).addClass("active");
		}
	}

	function onSidebarClick(e) {
		var li = $(this);
		var index = li.index();
		var action = li.data("action");
		switch(action) {
			case "save":
				onSaveClick();
				break;
			case "download":
				onDownloadClick();
				break;
			case "share":
				onShareClick();
				break;
			default:
				var tab = $('.sidebar .tab.tab-' + action);
				toggleActive(li, null, true);
				toggleActive(tab, ".tab", true);
				$(".content .tabs").css({
					'margin-left': $('.sidebar').width()
				});
				break;
		}
	}

	function onComponentClick(e) {
		$(this).parent().find("li.active").removeClass("active");
		$(this).addClass("active");
		hardware.setPlaceComponent($(this).data("component-name"));
		EventManager.trigger("hardware", "changeInteractiveMode", "place");
	}

	function onToolsClick(e) {
		var li = $(this);
		if (toggleActive(li)) {
			var node = li;
			var action = node.data('action');
			switch (action) {
				case 'changeMode':
					onInteractiveModeClick(node, e);
					break;
			}
		}
	}

	function onInteractiveModeClick(node, e) {
		var mode = node.data('mode');
		hardware.setInteractiveMode(mode);
		if(mode == "place") {
			$('.component .items .list > li.active').click();
		}
	}

	function onChangeInteractiveMode(mode) {
		$('.hardware .tools > li[data-mode="' + mode + '"').click();
	}

	function onSwitchToSoftware() {
		$('.project .list .view > div').eq(1).click();
	}

	function onSoftwareSubTabClick(e) {
		var li = $(this);
		var index = li.index();
		if(index == 0) {
			return;
		}
		if (toggleActive(li)) {
			$('.software .sub-mod').removeClass("active").eq(index).addClass("active");
		}
	}

	function onDoEditClick(e) {
		var li = $(this);
		var action = li.data('action');
		if(action == "enterEdit") {
			editor.setReadOnly(false);
			editor.setHighlightActiveLine(true);
			editor.setHighlightSelectedWord(true);
			isSourceEditMode = true;
			li.removeClass('active').parent().find('li[data-action="exitEdit"]').addClass('active');
		} else {
			editor.setReadOnly(true);
			editor.setHighlightActiveLine(false);
			editor.setHighlightSelectedWord(false);
			isSourceEditMode = false;
			li.removeClass('active').parent().find('li[data-action="enterEdit"]').addClass('active');
		}
	}

	function onShowNameDialog(args) {
		var dialog = $('.hardware .name-dialog');
		if(args) {
			var name = $('.name', dialog).val(args.varName).off('blur').on('blur', function(e) {
				var result = hardware.setVarName(args.key, name.val());
				if(!result.success) {
					name.val(args.varName);
					util.message(result.message);
				}
			});

			if(dialog.css("display") == "block") {
				var result = hardware.setVarName(args.key, name.val());
				if(!result.success) {
					name.val(args.varName);
					util.message(result.message);
				}
			}
			dialog.show();
			name.focus();
		} else {
			dialog.hide();
		}
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

	function toggleWidth(e, width) {
		var li = $(e.target);
		if (!li.is('li') || li.hasClass('active')) {
			return;
		}

		var duration = 100;
		li.animate({
			width: width
		}, duration);
	}

	function showLoginDialog() {
		$('#login_dialog').css({
			top: -$(this).height(),
		}).show().animate({
			top: 200,
		}, 400, "swing", function() {
			setLoginCheck(true);
		});
	}

	function setLoginCheck(value) {
		clearInterval(loginCheckTimer);
		if (value) {
			loginCheckTimer = setInterval(function() {
				var key = $('#qrcode_key').val();
				$.ajax({
					url: '/weixinlogin?key=' + key,
				}).done(function(result) {
					if (result.code == 0) {
						//登录成功
						setLoginCheck(false);
						util.message(result.message);
						$('#login_dialog .closeBtn').click();
					} else if (result.code == 1) {
						//已经登录
						setLoginCheck(false);
					} else {
						//登录失败
					}
				});
			}, 3000);
		}
	}

	function getSource() {
		var source = editor.getValue();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}
		return bytes;
	}

	return {
		init: init,
	}
});