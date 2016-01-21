define(['jquery', 'bootstrap', 'ace', 'ace-ext-language-tools', 'util'], function($, _, _, _, util) {
	//默认代码
	var platformConfig;

	var editor;
	var loginCheckTimer;

	function init() {
		requestPlatformConfig();
		initAjax();
		initSoftwareMenu();
		initEditor();
		initLogin();

		$('.header .tab li').on('click', onHeaderTabClick).eq(0).click();
		$('.hardware .tab li').on('click', onHardwareTabClick).hover(function(e) {
			toggleWidth(e, 32);
		}, function(e) {
			toggleWidth(e, 24);
		}).eq(0).click();
		$('.software .tab li').on('click', onSoftwareTabClick).hover(function(e) {
			toggleWidth(e, 32);
		}, function(e) {
			toggleWidth(e, 24);
		}).eq(0).click();
		$('.software .sub-tab li').on('click', onSoftwareSubTabClick).eq(1).click();
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
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function initSoftwareMenu() {
		$('.software .menu li').on('click', onSoftwareMenuClick);
	}

	function initEditor() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
		});
		editor.setTheme("ace/theme/monokai");
		editor.session.setMode("ace/mode/arduino");
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
		editor.commands.addCommand({
			name: "save",
			bindKey: {win: "Ctrl-s", mac: "Command-s"},
			exec: function() {
				onSaveClick();
			}
		});
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
			$('#login_dialog').slideUp(0.1, function(event, ui) {
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
				use_weixin.addClass("active")
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					}, {
						duration: 0.3,
					});
			}
		}, function(e) {
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin')
			if (!use_weixin.is(':animated')) {
				use_weixin.animate({
					left: left + 420,
					opacity: 0,
				}, {
					duration: 0.3,
					complete: function() {
						use_weixin.removeClass("active");
					},
				});
			}
		});
	}

	function onSoftwareMenuClick(e) {
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
		}
	}

	function onSaveClick(node, e) {
		$.ajax({
			type: 'GET',
			url: '/auth/check',
			dataType: 'json',
		}).done(function(result){
			if (result.code == 0) {
				var projectData = {
					source: getSource(),
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
				});
			} else {
				showLogin();
			}
		});
	}

	function onDownloadClick(node, e) {
		var project = "Arduino";
		var buildType = "Arduino";
		var userId = 1;
		var board = "uno";

		$.ajax({
			type: "POST",
			url: "/build2",
			data: {
				source: getSource(),
				user_id: userId,
				project: project,
				build_type: buildType,
				board: board,
			},
			dataType: "json",
		}).done(function(result){
			util.message(result.msg);
			if (result.code == 0 && result.url) {
				window.open(result.url);
			}
		});
	}

	function onShareClick(node, e) {

	}

	function onIncludeLibraryClick(node, e) {
		var libraries = platformConfig.libraries;
		var name = node.data('library');
		var library;
		for (var i = 0; i < libraries.length; i++) {
			var config = libraries[i];
			if (config.name == name) {
				library = config;
				break;
			}
		}

		if (!library) {
			return
		}

		var doc = editor.session.doc;
		doc.insert(doc.pos(0, 0), library.code);
	}

	function onHeaderTabClick(e) {
		var li = $(this);
		if (li.index() == 2) {
			return;
		}
		if (toggleActive(li)) {
			$('.content .mod').removeClass("active").eq(li.index()).addClass("active");
		}
	}

	function onHardwareTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {

		}
	}

	function onSoftwareTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {

		}
	}

	function onSoftwareSubTabClick(e) {
		var li = $(this);
		if (toggleActive(li)) {
			$('.software .sub-mod').removeClass("active").eq(li.index()).addClass("active");
		}
	}

	function toggleActive(li) {
		if (li.hasClass("active")) {
			return false;
		}

		li.parent().find("li.active").removeClass("active");
		li.addClass("active");

		return true;
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

	function showLogin() {
		$('#login_dialog').css({
			top: -$(this).height(),
		}).show().animate({
			top: 100,
		}, {
			duration: 0.4,
			easing: "swing",
			complete: function() {
				setLoginCheck(true);
			},
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
						console.log(result.message);
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