require.config({
	baseUrl: "assets/js",
	paths: {
		"jquery": "lib/jquery-1.11.2.min",
		"jquery-ui": "lib/jquery-ui-1.11.3.min",
		"goJS": "lib/go",
		'hljs': "../highlight/highlight.pack",
		'tour': 'lib/bootstrap-tour-standalone.min',

		"nodeConfig": "nodeConfig",
		"nodeTemplate": "nodeTemplate",
		"EventManager": "EventManager",
		"hardware": "hardware",
		"software": "software",
		"variable": "variable",
		"code": "code",
		"kenrobotDialog": "kenrobotDialog",
		"EasterEgg": "EasterEgg",
		'demo': 'demo',
	},
	shim: {
		'jquery-ui': {
			deps: ['jquery'],
		},
		'tour': {
			deps: ['jquery'],
		}
	}
});

require(['jquery', 'jquery-ui', 'goJS', 'nodeConfig', "nodeTemplate", "EventManager", "hardware", "software", "variable", "code", "kenrobotDialog", "EasterEgg", 'tour', 'demo'], function($, _, _, nodeConfig, nodeTemplate, EventManager, hardware, software, variable, code, kenrobotDialog, EasterEgg, _, demo) {
	$(function() {
		initAjax();
		initTabs();
		initNavSecond();
		initLogin();
		initThumbnail();
		initCode();
		initButtons();
		initVars();
		initEvent();

		EasterEgg.init();

		hardware.init("hardware-container", nodeTemplate.hardware, nodeConfig.hardwares);
		software.init("software-container", nodeTemplate.software, nodeConfig.softwares);
		variable.init("var-table");
		code.init("src", nodeConfig.softwares, {
			findSpecNode: software.findSpecNode,
			findTargetNode: software.findTargetNode,
			findIfMergeNode: software.findIfMergeNode,
			getVars: variable.getVars,
		});
		EventManager.trigger("code", "refresh");

		$('.tabs li:eq(0)').click();
		demo.init();
	});

	function initAjax(){
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function initTabs() {
		var first = true;
		var instroes = ["右键:删除 滚轮:缩放", "右键:删除 滚轮:缩放 双击:编辑"];
		$('.tabs li').click(function() {
			var index = $(this).index();
			var step = index == 0 ? 1 : 3
			if ($(this).hasClass("active")) {
				EventManager.trigger("demo", "finishStep", [[1, step], [2, step], [3, 1], [3, 4], [4, step]]);
				return;
			}

			$(this).parent().find(".active").removeClass("active");
			$(this).addClass("active");
			$('.mod').css({
				visibility: "hidden"
			}).eq(index).css({
				visibility: "visible"
			});

			$(".instro").text(instroes[index]);
			if(first) {
				first = false;
				setTimeout(drawThumbnail(index), 1000);
			} else {
				drawThumbnail(index)();
			}

			EventManager.trigger("demo", "finishStep", [[1, step], [2, step], [3, 1], [3, 4], [4, step]]);
		});

		function drawThumbnail(index) {
			return function() {
				var image;
				if(index == 0) {
					image = software.makeImage();
				} else {
					image = hardware.makeImage();
				}
				var canvas = $(".thumbnail .canvas").empty();
				$(image).css({
					width: canvas.width(),
					height: canvas.height(),
				}).appendTo(canvas);
			};
		}
	}

	function initNavSecond() {
		var mods = $('.mod');

		var hardwareGroups = [];
		for (var name in nodeConfig.hardwares) {
			var config = nodeConfig.hardwares[name];
			if (config.in_use) {
				var module_id = config.module_id;
				var group = null;
				for (var i = 0; i < hardwareGroups.length; i++) {
					if (hardwareGroups[i].module_id == module_id) {
						group = hardwareGroups[i];
						break;
					}
				}
				if (!group) {
					group = {
						module_id: module_id,
						module: config.module,
						hardwares: []
					};
					hardwareGroups.push(group);
				}
				group.hardwares.push(config);
			}
		}
		hardwareGroups = hardwareGroups.sort(function(a, b) {
			return a.module_id > b.module_id;
		});

		var hardwareNav = $('.nav-second>ul', mods[0]).empty();
		for (var i = 0; i < hardwareGroups.length; i++) {
			var group = hardwareGroups[i];
			if (group.module_id > 1) {
				var li = $('<li>').appendTo(hardwareNav);
				$('<div>').addClass('tag').append(group.module).append('<div class="arrow"></div>').appendTo(li);
				var ul = $('<ul>');
				for (var j = 0; j < group.hardwares.length; j++) {
					var config = group.hardwares[j];
					var name = config.name;
					var itemDiv = $('<div>').addClass('hardware-item').addClass('hardware-' + name).attr('data-name', name);
					$('<li>').attr("title", config.tips).append(itemDiv).append(config.alias).appendTo(ul);
				}
				$('<div>').append(ul).appendTo(li);
			}
		}

		$(".nav-second>ul>li .tag").click(function() {
			var li = $(this).parent();
			if (li.hasClass("active")) {
				li.removeClass("active");
			} else {
				li.addClass("active");
			}
		}).each(function(i, o) {
			$(this).parent().addClass("active");
		});
	}

	function initLogin() {
		$('.login li a.loginBtn').click(function(e) {
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

		$('.qrLoginBtn, .baseLoginBtn').click(function(e) {
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
					console.log(result.message);
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

		$('#login_dialog .closeBtn').click(function(e) {
			$('#login_dialog').dialog('close');
		});


		$('.submitBtn').click(function() {
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

		$('.qrLogin .qrcode').hover(function(e) {
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			if (!$('#use_weixin').is(":animated")) {
				$('#use_weixin')
					.addClass("active")
					.css({
						top: top - 160,
						left: left + 50,
						opacity: 0
					})
					.animate({
						left: left + 260,
						opacity: 1,
					}, 500);
			}
		}, function(e) {
			var left = $(this).offset().left;
			if (!$('#use_weixin').is(":animated")) {
				$('#use_weixin')
					.animate({
						left: left + 420,
						opacity: 0,
					}, 500, null, function() {
						$(this).removeClass("active");
					});
			}
		})
	}

	//缩略图
	function initThumbnail() {
		var modCanvas = $(".mod .canvas");
		
		var thumbnail = $('.thumbnail').draggable({
			containment: "window",
			handle: ".canvas-wrap",
			opacity: 0.5,
		});

		var wrap = $('.canvas-wrap', thumbnail);

		var wrapWidth = 0;
		var wrapHeight = 0;
		var wrapLeft = 0;

		var scaleTip = $('.scaleTip', thumbnail);
		$('.foldBtn', thumbnail).click(function(e) {
			if (wrap.attr("data-action") == "show") {
				wrapLeft = wrap.position().left;
				wrapWidth = wrap.width();
				wrapHeight = wrap.height();
				$(this).removeClass("active");
				scaleTip.hide();
				wrap.stop().animate({
					width: 0,
					height: 0,
					left: wrapLeft + wrapWidth,
				}, 300);
				wrap.attr("data-action", "hide");
			} else {
				wrapLeft = wrap.position().left;
				$(this).addClass("active")
				wrap.stop().animate({
					width: wrapWidth,
					height: wrapHeight,
					left: wrapLeft - wrapWidth,
				}, 300, function() {
					scaleTip.show();
				});
				wrap.attr("data-action", "show");
			}
		});

		wrap.resizable({
			handles: "sw",
			alsoResize: "img",
			autoHide: true,
			aspectRatio: true,
		});
		wrap.resize(function(e) {
			var wrapHeight = wrap.height();
			var wrapLeft = wrap.position().left
			scaleTip.css({
				left: wrapLeft + 2,
				top: wrapHeight - scaleTip.height()
			});
		});

		$(window).resize(function(e) {
			if (e.target == wrap[0]) {
				return
			}
			onWindowResize();
		});

		function onWindowResize() {
			var scale = 0.2;
			var width = Math.floor(modCanvas.width() * scale);
			var height = Math.floor(modCanvas.height() * scale);
			thumbnail.css({
				width: width,
				height: height,
				top: 60,
				left: $(window).width() - 242 - width,
			});
		}

		onWindowResize();
	}

	function initCode() {
		$('#code-more .closeBtn').click(function(e) {
			$('#code-more').dialog("close");
		});

		$('.code-side .code_view').click(function(e) {
			$('#code-more .code').html($('#src').html())
			$('#code-more').dialog({
				draggable: false,
				modal: true,
				resizable: false,
			});
		});
	}

	function initVars() {
		var varContainer = $(".var-side");
		$(".var_btn.add", varContainer).click(function() {
			kenrobotDialog.show(0, {
				"title": "添加/更改变量",
				"isSplit": 0,
				"contents": [{
					"title": "变量名称",
					"inputType": "text",
					"inputHolder": "",
					"inputInitValue": "",
					"inputKey": "name"
				}, {
					"title": "变量类型",
					"inputType": "select",
					"inputHolder": [{
						"value": "bool",
						"text": "bool"
					}, {
						"value": "unsigned char",
						"text": "unsigned char"
					}, {
						"value": "int",
						"text": "int"
					}, {
						"value": "long",
						"text": "long"
					}, {
						"value": "float",
						"text": "float"
					}],
					"inputInitValue": "int",
					"inputKey": "type"
				}, {
					"title": "变量种类",
					"inputType": "select",
					"inputHolder": [{
						"value": "auto",
						"text": "auto"
					}, {
						"value": "register",
						"text": "register"
					}, {
						"value": "static",
						"text": "static"
					}, {
						"value": "volatile",
						"text": "volatile"
					}],
					"inputInitValue": "auto",
					"inputKey": "storage_type"
				}, {
					"title": "变量初值",
					"inputType": "text",
					"inputHolder": "",
					"inputInitValue": "",
					"inputKey": "default_value"
				}]
			}, function(info) {
				variable.addVar(info);
			});
		});

		$(".var_btn.modify", varContainer).click(function() {
			var curRow = $("tbody tr.active", varContainer);
			if(curRow.length == 0) {
				return;
			}
			
			var index = curRow.index();
			var varInfo = variable.getVar(index);

			kenrobotDialog.show(0, {
				"title": "添加/更改变量",
				"isSplit": 0,
				"contents": [{
					"title": "变量名称",
					"inputType": "text",
					"inputHolder": "",
					"inputInitValue": varInfo.name,
					"inputKey": "name"
				}, {
					"title": "变量类型",
					"inputType": "select",
					"inputHolder": [{
						"value": "bool",
						"text": "bool"
					}, {
						"value": "unsigned char",
						"text": "unsigned char"
					}, {
						"value": "int",
						"text": "int"
					}, {
						"value": "long",
						"text": "long"
					}, {
						"value": "float",
						"text": "float"
					}],
					"inputInitValue": varInfo.type,
					"inputKey": "type"
				}, {
					"title": "变量种类",
					"inputType": "select",
					"inputHolder": [{
						"value": "auto",
						"text": "auto"
					}, {
						"value": "register",
						"text": "register"
					}, {
						"value": "static",
						"text": "static"
					}, {
						"value": "volatile",
						"text": "volatile"
					}],
					"inputInitValue": varInfo.storage_type,
					"inputKey": "storage_type"
				}, {
					"title": "变量初值",
					"inputType": "text",
					"inputHolder": "",
					"inputInitValue": varInfo.default_value,
					"inputKey": "default_value"
				}]
			}, function(info) {
				variable.saveVar(info, index);
			});
		});

		$(".var_btn.del", varContainer).click(function() {
			variable.deleteVar();
		});
	}

	function initButtons(){
		//下载
		$('.mod_btn .download').click(function(e) {
			var source = code.gen();
			var bytes = [];
			for (var i = 0; i < source.length; ++i) {
				bytes.push(source.charCodeAt(i));
			}
			var projectName = "Rosys";
			var buildType = "Rosys";

			EventManager.trigger("demo", "finishStep", [[1, 6], [2, 9], [3, 9], [4, 6]]);
			$.ajax({
				type: "POST",
				url: "./build",
				data: {
					source: bytes,
					projectName: projectName,
					buildType: buildType
				},
				dataType: "json",
				async: true, //异步
				success: function(result) {
					if (result.code == 0 && result.url) {
						window.open(result.url);
					} else {
						alert(result.msg);
						console.log(result.output);
					}
				},
				error: function(result) {
					console.log(result);
				}
			});
		});

		$('.mod_btn .test').click(function(e) {
			// hardware.test();
			// software.test();
		});

		$('.mod_btn .feedback').click(function(e) {
			var contents = [];
			contents.push({
				title: "您的昵称",
				inputType: "text",
				inputKey: "nickname",
			});
			contents.push({
				title: "",
				inputType: "textarea",
				inputKey: "content",
				inputHolder: "您的任何问题或建议"
			});
			contents.push({
				title: "联系方式",
				inputType: "text",
				inputKey: "contact",
				inputHolder: "电话、邮箱或者其它联系方式"
			});

			kenrobotDialog.show(0, {
				title: "反馈",
				contents: contents
			}, function(data) {
				if(data.nickname == "") {
					alert("请输入您的昵称");
					return false;
				}
				if(data.content == "") {
					alert("意见不能为空");
					return false;
				}
				if(data.contact == "") {
					alert("请输入您的联系方式");
					return false;
				}

				$.ajax({
					type: "POST",
					url: "./feedback",
					data: data,
					success: function(result) {
						console.log("success");
					},
					error: function(result) {
						console.log("error");
					}
				});
			});
		});
	}

	function initEvent() {
		EventManager.bind("hardware", "addNode", onHardwareAddNode);
		EventManager.bind("hardware", "deleteNode", onHardwareDeleteNode);
	}

	function onHardwareAddNode(args) {
		var name = args.name;
		var text = args.text;
		var key = args.key;
		
		var list = $(".nav-second .hardware-list ul");
		var div = $('<div>').addClass('hardware-item').addClass('hardware-' + name).attr({
			'data-name': name,
			'data-key': key,
		});
		$("<li>").append(div).append(text).appendTo(list);

		list = $(".side .hardware-list ul");
		div = $('<div>').addClass('hardware-item').addClass('hardware-' + name).attr({
			'data-key': key,
		});
		$("<li>").append(div).append(text).appendTo(list);
	}

	function onHardwareDeleteNode(args) {
		var key = args.key;
		var list = $(".nav-second .hardware-list ul");
		$("li div[data-key=" + key + "]", list).parent().remove();

		list = $(".side .hardware-list ul");
		$("li div[data-key=" + key + "]", list).parent().remove();
	}
});