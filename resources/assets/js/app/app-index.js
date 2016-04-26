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
			getFileName: project.getProjectName,
			getAuthor: user.getUserName,
		});
		extAgent.init(config.extension);

		guide.init();

		$.ajax({
			// type: 'POST',
			url: '/api/config',
			dataType: 'json',
		}).done(onLoadSuccess);
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

	function onLoadSuccess(result) {
		board.load(result.boards);
		component.load(result.components);
		library.load(result.libraries);

		hardware.load(result);
		user.authCheck(function() {
			project.load();
		});
	}

	return {
		init: init,
	}
});