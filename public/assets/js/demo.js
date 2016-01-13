define(["jquery", "tour", "kenrobotDialog", "EventManager"], function($, _, kenrobotDialog, EventManager) {
	var demoBtn;
	var tour;
	var demoId;

	/*
	点亮LED           使用单一IO口控制LED灯常亮
	驱动电机          使用单一IO口控制电机驱动
	按键控制LED       单一IO口读取开关状态控制另一IO口LED灯亮灭
	点亮7段数码管     使用7段数码管模块显示4位数字
	温度传感器        使用7段数码管模块显示温度传感器读数
	光线传感器        使用LED模块显示光线传感器状态
	*/
	var demoConfigs = [{
		id: 1,
		name: "点亮LED",
		desc: "点亮一个LED灯",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个LED灯到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把LED灯拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击LED灯，在属性设置里把输出值设为1，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 2,
		name: "控制LED",
		desc: "点亮一个LED灯，并让其1秒闪1次",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个LED灯到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把LED拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击LED，在属性设置里把输出值设为1，然后保存",
		}, {
			content: "拖一个延时函数放到LED下面，双击把延时设置为1000(毫秒)，然后保存",
		}, {
			content: "再拖一次LED灯放到延时函数下面，双击把输出值设为0，然后保存",
		}, {
			content: "再拖一个延时函数放到第二个LED下面，双击把延时设置为1000(毫秒)，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 3,
		name: "开关控制LED",
		desc: "通过开关控制LED灯，开关开，灯亮；开关关，灯灭",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个LED到中间主板的端口(灰色矩形)上",
		}, {
			content: "再拖一个开关到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把开关拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击开关，在属性设置里把读取到变量设为Switch，然后保存",
		}, {
			content: "把LED拖到开关下面",
		}, {
			content: "双击LED，在属性设置里把输出值设为开关的读取变量Switch，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 4,
		name: "驱动电机",
		desc: "使用单一IO口控制电机驱动",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个直流电机到中间主板的B端口上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把电机拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击电机，在属性设置里设置一个电机的转动速度(-255~255)，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 5,
		name: "点亮7段数码管",
		desc: "使用7段数码管模块显示4位数字",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个数码管到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把数码管拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击数码管，在属性设置里把输出值设为一个数字(0~9999)，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 6,
		name: "温度传感器",
		desc: "使用7段数码管模块显示温度传感器读数",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个温度传感器到中间主板的F端口上",
		}, {
			content: "拖一个数码管到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把温度传感器拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击温度传感器，在属性设置里把读取到变量设为Tem，然后保存",
		}, {
			content: "把数码管拖到温度传感器下面",
		}, {
			content: "双击数码管，在属性设置里把输出值设为温度传感器的读取变量Tem，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}, {
		id: 7,
		name: "光照传感器 ",
		desc: "使用LED灯显示光照传感器状态",
		steps: [{
			content: "点击硬件连接",
		}, {
			content: "拖一个光照传感器到中间主板的F端口上",
		}, {
			content: "拖一个LED到中间主板的端口(灰色矩形)上",
		}, {
			content: "点击软件编程",
		}, {
			content: "把光照传感器拖到loop开始和loop结束之间的连线上",
		}, {
			content: "双击光照传感器，在属性设置里把读取到变量设为Light，然后保存",
		}, {
			content: "把LED拖到光照传感器下面",
		}, {
			content: "双击LED，在属性设置里把输出值设为光照传感器的读取变量Light，然后保存",
		}, {
			placement: "top",
			content: "点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
		}],
	}];

	function init() {
		demoBtn = $(".mod_btn .demo").click(onDemoClick);
	}

	function onDemoClick(e) {
		var options = [];
		for(var i = 0; i < demoConfigs.length; i++) {
			var config = demoConfigs[i];
			options.push({
				text: config.name,
				value: config.id,
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
			var id = parseInt($(this).val());
			var demoConfig = getDemoConfig(id);
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

	function getDemoConfig(id) {
		for(var i = 0; i < demoConfigs.length; i++) {
			var config = demoConfigs[i];
			if(config.id == id) {
				return config;
			}
		}
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
				element = $("li img[data-name=light]", li).parent();
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
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
				element = $("li img[data-name=light]", li).parent();
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(2)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=delay]", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(2)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=delay]", li).parent();
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
				element = $("li img[data-name=light]", li).parent();
			} else if (index == 2) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=switch]", li).parent();
			} else if (index == 3) {
				element = $(".tabs li:eq(1)");
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=switch]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=switch]:eq(0)", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if (index == 8) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 4) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(2)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=dcMotor]", li).parent();
				var container = $(".mod:eq(0) .nav-second");
				container.scrollTop(element.offset().top - container.offset().top + container.scrollTop());
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=dcMotor]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=dcMotor]:eq(0)", li).parent();
			} else if (index == 5) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 5) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]", li).parent();
			} else if (index == 2) {
				element = $(".tabs li:eq(1)");
			} else if (index == 3) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]:eq(0)", li).parent();
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]:eq(0)", li).parent();
			} else if (index == 5) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 6) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(3)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=temperatue]", li).parent();
				scrollToCenter(element);
			} else if (index == 2) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]", li).parent();
				scrollToCenter(element);
			} else if (index == 3) {
				element = $(".tabs li:eq(1)");
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=temperatue]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=temperatue]:eq(0)", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=digitalTube]:eq(0)", li).parent();
			} else if (index == 8) {
				element = $(".mod_btn .download");
			}
		} else if(demoId == 7) {
			if (index == 0) {
				element = $(".tabs li:eq(0)");
			} else if (index == 1) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(3)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=illumination]", li).parent();
				scrollToCenter(element);
			} else if (index == 2) {
				var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]", li).parent();
				scrollToCenter(element);
			} else if (index == 3) {
				element = $(".tabs li:eq(1)");
			} else if (index == 4) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=illumination]:eq(0)", li).parent();
			} else if(index == 5) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=illumination]:eq(0)", li).parent();
			} else if(index == 6) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if(index == 7) {
				var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
				if (!li.hasClass("active")) {
					li.addClass("active");
				}
				element = $("li img[data-name=light]:eq(0)", li).parent();
			} else if (index == 8) {
				element = $(".mod_btn .download");
			}
		}
		
		if(!element) {
			console.log("fffffff");
			return;
		}
		console.log(element);

		var demoConfig = getDemoConfig(demoId);
		console.log(demoConfig);
		var step = $.extend(true, {}, demoConfig.steps[index]);
		var count = demoConfig.steps.length;
		step.content = "Step: " + (index + 1) + "/" + count + "<br />" + step.content;
		step.element = element;
		tour.addStep(step);
		tour.goTo(index);
	}

	function scrollToCenter(element) {
		var container = $(".mod:eq(0) .nav-second");
		container.scrollTop(element.offset().top - container.offset().top + container.scrollTop());
	}

	function onFinishStep(args) {
		console.log("onFinishStep", args);
		if (!tour) {
			console.log("aaaaaaa");
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
			console.log("bbbbbbbb");
			return;
		}

		var demoConfig = getDemoConfig(demoId);
		if (step <= demoConfig.steps.length - 1) {
			console.log("cccccccc");
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
			console.log("ddddddddd");
			tour.end();
		}
	}

	return {
		init: init,
	};
});