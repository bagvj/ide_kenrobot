define(function($, IO, Menu, util) {
	var editor;

	function init() {
		initSoftwareMenu();
		initEditor();
		// initLogin();

		var headerTabItems = $('.header .tab li').on('click', onHeaderTabClick);

		var hardwareTabItems = $('.hardware .tab li').on('click', onHardwareTabClick);
		var softwareTabItems = $('.software .tab li').on('click', onSoftwareTabClick);

		var sortwareSubTabItems = $('.software .sub-tab li').on('click', onSoftwareSubTabClick);

		headerTabItems.item(0).fire("click");
		hardwareTabItems.item(0).fire("click");
		softwareTabItems.item(0).fire("click");
		sortwareSubTabItems.item(1).fire("click");
	}

	function initSoftwareMenu() {
		var filePopMenu = new Menu.PopupMenu({
			xclass: 'popupmenu',
			prefixCls: 'software-',
			align: {
				points: ['bl', 'tl']
			},
			autoHideOnMouseLeave: true,
			children: [{
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '保存',
				ATTRS: {
					action: 'save',
				},
			}, {
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '下载',
				ATTRS: {
					action: 'download',
				},
			}, {
				xclass: 'menuitem',
				prefixCls: 'software-',
				content: '分享',
				ATTRS: {
					action: 'share',
				},
			}, ],
			listeners: {
				'click': onSoftwareMenuClick,
			},
		});

		var menu = new Menu({
			render: '.software .menu',
			prefixCls: 'software-',
			children: [{
				xclass: 'submenu',
				prefixCls: 'software-',
				content: '文件',
				menu: filePopMenu,
			}, ],
		});
		menu.render();
	}

	function initEditor() {
		editor = ace.edit($(".software .editor")[0]);
		editor.setTheme("ace/theme/monokai");
		editor.session.setMode("ace/mode/c_cpp");
		editor.setShowPrintMargin(false);
		editor.$blockScrolling = Infinity;
	}

	function initLogin() {
		$('.login li a.loginBtn').on('click', function(e) {
			$('#login_dialog').dialog({
				draggable: false,
				modal: true,
				resizable: false,
				show: {
					effect: "blind",
					duration: 200
				},
				hide: {
					effect: "blind",
					duration: 200
				},
				close: function(event, ui) {
					$('.login li a.loginBtn').blur();
					$('#use_weixin').removeClass("active");
				}
			});
		});

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

			var time1 = setInterval(function() {
				var key = $('#qrcode_key').val();
				$.get('/weixinlogin?key=' + key, function(result) {
					// console.log(result.message);
					if (result.code == 0) {
						//登录成功
						clearInterval(time1);
						window.location.href = "/";
					} else if (result.code == 1) {
						//已经登录
						clearInterval(time1);
					} else {
						//登录失败
					}
				});
			}, 3000);
		});

		$('#login_dialog .closeBtn').on('click', function(e) {
			$('#login_dialog').dialog('close');
		});


		$('.submitBtn').on('click', function() {
			$.post('/snspostlogin', {
					email: $('#email').val(),
					password: $('#password').val()
				},
				function(result) {
					if (result.code == 0) {
						//登录成功
						window.location.href = "/";
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

		$('.qrLogin .qrcode').on('mouseenter', function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin');
			if (!use_weixin.isRunning()) {
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
		}).on('mouseleave', function(e) {
			var left = $(this).offset().left;
			var use_weixin = $('#use_weixin')
			if(!use_weixin.isRunning()){
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
		var menuItem = e.target;
		var action = menuItem.getAttrVals().ATTRS.action;
		switch (action) {
			case 'save':
				onSaveClick();
				break;
			case 'download':
				onDownloadClick();
				break;
			case 'share':
				onShareClick();
				break;
		}
	}

	function onSaveClick() {

	}

	function onDownloadClick() {
		var source = editor.getValue();
		var bytes = [];
		for (var i = 0; i < source.length; ++i) {
			bytes.push(source.charCodeAt(i));
		}

		var projectName = "Arduino";
		var buildType = "Arduino";

		new IO({
			type: "POST",
			url: "./build",
			data: {
				source: bytes,
				projectName: projectName,
				buildType: buildType
			},
			dataType: "json",
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			},
			success: function(result) {
				if (result.code == 0 && result.url) {
					window.open(result.url);
				} else {
					util.message(result.msg);
				}
			},
			error: function(result) {
				console.log(result);
			}
		});
	}

	function onShareClick() {

	}

	function onHeaderTabClick(e) {
		var li = $(this);
		if (li.index() == 2) {
			return;
		}
		if (toggleActive(li)) {
			$('.content .mod').removeClass("active").item(li.index()).addClass("active");
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
			$('.software .sub-mod').removeClass("active").item(li.index()).addClass("active");
		}
	}

	function toggleActive(li) {
		if (li.hasClass("active")) {
			return false;
		}

		li.parent().all("li.active").removeClass("active");
		li.addClass("active");

		return true;
	}

	return {
		init: init,
	}
}, {
	requires: ['node', 'io', 'menu', 'platform/util']
});