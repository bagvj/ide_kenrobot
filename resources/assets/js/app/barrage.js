define(['vendor/jquery', './EventManager', './software', './project', './comment'], function(_, EventManager, software, project, comment) {
	var template;
	var display;
	var list;
	var displayWidth;
	var speedRange;
	var isPlaying;
	var tickTimer;
	var barrages;
	var delay;

	function init() {
		template = '<div class="barrage-item"></div>'
		display = $('.barrage').on('resize', onResize);
		speedRange = [120, 240];
		delay = 15 * 1000;

		EventManager.bind('project', 'open', onOpenProject);
		EventManager.bind("project", "viewChange", onViewChange);
	}

	function add(text, options) {
		options = options || {};
		var item = $(template).text(text).appendTo(display);
		var width = item.width();
		var displayWidth = display.width();
		var displayHeight = display.height();
		
		var speed = options.speed || random(speedRange[0], speedRange[1]);
		var top = options.y || random(20, Math.ceil(displayHeight / 3));
		var time = Math.round((displayWidth + width) / speed * 1000);
		var line = options.line;

		item.data('speed', speed).css({
			left: displayWidth,
			top: top,
		})
		.animate({
			left: -width	
		}, time, "linear", function(){
			item.remove();
			resetBarrage(line);
		});
	}

	function resetBarrage(line) {
		if(!barrages) {
			return;
		}

		var item;
		for(var i = 0; i < barrages.length; i++) {
			item = barrages[i];
			if(item.line == line) {
				item.isPlaying = false;
				break;
			}
		}
	}

	function random(min, max) {
		return min + Math.ceil(Math.random() * (max - min));
	}

	function start() {
		if(isPlaying) {
			return;
		}

		isPlaying = true;
		tickTimer = setInterval(tick, 2000);
	}

	function stop() {
		isPlaying = false;
		clearInterval(tickTimer);
		barrages = null;

		$('.barrage-item', display).stop().remove();
	}

	function tick() {
		if(!barrages) {
			var projectInfo = project.getCurrentProject();
			var projectId = projectInfo.id;
			var comments = comment.getComments(projectId);
			if(!comments) {
				return;
			}

			var commentInfo;
			var extra;
			for(var i = 0; i < comments.length; i++) {
				commentInfo = comments[i];
				if(commentInfo.extra) {
					barrages = barrages || [];

					extra = commentInfo.extra;
					barrages.push({
						content: commentInfo.content,
						lineContent: extra.lineContent,
						line: extra.line,
					});
				}
			}
		}

		if(!barrages) {
			return;
		}

		var lineInfo = software.getCurrentLineInfo();
		var item;
		var now = new Date().getTime();
		for(var i = 0; i < barrages.length; i++) {
			item = barrages[i];
			if(!item.isPlaying && item.line == lineInfo.line && item.lineContent == lineInfo.lineContent && (!item.lastPlay || item.lastPlay + delay <= now)) {
				item.isPlaying = true;
				item.lastPlay = new Date().getTime();
				add(item.content, {y: lineInfo.top, line: item.line});
			}
		}
	}

	function onResize(e) {
		var item;
		var speed;
		var left;
		var width;
		var time;
		$('.barrage-item', display).each(function(i, value) {
			item = $(value);
			speed = item.data('speed');
			left = item.position().left;
			width = item.width();
			time = Math.round((left + width) / speed);
			item.stop().animate({
				left: -width,
			}, time, "linear", function() {
				item.remove();
			});
		});
	}

	function onOpenProject() {
		stop();
		start();
	}

	function onViewChange(view) {
		stop();

		if(view == "software") {
			start();
		}
	}

	return {
		init: init,
	}
});