define(["jquery", "tour", "kenrobotDialog", "EventManager"], function($, _, kenrobotDialog, EventManager) {
	var demoBtn;
	var tour;
	var demoId;
	var demoConfigs = [{
		desc: "点亮一个LED灯",
		steps: [{
			content: "Step: 1/6<br />点击硬件连接",
		}, {
			content: "Step: 2/6<br />拖一个LED灯到中间主板的端口(灰色矩形)上",
		}, {
			content: "Step: 3/6<br />点击软件编程",
		}, {
			content: "Step: 4/6<br />把LED灯拖到loop开始和loop结束之间的连线上",
		}, {
			content: "Step: 5/6<br />双击LED灯，在属性设置里把输出值设为1，然后保存",
		}, {
			placement: "top",
			content: "Step: 6/6<br />点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		desc: "点亮一个LED灯，并让其1秒闪1次",
		steps: [{
			content: "Step: 1/9<br />点击硬件连接",
		}, {
			content: "Step: 2/9<br />拖一个LED灯到中间主板的端口(灰色矩形)上",
		}, {
			content: "Step: 3/9<br />点击软件编程",
		}, {
			content: "Step: 4/9<br />把LED拖到loop开始和loop结束之间的连线上",
		}, {
			content: "Step: 5/9<br />双击LED，在属性设置里把输出值设为1，然后保存",
		}, {
			content: "Step: 6/9<br />拖一个延时函数放到LED下面，双击把延时设置为1000(毫秒)，然后保存",
		}, {
			content: "Step: 7/9<br />再拖一次LED灯放到延时函数下面，双击把输出值设为0，然后保存",
		}, {
			content: "Step: 8/9<br />再拖一个延时函数放到第二个LED下面，双击把延时设置为1000(毫秒)，然后保存",
		}, {
			placement: "top",
			content: "Step: 9/9<br />点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		desc: "通过开关控制LED灯，开关开，灯亮；开关关，灯灭",
		steps: [{
			content: "Step: 1/9<br />点击硬件连接",
		}, {
			content: "Step: 2/9<br />拖一个LED到中间主板的端口(灰色矩形)上",
		}, {
			content: "Step: 3/9<br />再拖一个开关到中间主板的端口(灰色矩形)上",
		}, {
			content: "Step: 4/9<br />点击软件编程",
		}, {
			content: "Step: 5/9<br />把开关拖到loop开始和loop结束之间的连线上",
		}, {
			content: "Step: 6/9<br />双击开关，在属性设置里把读取到变量设为Switch，然后保存",
		}, {
			content: "Step: 7/9<br />把LED拖到开关下面",
		}, {
			content: "Step: 8/9<br />双击LED，在属性设置里把输出值设为开关的读取变量Switch，然后保存",
		}, {
			placement: "top",
			content: "Step: 9/9<br />点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}];

	function init() {
		demoBtn = $(".mod_btn .demo").click(onDemoClick);
	}

	function onDemoClick(e) {
		var options = [];
		for(var i = 1; i <= demoConfigs.length; i++) {
			options.push({
				text: "示例" + i,
				value: i,
			});
		}
		var contents = [];
		contents.push({
			title: "示例",
			inputType: "select",
			inputKey: "demoId",
			inputHolder: options,
		});
		contents.push({
			title: "说明",
			inputType: "textarea",
			inputKey: "desc",
		});

		var dialog = kenrobotDialog.show(0, {
			title: "Demo演示",
			contents: contents,
			okLabel: "确定",
		}, onSelectDemo);
		var demoSelect = $("select[data-item=demoId]", dialog).change(function(){
			var index = parseInt($(this).val());
			var demoConfig = demoConfigs[index - 1];
			$("textarea[data-item=desc]", dialog).val(demoConfig.desc);
		});
		demoSelect.trigger("change");
	}

	function onSelectDemo(data) {
		demoId = parseInt(data.demoId);

		if (tour) {
			tour.end();
			tour = null;
		} else {
			EventManager.bind("demo", "finishStep", onFinishStep);
		}
		tour = new Tour({
			storage: false,
			keyboard: false,
			template: '<div class="popover tour">\
					       <div class="arrow"></div>\
				           <div class="popover-content"></div>\
			           </div>',
		});
		tour.init();
		onFinishStep([[demoId, 0]]);
	}

	function getSteps() {
		var config = demoConfigs[demoId - 1];
		return config.steps;
	}

	function onIntoStep(index) {
		var element;
		if(demoId == 1) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]", li).parent();
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if (index == 5) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 2) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]", li).parent();
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(2)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=delay]", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(2)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=delay]", li).parent();
			} else if (index == 8) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 3) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]", li).parent();
			} else if (index == 2) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=switch]", li).parent();
			} else if (index == 3) {
				element = $(".tabs li:eq(1)");
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=switch]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=switch]:eq(0)", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li div[data-name=light]:eq(0)", li).parent();
			} else if (index == 8) {
				element = $(".mod_btn .download");
			}
		}
		
		if(!element) {
			return;
		}

		var steps = getSteps();
		var step = $.extend(true, {}, steps[index]);
		step.element = element;
		tour.addStep(step);
		tour.goTo(index);
	}

	function onFinishStep(args) {
		if (!tour) {
			return;
		}

		var step = tour.getCurrentStep();
		step = step == null ? 0 : step + 1;

		var demoArg;
		for(var i = 0; i < args.length; i++) {
			var arg = args[i];
			if(demoId == arg[0] && step == arg[1]) {
				demoArg = arg;
				break;
			}
		}

		if (!demoArg) {
			return;
		}

		var steps = getSteps();
		if (step <= steps.length - 1) {
			onIntoStep(step);
			if (demoArg.length >= 4) {
				setTimeout(function() {
					$(".popover").css({
						left: demoArg[2],
						top: demoArg[3],
						position: "absolute",
					});
				}, 500);
			}
		} else {
			tour.end();
		}
	}

	return {
		init: init,
	};
});