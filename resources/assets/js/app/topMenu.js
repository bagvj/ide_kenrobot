define(['vendor/jquery', './EventManager', './project', './software', './logcat', './ext/agent'], function(_, EventManager, project, software, logcat, agent) {

	function init() {
		$('.top-menu > ul > li').on('click', onMenuClick);
		EventManager.bind('global', 'project.save', onSaveClick);
		EventManager.bind('global', 'project.build', onBuildClick);
		EventManager.bind('global', 'software.format', onFormatClick);
	}

	function onMenuClick(e) {
		var li = $(this);
		var index = li.index();
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
		}
	}

	function onBuildClick() {
		project.build();
	}

	function onBurnClick() {
		project.isBuild(function(url){
			agent.showBurnDialog(url);
		});
	}

	function onFormatClick() {
		software.format();
	}

	function onSaveClick() {
		project.save();
	}

	function onDownloadClick() {
		project.isBuild(function(url) {
			window.location.href = url;
		});
	}

	function onLogcatClick() {
		logcat.toggle();
	}

	return {
		init: init,
	}
});