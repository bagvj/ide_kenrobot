define(['vendor/jquery', 'vendor/mousetrap', './EventManager', './config', './util', './hardware', './user', './project', './software', './sidebar', './topMenu', './logcat', './board', './component', './library', './ext/agent', './guide'], function(_, Mousetrap, EventManager, config, util, hardware, user, project, software, sidebar, topMenu, logcat, board, component, library, extAgent, guide) {
	function init() {
		initAjax();
		initKeys();
		initEscape();

		user.init();
		sidebar.init();
		topMenu.init();
		logcat.init();
		board.init();
		component.init();
		library.init();
		project.init();

		hardware.init();
		software.init({
			getNodes: hardware.getNodes,
			getProjectInfo: project.getCurrentProject,
		});
		extAgent.init(config.extension);

		guide.init();

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
			EventManager.trigger('global', 'project.save');
		});

		//编译
		Mousetrap.bind(['ctrl+b', 'command+b'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('global', 'project.build');
		});

		//格式化
		Mousetrap.bind(['ctrl+u', 'command+u'], function(e) {
			e.preventDefault && e.preventDefault();
			EventManager.trigger('global', 'software.format');
		});
	}

	function initEscape() {
		$(window).on('keydown', function(e) {
			if(e.keyCode != 27) {
				return;
			}

			if(util.isInDialog()) {
				return;
			}

			if(logcat.isShow()) {
				logcat.hide();
				return;
			}

			if(sidebar.isShow()) {
				sidebar.hide();
				return;
			}
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
		}).done(function(result) {
			board.load(result.boards);
			component.load(result.components);
			library.load(result.libraries);
			hardware.load(result);

			promise.resolve();
		});

		return promise;
	}

	return {
		init: init,
	}
});