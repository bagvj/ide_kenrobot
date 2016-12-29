define(['vendor/jquery', 'vendor/jquery.cookie', './util', './EventManager'], function(_, _, util, EventManager) {

	var defaultDemoConfig = {
		type: 'left',
		title: '引导',
		offset: 9 + 8,
	};

	var demos = [{
		id: 1,
		title: "在线烧写&点亮LED",
		steps: [{
			type: 'left',
			target: '.sidebar .bar li[data-action="example"]',
			content: '点击示例，选择“Basics->Blink”',
		}, {
			type: 'top',
			target: '.top-menu li[data-action="save"]',
			content: '点击保存',
		}, {
			type: 'top',
			target: '.top-menu li[data-action="burn"]',
			content: '点击烧写',
		}],
	}, {
		id: 2,
		title: "我的第一个Arduino程序",
		steps: [{
			type: 'left',
			target: '.sidebar .bar li[data-action="project"]',
			content: '点击项目->新建',
		}, {
			type: 'right',
			target: '.switch-view',
			content: '切换到硬件设计',
		}, {
			type: 'left',
			target: '.sidebar .bar li[data-action="component"]',
			content: '点击元件，拖一个“LED”到右边<br />然后把它连接到开发板上',
		}, {
			type: 'right',
			target: '.switch-view',
			content: '连线完成后，切换到软件设计',
		}, {
			type: 'top',
			target: '.top-menu li[data-action="save"]',
			content: '在loop里输入相应代码，然后保存<br />可以参考“示例->Basics->Blink”',
		}, {
			type: 'top',
			target: '.top-menu li[data-action="burn"]',
			content: '点击烧写',
		}],
	}];

	var guideLayer;
	var guideCover;
	var guideCoverTime;

	var finishedGuides;

	function init() {
		guideLayer = $('.guide-layer');
		guideCover = $('.guide-cover');

		// finishedGuides = util.parseJson($.cookie('finishedGuides')) || [];
		// finishedGuides.length == 0 && start(demos[0].id);

		if(!$.cookie('has_visit')) {
			$(window).on('keyup', onGuideCoverNext);
			guideCover.addClass("active").on('click', onGuideCoverNext);
			$('.guide-skip', guideCover).on('click', onGuideSkipClick);

			onGuideCoverNext();
		}
	}

	function start(id) {
		guideLayer.addClass("active");

		var guideDemo = $('.guide-demo[data-demo-id="' + id + '"]', guideLayer);
		if(guideDemo.length > 0) {
			util.toggleActive(guideDemo);
			$('.guide-step', guideDemo).removeClass("active").removeClass('hide');

			EventManager.trigger("guide", "start", id);
			nextStep();
			return;
		}

		var demo = getDemoConfig(id);
		if(!demo) {
			return;
		}

		guideDemo = $('<div>').attr('data-demo-id', demo.id).addClass("guide-demo").appendTo(guideLayer);
		var count = demo.steps.length;
		for(var i = 0; i < count; i++) {
			var step = demo.steps[i];
			var demoStep = $('<div>').addClass("guide-step").addClass(step.type || defaultDemoConfig.type).appendTo(guideDemo);
			$('<i>').addClass("kenrobot ken-close guide-close").attr("title", "退出引导").appendTo(demoStep).on('click', function(e) {
				stop();
			});
			var wrap = $('<div>').addClass('guide-step-wrap').appendTo(demoStep);
			$('<div>').addClass("guide-title").text((step.title || demo.title || defaultDemoConfig.title) + "(" + (i + 1) + "/" + count + ")").appendTo(wrap);
			$('<div>').addClass("guide-content").html(step.content).appendTo(wrap);
			updateStepPos(demo.id, i);
		}
		util.toggleActive(guideDemo);
		EventManager.trigger("guide", "start", id);
		nextStep();
	}

	function stop() {
		guideLayer.hide();
		var guideDemo = $('.guide-demo.active', guideLayer).removeClass("active");
		$('.guide-step', guideDemo).removeClass('active').removeClass('hide');
		var id = guideDemo.data('demo-id');
		EventManager.trigger("guide", "stop", id);
	}

	function hideStep() {
		$('.guide-demo.active .guide-step.active').addClass('hide');
	}

	function previousStep() {
		var steps = $('.guide-demo.active .guide-step', guideLayer);
		var index = steps.filter('.active').index();
		if(index - 1 < 0) {
			return;
		}

		index = index - 1;
		var step = steps.eq(index);
		util.toggleActive(step);
	}

	function nextStep() {
		var guideDemo = $('.guide-demo.active', guideLayer);
		if(guideDemo.length == 0) {
			return;
		}

		var id = guideDemo.data('demo-id');
		var steps = $('.guide-step', guideDemo);
		var index = getStep();
		if(index + 1 == steps.length) {
			onFinishDemo(id);
			stop();
			return;
		}

		index = index + 1;
		updateStepPos(id, index);
		var step = steps.eq(index);
		util.toggleActive(step);
	}

	function updateStepPos(id, index) {
		var demoStep = $('.guide-demo[data-demo-id="' + id + '"] .guide-step').eq(index);
		var demo = getDemoConfig(id);
		var step = demo.steps[index];

		var pos;
		if(step.top != undefined && step.left != undefined) {
			pos = {top: step.top, left: step.left};
		} else if(step.target) {
			pos = calcStepPos(step.target, step.type || defaultDemoConfig.type, demoStep.width(), demoStep.height());
		}

		pos && demoStep.css({top: pos.top, left: pos.left});
	}

	function onFinishDemo(id) {
		if(finishedGuides.indexOf(id) < 0) {
			finishedGuides.push(id);
			$.cookie('finishedGuides', JSON.stringify(finishedGuides), {expires: 365});
		}

		EventManager.trigger('guide', 'finish', id);
	}

	function getDemoConfig(id) {
		for(var i = 0; i < demos.length; i++) {
			if(demos[i].id == id) {
				return demos[i];
			}
		}
	}
	
	function getStep() {
		var steps = $('.guide-demo.active .guide-step', guideLayer);
		return steps.filter('.active').index();
	}

	function calcStepPos(target, type, stepWidth, stepHeight) {
		target = $(target);
		var pos = target.offset();
		var targetWidth = target.width();
		var targetHeight = target.height();
		var stepPos = {};

		if(type == "top") {
			stepPos.top = pos.top + targetHeight + defaultDemoConfig.offset;
			stepPos.left = pos.left + (targetWidth - stepWidth) / 2;
		} else if(type == "bottom") {
			stepPos.top = pos.top - targetHeight - defaultDemoConfig.offset;
			stepPos.left = pos.left + (targetWidth - stepWidth) / 2;
		} else if(type == "right") {
			stepPos.top = pos.top + (targetHeight - stepHeight) / 2;
			stepPos.left = pos.left - stepWidth - defaultDemoConfig.offset;
		} else {
			stepPos.top = pos.top + (targetHeight - stepHeight) / 2;
			stepPos.left = pos.left + targetWidth + defaultDemoConfig.offset;
		}

		return stepPos;
	}

	function onGuideSkipClick(e) {
		$('.guide-highlight').removeClass('guide-highlight');

		$(window).off('keyup', onGuideCoverNext);
		$('.guide-skip', guideCover).off('click', onGuideSkipClick);
		guideCover.off('click', onGuideCoverNext).removeClass("active").remove();
		guideCover = null;

		$.cookie('has_visit', true, {expires: 365});
	}

	function onGuideCoverNext(e) {
		var now = new Date().getTime();
		if(guideCoverTime && guideCoverTime + 1000 > now) {
			return;
		}

		if(e && e.keyCode && e.keyCode != 32) {
			return;
		}

		guideCoverTime = now;

		var steps = $('.guide-step', guideCover);
		var index = steps.filter('.active').index();
		if(index + 1 < steps.length) {
			guideCover.show();
			$('.guide-highlight').removeClass('guide-highlight');

			var step = steps.eq(index + 1);
			util.toggleActive(step);
			var target = $(step.data('target'));
			target.addClass('guide-highlight');
		} else {
			onGuideSkipClick();
		}
	}

	return {
		init: init,
		start: start,
		stop: stop,
		hideStep: hideStep,
		previousStep: previousStep,
		nextStep: nextStep,
		getStep: getStep,
		getDemoConfig: getDemoConfig,
	};
});