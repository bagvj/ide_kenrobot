define(['vendor/jquery', 'vendor/mousetrap', './EventManager', './config', './util', './hardware', './user', './project', './software', './sidebar', './topMenu', './board', './component', './library', './example', './ext/agent', './serial', './ext/burnDialog', './bottomContainer', './logcat', './serialAssitant', './interpreter', './setting', './rightBar', './comment', './barrage', './driverDialog', './guide'], function(_, Mousetrap, EventManager, config, util, hardware, user, project, software, sidebar, topMenu, board, component, library, example, extAgent, serial, burnDialog, bottomContainer, logcat, serialAssitant, interpreter, setting, rightBar, comment, barrage, driverDialog, guide) {
	function init() {
		initAjax();
		initKeys();
		initEscape();

		user.init();
		sidebar.init();
		topMenu.init();
		board.init();
		component.init();
		library.init();
		example.init();
		project.init();

		bottomContainer.init();
		logcat.init();
		serialAssitant.init();
		interpreter.init();

		hardware.init();
		software.init({
			getNodes: hardware.getNodes,
			getLibraries: software.getLibraries,
			getProjectInfo: project.getCurrentProject,
		});
		extAgent.init(config.extension);
		serial.init();
		burnDialog.init();

		setting.init();
		rightBar.init();
		comment.init();
		barrage.init();
		driverDialog.init();

		$.when(
			loadConfig(),
			project.loadMyProject()
		).done(project.load);
	}

	function initAjax() {
		$.ajaxSetup({
			headers: {
				'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			}
		});
	}

	function initKeys() {
		//保存
		Mousetrap.bind(['ctrl+s', 'command+s'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('project', 'save');
		});

		//编译
		Mousetrap.bind(['ctrl+b', 'command+b'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('project', 'build');
		});

		//格式化
		Mousetrap.bind(['ctrl+u', 'command+u'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('software', 'format');
		});
	}

	function initEscape() {
		$(window).on('keydown', function(e) {
			e.keyCode != 27 || util.isInDialog() || bottomContainer.hide() || sidebar.hide() || rightBar.hide();
		});
	}

	function loadConfig() {
		var promise = $.Deferred();
		$.ajax({
			type: 'POST',
			url: '/api/config',
			data: {
				id: 0,
			},
			dataType: 'json',
		}).done(function(config) {
			board.load(config.boards);
			component.load(config.components);
			hardware.load(config);
			software.load(config);

			guide.init();

			promise.resolve();
		});

		return promise;
	}

	return {
		init: init,
	}
});