define(['vendor/jquery', './EventManager', './project', './software', './logcat', './serialAssitant', './interpreter', './ext/agent', './ext/burn-dialog', './util'], function(_, EventManager, project, software, logcat, serialAssitant, interpreter, agent, burnDialog, util) {

	function init() {
		$('.top-menu > ul > li').on('click', onMenuClick);
		EventManager.bind('global', 'project.save', onSaveClick);
		EventManager.bind('global', 'project.build', onBuildClick);
		EventManager.bind('global', 'software.format', onFormatClick);
	}

	function onMenuClick(e) {
		var li = $(this);
		var action = li.data("action");
		switch(action) {
			case "build":
				onBuildClick();
				break;
			case "burn":
				onBurnClick();
				break;
			case "format":
				onFormatClick();
				break;
			case "save":
				onSaveClick();
				break;
			case "download":
				onDownloadClick();
				break;
			case "logcat":
				onLogcatClick();
				break;
			case "serial-assitant":
				onSerialAssitantClick();
				break;
			case "interpreter":
				onInterpreterClick();
				break;
		}
	}

	function onBuildClick() {
		project.build();
	}

	function onBurnClick() {
		project.build(true).done(function(hexUrl) {
			agent.check().done(function() {
				burnDialog.show(hexUrl);
			});
		});
	}

	function onFormatClick() {
		software.format();
	}

	function onSaveClick() {
		project.save();
	}

	function onDownloadClick() {
		project.build(true).done(function(url){
			window.location.href = url;
		});
	}

	function onLogcatClick() {
		logcat.toggle();
	}

	function onSerialAssitantClick() {
		serialAssitant.toggle();	
	}

	function onInterpreterClick() {
		agent.check().done(function() {
			interpreter.show();
		});
	}

	return {
		init: init,
	}
});