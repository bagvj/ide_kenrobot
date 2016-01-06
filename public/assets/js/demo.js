define(["jquery", "tour", "EventManager"], function($, _, EventManager) {
	var demoBtn;
	var tour;

	var steps = [{
		content: "Step: 1/7<br />硬件连接",
	}, {
		content: "Step: 2/7<br />拖一个LED到中间主板的端口(灰色矩形)上",
	}, {
		content: "Step: 3/7<br />软件编程",
	}, {
		content: "Step: 4/7<br />把LED拖到loop开始和loop结束之间的连线上",
	}, {
		content: "Step: 5/7<br />双击LED，在属性设置里把输出值设为1，然后保存",
	}, {
		content: "Step: 6/7<br />查看源代码",
		placement: "left",
	}, {
		content: "Step: 7/7<br />点击下载<br />(我们会把代码上传至服务器并编译。如果编译成功，你将会下载一个包括源代码.cpp和编译出来的.hex的zip压缩包)",
	}]

	function init() {
		demoBtn = $(".mod_btn .demo").click(onDemoClick);
	}

	function onDemoClick(e) {
		if(tour) {
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
		onFinishStep(0);
	}

	function onIntoStep(index) {
		// console.log("onIntoStep " + index);
		var element;
		if(index == 0) {
			element = $(".tabs li:eq(0)");
		} else if(index == 1) {
			var li = $(".mod:eq(0) .nav-second>ul>li:eq(1)");
			if(!li.hasClass("active")) {
				li.addClass("active");
			}
			element = $("li div[data-name=light]", li).parent();
		} else if(index == 2) {
			element = $(".tabs li:eq(1)");
		} else if(index == 3) {
			var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
			if(!li.hasClass("active")) {
				li.addClass("active");
			}
			element = $("li div[data-name=light]:eq(0)", li).parent();
		} else if(index == 4) {
			var li = $(".mod:eq(1) .nav-second>ul>li:eq(0)");
			if(!li.hasClass("active")) {
				li.addClass("active");
			}
			element = $("li div[data-name=light]:eq(0)", li).parent();
		} else if(index == 5) {
			element = $(".code_view");
		} else if(index == 6) {
			element = $(".mod_btn .download");
		}
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

		var triggerStep;
		var adjust;
		if(typeof args == "number") {
			triggerStep = args;
		} else {
			triggerStep = args.index;
			adjust = true;
		}
		if(step != triggerStep) {
			return;
		}

		if(step <= steps.length - 1) {
			onIntoStep(step);
			if(adjust) {
				setTimeout(function(){
					$(".popover").css({
						left: args.left,
						top: args.top,
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